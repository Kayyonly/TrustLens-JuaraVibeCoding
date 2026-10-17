export type CaseRecord = { id: string; title: string; createdAt: number; historyIds: string[] }
export type CaseHistoryEntry = { id: string; timestamp: number; category: string; threatScore: number; threatLevel: string; summary: string; thumbnail?: string | null; textPreview?: string }

export function parseCases(raw: string | null): CaseRecord[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") return []
      const value = item as Record<string, unknown>
      if (typeof value.id !== "string" || typeof value.title !== "string" || !Number.isFinite(Number(value.createdAt)) || !Array.isArray(value.historyIds)) return []
      return [{ id: value.id.slice(0, 100), title: value.title.trim().slice(0, 100), createdAt: Number(value.createdAt), historyIds: [...new Set(value.historyIds.filter((id): id is string => typeof id === "string"))].slice(0, 200) }]
    })
  } catch {
    return []
  }
}

export function createCase(title: string, now = Date.now(), id = globalThis.crypto?.randomUUID?.() ?? `${now}-${Math.random().toString(36).slice(2, 10)}`): CaseRecord | null {
  const normalized = title.trim().slice(0, 100)
  return normalized ? { id, title: normalized, createdAt: now, historyIds: [] } : null
}

export function attachHistoryIds(existing: string[], additions: string[]): string[] {
  return [...new Set([...existing, ...additions].filter((id) => typeof id === "string"))].slice(0, 200)
}

export function resolveCaseEntries(caseRecord: CaseRecord, history: CaseHistoryEntry[]): CaseHistoryEntry[] {
  const byId = new Map(history.map((entry) => [entry.id, entry]))
  return caseRecord.historyIds.flatMap((id) => {
    const entry = byId.get(id)
    return entry ? [entry] : []
  }).sort((a, b) => a.timestamp - b.timestamp)
}

export function riskPattern(entries: CaseHistoryEntry[]): "rising" | "falling" | "mixed" | "flat" | "insufficient" {
  if (entries.length < 2) return "insufficient"
  const deltas = entries.slice(1).map((entry, index) => Math.sign(entry.threatScore - entries[index].threatScore)).filter((delta) => delta !== 0)
  if (!deltas.length) return "flat"
  if (deltas.every((delta) => delta > 0)) return "rising"
  if (deltas.every((delta) => delta < 0)) return "falling"
  return "mixed"
}
