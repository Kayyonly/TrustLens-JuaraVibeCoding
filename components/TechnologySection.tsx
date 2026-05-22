"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { Cpu, ScanLine, BrainCircuit, ShieldAlert, Activity, TerminalSquare, Network, Fingerprint, Zap, Lock, CheckCircle2, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }

const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
)

export default function TechnologySection() {
  const { t } = useLanguage()
  const pipeIcons = [ScanLine, FileText, Zap, BrainCircuit, Fingerprint, ShieldAlert]
  const techIcons = [Cpu, ScanLine, Network, Fingerprint, Activity, ShieldAlert]

  const liveAnalysisLines = [
    t.techLiveInit,
    t.techLiveOcr,
    t.techLiveSemantic,
    `✓ ${t.techLiveDetect1}`,
    `✓ ${t.techLiveDetect2}`,
    `✓ ${t.techLiveDetect3}`,
    t.techLiveDone
  ]

  return (
    <section id="technology" className="relative py-32 overflow-hidden border-t border-white/[0.05]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-white/[0.015] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="text-xs text-white/60 tracking-[0.2em] uppercase font-medium">{t.techBadge}</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-light tracking-[-0.04em] text-white leading-[1.1]">
            {t.techTitle1} <span className="text-white/40 italic">{t.techTitle2}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-2xl">{t.techDesc}</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10"><p className="text-xs text-white/40 tracking-[0.2em] uppercase font-medium">{t.techArchitecture}</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-y-1/2 z-0" />
            {t.techPipeline.map((label, index) => {
              const Icon = pipeIcons[index]
              return (
                <motion.div key={label} variants={fadeUp} className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl border border-white/[0.1] bg-[#0A0A0F] flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.03)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.05] transition-colors duration-500" />
                    <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/30 font-mono">0{index + 1}</span>
                    <span className="text-sm font-medium tracking-wide text-white/60">{label}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6 max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="rounded-[32px] border border-white/[0.08] bg-[#050505] overflow-hidden flex flex-col relative shadow-[0_0_40px_rgba(255,255,255,0.02)]">
            <div className="h-12 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-6 gap-2">
              <TerminalSquare className="w-4 h-4 text-white/40" />
              <span className="text-xs text-white/40 font-mono tracking-widest uppercase">System.Log</span>
            </div>
            <div className="p-8 flex-1 flex flex-col gap-3 font-mono text-xs md:text-sm">
              {liveAnalysisLines.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 + 0.3 }} className={`flex items-start gap-3 ${line.includes('✓') ? 'text-white/90' : 'text-white/40'}`}>
                  {line.includes('✓') ? <span className="text-white shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></span> : <span className="text-white/20 shrink-0">{'>'}</span>}
                  <span className="leading-relaxed">{line.replace('✓ ', '')}</span>
                </motion.div>
              ))}
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-4 bg-white/50 mt-2" />
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="grid sm:grid-cols-2 gap-4">
            {t.techCards.map((card, i) => {
              const Icon = techIcons[i]
              return (
                <motion.div key={i} variants={fadeUp} className="group relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-6 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-2 tracking-tight">{card.title}</h3>
                      <p className="text-sm text-white/40 leading-relaxed font-light">{card.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/[0.05] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent py-8 px-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center shrink-0 relative">
                <div className="absolute inset-0 border border-white/20 rounded-full animate-[ping_3s_ease-in-out_infinite]" />
                <Lock className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <h4 className="text-lg font-medium tracking-tight text-white/90">{t.techTrustTitle}</h4>
                <p className="text-white/40 text-sm mt-1 font-light">{t.techTrustDesc}</p>
              </div>
            </div>
            <button className="h-10 px-5 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white text-sm font-medium hover:bg-white/[0.1] transition shrink-0 flex items-center gap-2">
              {t.techTrustBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}