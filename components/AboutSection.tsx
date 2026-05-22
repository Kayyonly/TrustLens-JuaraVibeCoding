"use client"

import React from "react"
import { motion, Variants } from "framer-motion"
import { 
  ScanLine, 
  BrainCircuit, 
  ShieldAlert, 
  Activity, 
  FileText, 
  Lock, 
  ChevronRight,
  Search,
  ShieldCheck
} from "lucide-react"

// --- ANIMATION VARIANTS ---
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
}

export default function AboutSection() {
  const features = [
    {
      title: "Scam Classification",
      description: "Instantly identifies known fraud patterns, from investment scams to sophisticated phishing attempts.",
      icon: Search
    },
    {
      title: "Emotional Analysis",
      description: "Measures invisible psychological pressure like fear, manufactured urgency, and trust exploitation.",
      icon: Activity
    },
    {
      title: "Clean OCR Engine",
      description: "Extracts and sanitizes messy, unreadable text from screenshots with high precision.",
      icon: FileText
    },
    {
      title: "Threat Intelligence",
      description: "Delivers a comprehensive breakdown of tactics and actionable steps to protect yourself.",
      icon: ShieldCheck
    }
  ]

  const pipelineSteps = [
    { label: "Screenshot", icon: FileText },
    { label: "OCR Clean", icon: ScanLine },
    { label: "AI Brain", icon: BrainCircuit },
    { label: "Report", icon: ShieldAlert },
  ]

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* --- HEADER SECTION --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
        >
          {/* Pill Label */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.02] backdrop-blur-md px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.02)]">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
            <span className="text-xs text-white/60 tracking-[0.2em] uppercase font-medium">
              AI Trust Intelligence
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-light tracking-[-0.04em] text-white leading-[1.1]">
            TrustLens is more than a <span className="text-white/40 italic">scanner.</span>
          </motion.h2>

          {/* Description */}
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
            We built a psychological defense engine. TrustLens doesnt just read words—it analyzes the invisible patterns of manipulation, detecting manufactured urgency, emotional exploitation, and impersonation before you make a costly mistake.
          </motion.p>
        </motion.div>

        {/* --- AI PIPELINE VISUAL --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rounded-3xl" />
          
          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.01] backdrop-blur-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 shadow-[0_0_40px_rgba(255,255,255,0.01)]">
            {pipelineSteps.map((step, index) => (
              <React.Fragment key={step.label}>
                {/* Pipeline Node */}
                <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 relative group">
                  <div className="w-16 h-16 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center transition-colors group-hover:bg-white/[0.06] group-hover:border-white/20">
                    <step.icon className="w-7 h-7 text-white/70" />
                  </div>
                  <span className="text-sm font-medium tracking-wide text-white/60 group-hover:text-white transition-colors">
                    {step.label}
                  </span>
                </motion.div>

                {/* Connector Arrow (Hidden on last item) */}
                {index < pipelineSteps.length - 1 && (
                  <motion.div variants={fadeUp} className="text-white/10 rotate-90 md:rotate-0">
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* --- CORE FEATURES GRID --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={i} 
                variants={fadeUp}
                className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md p-8 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden"
              >
                {/* Hover gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded-xl border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-3 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* --- TRUST STATEMENT BLOCK --- */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-10 flex flex-col items-center text-center gap-5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center mb-2">
              <Lock className="w-4 h-4 text-white/60" />
            </div>
            <h4 className="text-xl font-medium tracking-tight text-white/90">
              Absolute Privacy. Zero Retention.
            </h4>
            <p className="text-white/40 text-sm leading-relaxed max-w-md font-light">
              Your conversations are analyzed in real-time. We never permanently store, train on, or share your private screenshots or text.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}