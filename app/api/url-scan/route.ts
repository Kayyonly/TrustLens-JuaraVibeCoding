import { NextResponse } from "next/server"
import { classifyUrlReputation, urlReportId, validateSubmittedUrl } from "@/lib/url-intelligence"
import { clientIpKey, readJsonBody, RequestValidationError } from "@/lib/server/http"
import { checkRateLimit } from "@/lib/server/rate-limit"

export const runtime = "nodejs"
const VT_BASE = "https://www.virustotal.com/api/v3"
const FETCH_TIMEOUT_MS = 12_000

type VtObject = { data?: { id?: string; attributes?: Record<string, unknown> } }

function apiError(code: string, status: number, language: string) {
  const messages: Record<string, [string, string]> = {
    invalid_request: ["URL atau permintaan tidak valid. Gunakan alamat HTTP atau HTTPS.", "The URL or request is invalid. Use an HTTP or HTTPS address."],
    consent_required: ["Konfirmasi bahwa URL akan dibagikan ke VirusTotal sebelum memindai.", "Confirm that the URL will be shared with VirusTotal before scanning."],
    missing_key: ["Pemindaian URL belum dikonfigurasi. Administrator perlu menambahkan VIRUSTOTAL_API_KEY di lingkungan server.", "URL scanning is not configured. An administrator must add VIRUSTOTAL_API_KEY to the server environment."],
    rate_limit: ["Batas pemindaian tercapai. Tunggu sebelum memindai URL lain.", "The scan limit was reached. Wait before scanning another URL."],
    service_unavailable: ["VirusTotal sementara tidak tersedia. Coba lagi nanti.", "VirusTotal is temporarily unavailable. Please try again later."],
  }
  const [id, en] = messages[code] ?? messages.service_unavailable
  return NextResponse.json({ success: false, code, error: language === "en" ? en : id }, { status, headers: { "Cache-Control": "no-store, private" } })
}

async function safeJson(response: Response): Promise<VtObject | null> {
  try { return await response.json() as VtObject } catch { return null }
}

function findingsFrom(attributes: Record<string, unknown> | undefined) {
  const results = attributes?.last_analysis_results ?? attributes?.results
  if (!results || typeof results !== "object" || Array.isArray(results)) return []
  return Object.entries(results as Record<string, unknown>)
    .map(([source, value]) => {
      const item = value && typeof value === "object" ? value as Record<string, unknown> : {}
      return {
        source: String(item.engine_name || source).slice(0, 100),
        category: typeof item.category === "string" ? item.category.slice(0, 40) : "unknown",
        result: typeof item.result === "string" ? item.result.slice(0, 180) : null,
        method: typeof item.method === "string" ? item.method.slice(0, 40) : null,
        update: typeof item.engine_update === "string" ? item.engine_update.slice(0, 40) : null,
      }
    })
    .sort((a, b) => Number(["malicious", "suspicious"].includes(b.category)) - Number(["malicious", "suspicious"].includes(a.category)))
    .slice(0, 12)
}

function isoTimestamp(attributes: Record<string, unknown> | undefined): string | null {
  const timestamp = Number(attributes?.last_analysis_date ?? attributes?.date)
  return Number.isFinite(timestamp) && timestamp > 0 && timestamp <= 8_640_000_000_000 ? new Date(timestamp * 1000).toISOString() : null
}

export async function POST(request: Request) {
  const requestedLanguage = request.headers.get("x-language") === "en" ? "en" : "id"
  const limit = checkRateLimit(`url-scan:${clientIpKey(request)}`, 1, 60_000)
  if (!limit.allowed) {
    const response = apiError("rate_limit", 429, requestedLanguage)
    response.headers.set("Retry-After", String(limit.retryAfterSeconds))
    return response
  }

  if (!process.env.VIRUSTOTAL_API_KEY) return apiError("missing_key", 503, requestedLanguage)
  let body: unknown
  try {
    body = await readJsonBody(request, 8_192)
  } catch (error) {
    const status = error instanceof RequestValidationError ? error.status : 400
    return apiError("invalid_request", status, requestedLanguage)
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return apiError("invalid_request", 400, requestedLanguage)
  const payload = body as Record<string, unknown>
  const language = payload.language === "en" ? "en" : "id"
  if (payload.confirmExternalSharing !== true) return apiError("consent_required", 400, language)

  let url: string
  try { url = validateSubmittedUrl(payload.url) } catch { return apiError("invalid_request", 400, language) }

  const headers = { "x-apikey": process.env.VIRUSTOTAL_API_KEY, accept: "application/json" }
  try {
    const submitResponse = await fetch(`${VT_BASE}/urls`, {
      method: "POST",
      headers: { ...headers, "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url }),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    })
    if (submitResponse.status === 429) return apiError("rate_limit", 429, language)
    if (submitResponse.status === 401 || submitResponse.status === 403) return apiError("missing_key", 503, language)
    if (!submitResponse.ok) return apiError("service_unavailable", 502, language)
    const submitted = await safeJson(submitResponse)
    const analysisId = submitted?.data?.id
    if (!analysisId) return apiError("service_unavailable", 502, language)

    const [analysisResponse, reportResponse] = await Promise.all([
      fetch(`${VT_BASE}/analyses/${encodeURIComponent(analysisId)}`, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), cache: "no-store" }),
      fetch(`${VT_BASE}/urls/${urlReportId(url)}`, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), cache: "no-store" }),
    ])
    if (analysisResponse.status === 429 || reportResponse.status === 429) return apiError("rate_limit", 429, language)
    if ([401, 403].includes(analysisResponse.status) || [401, 403].includes(reportResponse.status)) return apiError("missing_key", 503, language)
    if ((!analysisResponse.ok && analysisResponse.status !== 404) || (!reportResponse.ok && reportResponse.status !== 404)) {
      return apiError("service_unavailable", 502, language)
    }

    const [analysis, report] = await Promise.all([safeJson(analysisResponse), safeJson(reportResponse)])
    const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value))
    if ((analysisResponse.ok && !isObject(analysis?.data)) || (reportResponse.ok && !isObject(report?.data))) {
      return apiError("service_unavailable", 502, language)
    }
    const analysisAttributes = analysis?.data?.attributes
    const reportAttributes = report?.data?.attributes
    const completed = analysisAttributes?.status === "completed"
    const rawStats = reportAttributes?.last_analysis_stats ?? (completed ? analysisAttributes?.stats : undefined)
    const reputation = classifyUrlReputation(rawStats, Boolean(completed || reportAttributes?.last_analysis_stats))
    const stats = reputation.stats
    const detections = findingsFrom(reportAttributes).filter((finding) => ["malicious", "suspicious"].includes(finding.category))
    const scannedAt = isoTimestamp(reportAttributes) ?? isoTimestamp(analysisAttributes)

    return NextResponse.json({
      success: true,
      result: {
        submittedUrl: url,
        status: reputation.status,
        analysisStatus: typeof analysisAttributes?.status === "string" ? analysisAttributes.status : "queued",
        stats,
        detections,
        source: "VirusTotal",
        scannedAt,
        message: reputation.status === "no_detections" ? "No malicious or suspicious detections were returned in this report. This is not a guarantee that the URL is safe." : null,
      },
    }, { headers: { "Cache-Control": "no-store, private" } })
  } catch (error) {
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return apiError("service_unavailable", 504, language)
    return apiError("service_unavailable", 502, language)
  }
}
