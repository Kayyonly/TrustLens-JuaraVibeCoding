"use client"

import { motion } from "framer-motion"

export default function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative"
    >

      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl">

        {/* Top */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <p className="text-sm text-white/35 tracking-wide">
              TRUSTLENS AI ANALYSIS
            </p>

            <h2 className="text-3xl font-[500] tracking-[-0.05em] mt-3">
              Critical Threat
            </h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/[0.08] bg-white/[0.03]">

            <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />

            <span className="text-sm text-white/60">
              Live Analysis
            </span>

          </div>

        </div>

        {/* Risk */}
        <div className="space-y-3 mb-10">

          <p className="text-white/35 text-sm">
            Scam Probability
          </p>

          <div className="flex items-end gap-3">

            <h1 className="text-7xl font-[500] tracking-[-0.08em]">
              98%
            </h1>

            <p className="text-white/40 pb-3">
              Severe Risk
            </p>

          </div>

        </div>

        {/* Findings */}
        <div className="space-y-4">

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">

            <p className="text-white font-medium">
              Artificial Urgency
            </p>

            <p className="text-white/45 text-sm mt-2 leading-relaxed">
              The sender attempts to pressure immediate action before logical thinking occurs.
            </p>

          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">

            <p className="text-white font-medium">
              Authority Impersonation
            </p>

            <p className="text-white/45 text-sm mt-2 leading-relaxed">
              Claimed identity appears inconsistent with behavioral patterns.
            </p>

          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.08] mt-10 pt-8">

          <p className="text-sm text-white/35 mb-3">
            AI INSIGHT
          </p>

          <p className="text-white/60 leading-relaxed">
            This conversation combines urgency and fear tactics to reduce critical thinking and manipulate emotional response.
          </p>

        </div>

      </div>

    </motion.div>
  )
}