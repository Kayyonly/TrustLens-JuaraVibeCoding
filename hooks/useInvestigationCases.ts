"use client"

import { useCallback, useEffect, useState } from "react"
import { attachHistoryIds, createCase, parseCases, type CaseRecord } from "@/lib/cases"

const STORAGE_KEY = "trustlens-cases"

export function useInvestigationCases() {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try { setCases(parseCases(localStorage.getItem(STORAGE_KEY))) } finally { setIsLoaded(true) }
  }, [])

  const persist = useCallback((next: CaseRecord[]) => {
    setCases(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* Keep the in-memory state usable when storage is full or blocked. */ }
  }, [])

  const addCase = useCallback((title: string) => {
    const record = createCase(title)
    if (!record) return null
    persist([record, ...cases])
    return record
  }, [cases, persist])

  const attachReports = useCallback((caseId: string, historyIds: string[]) => {
    persist(cases.map((record) => record.id === caseId ? { ...record, historyIds: attachHistoryIds(record.historyIds, historyIds) } : record))
  }, [cases, persist])

  const detachReport = useCallback((caseId: string, historyId: string) => {
    persist(cases.map((record) => record.id === caseId ? { ...record, historyIds: record.historyIds.filter((id) => id !== historyId) } : record))
  }, [cases, persist])

  const removeCase = useCallback((caseId: string) => persist(cases.filter((record) => record.id !== caseId)), [cases, persist])

  const removeMissingHistory = useCallback((validIds: Set<string>) => {
    const next = cases.map((record) => ({ ...record, historyIds: record.historyIds.filter((id) => validIds.has(id)) }))
    if (next.some((record, index) => record.historyIds.length !== cases[index].historyIds.length)) persist(next)
  }, [cases, persist])

  return { cases, isLoaded, addCase, attachReports, detachReport, removeCase, removeMissingHistory }
}
