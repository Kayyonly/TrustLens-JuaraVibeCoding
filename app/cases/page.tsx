"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import FeatureShell from "@/components/features/FeatureShell"
import { useLanguage } from "@/context/LanguageContext"
import { useScanHistory } from "@/hooks/useScanHistory"
import { useInvestigationCases } from "@/hooks/useInvestigationCases"
import { resolveCaseEntries, riskPattern, type CaseHistoryEntry } from "@/lib/cases"

export default function CasesPage() {
  const { language } = useLanguage()
  const isId = language === "id"
  const { history, isLoaded: historyLoaded } = useScanHistory()
  const { cases, isLoaded: casesLoaded, addCase, attachReports, detachReport, removeCase, removeMissingHistory } = useInvestigationCases()
  const [title, setTitle] = useState("")
  const [activeId, setActiveId] = useState("")
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([])
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [deleteArmed, setDeleteArmed] = useState(false)

  const validHistory = useMemo(() => history as CaseHistoryEntry[], [history])
  useEffect(() => {
    if (historyLoaded && casesLoaded) removeMissingHistory(new Set(history.map((item) => item.id)))
  }, [historyLoaded, casesLoaded, history, removeMissingHistory])

  const activeCase = cases.find((record) => record.id === activeId) ?? cases[0] ?? null
  const entries = useMemo(() => activeCase ? resolveCaseEntries(activeCase, validHistory) : [], [activeCase, validHistory])
  const compared = useMemo(() => validHistory.filter((item) => compareIds.includes(item.id)).sort((a, b) => a.timestamp - b.timestamp), [compareIds, validHistory])
  const formatDate = (timestamp: number) => new Intl.DateTimeFormat(isId ? "id-ID" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(timestamp)

  function createNewCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const created = addCase(title)
    if (created) { setTitle(""); setActiveId(created.id); setSelectedHistoryIds([]); setDeleteArmed(false) }
  }

  function toggle(id: string, values: string[], setter: (value: string[]) => void) {
    setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id])
  }

  function attachSelected() {
    if (!activeCase || !selectedHistoryIds.length) return
    attachReports(activeCase.id, selectedHistoryIds)
    setSelectedHistoryIds([])
  }

  const pattern = riskPattern(entries)
  const patternText = isId ? {
    rising: "Skor risiko meningkat secara berurutan pada laporan yang dipilih.",
    falling: "Skor risiko menurun secara berurutan pada laporan yang dipilih.",
    mixed: "Skor risiko berubah naik dan turun pada laporan yang dipilih.",
    flat: "Skor risiko tidak berubah pada laporan yang dipilih.",
    insufficient: "Tambahkan sedikitnya 2 laporan untuk melihat pola skor.",
  }[pattern] : {
    rising: "Risk scores rise across the selected reports.",
    falling: "Risk scores fall across the selected reports.",
    mixed: "Risk scores move both up and down across the selected reports.",
    flat: "Risk scores are unchanged across the selected reports.",
    insufficient: "Attach at least 2 reports to view a score pattern.",
  }[pattern]

  return <FeatureShell eyebrow={isId ? "INVESTIGASI LOKAL" : "LOCAL INVESTIGATION"} title={isId ? "Satukan laporan ke dalam kasus." : "Bring reports together in a case."} description={isId ? "Kasus hanya menyimpan ID laporan di penyimpanan lokal. Tidak ada laporan yang disalin ke server atau dianalisis ulang." : "Cases store report IDs only in local storage. Reports are not copied to a server or reanalyzed."}>
    <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <section className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
        <form onSubmit={createNewCase} className="space-y-3">
          <label htmlFor="case-title" className="block text-sm font-medium text-white/80">{isId ? "Buat kasus investigasi" : "Create an investigation case"}</label>
          <div className="flex flex-col gap-2 sm:flex-row"><input id="case-title" name="caseTitle" autoComplete="off" maxLength={100} required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={isId ? "Contoh: Pesan investasi Oktober" : "Example: October investment messages"} className="min-h-11 min-w-0 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" /><button type="submit" className="min-h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Buat kasus" : "Create case"}</button></div>
        </form>
        <div>
          <label htmlFor="active-case" className="mb-2 block text-sm font-medium text-white/80">{isId ? "Kasus aktif" : "Active case"}</label>
          <select id="active-case" name="activeCase" value={activeCase?.id ?? ""} onChange={(event) => { setActiveId(event.target.value); setDeleteArmed(false) }} className="min-h-11 w-full rounded-xl border border-white/15 bg-[#101016] px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            {!cases.length && <option value="">{isId ? "Belum ada kasus" : "No cases yet"}</option>}
            {cases.map((record) => <option key={record.id} value={record.id}>{record.title}</option>)}
          </select>
        </div>
        {activeCase && <div className="flex flex-wrap items-center gap-2">
          {!deleteArmed ? <button type="button" onClick={() => setDeleteArmed(true)} className="min-h-10 rounded-xl border border-red-200/20 px-3 text-sm text-red-100/70 hover:bg-red-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Hapus kasus" : "Delete case"}</button> : <div role="group" aria-label={isId ? "Konfirmasi penghapusan kasus" : "Confirm case deletion"} className="flex flex-wrap items-center gap-2"><span className="text-xs text-white/55">{isId ? "Laporan tetap ada di riwayat." : "Reports remain in history."}</span><button type="button" onClick={() => { removeCase(activeCase.id); setActiveId(""); setDeleteArmed(false) }} className="min-h-10 rounded-xl bg-red-200 px-3 text-sm font-medium text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Ya, hapus" : "Yes, delete"}</button><button type="button" onClick={() => setDeleteArmed(false)} className="min-h-10 rounded-xl border border-white/15 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Batal" : "Cancel"}</button></div>}</div>}
        <div className="border-t border-white/10 pt-5">
          <h2 className="text-base font-medium">{isId ? "Lampirkan laporan riwayat" : "Attach history reports"}</h2>
          {!history.length ? <p className="mt-3 text-sm text-white/45">{isId ? "Riwayat analisis lokal masih kosong." : "Local analysis history is empty."}</p> : <>
            <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">{history.map((item) => <li key={item.id}><label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 focus-within:ring-2 focus-within:ring-white/70"><input type="checkbox" checked={selectedHistoryIds.includes(item.id)} onChange={() => toggle(item.id, selectedHistoryIds, setSelectedHistoryIds)} className="mt-1 accent-white" /><span className="min-w-0 flex-1"><span className="block truncate text-sm text-white/80">{item.title}</span><span className="mt-1 block text-xs text-white/45">{item.category} · {item.threatScore}% · {formatDate(item.timestamp)}</span></span></label></li>)}</ul>
            <button type="button" disabled={!activeCase || !selectedHistoryIds.length} onClick={attachSelected} className="mt-3 min-h-10 rounded-xl border border-white/15 px-4 text-sm text-white/75 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-40">{isId ? `Lampirkan pilihan (${selectedHistoryIds.length})` : `Attach selected (${selectedHistoryIds.length})`}</button>
          </>}
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
        <div>
          <h2 className="text-xl font-medium">{isId ? "Linimasa kasus" : "Case timeline"}</h2>
          {!activeCase ? <p className="mt-3 text-sm text-white/45">{isId ? "Buat kasus, lalu pilih laporan untuk memulai linimasa." : "Create a case, then attach reports to start a timeline."}</p> : !entries.length ? <p className="mt-3 text-sm text-white/45">{isId ? "Belum ada laporan terlampir." : "No reports are attached yet."}</p> : <>
            <p className="mt-2 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">{patternText}<span className="mt-1 block text-xs text-white/40">{isId ? "Perubahan skor tidak membuktikan hubungan sebab-akibat antarperistiwa." : "Score changes do not establish a causal relationship between events."}</span></p>
            <ol className="mt-4 space-y-3">{entries.map((entry, index) => <li key={entry.id} className="relative rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start"><span className="shrink-0 rounded-full border border-white/15 px-2.5 py-1 text-xs tabular-nums text-white/65">{formatDate(entry.timestamp)}</span><div className="min-w-0 flex-1"><h3 className="break-words text-sm font-medium text-white/85">{entry.category} · {entry.threatScore}%</h3><p className="mt-1 text-xs text-white/45">{entry.threatLevel}</p><p className="mt-2 break-words text-sm leading-relaxed text-white/65">{entry.summary}</p>{entry.textPreview && <p className="mt-2 break-words rounded-lg border border-white/5 bg-white/[0.025] p-2 text-xs text-white/40">{isId ? "Cuplikan tersimpan:" : "Saved preview:"} {entry.textPreview}</p>}{entry.thumbnail && <Image src={entry.thumbnail} width={64} height={64} unoptimized alt={isId ? "Miniatur bukti lokal" : "Local evidence thumbnail"} loading="lazy" className="mt-3 h-16 w-16 rounded-lg border border-white/10 object-cover" />}</div><button type="button" onClick={() => detachReport(activeCase.id, entry.id)} aria-label={isId ? `Lepaskan laporan ${entry.category}` : `Detach ${entry.category} report`} className="min-h-9 rounded-lg border border-white/10 px-2.5 text-xs text-white/55 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Lepaskan" : "Detach"}</button></div>{index < entries.length - 1 && <div className="absolute -bottom-3 left-7 z-10 h-3 border-l border-white/20" />}</li>)}</ol>
          </>}
        </div>
        <div className="border-t border-white/10 pt-5">
          <h2 className="text-xl font-medium">{isId ? "Bandingkan laporan" : "Compare reports"}</h2>
          <p className="mt-2 text-sm text-white/50">{isId ? "Pilih 2 laporan atau lebih. Perbandingan hanya memakai hasil tersimpan dan tidak memanggil AI." : "Select 2 or more reports. Comparison uses saved results only and does not call AI."}</p>
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">{history.map((item) => <label key={`compare-${item.id}`} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 focus-within:ring-2 focus-within:ring-white/70"><input type="checkbox" checked={compareIds.includes(item.id)} onChange={() => toggle(item.id, compareIds, setCompareIds)} className="mt-1 accent-white" /><span className="min-w-0 flex-1"><span className="block truncate text-sm text-white/75">{item.title}</span><span className="text-xs text-white/40">{formatDate(item.timestamp)} · {item.threatScore}%</span></span></label>)}</div>
          {compared.length >= 2 && <div className="mt-4 overflow-x-auto rounded-xl border border-white/10"><table className="min-w-full text-left text-sm"><thead className="bg-white/[0.04] text-xs text-white/50"><tr><th scope="col" className="p-3">{isId ? "Waktu" : "Time"}</th><th scope="col" className="p-3">{isId ? "Kategori" : "Category"}</th><th scope="col" className="p-3">{isId ? "Skor" : "Score"}</th><th scope="col" className="p-3">{isId ? "Ringkasan" : "Summary"}</th></tr></thead><tbody>{compared.map((entry) => <tr key={entry.id} className="border-t border-white/10 align-top"><td className="whitespace-nowrap p-3 text-xs text-white/55">{formatDate(entry.timestamp)}</td><td className="max-w-40 break-words p-3 text-white/70">{entry.category}</td><td className="p-3 tabular-nums text-white/85">{entry.threatScore}%</td><td className="max-w-sm break-words p-3 text-white/60">{entry.summary}</td></tr>)}</tbody></table></div>}
        </div>
      </section>
    </div>
  </FeatureShell>
}
