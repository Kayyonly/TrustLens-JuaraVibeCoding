type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5_000

export function checkRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  let bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      for (const [candidate, value] of buckets) if (value.resetAt <= now) buckets.delete(candidate)
      if (buckets.size >= MAX_BUCKETS) buckets.delete(buckets.keys().next().value as string)
    }
    bucket = { count: 0, resetAt: now + windowMs }
    buckets.set(key, bucket)
  }
  bucket.count += 1
  return {
    allowed: bucket.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}
