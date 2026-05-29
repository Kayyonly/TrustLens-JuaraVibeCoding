"use client"

import { Upload } from "lucide-react"
import { motion } from "framer-motion"

export default function ScanUpload() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-12"
    >

      {/* Ambient Light */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">

        {/* Icon */}
        <div className="w-24 h-24 rounded-[28px] bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-2xl">

          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
            <Upload className="w-7 h-7 text-white/80" />
          </div>

        </div>

        {/* Text */}
        <div className="space-y-4">

          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.04em]">
            Upload conversation evidence
          </h2>

          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            TrustLens reviews emotional pressure, manipulation patterns, impersonation cues, and scam probability.
          </p>

        </div>

        {/* Upload Button */}
        <button className="group relative overflow-hidden bg-white text-black px-6 py-3 rounded-2xl font-medium transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]">

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full" />

          <span className="relative z-10">
            Select Evidence
          </span>

        </button>

        {/* Supported */}
        <p className="text-sm text-white/30">
          PNG · JPG · WEBP
        </p>

      </div>

    </motion.div>
  )
} //INI SCAN UPLOAD