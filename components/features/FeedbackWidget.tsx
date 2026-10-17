"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { createFeedback, parseFeedback, type FeedbackIssue } from "@/lib/feedback"

const STORAGE_KEY = "trustlens-feedback"
const FEEDBACK_EVENT = "trustlens-feedback-updated"

export default function FeedbackWidget() {
  const { language } = useLanguage()
  const isId = language === "id"
  const [issue, setIssue] = useState<FeedbackIssue | "">("")
  const [showReview, setShowReview] = useState(false)
  const [message, setMessage] = useState("")
  const issues: { value: FeedbackIssue; id: string; en: string }[] = [
    { value: "false_positive", id: "Kemungkinan positif palsu", en: "Possible false positive" },
    { value: "false_negative", id: "Kemungkinan negatif palsu", en: "Possible false negative" },
    { value: "wrong_category", id: "Kategori kurang tepat", en: "Incorrect category" },
    { value: "unhelpful_explanation", id: "Penjelasan tidak membantu", en: "Unhelpful explanation" },
  ]
  function save(rating: "helpful" | "not_helpful", selectedIssue: FeedbackIssue | null) {
    const record = createFeedback(rating, selectedIssue)
    if (!record) return
    try {
      const current = parseFeedback(localStorage.getItem(STORAGE_KEY))
      localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...current].slice(0, 500)))
      window.dispatchEvent(new Event(FEEDBACK_EVENT))
      setMessage(isId ? "Terima kasih. Feedback tersimpan hanya di perangkat ini." : "Thank you. Feedback is stored only on this device.")
      setIssue("")
      setShowReview(false)
    } catch {
      setMessage(isId ? "Penyimpanan lokal tidak tersedia. Feedback tidak disimpan." : "Local storage is unavailable. Feedback was not saved.")
    }
  }
  return <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-white/40">{isId ? "UMPAN BALIK SUKARELA" : "OPTIONAL FEEDBACK"}</p><h2 className="mt-2 text-xl font-medium">{isId ? "Apakah hasil ini membantu?" : "Was this result helpful?"}</h2><p className="mt-2 text-sm leading-relaxed text-white/50">{isId ? "Hanya rating dan kategori masalah yang disimpan lokal. Teks, screenshot, hasil analisis, dan identitas tidak diunggah." : "Only the rating and issue category are stored locally. Text, screenshots, analysis, and identity are not uploaded."}</p></div><Link href="/feedback" className="shrink-0 text-sm text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Lihat monitor lokal" : "View local monitor"}</Link></div>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => save("helpful", null)} className="min-h-10 rounded-xl border border-white/15 px-4 text-sm text-white/75 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Ya, membantu" : "Yes, helpful"}</button>
      <button type="button" onClick={() => { setShowReview(true); if (!issue) setIssue("false_positive"); setMessage("") }} className="min-h-10 rounded-xl border border-white/15 px-4 text-sm text-white/75 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Perlu diperbaiki" : "Needs review"}</button></div>
    {showReview && <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"><div className="flex-1"><label htmlFor="feedback-issue" className="mb-2 block text-sm text-white/70">{isId ? "Pilih jenis masalah" : "Choose an issue"}</label><select id="feedback-issue" name="feedbackIssue" value={issue} onChange={(event) => setIssue(event.target.value as FeedbackIssue)} className="min-h-11 w-full rounded-xl border border-white/15 bg-[#101016] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{issues.map((item) => <option key={item.value} value={item.value}>{isId ? item.id : item.en}</option>)}</select></div><button type="button" onClick={() => issue && save("not_helpful", issue)} disabled={!issue} className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-50">{isId ? "Simpan feedback" : "Save feedback"}</button></div>}
    {message && <p aria-live="polite" className="mt-3 text-sm text-white/70">{message}</p>}
  </section>
}
