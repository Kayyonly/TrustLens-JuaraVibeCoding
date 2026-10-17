export class RequestValidationError extends Error {
  readonly status: 400 | 413 | 415
  constructor(status: 400 | 413 | 415, message: string) {
    super(message)
    this.status = status
    this.name = "RequestValidationError"
  }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()
  if (contentType !== "application/json") throw new RequestValidationError(415, "Expected application/json")
  const lengthHeader = request.headers.get("content-length")
  if (lengthHeader && Number(lengthHeader) > maxBytes) throw new RequestValidationError(413, "Request body too large")
  let raw: string
  try {
    raw = await request.text()
  } catch {
    throw new RequestValidationError(400, "Invalid request body")
  }
  if (new TextEncoder().encode(raw).byteLength > maxBytes) throw new RequestValidationError(413, "Request body too large")
  try {
    return JSON.parse(raw) as unknown
  } catch {
    throw new RequestValidationError(400, "Invalid JSON")
  }
}

export function clientIpKey(request: Request): string {
  const trusted = request.headers.get("x-real-ip")?.trim()
  if (trusted) return trusted.slice(0, 64)
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) || "unknown"
}
