export type FeedbackRating = "helpful" | "not_helpful"
export type FeedbackIssue = "false_positive" | "false_negative" | "wrong_category" | "unhelpful_explanation"
export type FeedbackRecord = { id: string; createdAt: number; rating: FeedbackRating; issue: FeedbackIssue | null }

const issues = new Set<FeedbackIssue>(["false_positive", "false_negative", "wrong_category", "unhelpful_explanation"])

export function parseFeedback(raw: string | null): FeedbackRecord[] {
  if (!raw) return []
  try {
    const values: unknown = JSON.parse(raw)
    if (!Array.isArray(values)) return []
    return values.flatMap((entry) => {
      if (!entry || typeof entry !== "object") return []
      const value = entry as Record<string, unknown>
      if (typeof value.id !== "string" || !Number.isFinite(Number(value.createdAt)) || !["helpful", "not_helpful"].includes(String(value.rating))) return []
      const issue = issues.has(value.issue as FeedbackIssue) ? value.issue as FeedbackIssue : null
      if (value.rating === "not_helpful" && !issue) return []
      return [{ id: value.id.slice(0, 100), createdAt: Number(value.createdAt), rating: value.rating as FeedbackRating, issue }]
    }).slice(0, 500)
  } catch {
    return []
  }
}

export function createFeedback(rating: FeedbackRating, issue: FeedbackIssue | null, now = Date.now(), id = globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random().toString(36).slice(2, 10)}`): FeedbackRecord | null {
  if (rating === "not_helpful" && (!issue || !issues.has(issue))) return null
  if (rating === "helpful" && issue !== null) return null
  if (!["helpful", "not_helpful"].includes(rating)) return null
  return { id, createdAt: now, rating, issue }
}

export function feedbackCounts(records: FeedbackRecord[]) {
  return records.reduce((counts, record) => {
    counts[record.rating] += 1
    if (record.issue) counts[record.issue] += 1
    return counts
  }, { helpful: 0, not_helpful: 0, false_positive: 0, false_negative: 0, wrong_category: 0, unhelpful_explanation: 0 })
}
