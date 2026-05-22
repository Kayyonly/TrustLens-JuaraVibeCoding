"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"

export default function ThreatRing({ score }: { score: number }) {
  const { t } = useLanguage()
  const normalizedScore = Math.min(Math.max(score, 0), 100)
  
  const getThreatLabel = (s: number) => {
    if (s <= 30) return t.riskLow
    if (s <= 60) return t.riskModerate
    if (s <= 80) return t.riskHigh
    return t.riskCritical
  }

  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)
  const radius = 110
  const circumference = 2 * Math.PI * radius

  useEffect(() => { animate(count, normalizedScore, { duration: 2, ease: "easeOut" }) }, [normalizedScore, count])

  return (
    <div className="relative flex shrink-0 items-center justify-center p-8 rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
          <motion.circle cx="130" cy="130" r={radius} stroke="rgba(255,255,255,0.9)" strokeWidth="6" fill="none" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (normalizedScore / 100) * circumference }} transition={{ duration: 2 }} />
        </svg>
        <div className="absolute flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex items-start translate-x-2">
            <motion.span className="text-7xl font-medium tracking-tighter text-white">{rounded}</motion.span>
            <span className="text-2xl font-medium text-white/40 mt-2">%</span>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-xs tracking-[0.2em] text-white/50 uppercase font-medium">{getThreatLabel(normalizedScore)}</motion.div>
        </div>
      </div>
    </div>
  )
}