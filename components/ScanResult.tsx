/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShieldAlert, Brain, Siren, ShieldCheck, ScanSearch,
  UserX, HeartCrack, Gift, Coins, TrendingDown,
  Briefcase, KeyRound, ImageOff, Fish, Fingerprint,
  CircleDashed, CheckCircle2, Terminal
} from "lucide-react"

import EmotionalMeter from "./EmotionalMeter"
import ThreatRing from "./ThreatRing" // <-- KITA PINDAH THREAT RING KE SINI
import { useLanguage } from "@/context/LanguageContext"

type AnalysisResult = {
  scam_probability: string
  threat_level: string
  scam_category: { name: string; confidence: number }
  emotional_metrics: { fear: number; urgency: number; trust_abuse: number; isolation: number }
  summary: string
  analysis: {
    manipulation_tactics: string[]
    emotional_pressure: string[]
    impersonation_attempts: string[]
    urgency_tactics: string[]
    phishing_indicators: string[]
  }
  psychology_explanation: string
  recommended_actions: string[]
  highlighted_segments?: { text: string; risk: "low" | "medium" | "high" | "critical"; reason: string }[]
}

type Props = { result: AnalysisResult }

// --- KOMPONEN MESIN KETIK AI (TYPEWRITER) ---
function Typewriter({ text, delay = 0, speed = 15, className = "" }: { text: string; delay?: number; speed?: number; className?: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    let i = 0
    let interval: NodeJS.Timeout
    
    const timeout = setTimeout(() => {
      setHasStarted(true)
      setIsTyping(true)
      interval = setInterval(() => {
        setDisplayedText(text.substring(0, i))
        i++
        if (i > text.length) {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, speed)
    }, delay * 1000)

    return () => { clearTimeout(timeout); clearInterval(interval) }
  }, [text, delay, speed])

  return (
    <span className={className}>
      {displayedText}
      {isTyping && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="inline-block w-1.5 h-4 bg-white/70 ml-1 translate-y-0.5" />
      )}
      {!hasStarted && <span className="opacity-0">.</span>}
    </span>
  )
}

// --- ICON MAPPER ---
const getCategoryIcon = (categoryName: string) => {
  const iconProps = { className: "w-8 h-8 text-white/80" }
  switch (categoryName) {
    case 'Impersonation Scam': return <UserX {...iconProps} />
    case 'Emergency Scam': return <Siren {...iconProps} />
    case 'Romance Scam': return <HeartCrack {...iconProps} />
    case 'Giveaway Scam': return <Gift {...iconProps} />
    case 'Crypto Scam': return <Coins {...iconProps} />
    case 'Investment Scam': return <TrendingDown {...iconProps} />
    case 'Job Scam': return <Briefcase {...iconProps} />
    case 'OTP Scam': return <KeyRound {...iconProps} />
    case 'Sextortion Scam': return <ImageOff {...iconProps} />
    case 'Phishing Scam': return <Fish {...iconProps} />
    case 'Social Engineering': return <Fingerprint {...iconProps} />
    default: return <ShieldAlert {...iconProps} />
  }
}

// --- VARIANTS UNTUK STAGGER REVEAL ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function ScanResult({ result }: Props) {
  const { t } = useLanguage()

  const cards = [
    { key: "manipulation_tactics", title: t.manipulation, icon: Brain },
    { key: "emotional_pressure", title: t.emotional, icon: Siren },
    { key: "impersonation_attempts", title: t.impersonation, icon: ShieldAlert },
    { key: "urgency_tactics", title: t.urgency, icon: ScanSearch },
    { key: "phishing_indicators", title: t.phishing, icon: ShieldCheck },
  ]

  const threatScore = parseInt(result.scam_probability.replace(/\D/g, "")) || 0

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 md:space-y-10 mt-14 w-full">
      
      {/* 1. HERO RESULT & THREAT RING (STAGGER 1) */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-10 px-2">
        {/* Threat Ring Cinematic Entrance */}
        <motion.div initial={{ scale: 0.8, filter: "blur(10px)" }} animate={{ scale: 1, filter: "blur(0px)" }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="shrink-0">
          <ThreatRing score={threatScore} />
        </motion.div>

        <div className="flex-1 space-y-6 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Terminal className="w-4 h-4 text-white/50" />
            <span className="text-xs sm:text-sm font-medium text-white/80 tracking-wider">
              <Typewriter text={`${t.aiDetection} - ${result.threat_level}`} delay={0.5} speed={30} />
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-white leading-relaxed tracking-tight min-h-[100px]">
            <Typewriter text={result.summary} delay={1.5} speed={20} /> 
          </h2>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 2. CATEGORY DETECTED (STAGGER 2) */}
        {result.scam_category && (
          <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#050505] p-8 md:p-10 shadow-[0_0_40px_rgba(255,255,255,0.015)] flex flex-col justify-center gap-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.03)]" />
                {getCategoryIcon(result.scam_category.name)}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-medium">{t.categoryDetected}</p>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">{result.scam_category.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <CircleDashed className="w-4 h-4 text-white/40 animate-[spin_4s_linear_infinite]" />
                  <p className="text-base text-white/50 font-light">
                    <span className="text-white font-medium">{result.scam_category.confidence}%</span> {t.aiConfidence}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. EMOTIONAL MANIPULATION METER (STAGGER 3) */}
        <motion.div variants={itemVariants}>
          {result.emotional_metrics && <EmotionalMeter metrics={result.emotional_metrics} />}
        </motion.div>
      </div>

      {/* 4. ANALYSIS GRID (TACTICS) (STAGGER 4) */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          const items = result.analysis[card.key as keyof typeof result.analysis]

          return (
            <div key={card.key} className="rounded-[32px] border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl hover:bg-white/[0.04] transition duration-500 group">
              <div className="space-y-6">
                <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:border-white/20 transition duration-500">
                  <Icon className="w-6 h-6 text-white/80" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl tracking-tight font-medium text-white">{card.title}</h3>
                  <div className="space-y-3 pt-2">
                    {items.map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + (i * 0.15) }}
                        key={i} className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                        <span className="text-white/60 leading-relaxed text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* 5. PSYCHOLOGY TYPING (STAGGER 5) */}
      <motion.div variants={itemVariants} className="rounded-[40px] border border-white/[0.08] bg-[#050505] p-10 md:p-14 shadow-[0_0_50px_rgba(255,255,255,0.02)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] h-[200%] animate-[scan_4s_linear_infinite] pointer-events-none opacity-30" />
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
            <p className="text-sm text-white/40 tracking-[0.2em] uppercase font-mono">
              [SYS] {t.psychologyAnalysis}
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl tracking-tight leading-snug font-light text-white">
            {t.psychologySubtitle}
          </h2>
          <div className="text-white/60 text-lg leading-relaxed mt-4 font-light border-l-2 border-white/10 pl-6 min-h-[120px]">
            <Typewriter text={result.psychology_explanation} delay={2} speed={15} />
          </div>
        </div>
      </motion.div>

      {/* 6. RECOMMENDED ACTIONS (STAGGER 6) */}
      <motion.div variants={itemVariants} className="space-y-6 pt-4">
        <h2 className="text-3xl tracking-tight font-medium px-2">{t.actions}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {result.recommended_actions.map((action, index) => (
            <motion.div 
              key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + (index * 0.1) }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 flex items-start gap-4 hover:bg-white/[0.04] transition duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white/70 leading-relaxed text-sm md:text-base mt-1.5">{action}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
    </motion.div>
  )
}