"use client"

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { Terminal, CheckCircle2, Loader2, ShieldAlert } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

export default function ScanLoading() {
  const { t } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)
  
  // Animasi Persentase
  const count = useMotionValue(0)
  const roundedPercent = useTransform(count, Math.round)

  useEffect(() => {
    // Jalankan persentase dari 0 ke 98 (sisanya diisi saat selesai)
    const totalDuration = (t.steps.length * 1.2)
    animate(count, 98, { duration: totalDuration, ease: "circOut" })

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= t.steps.length ? prev : prev + 1))
    }, 1200)
    return () => clearInterval(interval)
  }, [t.steps.length, count])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }} transition={{ duration: 0.5 }} className="relative w-full max-w-4xl mx-auto mt-14">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-[#050505] shadow-[0_0_60px_rgba(255,255,255,0.03)] flex flex-col md:flex-row">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] h-[200%] animate-[scan_3s_linear_infinite] pointer-events-none opacity-50" />

        {/* LEFT: Percentage Counter */}
        <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-white/[0.08] bg-white/[0.01] p-8 md:p-10 flex flex-col items-center justify-center relative z-10">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <p className="text-xs tracking-[0.2em] text-white/40 uppercase mb-4 text-center">{t.loadingEngine}</p>
          <div className="flex items-start">
            <motion.span className="text-6xl md:text-8xl font-light tracking-tighter text-white">{roundedPercent}</motion.span>
            <span className="text-2xl md:text-3xl text-white/30 font-light mt-2">%</span>
          </div>
          <p className="text-sm text-white/40 mt-4 text-center animate-pulse">{t.loadingProcessing}...</p>
        </div>

        {/* RIGHT: Terminal Console */}
        <div className="md:w-2/3 flex flex-col relative z-10">
          <div className="h-12 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-white/50" />
              <span className="text-xs text-white/50 font-mono tracking-widest uppercase">System.Log</span>
            </div>
          </div>

          <div className="p-6 md:p-8 min-h-[300px] flex flex-col gap-4 font-mono text-xs md:text-sm">
            <div className="text-white/30 mb-2">{t.loadingInit}</div>
            <AnimatePresence>
              {t.steps.map((step, index) => {
                const isCompleted = activeStep > index
                const isProcessing = activeStep === index
                const isWarningStep = index === 2 || index === 3
                if (activeStep < index) return null

                return (
                  <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {isProcessing && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                      {isCompleted && !isWarningStep && <CheckCircle2 className="w-4 h-4 text-white/60" />}
                      {isCompleted && isWarningStep && <ShieldAlert className="w-4 h-4 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
                      <span className={`${isCompleted ? (isWarningStep ? 'text-white' : 'text-white/60') : 'text-white'}`}>{step}</span>
                    </div>
                    <div>
                      {isProcessing && <span className="text-white/40 animate-pulse">{t.loadingProcessing} <span className="inline-block w-1 h-4 bg-white/50 ml-1 animate-[ping_1s_steps(2,start)_infinite]" /></span>}
                      {isCompleted && !isWarningStep && <span className="text-white/40">{t.loadingOk}</span>}
                      {isCompleted && isWarningStep && <span className="text-white/90">{t.loadingDetected}</span>}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes scan { 0% { transform: translateY(-50%); } 100% { transform: translateY(0%); } }`}} />
    </motion.div>
  )
}