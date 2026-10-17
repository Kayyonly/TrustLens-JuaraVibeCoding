"use client"

import Link from "next/link"
import FeatureShell from "@/components/features/FeatureShell"
import { useLanguage } from "@/context/LanguageContext"

const tools = {
  id: [
    { href: "/url-scanner", title: "Pemindai reputasi URL", description: "Periksa sinyal URL dari VirusTotal dengan pengungkapan pembagian data." },
    { href: "/recovery", title: "Bantuan setelah dugaan penipuan", description: "Langkah respons berdasarkan apa yang sudah terjadi—tanpa meminta OTP, PIN, atau kata sandi." },
    { href: "/cases", title: "Kasus & linimasa", description: "Kelompokkan laporan lokal dan bandingkan skor tanpa menjalankan ulang AI." },
    { href: "/feedback", title: "Umpan balik kualitas", description: "Kirim penilaian sukarela yang disimpan hanya di perangkat ini; tidak ada bukti yang diunggah." },
  ],
  en: [
    { href: "/url-scanner", title: "URL reputation scanner", description: "Check VirusTotal URL signals with clear data-sharing disclosure." },
    { href: "/recovery", title: "Scam incident guidance", description: "Practical steps based on what happened—without requesting an OTP, PIN, or password." },
    { href: "/cases", title: "Cases & timeline", description: "Group local reports and compare scores without rerunning AI." },
    { href: "/feedback", title: "Quality feedback", description: "Provide voluntary feedback stored only on this device; no evidence is uploaded." },
  ],
}

export default function ToolsPage() {
  const { language } = useLanguage()
  const isId = language === "id"
  return <FeatureShell eyebrow="TRUSTLENS TOOLS" title={isId ? "Perangkat intelijen untuk langkah berikutnya." : "Intelligence tools for your next step."} description={isId ? "Pilih alat sesuai kebutuhan. Hasil reputasi dan panduan bersifat informatif, bukan jaminan keamanan atau pemulihan dana." : "Choose a tool for the situation. Reputation results and guidance are informational—not guarantees of safety or fund recovery."}>
    <div className="grid gap-4 sm:grid-cols-2">{tools[language].map((tool) => <Link key={tool.href} href={tool.href} className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"><h2 className="text-xl font-medium text-white group-hover:text-white">{tool.title}</h2><p className="mt-3 text-sm leading-relaxed text-white/55">{tool.description}</p><span className="mt-5 inline-block text-sm text-white/65">{isId ? "Buka alat →" : "Open tool →"}</span></Link>)}</div>
  </FeatureShell>
}
