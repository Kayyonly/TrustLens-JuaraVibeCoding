"use client"

import { useState } from "react"

type Props = { riskScore: number; language: "id" | "en" }

export default function SafeReplyPanel({ riskScore, language }: Props) {
  const [copied, setCopied] = useState("")
  const [manualText, setManualText] = useState("")
  const isId = language === "id"
  const replies = isId ? [
    { id: "verify", title: "Minta verifikasi resmi", text: "Terima kasih. Saya akan memverifikasi permintaan ini melalui kanal resmi yang saya cari sendiri. Saya tidak akan mengirimkan kode atau data rahasia." },
    { id: "decline", title: "Tolak dengan sopan", text: "Maaf, saya tidak dapat memenuhi permintaan tersebut. Saya tidak akan membagikan OTP, PIN, kata sandi, atau detail pembayaran." },
    { id: "end", title: "Akhiri percakapan", text: "Saya menghentikan percakapan ini dan tidak akan melanjutkan melalui tautan atau nomor ini." },
  ] : [
    { id: "verify", title: "Request official verification", text: "Thanks. I’ll verify this request through an official channel I find independently. I won’t share codes or sensitive information." },
    { id: "decline", title: "Politely decline", text: "I’m unable to help with that request. I won’t share an OTP, PIN, password, or payment details." },
    { id: "end", title: "End the conversation", text: "I’m ending this conversation and won’t continue through this link or number." },
  ]
  async function copyReply(text: string) {
    setCopied("")
    setManualText("")
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable")
      await navigator.clipboard.writeText(text)
      setCopied(isId ? "Balasan disalin." : "Reply copied.")
    } catch {
      setManualText(text)
      setCopied(isId ? "Salin manual dari kotak teks berikut." : "Copy manually from the text box below.")
    }
    window.setTimeout(() => setCopied(""), 3_500)
  }
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">{isId ? "BALASAN AMAN" : "SAFE REPLIES"}</p>
        <h2 className="mt-2 text-xl font-medium">{isId ? "Balas tanpa membuka informasi tambahan." : "Reply without sharing more information."}</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{isId ? "Pilihan ini dibuat lokal dari template, memakai konteks hasil yang sudah ada—tidak ada permintaan AI baru." : "These local templates use the existing result context—no additional AI request is made."}</p>
      </div>
      {riskScore >= 65 && <p className="mt-4 rounded-xl border border-amber-200/20 bg-amber-950/20 p-3 text-sm leading-relaxed text-amber-50/80">{isId ? "Skor risiko tinggi. Pilihan paling aman mungkin tidak membalas: verifikasi lewat kanal resmi, lalu blokir dan laporkan bila perlu. Gunakan template hanya jika memang perlu mengirim satu pesan penutup." : "Risk score is high. The safest choice may be not to reply: verify through an official channel, then block and report if appropriate. Use a template only if a single closing message is necessary."}</p>}
      <div className="mt-5 grid gap-3 md:grid-cols-3">{replies.map((reply) => <article key={reply.id} className="flex flex-col rounded-2xl border border-white/10 bg-black/20 p-4"><h3 className="text-sm font-medium text-white/85">{reply.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{reply.text}</p><button type="button" onClick={() => copyReply(reply.text)} className="mt-4 min-h-10 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{isId ? "Salin balasan" : "Copy reply"}</button></article>)}</div>
      {copied && <p aria-live="polite" className="mt-4 text-sm text-white/70">{copied}</p>}
      {manualText && <textarea aria-label={isId ? "Teks untuk disalin manual" : "Text to copy manually"} readOnly value={manualText} rows={3} className="mt-3 w-full rounded-xl border border-white/15 bg-black/35 p-3 text-sm text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70" />}
    </section>
  )
}
