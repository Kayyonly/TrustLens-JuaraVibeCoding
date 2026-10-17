export type UrlRiskStatus = "malicious" | "suspicious" | "no_detections" | "pending" | "unavailable"
export type ReputationStats = { malicious: number; suspicious: number; harmless: number; undetected: number; timeout?: number }

export class UrlInputError extends Error {
  constructor() {
    super("Invalid URL")
    this.name = "UrlInputError"
  }
}

export function validateSubmittedUrl(value: unknown): string {
  if (typeof value !== "string") throw new UrlInputError()
  const candidate = value.trim()
  if (!candidate || candidate.length > 2_048) throw new UrlInputError()
  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    throw new UrlInputError()
  }
  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) throw new UrlInputError()
  return parsed.href
}

export function urlReportId(url: string): string {
  return Buffer.from(url, "utf8").toString("base64url").replace(/=+$/g, "")
}

export function classifyUrlReputation(statsValue: unknown, completed: boolean): { status: UrlRiskStatus; stats: ReputationStats | null } {
  if (statsValue === null || typeof statsValue !== "object" || Array.isArray(statsValue)) {
    return { status: completed ? "unavailable" : "pending", stats: null }
  }
  const source = statsValue as Record<string, unknown>
  const keys = ["malicious", "suspicious", "harmless", "undetected", "timeout"] as const
  const counts = Object.fromEntries(keys.map((key) => {
    const number = Number(source[key])
    return [key, Number.isFinite(number) && number >= 0 ? Math.floor(number) : 0]
  })) as ReputationStats
  const hasAny = Object.values(counts).some((value) => value > 0)
  if (!completed) return { status: "pending", stats: hasAny ? counts : null }
  if (!hasAny) return { status: "unavailable", stats: null }
  if (counts.malicious > 0) return { status: "malicious", stats: counts }
  if (counts.suspicious > 0) return { status: "suspicious", stats: counts }
  return { status: "no_detections", stats: counts }
}
