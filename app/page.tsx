"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

import Navbar from "@/components/Navbar"
import BackgroundGlow from "@/components/BackgroundGlow"
import Spotlight from "@/components/Spotlight"
import HeroPreview from "@/components/HeroPreview"
import FeaturesSection from "@/components/FeaturesSection"
import TechnologySection from "@/components/TechnologySection"
import AboutSection from "@/components/AboutSection"

export default function Home() {
  const { t } = useLanguage() // <-- PANGGIL TRANSLASI

  return (
    <main id="top" className="relative min-h-screen bg-[#0A0A0F] text-white">
      <BackgroundGlow />
      <Spotlight />
      <Navbar />

      <section className="relative z-10 px-6 pt-40 pb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-24 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="space-y-10">
            
            <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-xl">
              <div className="h-2 w-2 rounded-full bg-white/70" />
              <span className="text-sm text-white/50 tracking-wide">{t.heroBadge}</span>
            </div>

            <div className="space-y-8">
              <h1 className="max-w-4xl text-6xl md:text-7xl lg:text-[92px] font-[500] tracking-[-0.07em] leading-[0.92] text-white">
                {t.heroTitle}
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-white/45 leading-relaxed font-[400]">
                {t.heroDesc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/scan">
                <button className="h-12 px-6 rounded-2xl bg-white text-black font-medium text-sm transition hover:opacity-90">
                  {t.heroScanBtn}
                </button>
              </Link>
              <button className="h-12 px-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white/70 text-sm backdrop-blur-xl transition hover:bg-white/[0.05]">
                {t.heroDemoBtn}
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 text-sm text-white/30">
              <p>{t.heroTrust1}</p>
              <div className="h-1 w-1 rounded-full bg-white/20" />
              <p>{t.heroTrust2}</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
            <div className="absolute inset-0 bg-white/[0.03] blur-[140px]" />
            <div className="relative">
              <HeroPreview />
            </div>
          </motion.div>
        </div>
      </section>

      <FeaturesSection />
      <TechnologySection />
      <AboutSection />
    </main>
  )
}