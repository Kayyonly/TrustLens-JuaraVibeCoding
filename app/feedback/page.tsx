"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import FeatureShell from "@/components/features/FeatureShell"
import { useLanguage } from "@/context/LanguageContext"
import { feedbackCounts, parseFeedback, type FeedbackIssue } from "@/lib/feedback"

const STORAGE_KEY = "trustlens-feedback"
const FEEDBACK_EVENT = "trustlens-feedback-updated"

function subscribeFeedback(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  window.addEventListener("storage", callback)
  window.addEventListener(FEEDBACK_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(FEEDBACK_EVENT, callback)
  }
}

function getFeedbackSnapshot() {
  return typeof window === "undefined" ? "[]" : localStorage.getItem(STORAGE_KEY) ?? "[]"
}

function getServerFeedbackSnapshot() { return "[]" }

export default function FeedbackPage() {
  const { language } = useLanguage()
  const isId = language === "id"
  const [confirmClear, setConfirmClear] = useState(false)
  const rawRecords = useSyncExternalStore(subscribeFeedback, getFeedbackSnapshot, getServerFeedbackSnapshot)
  const records = useMemo(() => parseFeedback(rawRecords), [rawRecords])
  const counts = useMemo(() => feedbackCounts(records), [records])
  const labels: Record<FeedbackIssue, string> = isId ? {
    false_positive: "Kemungkinan positif palsu",
    false_negative: "Kemungkinan negatif palsu",
    wrong_category: "Kategori kurang tepat",
    unhelpful_explanation: "Penjelasan tidak membantu",
  } : {
    false_positive: "Possible false positive",
    false_negative: "Possible false negative",
    wrong_category: "Incorrect category",
    unhelpful_explanation: "Unhelpful explanation",
  }
  function clearLocalFeedback() {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(FEEDBACK_EVENT))
    setConfirmClear(false)
  }
  const formatDate = (timestamp: number) => new Intl.DateTimeFormat(isId ? "id-ID" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(timestamp)

  return <FeatureShell eyebrow={isId ? "MONITOR KUALITAS LOKAL" : "LOCAL QUALITY MONITOR"} title={isId ? "Feedback membantu meninjau kualitas—tanpa mengunggah bukti." : "Feedback helps review quality—without uploading evidence."} description={isId ? "Masukan bersifat sukarela dan disimpan hanya di penyimpanan browser perangkat ini. Tidak ada teks, screenshot, hasil analisis, pengenal pribadi, atau data yang dikirim ke server. Feedback tidak melatih ulang model." : "Feedback is optional and stored only in this device’s browser storage. No text, screenshot, analysis result, personal identifier, or data is sent to a server. Feedback does not retrain a model."}>
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <h2 className="text-xl font-medium">{isId ? "Ringkasan di perangkat ini" : "On-device summary"}</h2>
        <dl className="mt-4 space-y-2">{[
          [isId ? "Membantu" : "Helpful", counts.helpful],
          [isId ? "Perlu ditinjau" : "Needs review", counts.not_helpful],
          ...Object.entries(labels).map(([key, label]) => [label, counts[key as FeedbackIssue]] as [string, number]),
        ].map(([label, count]) => <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm"><dt className="text-white/60">{label}</dt><dd className="tabular-nums text-white/85">{count}</dd></div>)}</dl>
        <p className="mt-4 text-xs leading-relaxed text-white/40">{isId ? "Hanya masukan dari browser ini yang ditampilkan. Ringkasan ini bukan metrik seluruh pengguna atau bukti akurasi model." : "Only feedback from this browser is shown. This summary is not a user-wide metric or proof of model accuracy."}</p>
        {records.length > 0 && <div className="mt-5">{!confirmClear ? <button type="button" onClick={() => setConfirmClear(true)} className="min-h-10 rounded-xl border border-red-200/20 px-3 text-sm text-red-100/70 hover:bg-red-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Hapus semua feedback lokal" : "Delete all local feedback"}</button> : <div role="group" aria-label={isId ? "Konfirmasi penghapusan feedback" : "Confirm feedback deletion"} className="flex flex-wrap gap-2"><button type="button" onClick={clearLocalFeedback} className="min-h-10 rounded-xl bg-red-200 px-3 text-sm font-medium text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Ya, hapus" : "Yes, delete"}</button><button type="button" onClick={() => setConfirmClear(false)} className="min-h-10 rounded-xl border border-white/15 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Batal" : "Cancel"}</button></div>}</div>}
      </section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
        <h2 className="text-xl font-medium">{isId ? "Masukan tersimpan" : "Saved feedback"}</h2>
        {!records.length ? <p className="mt-3 text-sm leading-relaxed text-white/45">{isId ? "Belum ada masukan. Setelah analisis, Anda dapat memilih ‘Ya, membantu’ atau ‘Perlu diperbaiki’." : "No feedback yet. After an analysis, choose “Yes, helpful” or “Needs review”."}</p> : <ol className="mt-4 max-h-[36rem] space-y-2 overflow-y-auto pr-1">{records.map((record) => <li key={record.id} className="rounded-xl border border-white/10 bg-black/20 p-3"><div className="flex flex-wrap justify-between gap-2"><span className="text-sm text-white/75">{record.rating === "helpful" ? (isId ? "Membantu" : "Helpful") : (isId ? "Perlu ditinjau" : "Needs review")}</span><time className="text-xs text-white/40" dateTime={new Date(record.createdAt).toISOString()}>{formatDate(record.createdAt)}</time></div>{record.issue && <p className="mt-1 text-xs text-white/50">{labels[record.issue]}</p>}</li>)}</ol>}
      </section>
    </div>
  </FeatureShell>
}
