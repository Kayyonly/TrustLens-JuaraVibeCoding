"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import BackgroundGlow from "@/components/BackgroundGlow"
import { useLanguage } from "@/context/LanguageContext"

export default function FeatureShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  const { language } = useLanguage()
  const links = language === "id"
    ? [["/url-scanner", "Pemindai URL"], ["/recovery", "Bantuan insiden"], ["/cases", "Kasus"], ["/feedback", "Umpan balik"]]
    : [["/url-scanner", "URL Scanner"], ["/recovery", "Incident help"], ["/cases", "Cases"], ["/feedback", "Feedback"]]
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <BackgroundGlow />
      <a href="#feature-content" className="sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:not-sr-only focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-black">{language === "id" ? "Lewati ke konten utama" : "Skip to main content"}</a>
      <Navbar />
      <section id="feature-content" tabIndex={-1} className="relative z-10 mx-auto max-w-6xl scroll-mt-28 px-4 pb-28 pt-32 focus-visible:outline-none sm:px-6 sm:pt-36">
        <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/45">{eyebrow}</p>
        <h1 className="max-w-4xl text-pretty text-3xl font-medium tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/55 sm:text-lg">{description}</p>
        <nav aria-label={language === "id" ? "Alat TrustLens" : "TrustLens tools"} className="mt-8 flex flex-wrap gap-2">
          {links.map(([href, label]) => <Link key={href} href={href} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">{label}</Link>)}
        </nav>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  )
}
