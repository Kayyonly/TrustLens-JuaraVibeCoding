"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

type ThreatRisk = "low" | "medium" | "high" | "critical"

type HighlightSegment = {
  text: string
  risk: ThreatRisk
  reason: string
}

type Props = {
  text: string
  segments?: HighlightSegment[]
  title: string
}

const riskStyles: Record<ThreatRisk, string> = {
  low: "bg-gradient-to-r from-slate-300/10 to-slate-100/5 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_24px_rgba(148,163,184,0.2)]",
  medium: "bg-gradient-to-r from-amber-500/20 to-orange-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.4),0_0_26px_rgba(251,146,60,0.35)]",
  high: "bg-gradient-to-r from-orange-500/25 to-red-500/20 shadow-[0_0_0_1px_rgba(249,115,22,0.55),0_0_30px_rgba(239,68,68,0.45)]",
  critical: "bg-gradient-to-r from-rose-700/40 to-red-700/30 shadow-[0_0_0_1px_rgba(244,63,94,0.7),0_0_38px_rgba(220,38,38,0.65)]",
}

const normalizeRisk = (risk: string): ThreatRisk => {
  const value = risk?.toLowerCase?.() || "low"
  if (value === "critical") return "critical"
  if (value === "high") return "high"
  if (value === "medium") return "medium"
  return "low"
}

export default function ThreatHeatmap({ text, segments = [], title }: Props) {
  const matchedSegments = useMemo(() => {
    return segments
      .map((segment) => ({ ...segment, risk: normalizeRisk(segment.risk), index: text.toLowerCase().indexOf(segment.text.toLowerCase()) }))
      .filter((segment) => segment.index >= 0)
      .sort((a, b) => a.index - b.index)
  }, [segments, text])

  const parts = useMemo(() => {
    if (!matchedSegments.length) return [{ type: "plain" as const, text }]

    const built: Array<{ type: "plain" | "hit"; text: string; reason?: string; risk?: ThreatRisk }> = []
    let cursor = 0

    matchedSegments.forEach((segment) => {
      if (segment.index < cursor) return
      if (segment.index > cursor) {
        built.push({ type: "plain", text: text.slice(cursor, segment.index) })
      }

      const segmentText = text.slice(segment.index, segment.index + segment.text.length)
      built.push({ type: "hit", text: segmentText, reason: segment.reason, risk: segment.risk })
      cursor = segment.index + segment.text.length
    })

    if (cursor < text.length) built.push({ type: "plain", text: text.slice(cursor) })
    return built
  }, [matchedSegments, text])

  return (
    <div className="rounded-[30px] border border-white/[0.08] bg-[#040409] p-5 sm:p-7 md:p-8 backdrop-blur-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm tracking-[0.22em] uppercase text-white/45">{title}</p>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/50">
          <span className="h-2 w-2 rounded-full bg-cyan-200/70 animate-pulse" /> Risk Heatmap
        </div>
      </div>

      <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 text-sm sm:text-base leading-7 sm:leading-8 text-white/75 whitespace-pre-wrap">
        <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" animate={{ x: ["-100%", "120%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} />
        {parts.map((part, idx) => {
          if (part.type === "plain") return <span key={`plain-${idx}`}>{part.text}</span>
          return (
            <motion.span
              key={`hit-${idx}`}
              initial={{ opacity: 0.5, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: idx * 0.12, duration: 0.55 }}
              className={`relative mx-[1px] inline-block rounded-md px-1.5 py-0.5 text-white ${riskStyles[part.risk || "low"]} hover:brightness-125 transition`}
              title={part.reason}
            >
              <motion.span animate={{ opacity: [0.75, 1, 0.75] }} transition={{ duration: 2.4, repeat: Infinity }}>{part.text}</motion.span>
            </motion.span>
          )
        })}
      </motion.div>
    </div>
  )
}
