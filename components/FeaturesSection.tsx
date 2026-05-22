"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { Activity, ShieldCheck, Fingerprint, FileText, Terminal, CheckCircle2, Sparkles, Brain } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }

export default function FeaturesSection() {
  const { t } = useLanguage()

  // Assign icons ke array dari dictionary
  const featureIcons = [Activity, Fingerprint, Brain, FileText]

  return (
    <section id="features" className="relative py-32 overflow-hidden border-t border-white/[0.05]">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[800px] h-[400px] bg-white/[0.01] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="text-xs text-white/60 tracking-[0.2em] uppercase font-medium">{t.featBadge}</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white leading-[1.1]">
            {t.featTitle1} <span className="text-white/40 italic">{t.featTitle2}</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 leading-relaxed font-light">{t.featDesc}</motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <motion.div variants={fadeUp} className="md:col-span-8 group relative rounded-[32px] border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl p-8 md:p-10 hover:bg-white/[0.03] transition-colors duration-500 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between h-full">
              <div className="max-w-sm space-y-4">
                <div className="w-12 h-12 rounded-xl border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white/80" />
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white tracking-tight">{t.featCards[0].title}</h3>
                <p className="text-white/50 font-light leading-relaxed">{t.featCards[0].desc}</p>
              </div>
              <div className="w-full md:w-64 h-40 rounded-2xl border border-white/[0.05] bg-[#0A0A0F] p-5 flex flex-col justify-end relative shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]">
                <div className="flex items-end justify-between h-full gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  {[40, 70, 45, 90, 65, 80].map((height, i) => (
                    <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }} className="w-full bg-gradient-to-t from-white/10 to-white/40 rounded-t-sm" />
                  ))}
                </div>
                <div className="absolute top-4 left-4 text-[10px] text-white/40 uppercase tracking-widest font-mono">Stress Pulse</div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-4 group relative rounded-[32px] border border-white/[0.06] bg-[#050505] p-6 hover:border-white/[0.12] transition-colors duration-500 overflow-hidden flex flex-col">
             <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-white/60" />
                <span className="text-xs text-white/40 uppercase tracking-widest font-mono">{t.featLiveIntercept}</span>
             </div>
             <div className="space-y-3 font-mono text-xs md:text-sm">
                <div className="text-white/30 mb-2">{t.featAnalyzing}</div>
                {t.featLiveSteps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 + (i * 0.2) }} className={`flex items-center gap-2 ${i === 3 ? 'text-white mt-2' : 'text-white/80'}`}>
                    {i === 3 ? <Sparkles className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-white/50" />} {step}
                  </motion.div>
                ))}
             </div>
          </motion.div>

          {[1, 2, 3].map((i) => {
            const Icon = featureIcons[i]
            return (
              <motion.div key={i} variants={fadeUp} className="md:col-span-4 group relative rounded-[32px] border border-white/[0.06] bg-white/[0.015] backdrop-blur-xl p-8 hover:bg-white/[0.03] transition-colors duration-500 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl border border-white/[0.1] bg-white/[0.02] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white/70" />
                </div>
                <h3 className="text-xl font-medium text-white tracking-tight">{t.featCards[i].title}</h3>
                <p className="text-sm text-white/50 font-light leading-relaxed">{t.featCards[i].desc}</p>
              </motion.div>
            )
          })}

        </motion.div>
      </div>
    </section>
  )
}