"use client"

import { motion } from "framer-motion"
import { Activity, Timer, HeartCrack, UserMinus } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext" // <-- IMPORT CONTEXT

type EmotionalMetrics = {
  fear: number
  urgency: number
  trust_abuse: number
  isolation: number
}

type Props = {
  metrics: EmotionalMetrics
}

export default function EmotionalMeter({ metrics }: Props) {
  const { t } = useLanguage() // <-- PANGGIL TRANSLASI
  const cinematicEase = [0.16, 1, 0.3, 1] as const

  // Mapping teks berdasarkan dictionary bahasa aktif
  const items = [
    { label: t.fearPressure, value: metrics?.fear || 0, icon: Activity },
    { label: t.urgencyManipulation, value: metrics?.urgency || 0, icon: Timer },
    { label: t.trustExploitation, value: metrics?.trust_abuse || 0, icon: HeartCrack },
    { label: t.isolationTactics, value: metrics?.isolation || 0, icon: UserMinus },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: cinematicEase, delay: 0.3 }}
      className="rounded-[32px] border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-center"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-8">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-xs text-white/40 tracking-[0.25em] uppercase font-medium mb-2"
          >
            {t.psychProfile}
          </motion.p>
          <h2 className="text-3xl font-light tracking-tight text-white">
            {t.emoManipulation}
          </h2>
        </div>

        <div className="space-y-6">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/70">
                    <Icon className="w-4 h-4 text-white/40" />
                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-sm text-white font-medium"
                  >
                    {item.value}%
                  </motion.span>
                </div>

                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{
                      duration: 1.2,
                      ease: cinematicEase,
                      delay: 0.5 + index * 0.15,
                    }}
                    className="h-full bg-gradient-to-r from-white/40 to-white rounded-full relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] blur-[2px]" />
                  </motion.div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}