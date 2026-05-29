/* eslint-disable */
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "id" | "en"

export const DICTIONARY = {
  id: {
    navFeatures: "Fitur", navTech: "Teknologi", navAbout: "Tentang Kami", navScanner: "Buka Scanner", navTechMobile: "Teknologi", navLearn: "Dokumen", navLearnMobile: "Belajar",
    heroBadge: "Deteksi Penipuan Bertenaga AI", heroTitle: "AI yang memahami manipulasi sebelum manusia menyadarinya.", heroDesc: "TrustLens menganalisis percakapan dan mengidentifikasi pola penipuan psikologis menggunakan AI yang cerdas secara emosional.", heroScanBtn: "Pindai Percakapan", heroDemoBtn: "Lihat Demo", heroTrust1: "Penalaran AI real-time", heroTrust2: "Analisis penipuan psikologis",
    featBadge: "Kemampuan AI", featTitle1: "Dirancang untuk memahami manipulasi ", featTitle2: "di balik kata-kata.", featDesc: "TrustLens menggabungkan kecerdasan OCR, analisis perilaku emosional, dan klasifikasi ancaman real-time untuk melindungi Anda dari pola psikologis penipuan modern.",
    featCards: [
      { title: "Kecerdasan Emosional", desc: "Mengidentifikasi tekanan psikologis yang tak terlihat. TrustLens memetakan urgensi buatan, induksi rasa takut, dan eksploitasi kepercayaan secara real-time." },
      { title: "Klasifikasi Ancaman", desc: "Mengkategorikan topologi penipuan secara dinamis—mulai dari penipuan investasi kripto hingga asmara tingkat lanjut." },
      { title: "Analisis Psikologis", desc: "Membongkar taktik manipulasi lapis demi lapis, memberikan penjelasan empatik tentang bagaimana rekayasa sosial digunakan." },
      { title: "Mesin OCR Bersih", desc: "Mengekstrak teks berantakan dari screenshot dan memurnikannya menjadi data terstruktur untuk evaluasi AI yang sempurna." }
    ],
    featLiveIntercept: "Intersepsi Langsung", featAnalyzing: "// MENGANALISIS VEKTOR ANCAMAN", featLiveSteps: ["Tekanan emosional", "Urgensi buatan", "Perilaku isolasi", "Penyamaran terdeteksi"],
    techBadge: "Infrastruktur AI", techTitle1: "Ditenagai oleh sistem ", techTitle2: "perilaku cerdas.", techDesc: "TrustLens menggabungkan kecerdasan OCR, deteksi manipulasi emosional, dan alur klasifikasi ancaman tingkat lanjut untuk menganalisis percakapan persis seperti pakar keamanan siber.", techArchitecture: "Arsitektur Pemrosesan", techPipeline: ["Unggah", "Mesin OCR", "Pembersihan", "AI Perilaku", "Klasifikasi", "Laporan"],
    techLiveInit: "Memulai pemindai ancaman neural...", techLiveOcr: "Mengekstrak data teks OCR... [SUKSES]", techLiveSemantic: "Menganalisis pola manipulasi semantik...", techLiveDetect1: "Terdeteksi: Taktik urgensi buatan", techLiveDetect2: "Terdeteksi: Eksploitasi kepercayaan", techLiveDetect3: "Terdeteksi: Upaya penyamaran", techLiveDone: "Menyusun profil ancaman psikologis... SELESAI",
    techCards: [
      { title: "Gemini AI", desc: "Mesin penalaran multimodal tingkat lanjut yang menggerakkan analisis kognitif kompleks." },
      { title: "Kecerdasan OCR", desc: "Mengekstrak, membersihkan, dan menyusun data percakapan mentah dari screenshot yang berantakan." },
      { title: "Deteksi Perilaku", desc: "Menganalisis pola psikologi manipulasi, mengidentifikasi eksploitasi manusia yang tersembunyi." },
      { title: "Klasifikasi Ancaman", desc: "Mengidentifikasi topologi penipuan secara akurat, mulai dari penyamaran hingga phishing." },
      { title: "Kecerdasan Emosional", desc: "Mengukur metrik tak kasat mata seperti urgensi buatan, rasa takut, dan penyalahgunaan kepercayaan." },
      { title: "Mesin Penilaian Risiko", desc: "Menghasilkan analisis probabilitas penipuan cerdas menggunakan model heuristik berlapis." }
    ],
    techTrustTitle: "Dibangun untuk analisis yang cepat, cerdas, dan menjaga privasi.", techTrustDesc: "Deteksi ancaman real-time dengan nol retensi data permanen.", techTrustBtn: "Lihat Arsitektur",
    aboutBadge: "Intelijen Kepercayaan AI", aboutTitle1: "TrustLens lebih dari sekadar ", aboutTitle2: "pemindai biasa.", aboutDesc: "Kami membangun mesin pertahanan psikologis. TrustLens tidak hanya membaca kata-kata—ia menganalisis pola manipulasi yang tak terlihat, mendeteksi urgensi buatan, eksploitasi emosional, dan penyamaran sebelum Anda membuat kesalahan fatal.",
    aboutCards: [
      { title: "Klasifikasi Penipuan", desc: "Secara instan mengidentifikasi pola penipuan yang diketahui, dari investasi hingga phishing canggih." },
      { title: "Analisis Emosional", desc: "Mengukur tekanan psikologis tak terlihat seperti rasa takut, urgensi, dan eksploitasi kepercayaan." },
      { title: "Mesin OCR Bersih", desc: "Mengekstrak dan mensterilkan teks yang sulit dibaca dari screenshot dengan presisi tinggi." },
      { title: "Intelijen Ancaman", desc: "Memberikan rincian komprehensif tentang taktik dan langkah praktis untuk melindungi diri Anda." }
    ],
    aboutPrivacyTitle: "Privasi Absolut. Nol Retensi.", aboutPrivacyDesc: "Percakapan Anda dianalisis secara real-time. Kami tidak pernah menyimpan permanen, melatih AI kami, atau membagikan screenshot dan teks pribadi Anda.", aboutSteps: ["Screenshot", "Pembersihan", "Otak AI", "Laporan"],
    badge: "Scanner TrustLens", hero: "Analisis percakapan mencurigakan dengan AI yang memahami emosi.", subtitle: "Unggah screenshot dari WhatsApp, Telegram, Instagram, atau SMS. TrustLens akan mendeteksi pola manipulasi, tekanan emosional, dan probabilitas penipuan.",
    dropTitle: "Lepaskan screenshot di sini", dropSubtitle: "TrustLens akan menampilkannya untuk di-review.", uploadLabel: "UNGGAH SCREENSHOT", uploadTitle: "Tarik dan lepas screenshot percakapan Anda.", uploadDesc: "TrustLens melakukan analisis AI kontekstual untuk mengidentifikasi manipulasi emosional, taktik penyamaran, tekanan urgensi, dan indikator phishing.", uploadBtn: "Pilih Screenshot", demoBtn: "Coba Demo Scam", readyTitle: "Gambar siap dianalisis.", readyDesc: "TrustLens akan mengekstrak teks, mensterilkan data, dan mendeteksi pola rekayasa sosial dari percakapan ini. Klik tombol di bawah untuk memulai.", analyzeBtn: "Mulai Analisis AI",
    fakeChatMsg1: "Bro, gw lagi di rumah sakit. Bisa transfer sekarang?", fakeChatMsg2: "Tolong jangan kasih tau siapa-siapa dulu ya. Ini darurat banget.", aiDetection: "DETEKSI AI", live: "Live", scamProb: "Probabilitas Penipuan", ocrWarning: "Kualitas gambar terlihat rendah. Coba gunakan screenshot yang lebih jelas.",
    loadingEngine: "Mesin AI TrustLens", loadingTitle: "Menganalisis perilaku percakapan.", loadingInit: "[SYS] Memulai jalur kecerdasan emosional...", loadingProcessing: "memproses", loadingOk: "[ OK ]", loadingDetected: "[ TERDETEKSI ]",
    steps: ["Memulai analisis AI...", "Mengekstrak sinyal emosional...", "Mendeteksi pola urgensi...", "Menganalisis psikologi manipulasi...", "Menghitung probabilitas ancaman...", "Menyusun panduan keamanan..."],
    riskLow: "Risiko Rendah", riskModerate: "Risiko Sedang", riskHigh: "Risiko Tinggi", riskCritical: "Ancaman Kritis",
    threatComplete: "Analisis Ancaman Selesai", categoryDetected: "Kategori Terdeteksi", aiConfidence: "Tingkat Kepercayaan AI", conversationPreview: "PRATINJAU PERCAKAPAN", manipulation: "MANIPULASI TERDETEKSI", emotional: "ANALISIS EMOSIONAL", urgency: "TAKTIK URGENSI", impersonation: "ANALISIS PENYAMARAN", phishing: "INDIKATOR PHISHING", psychologyAnalysis: "ANALISIS PSIKOLOGIS", psychologySubtitle: "Memahami manipulasi di balik percakapan ini.", actions: "REKOMENDASI TINDAKAN", actionsTitle: "Lindungi diri sebelum membalas.", verifyBtn: "Verifikasi Kontak", blockBtn: "Blokir Nomor", demoText: "Bro ini nomor baru gw.\nGw lagi di rumah sakit sekarang.\nBisa transfer 2 juta dulu?\nJangan bilang siapa-siapa ya.", removeImage: "Hapus Gambar", replaceImage: "Ganti Gambar",
    psychProfile: "Profil Psikologis", emoManipulation: "Manipulasi Emosional", fearPressure: "Tekanan Ketakutan", urgencyManipulation: "Manipulasi Urgensi", trustExploitation: "Eksploitasi Kepercayaan", isolationTactics: "Taktik Isolasi",
    // --- NEW: HISTORY SYSTEM ---
    historyBtn: "Riwayat",
    historyTitle: "Riwayat Analisis",
    historyClear: "Hapus Semua",
    historyEmpty: "Belum ada analisis.",
    historyEmptyDesc: "Hasil deteksi AI Anda akan tersimpan dengan aman secara lokal di perangkat ini.",
    historyAnalysis: "Analisis",
    analyzerModeScreenshot: "Mode Screenshot",
    analyzerModeText: "Mode Teks",
    textModeTitle: "Tempel percakapan mencurigakan.",
    textModeDesc: "Masukkan chat langsung untuk dianalisis AI tanpa OCR.",
    textModePlaceholder: "Tempel percakapan mencurigakan di sini untuk analisis perilaku AI...",
    textAnalyzeBtn: "Analisis Percakapan",
    textValidation: "Percakapan tidak boleh kosong.",
    textModeBadge: "ANALISIS TEKS LANGSUNG",
  },
  en: {
    navFeatures: "Features", navTech: "Technology", navAbout: "About", navScanner: "Open Scanner", navTechMobile: "Tech", navLearn: "Documents", navLearnMobile: "Learn",
    heroBadge: "AI-Powered Scam Detection", heroTitle: "AI that understands manipulation before humans do.", heroDesc: "TrustLens analyzes conversations and identifies psychological scam patterns using emotionally intelligent AI.", heroScanBtn: "Scan Conversation", heroDemoBtn: "Watch Demo", heroTrust1: "Real-time AI reasoning", heroTrust2: "Psychological scam analysis",
    featBadge: "AI Capabilities", featTitle1: "Designed to understand manipulation ", featTitle2: "beyond words.", featDesc: "TrustLens combines OCR intelligence, emotional behavioral analysis, and real-time threat classification to protect you from the psychological patterns of modern scams.",
    featCards: [
      { title: "Emotional Intelligence", desc: "Identifies invisible psychological pressures. TrustLens maps out manufactured urgency, fear induction, and trust exploitation in real-time." },
      { title: "Threat Classification", desc: "Dynamically categorizes exact scam topologies—from crypto investment fraud to sophisticated romance scams." },
      { title: "Psychological Analysis", desc: "Unpacks manipulation tactics layer by layer, providing an empathetic explanation of how social engineering is being weaponized." },
      { title: "Clean OCR Engine", desc: "Extracts messy, noisy text from screenshots and purifies it into structured data for flawless AI evaluation." }
    ],
    featLiveIntercept: "Live Intercept", featAnalyzing: "// ANALYZING THREAT VECTORS", featLiveSteps: ["Emotional pressure", "Artificial urgency", "Isolation behavior", "Impersonation detected"],
    techBadge: "AI Infrastructure", techTitle1: "Powered by intelligent ", techTitle2: "behavioral systems.", techDesc: "TrustLens combines OCR intelligence, emotional manipulation detection, and advanced threat classification pipelines to analyze conversations exactly like a cybersecurity expert would.", techArchitecture: "Processing Architecture", techPipeline: ["Upload", "OCR Engine", "Cleanup", "Behavior AI", "Classify", "Report"],
    techLiveInit: "Initializing neural threat scanner...", techLiveOcr: "Extracting OCR text data... [SUCCESS]", techLiveSemantic: "Analyzing semantic manipulation patterns...", techLiveDetect1: "Detected: Artificial urgency tactics", techLiveDetect2: "Detected: Trust exploitation", techLiveDetect3: "Detected: Impersonation attempt", techLiveDone: "Compiling psychological threat profile... DONE",
    techCards: [
      { title: "Gemini AI", desc: "Advanced multimodal reasoning engine powering complex cognitive analysis." },
      { title: "OCR Intelligence", desc: "Extracts, cleans, and structures raw conversation data from chaotic screenshots." },
      { title: "Behavioral Detection", desc: "Analyzes manipulation psychology patterns, identifying hidden human exploitation." },
      { title: "Threat Classification", desc: "Identifies exact scam topologies, from impersonation to sophisticated phishing." },
      { title: "Emotional Intelligence", desc: "Measures invisible metrics like artificial urgency, fear induction, and trust abuse." },
      { title: "Risk Scoring Engine", desc: "Generates intelligent scam probability analysis using multi-layered heuristic models." }
    ],
    techTrustTitle: "Built for fast, intelligent, privacy-conscious analysis.", techTrustDesc: "Real-time threat detection with zero permanent data retention.", techTrustBtn: "View Architecture",
    aboutBadge: "AI Trust Intelligence", aboutTitle1: "TrustLens is more than a ", aboutTitle2: "scanner.", aboutDesc: "We built a psychological defense engine. TrustLens doesn't just read words—it analyzes the invisible patterns of manipulation, detecting manufactured urgency, emotional exploitation, and impersonation before you make a costly mistake.",
    aboutCards: [
      { title: "Scam Classification", desc: "Instantly identifies known fraud patterns, from investment scams to sophisticated phishing attempts." },
      { title: "Emotional Analysis", desc: "Measures invisible psychological pressure like fear, manufactured urgency, and trust exploitation." },
      { title: "Clean OCR Engine", desc: "Extracts and sanitizes messy, unreadable text from screenshots with high precision." },
      { title: "Threat Intelligence", desc: "Delivers a comprehensive breakdown of tactics and actionable steps to protect yourself." }
    ],
    aboutPrivacyTitle: "Absolute Privacy. Zero Retention.", aboutPrivacyDesc: "Your conversations are analyzed in real-time. We never permanently store, train on, or share your private screenshots or text.", aboutSteps: ["Screenshot", "OCR Clean", "AI Brain", "Report"],
    badge: "TrustLens Scanner", hero: "Analyze suspicious conversations with emotionally intelligent AI.", subtitle: "Upload a screenshot from WhatsApp, Telegram, Instagram, or SMS. TrustLens will detect manipulation patterns, emotional pressure, and scam probability.",
    dropTitle: "Drop your screenshot here", dropSubtitle: "TrustLens will load it for your review.", uploadLabel: "UPLOAD SCREENSHOT", uploadTitle: "Drag and drop your conversation screenshot.", uploadDesc: "TrustLens performs contextual AI analysis to identify emotional manipulation, impersonation tactics, urgency pressure, and phishing indicators.", uploadBtn: "Select Screenshot", demoBtn: "Try Demo Scam", readyTitle: "Image ready for analysis.", readyDesc: "TrustLens will extract text, sanitize the data, and detect social engineering patterns from this screenshot. Click below to begin.", analyzeBtn: "Analyze Conversation",
    fakeChatMsg1: "Bro, I'm in the hospital right now. Can you transfer money?", fakeChatMsg2: "Please don't tell anyone yet. It's really urgent.", aiDetection: "AI DETECTION", live: "Live", scamProb: "Scam Probability", ocrWarning: "OCR quality appears low. Try using a clearer screenshot.",
    loadingEngine: "TrustLens AI Engine", loadingTitle: "Analyzing conversation behavior.", loadingInit: "[SYS] Initialize emotional intelligence pipeline...", loadingProcessing: "processing", loadingOk: "[ OK ]", loadingDetected: "[ DETECTED ]",
    steps: ["Initializing AI analysis...", "Extracting emotional signals...", "Detecting urgency patterns...", "Analyzing manipulation psychology...", "Calculating threat probability...", "Generating safety guidance..."],
    riskLow: "Low Risk", riskModerate: "Moderate Risk", riskHigh: "High Risk", riskCritical: "Critical Threat",
    threatComplete: "Threat Analysis Complete", categoryDetected: "Category Detected", aiConfidence: "AI Confidence", conversationPreview: "CONVERSATION PREVIEW", manipulation: "DETECTED MANIPULATION", emotional: "EMOTIONAL ANALYSIS", urgency: "URGENCY TACTICS", impersonation: "IMPERSONATION ANALYSIS", phishing: "PHISHING INDICATORS", psychologyAnalysis: "PSYCHOLOGICAL ANALYSIS", psychologySubtitle: "Understanding the manipulation behind the conversation.", actions: "RECOMMENDED ACTIONS", actionsTitle: "Protect yourself before responding.", verifyBtn: "Verify Contact", blockBtn: "Block Number", demoText: "Bro this is my new number.\nI'm in the hospital right now.\nCan you transfer $200?\nPlease don't tell anyone.", removeImage: "Remove Image", replaceImage: "Replace Image",
    psychProfile: "Psychological Profile", emoManipulation: "Emotional Manipulation", fearPressure: "Fear Pressure", urgencyManipulation: "Urgency Manipulation", trustExploitation: "Trust Exploitation", isolationTactics: "Isolation Tactics",
    // --- NEW: HISTORY SYSTEM ---
    historyBtn: "History",
    historyTitle: "Scan History",
    historyClear: "Clear All",
    historyEmpty: "No analysis history.",
    historyEmptyDesc: "Your AI detection results will be securely saved locally on this device.",
    historyAnalysis: "Analysis",
    analyzerModeScreenshot: "Screenshot Mode",
    analyzerModeText: "Text Mode",
    textModeTitle: "Paste suspicious conversation.",
    textModeDesc: "Enter chat text directly for AI analysis without OCR.",
    textModePlaceholder: "Paste chat messages for AI behavioral analysis...",
    textAnalyzeBtn: "Analyze Conversation",
    textValidation: "Conversation text cannot be empty.",
    textModeBadge: "DIRECT TEXT ANALYSIS",
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