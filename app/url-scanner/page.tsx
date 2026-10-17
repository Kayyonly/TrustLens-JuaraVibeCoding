"use client"

import { FormEvent, useState } from "react"
import FeatureShell from "@/components/features/FeatureShell"
import { useLanguage } from "@/context/LanguageContext"

type ScanResult = {
  submittedUrl: string
  status: "malicious" | "suspicious" | "no_detections" | "pending" | "unavailable"
  analysisStatus: string
  stats: { malicious: number; suspicious: number; harmless: number; undetected: number; timeout?: number } | null
  detections: { source: string; category: string; result: string | null; method: string | null; update: string | null }[]
  source: string
  scannedAt: string | null
  message: string | null
}

export default function UrlScannerPage() {
  const { language } = useLanguage()
  const isId = language === "id"
  const [url, setUrl] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const copy = {
    setup: isId ? "Fitur ini memerlukan VIRUSTOTAL_API_KEY pada lingkungan server. Tidak ada hasil simulasi." : "This feature requires VIRUSTOTAL_API_KEY in the server environment. No simulated results are shown.",
    share: isId ? "URL yang dikirim akan dibagikan dengan VirusTotal dan dapat masuk ke dataset komunitasnya. Jangan kirim URL rahasia, token, atau data pribadi." : "Submitted URLs are shared with VirusTotal and may be added to its community dataset. Do not submit private URLs, tokens, or personal data.",
    consent: isId ? "Saya memahami URL ini akan dikirim ke VirusTotal." : "I understand this URL will be sent to VirusTotal.",
    placeholder: isId ? "Contoh: https://example.com/path…" : "Example: https://example.com/path…",
    scan: isId ? "Periksa URL" : "Check URL",
    loading: isId ? "Mengirim dan memeriksa…" : "Submitting and checking…",
    result: isId ? "Hasil reputasi" : "Reputation results",
    statuses: isId ? { malicious: "Ada deteksi berbahaya", suspicious: "Ada indikator mencurigakan", no_detections: "Tidak ada deteksi yang diketahui", pending: "Analisis masih berjalan", unavailable: "Data reputasi tidak tersedia" } : { malicious: "Malicious detections reported", suspicious: "Suspicious indicators reported", no_detections: "No known detections reported", pending: "Analysis is pending", unavailable: "Reputation data is unavailable" },
    notSafe: isId ? "Tidak ada deteksi bukan jaminan bahwa situs aman." : "No detections do not guarantee that a site is safe.",
    analysis: isId ? "Status analisis" : "Analysis status",
    scanned: isId ? "Waktu data" : "Data timestamp",
    sources: isId ? "Sumber deteksi" : "Detection sources",
    noSources: isId ? "Tidak ada sumber deteksi tercatat dalam respons ini." : "No detection sources were listed in this response.",
    external: isId ? "Sumber eksternal" : "External source",
  }
  const statusStyle: Record<ScanResult["status"], string> = {
    malicious: "border-red-300/30 bg-red-950/30 text-red-100",
    suspicious: "border-amber-300/30 bg-amber-950/25 text-amber-100",
    no_detections: "border-white/15 bg-white/[0.04] text-white/85",
    pending: "border-sky-300/25 bg-sky-950/25 text-sky-100",
    unavailable: "border-white/10 bg-black/30 text-white/65",
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setResult(null)
    setLoading(true)
    try {
      const response = await fetch("/api/url-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Language": language },
        body: JSON.stringify({ url, confirmExternalSharing: consent, language }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || (isId ? "Pemindaian gagal." : "The scan failed."))
      setResult(data.result as ScanResult)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (isId ? "Layanan tidak tersedia. Coba lagi." : "The service is unavailable. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (value: string) => new Intl.DateTimeFormat(isId ? "id-ID" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))

  return (
    <FeatureShell eyebrow="URL INTELLIGENCE" title={isId ? "Periksa reputasi tautan sebelum membukanya." : "Check a link’s reputation before opening it."} description={isId ? "TrustLens mengirim URL yang Anda setujui ke VirusTotal dan menampilkan data yang dikembalikan layanan. Hasilnya bukan jaminan keamanan." : "TrustLens submits the URL you approve to VirusTotal and displays the service’s returned data. Results are not a safety guarantee."}>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
          <h2 className="text-xl font-medium">{isId ? "Pemindai reputasi URL" : "URL reputation scanner"}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/55">{copy.share}</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label htmlFor="url-input" className="mb-2 block text-sm text-white/75">{isId ? "URL HTTP atau HTTPS" : "HTTP or HTTPS URL"}</label>
              <input id="url-input" name="url" type="url" inputMode="url" autoComplete="off" maxLength={2048} required value={url} onChange={(event) => setUrl(event.target.value)} placeholder={copy.placeholder} className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" />
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
              <input type="checkbox" name="external-sharing-consent" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-0.5 accent-white" />
              <span>{copy.consent}</span>
            </label>
            <button type="submit" disabled={loading || !consent} className="min-h-11 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50">{loading ? copy.loading : copy.scan}</button>
          </form>
          <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-relaxed text-white/45">{copy.setup}</p>
          {error && <p role="alert" aria-live="polite" className="mt-4 rounded-xl border border-red-300/20 bg-red-950/30 p-3 text-sm text-red-100">{error}</p>}
        </section>

        <section aria-live="polite" className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
          <h2 className="text-xl font-medium">{copy.result}</h2>
          {!result ? <p className="mt-4 text-sm leading-relaxed text-white/45">{isId ? "Hasil dari layanan akan tampil di sini setelah pemindaian." : "Service results will appear here after a scan."}</p> : (
            <div className="mt-5 space-y-5">
              <div className={`rounded-2xl border p-4 ${statusStyle[result.status]}`}>
                <p className="font-medium">{copy.statuses[result.status]}</p>
                <p className="mt-1 break-all text-xs opacity-75">{result.submittedUrl}</p>
              </div>
              {result.stats && <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                {([["malicious", isId ? "Berbahaya" : "Malicious"], ["suspicious", isId ? "Mencurigakan" : "Suspicious"], ["harmless", isId ? "Tidak berbahaya" : "Harmless"], ["undetected", isId ? "Tidak terdeteksi" : "Undetected"]] as const).map(([key, label]) => <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-3"><dt className="text-xs text-white/45">{label}</dt><dd className="mt-1 tabular-nums text-lg">{result.stats?.[key] ?? 0}</dd></div>)}
              </dl>}
              {result.status === "no_detections" && <p className="text-sm text-amber-100/80">{copy.notSafe}</p>}
              <dl className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between gap-4"><dt>{copy.external}</dt><dd>{result.source}</dd></div>
                <div className="flex justify-between gap-4"><dt>{copy.analysis}</dt><dd>{result.analysisStatus}</dd></div>
                {result.scannedAt && <div className="flex justify-between gap-4"><dt>{copy.scanned}</dt><dd className="text-right">{formatDate(result.scannedAt)}</dd></div>}
              </dl>
              <div>
                <h3 className="text-sm font-medium text-white/80">{copy.sources}</h3>
                {result.detections.length ? <ul className="mt-2 space-y-2">{result.detections.map((item, index) => <li key={`${item.source}-${index}`} className="break-words rounded-xl border border-white/10 bg-black/20 p-3 text-xs"><span className="font-medium">{item.source}</span><span className="ml-2 text-white/45">{item.category}</span>{item.result && <p className="mt-1 text-white/60">{item.result}</p>}</li>)}</ul> : <p className="mt-2 text-xs text-white/45">{copy.noSources}</p>}
              </div>
              <a href="https://www.virustotal.com/gui/home/url" target="_blank" rel="noopener noreferrer" className="inline-flex text-sm text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Buka VirusTotal" : "Open VirusTotal"}</a>
            </div>
          )}
        </section>
      </div>
    </FeatureShell>
  )
}
