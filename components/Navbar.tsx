"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Cpu, Fingerprint, Globe } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext" // <-- IMPORT BARU

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage() // <-- PANGGIL KONTEKS

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Fungsi toggle bahasa
  const toggleLanguage = () => setLanguage(language === "id" ? "en" : "id")

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4 md:pt-6">
          <div className="pointer-events-auto h-14 rounded-2xl border border-white/[0.08] bg-[#050505]/40 backdrop-blur-2xl flex items-center justify-between px-4 md:px-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">

            <Link href="/" onClick={handleLogoClick} className="outline-none">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:bg-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.9)] transition-all duration-300" />
                <span className="text-sm text-white/80 font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                  TrustLens
                </span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm text-white/40 hover:text-white transition-colors duration-300">{t.navFeatures}</Link>
              <Link href="/#technology" className="text-sm text-white/40 hover:text-white transition-colors duration-300">{t.navTech}</Link>
              <Link href="/#about" className="text-sm text-white/40 hover:text-white transition-colors duration-300">{t.navAbout}</Link>
            </div>

            {/* CTA & Language Switcher */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <button 
                onClick={toggleLanguage}
                className="pointer-events-auto flex items-center justify-center gap-1.5 h-9 md:h-10 px-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/70 text-xs font-medium hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{language}</span>
              </button>

              <button 
                onClick={() => router.push("/scan")} 
                className="h-9 md:h-10 px-4 md:px-5 rounded-xl bg-white text-black text-xs md:text-sm font-semibold hover:scale-[1.03] hover:bg-white/90 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] pointer-events-auto hidden sm:block"
              >
                {t.navScanner}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DOCK */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none px-4">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-[24px] border border-white/[0.1] bg-[#050505]/70 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          <MobileDockItem href="/#features" icon={Sparkles} label={t.navFeatures} />
          <MobileDockItem href="/#technology" icon={Cpu} label={t.navTechMobile} />
          <MobileDockItem href="/#about" icon={Fingerprint} label={t.navAbout} />
        </motion.div>
      </div>
    </>
  )
}

function MobileDockItem({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) {
  return (
    <a href={href} className="relative flex flex-col items-center justify-center w-[72px] h-[56px] rounded-[18px] text-white/40 hover:text-white transition-colors group active:scale-95 duration-200">
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.08] rounded-[18px] transition-colors duration-300" />
      <Icon className="w-[18px] h-[18px] mb-1 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </a>
  )
}