import { NextResponse } from "next/server"
import { analyzeWithConfiguredProvider, AiProviderError } from "@/lib/ai/provider"
import { readJsonBody, RequestValidationError, clientIpKey } from "@/lib/server/http"
import { checkRateLimit } from "@/lib/server/rate-limit"

export const runtime = "nodejs"
const MAX_BODY_BYTES = 4_000_000
const MAX_TEXT_LENGTH = 20_000
const MAX_IMAGE_BASE64_LENGTH = 3_700_000
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function matchesImageType(image: string, mimeType: string): boolean {
  const bytes = Buffer.from(image, "base64")
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (mimeType === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (mimeType === "image/webp") return bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP"
  if (mimeType === "image/gif") return ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))
  return false
}

function failure(code: string, status: number, language: string) {
  const messages: Record<string, [string, string]> = {
    invalid_request: ["Permintaan tidak valid. Periksa teks atau gambar, lalu coba lagi.", "The request is invalid. Check the text or image and try again."],
    missing_key: ["Penyedia AI belum dikonfigurasi atau kunci API ditolak. Hubungi administrator aplikasi.", "The AI provider is not configured or its API key was rejected. Contact the app administrator."],
    invalid_provider: ["AI_PROVIDER harus bernilai gemini atau groq.", "AI_PROVIDER must be set to gemini or groq."],
    rate_limit: ["Batas permintaan tercapai. Tunggu sebentar sebelum mencoba lagi.", "The request limit was reached. Wait a moment before trying again."],
    timeout: ["Analisis melewati batas waktu. Coba lagi sebentar lagi.", "The analysis timed out. Please try again shortly."],
    malformed_response: ["Penyedia AI mengembalikan hasil yang tidak dapat dibaca. Coba lagi.", "The AI provider returned an unreadable result. Please try again."],
    provider_error: ["Penyedia AI sedang tidak tersedia. Coba lagi nanti.", "The AI provider is temporarily unavailable. Please try again later."],
  }
  const [id, en] = messages[code] ?? messages.provider_error
  return NextResponse.json({ success: false, code, error: language === "en" ? en : id }, { status, headers: { "Cache-Control": "no-store, private" } })
}

export async function POST(request: Request) {
  const requestedLanguage = request.headers.get("x-language") === "en" ? "en" : "id"
  const limit = checkRateLimit(`analyze:${clientIpKey(request)}`, 10, 60_000)
  if (!limit.allowed) {
    const response = failure("rate_limit", 429, requestedLanguage)
    response.headers.set("Retry-After", String(limit.retryAfterSeconds))
    return response
  }

  let body: unknown
  try {
    body = await readJsonBody(request, MAX_BODY_BYTES)
  } catch (error) {
    if (error instanceof RequestValidationError) return failure("invalid_request", error.status, requestedLanguage)
    return failure("invalid_request", 400, requestedLanguage)
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) return failure("invalid_request", 400, requestedLanguage)
  const payload = body as Record<string, unknown>
  const language = payload.language === "en" ? "en" : "id"
  const image = typeof payload.image === "string" ? payload.image : undefined
  const isImage = image !== undefined
  const text = typeof payload.text === "string" ? payload.text.trim() : ""
  if (isImage) {
    const mimeType = typeof payload.mimeType === "string" ? payload.mimeType.toLowerCase() : "image/jpeg"
    if (!ALLOWED_IMAGE_TYPES.has(mimeType) || image.length > MAX_IMAGE_BASE64_LENGTH || !/^[A-Za-z0-9+/]+={0,2}$/.test(image) || !matchesImageType(image, mimeType)) {
      return failure("invalid_request", 400, language)
    }
    try {
      const result = await analyzeWithConfiguredProvider({ language, image, mimeType })
      return NextResponse.json({ success: true, result: result.result }, { headers: { "Cache-Control": "no-store, private" } })
    } catch (error) {
      const code = error instanceof AiProviderError ? error.code : "provider_error"
      const status = code === "missing_key" ? 503 : code === "invalid_provider" ? 500 : code === "rate_limit" ? 429 : code === "timeout" ? 504 : code === "malformed_response" ? 502 : 502
      return failure(code, status, language)
    }
  }
  if (!text || text.length > MAX_TEXT_LENGTH) return failure("invalid_request", 400, language)
  try {
    const result = await analyzeWithConfiguredProvider({ language, text })
    return NextResponse.json({ success: true, result: result.result }, { headers: { "Cache-Control": "no-store, private" } })
  } catch (error) {
    const code = error instanceof AiProviderError ? error.code : "provider_error"
    const status = code === "missing_key" ? 503 : code === "invalid_provider" ? 500 : code === "rate_limit" ? 429 : code === "timeout" ? 504 : code === "malformed_response" ? 502 : 502
    return failure(code, status, language)
  }
}
