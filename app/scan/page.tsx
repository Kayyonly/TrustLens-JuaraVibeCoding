/* eslint-disable */
"use client"

import React, { useState } from "react"
import Tesseract from "tesseract.js"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileImage, AlertCircle, ScanSearch, RefreshCw, History } from "lucide-react"

import Navbar from "@/components/Navbar"
import BackgroundGlow from "@/components/BackgroundGlow"
import ScanLoading from "@/components/ScanLoading"
import ScanResult from "@/components/ScanResult"
import HistoryDrawer from "@/components/HistoryDrawer"
import { cleanOCRText, assessOCRQuality } from "@/lib/cleanOCRText"
import { useLanguage } from "@/context/LanguageContext"
import { useScanHistory, HistoryItem, generateMiniThumbnail } from "@/hooks/useScanHistory"

type OcrQuality = "good" | "bad" | null

// TAMBAHKAN BLOK INI:
type AnalysisResult = {
  scam_probability: string
  threat_level: string
  scam_category: { name: string; confidence: number }
  emotional_metrics: { fear: number; urgency: number; trust_abuse: number; isolation: number }
  summary: string
  psychology_explanation: string
  analysis: {
    manipulation_tactics: string[]
    emotional_pressure: string[]
    urgency_tactics: string[]
    impersonation_attempts: string[]
    phishing_indicators: string[]
  }
  recommended_actions: string[]
}

const OCR_CONFIDENCE_THRESHOLD = 60

export default function ScanPage() {
  const { language, t } = useLanguage()
  const { history, isLoaded, addScan, deleteScan, clearHistory } = useScanHistory()

  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState("")
  const [ocrQuality, setOcrQuality] = useState<OcrQuality>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return
    setSelectedFile(file)
    setImagePreview(URL.createObjectURL(file))
    setExtractedText("")
    setOcrQuality(null)
    setResult(null)
  }

  const handleOpenFromHistory = (item: HistoryItem) => {
    setSelectedFile(null)
    setImagePreview(item.thumbnail)
    setExtractedText(t.historyAnalysis)
    setOcrQuality("good")
    setResult(item.result)
  }

  const runAnalysis = async () => {
    if (!selectedFile) return
    setLoading(true)

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(",")[1])
        reader.readAsDataURL(selectedFile)
      })

      const ocrResult = await Tesseract.recognize(selectedFile, "eng+ind")
      const rawText = ocrResult.data.text.trim()
      const confidence = ocrResult.data.confidence

      const cleanedText = cleanOCRText(rawText)
      const isLowQuality = assessOCRQuality(cleanedText) || confidence < OCR_CONFIDENCE_THRESHOLD

      const quality: OcrQuality = isLowQuality ? "bad" : "good"
      setOcrQuality(quality)
      setExtractedText(cleanedText)

      const body = quality === "good"
        ? { text: cleanedText, language }
        : { image: base64, mimeType: selectedFile.type, language }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      const analysisData = data.result
      setResult(analysisData)

      // Simpan ke History
      const thumb = await generateMiniThumbnail(selectedFile)
      addScan({
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: `${analysisData.scam_category?.name || "Suspicious"} Analysis`,
        threatScore: parseInt(analysisData.scam_probability.replace(/\D/g, "")) || 0,
        threatLevel: analysisData.threat_level,
        category: analysisData.scam_category?.name || "Unknown",
        summary: analysisData.summary,
        thumbnail: thumb,
        result: analysisData
      })

    } catch (error) {
      console.error("Processing Pipeline Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileSelect(file) }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileSelect(file) }
  const clearSelection = () => { setSelectedFile(null); setImagePreview(null); setExtractedText(""); setOcrQuality(null); setResult(null); }

  const runDemoAnalysis = async () => {
    const textToAnalyze = t.demoText
    clearSelection()
    setOcrQuality("good")
    setExtractedText(textToAnalyze)
    setLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze, language }),
      })
      const data = await response.json()
      setResult(data.result)

      addScan({
        id: Date.now().toString(),
        timestamp: Date.now(),
        title: `Demo: ${data.result.scam_category?.name || "Analysis"}`,
        threatScore: parseInt(data.result.scam_probability.replace(/\D/g, "")) || 0,
        threatLevel: data.result.threat_level,
        category: data.result.scam_category?.name || "Unknown",
        summary: data.result.summary,
        thumbnail: null,
        result: data.result
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0A0A0F] text-white">
      <BackgroundGlow />
      <Navbar />

      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onSelect={handleOpenFromHistory} onDelete={deleteScan} onClear={clearHistory} />

      <section className="relative z-10 px-4 sm:px-6 pt-40 pb-24">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl space-y-6 mb-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/3 px-4 py-2 backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-white/70" />
              <span className="text-sm text-white/50">{t.badge}</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-medium tracking-[-0.03em] md:tracking-[-0.07em] leading-[1.05] md:leading-[0.95]">
              {t.hero}
            </h1>
            <p className="text-base sm:text-lg text-white/45 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Drag & Drop Upload Card */}
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/3 backdrop-blur-2xl transition-all duration-300">
            
            {/* NEW: ELEGANT HISTORY BUTTON INSIDE CARD */}
            {isLoaded && (
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
                <button onClick={() => setIsHistoryOpen(true)} className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white text-xs sm:text-sm font-medium shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                  <History className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" /> 
                  <span className="hidden sm:inline">{(t as any).historyBtn || "History"}</span>
                  {history.length > 0 && <span className="bg-white/10 px-1.5 py-0.5 rounded-md text-[10px] text-white">{history.length}</span>}
                </button>
              </div>
            )}
            <AnimatePresence>
              {isDragging && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0F]/80 backdrop-blur-xl border-4 border-white/30 rounded-[36px] shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="w-24 h-24 mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                    <FileImage className="w-10 h-10 text-white animate-pulse" />
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight mb-2 text-white drop-shadow-lg">{t.dropTitle}</h3>
                  <p className="text-white/70 text-base sm:text-lg">{t.dropSubtitle}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6 sm:p-10 md:p-16">
              <div className="grid lg:grid-cols-[1fr_0.8fr] gap-10 lg:gap-16 items-center">

                {/* LEFT: Dynamic Text & Buttons */}
                <div className="space-y-8 sm:space-y-10">
                  <AnimatePresence mode="wait">
                    {!imagePreview ? (
                      <motion.div key="upload" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8 sm:space-y-10">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] border border-white/8 bg-white/3 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white/70" />
                          </div>
                        </div>
                        <div className="space-y-4 pointer-events-none">
                          <div>
                            <p className="text-xs sm:text-sm text-white/35 mb-3 tracking-wide">{t.uploadLabel}</p>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-[-0.02em] md:tracking-[-0.06em] leading-tight">{t.uploadTitle}</h2>
                          </div>
                          <p className="text-white/45 text-base sm:text-lg leading-relaxed max-w-xl">{t.uploadDesc}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 relative z-20">
                          <label htmlFor="imageUpload" className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl bg-white text-black font-medium text-sm hover:scale-[1.02] hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            {t.uploadBtn}
                          </label>
                          <button onClick={runDemoAnalysis} disabled={loading} className="group relative h-11 sm:h-12 px-5 sm:px-6 rounded-2xl border border-white/10 bg-white/5 text-white/80 font-medium text-sm hover:bg-white/10 active:scale-95 transition-all overflow-hidden flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
                            <span className="relative z-10">{t.demoBtn}</span>
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="ready" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8 sm:space-y-10">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] border border-white/8 bg-white/3 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                            <ScanSearch className="w-6 h-6 sm:w-7 sm:h-7 text-white/70" />
                          </div>
                        </div>
                        <div className="space-y-4 pointer-events-none">
                          <div>
                            <p className="text-xs sm:text-sm text-white/35 mb-3 tracking-wide">{t.uploadLabel}</p>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-[-0.02em] md:tracking-[-0.06em] leading-tight">{(t as any).readyTitle || "Ready"}</h2>
                          </div>
                          <p className="text-white/45 text-base sm:text-lg leading-relaxed max-w-xl">{(t as any).readyDesc || "Ready to analyze."}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 relative z-20">
                          <button onClick={runAnalysis} disabled={loading} className="h-11 sm:h-12 px-6 sm:px-8 rounded-2xl bg-white text-black font-semibold text-sm hover:scale-[1.02] hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2 cursor-pointer disabled:opacity-50">
                            <Sparkles className="w-4 h-4" /> {(t as any).analyzeBtn || "Analyze"}
                          </button>
                          <button onClick={clearSelection} disabled={loading} className="h-11 sm:h-12 px-5 sm:px-6 rounded-2xl border border-white/10 bg-transparent text-white/60 font-medium text-sm hover:text-white hover:bg-white/5 active:scale-95 transition-all cursor-pointer disabled:opacity-50">
                            {(t as any).removeImage || "Remove"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                </div>

                {/* RIGHT: Visual Preview */}
                <div className="relative">
                  {imagePreview && !result ? (
                    <motion.div key="image-preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="group relative rounded-[32px] overflow-hidden border border-white/10 bg-[#050505] shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(255,255,255,0.03)] aspect-[4/5] sm:aspect-auto">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 sm:group-hover:opacity-40" />
                      {!loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                          <label htmlFor="imageUpload" className="pointer-events-auto h-12 px-6 rounded-2xl border border-white/10 bg-black/60 text-white text-sm font-medium flex items-center gap-2 cursor-pointer hover:scale-105 hover:bg-white/10 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-md">
                            <RefreshCw className="w-4 h-4" /> {(t as any).replaceImage || "Replace"}
                          </label>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="rounded-[32px] border border-white/8 bg-black/30 backdrop-blur-2xl p-5 sm:p-6 space-y-6 shadow-[0_0_30px_rgba(255,255,255,0.01)] pointer-events-none">
                      <div className="space-y-4 opacity-50">
                        <div className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-br-md bg-white text-black px-4 py-3 text-sm leading-relaxed">{t.fakeChatMsg1}</div></div>
                        <div className="flex justify-start"><div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white/5 border border-white/8 px-4 py-3 text-sm text-white/70 leading-relaxed">{t.fakeChatMsg2}</div></div>
                      </div>
                      <div className="rounded-2xl border border-white/8 bg-white/3 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs sm:text-sm text-white/40">{t.aiDetection}</p>
                          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" /><span className="text-xs text-white/40">{t.live}</span></div>
                        </div>
                        <div className="flex items-end gap-3"><h3 className="text-4xl font-medium tracking-[-0.03em] md:tracking-[-0.07em]">--%</h3><p className="text-white/40 pb-2 text-sm sm:text-base">{t.scamProb}</p></div>
                        <div className="space-y-3 pt-2"><div className="h-4 w-full bg-white/5 rounded" /><div className="h-4 w-2/3 bg-white/5 rounded" /></div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {loading && (
              <motion.div key="scan-loading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="mt-12">
                <ScanLoading />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {result && !loading && (
              <motion.div key="scan-result" exit={{ opacity: 0 }} className="mt-4 flex flex-col items-center">
                <div className="w-full">
                  <ScanResult result={result} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </main>
  )
}

function Sparkles(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}