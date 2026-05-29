/* eslint-disable */
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "id" | "en"

export const DICTIONARY = {
  id: {
    navFeatures: "Fitur", navTech: "Teknologi", navAbout: "Tentang Kami", navScanner: "Buka Scanner", navTechMobile: "Teknologi", navLearn: "Dokumen", navLearnMobile: "Belajar",
    heroBadge: "Intelijen Scam Real-Time", heroTitle: "Lihat manipulasi sebelum berubah menjadi kerugian.", heroDesc: "TrustLens membaca percakapan, tekanan emosional, penyamaran identitas, dan sinyal phishing dengan analisis yang tenang dan mudah dipercaya.", heroScanBtn: "Mulai Analisis", heroDemoBtn: "Lihat Runtime", heroTrust1: "Penalaran real-time", heroTrust2: "Analisis manipulasi",
    featBadge: "Kemampuan Inti", featTitle1: "Dibangun untuk membaca tekanan ", featTitle2: "di balik setiap pesan.", featDesc: "TrustLens memadukan OCR bersih, analisis perilaku, dan klasifikasi risiko untuk mengungkap pola scam modern tanpa membuatnya terasa rumit.",
    featCards: [
      { title: "Sinyal Emosional", desc: "Membaca urgensi buatan, rasa takut, rasa bersalah, dan eksploitasi kepercayaan yang sering tersembunyi di balik pesan biasa." },
      { title: "Klasifikasi Scam", desc: "Mengelompokkan pola risiko dari penipuan investasi, phishing, penyamaran identitas, hingga manipulasi relasi yang lebih halus." },
      { title: "Analisis Perilaku", desc: "Menjelaskan bagaimana pelaku membangun tekanan, mengalihkan konteks, dan mendorong keputusan impulsif." },
      { title: "OCR Bersih", desc: "Mengubah screenshot percakapan menjadi teks yang rapi, siap dianalisis, dan tetap mudah ditinjau manusia." }
    ],
    featLiveIntercept: "Analisis Langsung", featAnalyzing: "// MEMBACA SINYAL RISIKO", featLiveSteps: ["Tekanan emosional", "Urgensi buatan", "Isolasi korban", "Penyamaran identitas"],
    techBadge: "Arsitektur Analisis", techTitle1: "Pipeline yang membaca ", techTitle2: "konteks, bukan hanya teks.", techDesc: "TrustLens menyatukan OCR, pemahaman bahasa, deteksi tekanan emosional, dan skoring risiko dalam alur yang cepat, jelas, dan siap demo.", techArchitecture: "Pipeline Pemrosesan", techPipeline: ["Input", "OCR", "Normalisasi", "Analisis", "Skoring", "Laporan"],
    techLiveInit: "Membuka sesi analisis percakapan...", techLiveOcr: "Menangkap teks dari bukti visual... [OK]", techLiveSemantic: "Memetakan konteks, maksud, dan tekanan bahasa...", techLiveDetect1: "Sinyal ditemukan: urgensi buatan", techLiveDetect2: "Sinyal ditemukan: eksploitasi kepercayaan", techLiveDetect3: "Sinyal ditemukan: penyamaran identitas", techLiveDone: "Profil risiko siap ditinjau.",
    techCards: [
      { title: "Penalaran Gemini", desc: "Analisis multimodal untuk konteks, maksud, pola persuasi, dan perubahan narasi." },
      { title: "OCR Intelligence", desc: "Mengekstrak dan menyusun data percakapan dari screenshot, bahkan saat sumbernya kurang rapi." },
      { title: "Deteksi Perilaku", desc: "Mengidentifikasi pola tekanan, penyalahgunaan kepercayaan, dan titik ketika persuasi berubah menjadi paksaan." },
      { title: "Klasifikasi Risiko", desc: "Memberi label jenis scam yang paling mungkin dan menjelaskan bukti di baliknya." },
      { title: "Metrik Emosional", desc: "Mengukur rasa takut, urgensi, isolasi, dan penyalahgunaan kepercayaan dalam bahasa yang mudah dipahami." },
      { title: "Skoring Risiko", desc: "Mengalibrasi probabilitas dan keyakinan dari sinyal perilaku, teks, dan forensik." }
    ],
    techTrustTitle: "Cepat, privat, dan mudah diaudit.", techTrustDesc: "Analisis risiko real-time tanpa retensi permanen.", techTrustBtn: "Lihat Pipeline",
    aboutBadge: "Trust Intelligence", aboutTitle1: "TrustLens adalah ", aboutTitle2: "lapisan penilaian sebelum Anda merespons.", aboutDesc: "TrustLens membantu Anda berhenti sejenak, membaca konteks, dan memahami tekanan yang sedang dibangun dalam percakapan—sebelum uang, data, atau kepercayaan berpindah tangan.",
    aboutCards: [
      { title: "Klasifikasi Scam", desc: "Mengidentifikasi pola fraud umum dan baru di skenario investasi, phishing, darurat, dan penyamaran." },
      { title: "Analisis Emosional", desc: "Mengukur rasa takut, urgensi, isolasi, dan penyalahgunaan kepercayaan tanpa bahasa teknis berlebihan." },
      { title: "OCR Bersih", desc: "Mengekstrak teks percakapan dari screenshot dan mengubahnya menjadi bukti yang mudah ditinjau." },
      { title: "Panduan Tindakan", desc: "Mengubah sinyal risiko menjadi langkah jelas untuk verifikasi, pemblokiran, pelaporan, dan penyimpanan bukti." }
    ],
    aboutPrivacyTitle: "Privat sejak awal.", aboutPrivacyDesc: "Percakapan dianalisis saat dibutuhkan. TrustLens tidak menyimpan permanen, melatih model, atau membagikan screenshot dan teks pribadi Anda.", aboutSteps: ["Bukti", "Pembersihan", "Analisis", "Laporan"],
    badge: "TrustLens Scanner", hero: "Analisis percakapan mencurigakan sebelum Anda merespons.", subtitle: "Unggah screenshot dari WhatsApp, Telegram, Instagram, atau SMS. TrustLens membaca manipulasi, penyamaran, tekanan emosional, dan probabilitas scam dalam satu laporan.",
    dropTitle: "Lepaskan bukti di sini", dropSubtitle: "Kami akan menyiapkannya untuk ditinjau.", uploadLabel: "BUKTI PERCAKAPAN", uploadTitle: "Unggah screenshot percakapan.", uploadDesc: "TrustLens meninjau konteks, pola bahasa, penyamaran identitas, tekanan urgensi, dan sinyal phishing tanpa jargon yang mengganggu.", uploadBtn: "Pilih Screenshot", demoBtn: "Jalankan Demo", readyTitle: "Bukti siap dianalisis.", readyDesc: "TrustLens akan mengekstrak teks, merapikan sinyal, dan menyusun profil risiko dari percakapan ini.", analyzeBtn: "Mulai Analisis",
    fakeChatMsg1: "Bro, gw lagi di rumah sakit. Bisa transfer sekarang?", fakeChatMsg2: "Tolong jangan kasih tau siapa-siapa dulu ya. Ini darurat banget.", aiDetection: "PENILAIAN RISIKO", live: "Live", scamProb: "Probabilitas Scam", ocrWarning: "Teks pada gambar kurang jelas. Gunakan screenshot yang lebih tajam untuk hasil terbaik.",
    loadingEngine: "TrustLens Runtime", loadingTitle: "Membaca perilaku percakapan.", loadingInit: "[runtime] Membuka sesi analisis aman...", loadingProcessing: "menganalisis", loadingOk: "[ selesai ]", loadingDetected: "[ sinyal ]",
    steps: ["Menyiapkan bukti percakapan...", "Membaca konteks dan intent...", "Menandai urgensi buatan...", "Memetakan tekanan emosional...", "Mengalibrasi skor risiko...", "Menyusun rekomendasi aman..."],
    riskLow: "Risiko Rendah", riskModerate: "Risiko Sedang", riskHigh: "Risiko Tinggi", riskCritical: "Risiko Kritis",
    threatComplete: "Analisis Risiko Selesai", categoryDetected: "Kategori Risiko", aiConfidence: "Keyakinan Model", conversationPreview: "BUKTI PERCAKAPAN", manipulation: "POLA MANIPULASI", emotional: "TEKANAN EMOSIONAL", urgency: "URGENSI BUATAN", impersonation: "PENYAMARAN IDENTITAS", phishing: "SINYAL PHISHING", psychologyAnalysis: "ANALISIS PERILAKU", psychologySubtitle: "Apa yang coba dibangun percakapan ini.", actions: "LANGKAH AMAN", actionsTitle: "Berhenti sejenak sebelum merespons.", verifyBtn: "Verifikasi", blockBtn: "Blokir", demoText: "Bro ini nomor baru gw.\nGw lagi di rumah sakit sekarang.\nBisa transfer 2 juta dulu?\nJangan bilang siapa-siapa ya.", removeImage: "Hapus Gambar", replaceImage: "Ganti Gambar",
    psychProfile: "Profil Psikologis", emoManipulation: "Manipulasi Emosional", fearPressure: "Tekanan Ketakutan", urgencyManipulation: "Manipulasi Urgensi", trustExploitation: "Eksploitasi Kepercayaan", isolationTactics: "Taktik Isolasi",
    // --- NEW: HISTORY SYSTEM ---
    historyBtn: "Riwayat",
    historyTitle: "Riwayat Analisis",
    historyClear: "Bersihkan Riwayat",
    historyEmpty: "Belum ada laporan.",
    historyEmptyDesc: "Hasil analisis tersimpan lokal di perangkat ini.",
    historyAnalysis: "Analisis",
    analyzerModeScreenshot: "Screenshot",
    analyzerModeText: "Teks",
    textModeTitle: "Tempel percakapan untuk dianalisis.",
    textModeDesc: "Masukkan teks langsung saat tidak ada screenshot.",
    textModePlaceholder: "Tempel pesan, tautan, atau percakapan mencurigakan...",
    textAnalyzeBtn: "Analisis Teks",
    textValidation: "Masukkan percakapan terlebih dahulu.",
    textModeBadge: "ANALISIS TEKS",
  },
  en: {
    navFeatures: "Features", navTech: "Technology", navAbout: "About", navScanner: "Open Scanner", navTechMobile: "Tech", navLearn: "Docs", navLearnMobile: "Learn",
    heroBadge: "Real-time Scam Intelligence", heroTitle: "See the manipulation before it costs you.", heroDesc: "TrustLens reviews conversations for emotional pressure, impersonation, phishing signals, and behavioral red flags—clear enough to act on, calm enough to trust.", heroScanBtn: "Start Analysis", heroDemoBtn: "View Runtime", heroTrust1: "Real-time reasoning", heroTrust2: "Manipulation analysis",
    featBadge: "Core Capabilities", featTitle1: "Built to read the pressure ", featTitle2: "behind every message.", featDesc: "TrustLens combines clean OCR, behavioral analysis, and risk classification to surface modern scam patterns without making the experience feel technical.",
    featCards: [
      { title: "Emotional Signals", desc: "Surfaces manufactured urgency, fear, guilt, and trust exploitation that often hide inside ordinary messages." },
      { title: "Scam Classification", desc: "Maps risk patterns across investment fraud, phishing, impersonation, emergency scams, and relationship-based manipulation." },
      { title: "Behavioral Analysis", desc: "Explains how pressure builds, context shifts, and social engineering nudges the recipient toward a risky decision." },
      { title: "Clean OCR", desc: "Turns messy conversation screenshots into structured text that remains readable, reviewable, and ready for analysis." }
    ],
    featLiveIntercept: "Live Analysis", featAnalyzing: "// READING RISK SIGNALS", featLiveSteps: ["Emotional pressure", "Manufactured urgency", "Victim isolation", "Identity mismatch"],
    techBadge: "Analysis Architecture", techTitle1: "A pipeline that reads ", techTitle2: "context, not just text.", techDesc: "TrustLens brings OCR, language understanding, emotional-pressure detection, and risk scoring into one fast, legible workflow built for investigation.", techArchitecture: "Processing Pipeline", techPipeline: ["Input", "OCR", "Normalize", "Analyze", "Score", "Report"],
    techLiveInit: "Opening secure analysis session...", techLiveOcr: "Capturing text from visual evidence... [OK]", techLiveSemantic: "Mapping context, intent, and pressure cues...", techLiveDetect1: "Signal found: manufactured urgency", techLiveDetect2: "Signal found: trust exploitation", techLiveDetect3: "Signal found: identity mismatch", techLiveDone: "Risk profile ready for review.",
    techCards: [
      { title: "Gemini Reasoning", desc: "Multimodal analysis for context, intent, persuasion patterns, and narrative shifts." },
      { title: "OCR Intelligence", desc: "Extracts and structures raw conversation data from screenshots, even when the source is noisy." },
      { title: "Behavioral Detection", desc: "Identifies pressure patterns, trust abuse, and the moments where persuasion becomes coercive." },
      { title: "Risk Classification", desc: "Labels likely scam types and explains the evidence behind each classification." },
      { title: "Emotional Metrics", desc: "Measures fear, urgency, isolation, and trust abuse in language users can understand." },
      { title: "Risk Scoring", desc: "Calibrates probability and confidence from behavioral, textual, and forensic signals." }
    ],
    techTrustTitle: "Fast, private, and built for review.", techTrustDesc: "Real-time risk analysis with no permanent data retention.", techTrustBtn: "View Pipeline",
    aboutBadge: "Trust Intelligence", aboutTitle1: "TrustLens is a ", aboutTitle2: "decision layer before you respond.", aboutDesc: "TrustLens helps you pause, read the context, and understand the pressure being applied in a conversation—before money, data, or trust changes hands.",
    aboutCards: [
      { title: "Scam Classification", desc: "Identifies common and emerging fraud patterns across investment, phishing, emergency, and impersonation scenarios." },
      { title: "Emotional Analysis", desc: "Measures fear, urgency, isolation, and trust abuse without burying the user in technical language." },
      { title: "Clean OCR", desc: "Extracts conversation text from screenshots and turns it into readable evidence for review." },
      { title: "Actionable Guidance", desc: "Turns detected signals into plain-language next steps for verification, blocking, reporting, and evidence preservation." }
    ],
    aboutPrivacyTitle: "Private by design.", aboutPrivacyDesc: "Conversations are analyzed only when needed. TrustLens does not permanently store, train on, or share your private screenshots or text.", aboutSteps: ["Evidence", "Cleanup", "Analysis", "Report"],
    badge: "TrustLens Scanner", hero: "Analyze suspicious conversations before you respond.", subtitle: "Upload a screenshot from WhatsApp, Telegram, Instagram, or SMS. TrustLens reads manipulation, impersonation, emotional pressure, and scam probability in one clear report.",
    dropTitle: "Drop evidence here", dropSubtitle: "We’ll prepare it for review.", uploadLabel: "CONVERSATION EVIDENCE", uploadTitle: "Upload a conversation screenshot.", uploadDesc: "TrustLens reviews context, language patterns, impersonation cues, urgency pressure, and phishing signals—without the noise.", uploadBtn: "Select Screenshot", demoBtn: "Run Demo", readyTitle: "Evidence ready for analysis.", readyDesc: "TrustLens will extract the text, normalize the signal, and build a risk profile from this conversation.", analyzeBtn: "Start Analysis",
    fakeChatMsg1: "Bro, I'm in the hospital right now. Can you transfer money?", fakeChatMsg2: "Please don't tell anyone yet. It's really urgent.", aiDetection: "RISK ASSESSMENT", live: "Live", scamProb: "Scam Probability", ocrWarning: "Image text is hard to read. Use a sharper screenshot for the best result.",
    loadingEngine: "TrustLens Runtime", loadingTitle: "Reading conversation behavior.", loadingInit: "[runtime] Opening secure analysis session...", loadingProcessing: "analyzing", loadingOk: "[ complete ]", loadingDetected: "[ signal ]",
    steps: ["Preparing conversation evidence...", "Reading context and intent...", "Flagging manufactured urgency...", "Mapping emotional pressure...", "Calibrating risk score...", "Drafting safety guidance..."],
    riskLow: "Low Risk", riskModerate: "Moderate Risk", riskHigh: "High Risk", riskCritical: "Critical Risk",
    threatComplete: "Risk Analysis Complete", categoryDetected: "Risk Category", aiConfidence: "Model Confidence", conversationPreview: "CONVERSATION EVIDENCE", manipulation: "MANIPULATION PATTERNS", emotional: "EMOTIONAL PRESSURE", urgency: "MANUFACTURED URGENCY", impersonation: "IDENTITY MISMATCH", phishing: "PHISHING SIGNALS", psychologyAnalysis: "BEHAVIORAL ANALYSIS", psychologySubtitle: "What this conversation is trying to make you do.", actions: "SAFE NEXT STEPS", actionsTitle: "Pause before you respond.", verifyBtn: "Verify", blockBtn: "Block", demoText: "Bro this is my new number.\nI'm in the hospital right now.\nCan you transfer $200?\nPlease don't tell anyone.", removeImage: "Remove Image", replaceImage: "Replace Image",
    psychProfile: "Psychological Profile", emoManipulation: "Emotional Manipulation", fearPressure: "Fear Pressure", urgencyManipulation: "Urgency Manipulation", trustExploitation: "Trust Exploitation", isolationTactics: "Isolation Tactics",
    // --- NEW: HISTORY SYSTEM ---
    historyBtn: "History",
    historyTitle: "Analysis History",
    historyClear: "Clear History",
    historyEmpty: "No reports yet.",
    historyEmptyDesc: "Analysis results are saved locally on this device.",
    historyAnalysis: "Analysis",
    analyzerModeScreenshot: "Screenshot",
    analyzerModeText: "Text",
    textModeTitle: "Paste a conversation for analysis.",
    textModeDesc: "Use direct text when you do not have a screenshot.",
    textModePlaceholder: "Paste suspicious messages, links, or conversation text...",
    textAnalyzeBtn: "Analyze Text",
    textValidation: "Add conversation text before analyzing.",
    textModeBadge: "TEXT ANALYSIS",
  }
}

type LanguageContextType = { language: Language; setLanguage: (lang: Language) => void; t: typeof DICTIONARY["en"] }
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id")
  useEffect(() => {
    const saved = localStorage.getItem("trustlens-lang") as Language
    if (saved === "id" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved)
    }
  }, [])
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("trustlens-lang", lang)
  }
  const t = DICTIONARY[language]
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) throw new Error("useLanguage must be used within a LanguageProvider")
  return context
}