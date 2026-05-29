"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BadgeHelp, BookOpen, Brain, ChevronRight, CircleDot, HeartPulse, Lock, Radar, Search, ShieldAlert, Siren, Sparkles, UserX, type LucideIcon } from "lucide-react"

import BackgroundGlow from "@/components/BackgroundGlow"
import Navbar from "@/components/Navbar"
import Spotlight from "@/components/Spotlight"
import { useLanguage } from "@/context/LanguageContext"

type ScamCard = { title: string; description: string; tactics: string; warningSigns: string; manipulation: string }
type EducationCopy = {
  eyebrow: string; title: string; subtitle: string; ctaPrimary: string; ctaSecondary: string
  stats: { value: string; label: string }[]; navLabel: string
  howTitle: string; howDescription: string; howSteps: { title: string; description: string }[]
  scamTitle: string; scamDescription: string; scamCards: ScamCard[]
  psychTitle: string; psychDescription: string; psychCards: { title: string; description: string; icon: LucideIcon }[]
  aiTitle: string; aiDescription: string; aiCards: { title: string; description: string }[]
  safetyTitle: string; safetyDescription: string; safetyItems: string[]
  faqTitle: string; faqDescription: string; faqItems: { question: string; answer: string }[]
}

const pageCopy: Record<"id" | "en", EducationCopy> = {
  id: {
    eyebrow: "TRUSTLENS / LEARN",
    title: "Playbook Intelijen Scam",
    subtitle: "Panduan ringkas untuk memakai TrustLens, membaca psikologi scam, dan mengambil keputusan lebih aman sebelum merespons.",
    ctaPrimary: "Mulai Analisis", ctaSecondary: "Pelajari Sistem",
    stats: [{ value: "06", label: "Tipe scam utama" }, { value: "AI", label: "Analisis perilaku" }, { value: "ID/EN", label: "Dukungan bahasa" }],
    navLabel: "Navigasi Panduan",
    howTitle: "Cara Menggunakan TrustLens",
    howDescription: "Alur penggunaan dibuat sederhana: masukkan bukti percakapan, biarkan AI membaca sinyal risiko, lalu gunakan rekomendasi untuk bertindak aman.",
    howSteps: [
      { title: "Unggah screenshot atau tempel percakapan", description: "Gunakan screenshot chat dari aplikasi pesan atau masukkan teks percakapan secara langsung." },
      { title: "Biarkan TrustLens menganalisis percakapan", description: "TrustLens mengekstrak konteks dan membaca pola bahasa yang sering muncul dalam rekayasa sosial." },
      { title: "Tinjau indikator ancaman", description: "Lihat kategori scam, probabilitas risiko, dan alasan utama mengapa percakapan terlihat berbahaya." },
      { title: "Analisis manipulasi emosional", description: "Pahami tekanan rasa takut, urgensi, isolasi, dan eksploitasi kepercayaan yang digunakan pelaku." },
      { title: "Ikuti rekomendasi keselamatan", description: "Verifikasi identitas, hentikan transfer impulsif, dan simpan bukti sebelum melanjutkan respons." },
    ],
    scamTitle: "Peta Tipe Penipuan Modern", scamDescription: "Kenali pola paling umum yang muncul dalam percakapan scam sehari-hari.",
    scamCards: [
      { title: "Romance Scam", description: "Pelaku membangun kedekatan emosional sebelum meminta uang, hadiah, atau bantuan darurat.", tactics: "Love bombing, janji masa depan, cerita sakit atau perjalanan tertahan.", warningSigns: "Hubungan bergerak terlalu cepat, menghindari video call, meminta transfer bertahap.", manipulation: "Keterikatan, rasa kasihan, dan rasa bersalah." },
      { title: "Marketplace Scam", description: "Penipuan jual-beli dengan bukti transfer palsu, link escrow palsu, atau tekanan transaksi cepat.", tactics: "Diskon ekstrem, chat dipindahkan ke luar platform, klaim pembayaran tertahan.", warningSigns: "Akun baru, bukti pembayaran janggal, meminta OTP atau biaya tambahan.", manipulation: "FOMO, kelangkaan palsu, dan tekanan waktu." },
      { title: "Investment Scam", description: "Skema investasi palsu yang menjanjikan cuan besar dengan risiko kecil atau tanpa risiko.", tactics: "Testimoni palsu, dashboard profit rekayasa, ajakan top-up untuk mencairkan dana.", warningSigns: "Return tidak realistis, tidak ada izin jelas, menolak audit atau penarikan dana.", manipulation: "Keserakahan, FOMO, dan validasi sosial palsu." },
      { title: "Phishing", description: "Korban diarahkan ke situs atau formulir palsu untuk mencuri password, OTP, atau data kartu.", tactics: "Domain mirip, pesan akun terblokir, link verifikasi mendesak.", warningSigns: "URL aneh, grammar buruk, meminta kredensial sensitif.", manipulation: "Ketakutan kehilangan akses dan rasa wajib patuh." },
      { title: "Fake Emergency Scam", description: "Pelaku menyamar sedang berada dalam kondisi krisis agar korban mengirim uang tanpa berpikir panjang.", tactics: "Cerita rumah sakit, kecelakaan, nomor baru keluarga, larangan memberi tahu orang lain.", warningSigns: "Permintaan rahasia, transfer sangat cepat, menolak panggilan atau verifikasi ulang.", manipulation: "Panik, rasa bersalah, dan isolasi korban." },
      { title: "Impersonation Scam", description: "Pelaku meniru teman, keluarga, brand, kurir, bank, atau instansi resmi untuk mendapatkan kepercayaan.", tactics: "Menggunakan logo, nama jabatan, nomor baru, atau gaya otoritatif.", warningSigns: "Nada tidak konsisten, identitas sulit diverifikasi, meminta uang atau data sensitif.", manipulation: "Otoritas palsu dan eksploitasi hubungan tepercaya." },
    ],
    psychTitle: "Panduan Manipulasi Psikologis",
    psychDescription: "Banyak scam berhasil bukan karena teknologinya canggih, tetapi karena pelaku memahami cara menekan emosi manusia.",
    psychCards: [
      { title: "Urgency Manipulation", description: "Pelaku menciptakan batas waktu palsu agar korban tidak sempat membandingkan fakta atau bertanya kepada orang lain.", icon: Siren },
      { title: "Emotional Coercion", description: "Rasa cinta, empati, malu, atau bersalah dipakai untuk membuat korban merasa wajib membantu.", icon: HeartPulse },
      { title: "Fear Pressure", description: "Ancaman akun diblokir, dana hilang, atau keluarga terluka digunakan untuk mendorong kepatuhan cepat.", icon: ShieldAlert },
      { title: "Isolation Tactics", description: "Korban diminta merahasiakan situasi agar tidak mendapat perspektif eksternal yang bisa menghentikan scam.", icon: UserX },
      { title: "Trust Exploitation", description: "Identitas orang dekat atau institusi resmi ditiru untuk menurunkan kewaspadaan dan mempercepat keputusan.", icon: Lock },
    ],
    aiTitle: "Cara TrustLens Bekerja",
    aiDescription: "Penjelasan ini bersifat tingkat tinggi dan ramah pengguna. TrustLens tidak mengekspos rahasia backend, prompt internal, atau kunci API.",
    aiCards: [
      { title: "OCR Extraction", description: "Screenshot percakapan diubah menjadi teks yang dapat dianalisis tanpa mengubah alur OCR yang sudah berjalan." },
      { title: "Analisis Risiko", description: "Model membaca konteks, nada, pola permintaan, dan indikator social engineering untuk menyusun ringkasan risiko." },
      { title: "Emotional Meter", description: "Tekanan emosi seperti takut, urgensi, eksploitasi kepercayaan, dan isolasi dipresentasikan agar mudah dipahami." },
      { title: "Threat Heatmap", description: "Bagian percakapan yang paling berisiko disorot sehingga pengguna dapat melihat kalimat pemicu ancaman." },
      { title: "Behavioral Timeline", description: "Perubahan taktik dari pendekatan lembut ke tekanan tinggi dapat dipahami sebagai rangkaian perilaku." },
      { title: "Confidence Analysis", description: "Tingkat keyakinan membantu pengguna membaca seberapa kuat sinyal yang ditemukan AI dalam percakapan." },
    ],
    safetyTitle: "Rekomendasi Keselamatan", safetyDescription: "Gunakan prinsip ini sebelum mengirim uang, data pribadi, OTP, dokumen, atau akses akun.",
    safetyItems: ["Jangan transfer uang ketika percakapan membuat Anda panik atau merasa dikejar waktu.", "Verifikasi identitas melalui kanal terpisah: telepon nomor lama, hubungi keluarga, atau cek aplikasi resmi.", "Waspadai permintaan rahasia, larangan bertanya, atau instruksi untuk tidak menghubungi siapa pun.", "Jangan klik link login dari chat; ketik alamat situs resmi secara manual di browser.", "Simpan screenshot, nomor, link, dan bukti transaksi untuk pelaporan jika dibutuhkan."],
    faqTitle: "Pertanyaan Umum", faqDescription: "Jawaban singkat tentang akurasi, privasi, bahasa, dan cara membaca hasil TrustLens.",
    faqItems: [
      { question: "Apakah TrustLens akurat?", answer: "TrustLens membaca pola risiko dengan AI, tetapi keputusan akhir tetap perlu verifikasi manusia dan bukti tambahan." },
      { question: "Apakah data saya disimpan?", answer: "TrustLens dirancang dengan pendekatan privasi tinggi. Hasil riwayat scan disimpan lokal di perangkat untuk pengalaman pengguna." },
      { question: "Apakah TrustLens mendukung bahasa Indonesia?", answer: "Ya. Antarmuka, scan, dan halaman edukasi ini mendukung bahasa Indonesia dan Inggris tanpa output campuran." },
      { question: "Bagaimana analisis TrustLens bekerja?", answer: "TrustLens menganalisis teks percakapan, konteks, sinyal manipulasi, dan indikator phishing untuk memberi ringkasan risiko." },
      { question: "Bisakah scammer memanipulasi emosi?", answer: "Ya. Banyak scam modern menargetkan emosi seperti takut, cinta, panik, rasa bersalah, dan kepercayaan." },
    ],
  },
  en: {
    eyebrow: "TRUSTLENS / LEARN",
    title: "Scam Intelligence Playbook",
    subtitle: "A clear guide to using TrustLens, reading scam psychology, and making safer decisions before you respond.",
    ctaPrimary: "Start Analysis", ctaSecondary: "Explore System",
    stats: [{ value: "06", label: "Core scam types" }, { value: "AI", label: "Behavior analysis" }, { value: "ID/EN", label: "Language support" }],
    navLabel: "Guide Navigation",
    howTitle: "How to Use TrustLens",
    howDescription: "The workflow is intentionally simple: submit conversation evidence, let AI read the risk signals, then use the recommendations to act safely.",
    howSteps: [
      { title: "Upload a screenshot or paste conversation text", description: "Use a chat screenshot from a messaging app or enter suspicious conversation text directly." },
      { title: "Let TrustLens analyze the exchange", description: "TrustLens reads context, tone, requests, and language patterns commonly used in social engineering." },
      { title: "Review threat indicators", description: "Inspect the scam category, risk probability, and the primary reasons the conversation appears dangerous." },
      { title: "Analyze emotional manipulation", description: "Understand fear pressure, urgency, isolation, and trust exploitation used by the attacker." },
      { title: "Follow safety recommendations", description: "Verify identity, pause impulsive transfers, and preserve evidence before responding." },
    ],
    scamTitle: "Modern Scam Map", scamDescription: "Recognize the patterns that appear most often in high-risk conversations.",
    scamCards: [
      { title: "Romance Scam", description: "Attackers build emotional intimacy before asking for money, gifts, or emergency help.", tactics: "Love bombing, future promises, illness stories, travel delays.", warningSigns: "Relationship moves too fast, avoids video calls, asks for repeated transfers.", manipulation: "Attachment, sympathy, and guilt." },
      { title: "Marketplace Scam", description: "Buy-sell fraud using fake payment proof, fake escrow links, or rapid transaction pressure.", tactics: "Extreme discounts, moving chat off-platform, claims that payment is pending.", warningSigns: "New account, odd payment proof, requests for OTP or extra fees.", manipulation: "FOMO, artificial scarcity, and time pressure." },
      { title: "Investment Scam", description: "Fake schemes promising high returns with little or no risk.", tactics: "Fake testimonials, manipulated profit dashboards, top-up requests to unlock withdrawals.", warningSigns: "Unrealistic returns, unclear licensing, blocked withdrawals or no audit trail.", manipulation: "Greed, FOMO, and fake social proof." },
      { title: "Phishing", description: "Victims are sent to fake sites or forms to steal passwords, OTPs, or card data.", tactics: "Lookalike domains, account-lock alerts, urgent verification links.", warningSigns: "Strange URLs, poor grammar, requests for sensitive credentials.", manipulation: "Fear of lost access and forced compliance." },
      { title: "Fake Emergency Scam", description: "Attackers impersonate a crisis to make victims send money before thinking clearly.", tactics: "Hospital stories, accidents, new family number, secrecy requests.", warningSigns: "Keep-it-secret pressure, urgent transfer asks, refusal to call or verify.", manipulation: "Panic, guilt, and victim isolation." },
      { title: "Impersonation Scam", description: "Attackers mimic friends, family, brands, couriers, banks, or officials to gain trust.", tactics: "Logos, job titles, new numbers, and authoritative tone.", warningSigns: "Inconsistent tone, unverifiable identity, requests for money or sensitive data.", manipulation: "False authority and trusted-relationship abuse." },
    ],
    psychTitle: "Manipulation Signals",
    psychDescription: "Many scams succeed because the attacker controls emotion, timing, and trust—not because the technology is advanced.",
    psychCards: [
      { title: "Urgency Manipulation", description: "Attackers invent deadlines so victims do not compare facts or ask other people for help.", icon: Siren },
      { title: "Emotional Coercion", description: "Love, empathy, shame, or guilt are used to make the victim feel obligated to help.", icon: HeartPulse },
      { title: "Fear Pressure", description: "Threats of account loss, lost funds, or harm to family are used to force quick compliance.", icon: ShieldAlert },
      { title: "Isolation Tactics", description: "Victims are told to keep the situation secret so outside perspective cannot interrupt the scam.", icon: UserX },
      { title: "Trust Exploitation", description: "Trusted identities or institutions are mimicked to lower skepticism and speed up decisions.", icon: Lock },
    ],
    aiTitle: "How TrustLens Works",
    aiDescription: "A high-level view of the analysis pipeline. TrustLens does not expose backend secrets, internal prompts, or API keys.",
    aiCards: [
      { title: "OCR Extraction", description: "Conversation screenshots are converted into analyzable text while preserving the existing OCR flow." },
      { title: "Risk Analysis", description: "The model reads context, tone, requests, and social engineering indicators to create a risk summary." },
      { title: "Emotional Meter", description: "Emotional pressure such as fear, urgency, trust abuse, and isolation is presented in a readable way." },
      { title: "Threat Heatmap", description: "The riskiest conversation segments are highlighted so users can inspect the triggering language." },
      { title: "Behavioral Timeline", description: "Tactic changes from soft rapport to high pressure can be understood as a behavioral sequence." },
      { title: "Confidence Analysis", description: "Confidence helps users interpret how strong the detected signals are within the conversation." },
    ],
    safetyTitle: "Safe Response Guide", safetyDescription: "Use these principles before sending money, private data, OTPs, documents, or account access.",
    safetyItems: ["Never transfer money when a conversation makes you panic or feel rushed.", "Verify identity through a separate channel: call an old number, contact family, or use an official app.", "Treat secrecy requests, no-questions instructions, and isolation pressure as high-risk signals.", "Do not open login links from chat; manually type the official website address in your browser.", "Preserve screenshots, numbers, links, and transaction evidence for reporting when needed."],
    faqTitle: "Questions", faqDescription: "Short answers about accuracy, privacy, language support, and how to interpret TrustLens reports.",
    faqItems: [
      { question: "How accurate is TrustLens?", answer: "TrustLens reads risk patterns and explains its signals, but final decisions should still include independent verification and supporting evidence." },
      { question: "Is my data stored?", answer: "TrustLens is designed with a privacy-conscious approach. Scan history is stored locally on the device for user experience." },
      { question: "Does TrustLens support Indonesian?", answer: "Yes. The interface, scanner, and this learning page support Indonesian and English without mixed-language output." },
      { question: "How does the analysis work?", answer: "TrustLens analyzes conversation text, context, manipulation signals, and phishing indicators to produce risk insights." },
      { question: "Can scammers manipulate emotions?", answer: "Yes. Modern scams often target fear, love, panic, guilt, and trust rather than facts alone." },
    ],
  },
}

const sectionLinks = ["how", "scams", "psych", "ai", "safety", "faq"] as const

export default function LearnPage() {
  const { language } = useLanguage()
  const copy = pageCopy[language]
  const linkLabels = [copy.howTitle, copy.scamTitle, copy.psychTitle, copy.aiTitle, copy.safetyTitle, copy.faqTitle]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <BackgroundGlow />
      <Spotlight />
      <Navbar />
      <section className="relative z-10 px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="hidden h-fit rounded-[28px] border border-white/[0.09] bg-white/[0.025] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl lg:sticky lg:top-28 lg:block">
            <p className="mb-4 text-xs font-medium tracking-[0.24em] text-white/40">{copy.navLabel}</p>
            <nav className="space-y-1" aria-label={copy.navLabel}>
              {sectionLinks.map((id, index) => (
                <a key={id} href={`#${id}`} className="group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm text-white/55 transition hover:bg-white/[0.07] hover:text-white">
                  <span>{linkLabels[index]}</span><ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              ))}
            </nav>
          </motion.aside>
          <div className="space-y-10 md:space-y-14">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="relative overflow-hidden rounded-[34px] border border-white/[0.10] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.075),rgba(255,255,255,0.018))] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-10 lg:p-12">
              <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-white/10 bg-white/[0.03] blur-[1px]" />
              <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-dashed border-white/15" />
              <div className="relative max-w-4xl">
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/[0.1] bg-black/20 px-4 py-2 backdrop-blur-xl"><span className="h-2 w-2 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" /><span className="text-xs font-medium tracking-[0.24em] text-white/55">{copy.eyebrow}</span></div>
                <h1 className="max-w-5xl text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-white md:text-6xl lg:text-7xl">{copy.title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-white/58 md:text-lg">{copy.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3"><Link href="/scan" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90 active:scale-95">{copy.ctaPrimary}</Link><a href="#ai" className="rounded-2xl border border-white/[0.10] bg-white/[0.035] px-5 py-3 text-sm font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white">{copy.ctaSecondary}</a></div>
              </div>
              <div className="relative mt-10 grid gap-3 sm:grid-cols-3">{copy.stats.map((item) => <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 backdrop-blur-xl"><p className="text-2xl font-medium tracking-[-0.04em]">{item.value}</p><p className="mt-1 text-xs text-white/45">{item.label}</p></div>)}</div>
            </motion.div>
            <DocumentSection id="how" icon={BookOpen} title={copy.howTitle} description={copy.howDescription}><div className="grid gap-4 md:grid-cols-2">{copy.howSteps.map((step, index) => <PremiumCard key={step.title} index={index + 1} title={step.title} description={step.description} />)}</div></DocumentSection>
            <DocumentSection id="scams" icon={ShieldAlert} title={copy.scamTitle} description={copy.scamDescription}><div className="grid gap-4 md:grid-cols-2">{copy.scamCards.map((card) => <PremiumCard key={card.title} title={card.title} description={card.description} details={[{ label: "Tactics", value: card.tactics }, { label: "Warning signs", value: card.warningSigns }, { label: "Psychology", value: card.manipulation }]} />)}</div></DocumentSection>
            <DocumentSection id="psych" icon={Brain} title={copy.psychTitle} description={copy.psychDescription}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{copy.psychCards.map((card) => <PremiumCard key={card.title} icon={card.icon} title={card.title} description={card.description} />)}</div></DocumentSection>
            <DocumentSection id="ai" icon={Radar} title={copy.aiTitle} description={copy.aiDescription}><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{copy.aiCards.map((card) => <PremiumCard key={card.title} title={card.title} description={card.description} />)}</div></DocumentSection>
            <DocumentSection id="safety" icon={Search} title={copy.safetyTitle} description={copy.safetyDescription}><div className="rounded-[30px] border border-white/[0.10] bg-white/[0.025] p-5 backdrop-blur-2xl md:p-7"><div className="grid gap-3 md:grid-cols-2">{copy.safetyItems.map((item) => <motion.div key={item} whileHover={{ x: 3 }} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/70"><CircleDot className="mt-1 h-4 w-4 shrink-0 text-white/55" /><span>{item}</span></motion.div>)}</div></div></DocumentSection>
            <DocumentSection id="faq" icon={BadgeHelp} title={copy.faqTitle} description={copy.faqDescription}><div className="space-y-3">{copy.faqItems.map((item) => <details key={item.question} className="group rounded-2xl border border-white/[0.09] bg-white/[0.025] p-5 backdrop-blur-xl"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-white md:text-base">{item.question}<Sparkles className="h-4 w-4 shrink-0 text-white/35 transition group-open:text-white" /></summary><p className="mt-4 max-w-3xl text-sm leading-6 text-white/62">{item.answer}</p></details>)}</div></DocumentSection>
          </div>
        </div>
      </section>
    </main>
  )
}

function DocumentSection({ id, icon: Icon, title, description, children }: { id: string; icon: LucideIcon; title: string; description: string; children: React.ReactNode }) {
  return <motion.section id={id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-110px" }} transition={{ duration: 0.65 }} className="scroll-mt-28"><div className="mb-5 flex flex-col gap-3 md:mb-7 md:flex-row md:items-end md:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 text-xs text-white/55"><Icon className="h-3.5 w-3.5" /><span>TrustLens Intelligence</span></div><h2 className="text-2xl font-medium tracking-[-0.035em] md:text-4xl">{title}</h2></div><p className="max-w-xl text-sm leading-6 text-white/52 md:text-right">{description}</p></div>{children}</motion.section>
}

function PremiumCard({ index, icon: Icon, title, description, details }: { index?: number; icon?: LucideIcon; title: string; description: string; details?: { label: string; value: string }[] }) {
  return <motion.article whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.18)" }} transition={{ duration: 0.25 }} className="group relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl md:p-6"><div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition group-hover:opacity-100" /><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.035] text-sm text-white/75">{Icon ? <Icon className="h-4 w-4" /> : index ? String(index).padStart(2, "0") : <Sparkles className="h-4 w-4" />}</div><h3 className="text-base font-medium tracking-[-0.01em] text-white md:text-lg">{title}</h3></div><p className="text-sm leading-6 text-white/62">{description}</p>{details ? <div className="mt-5 space-y-3 border-t border-white/[0.08] pt-4">{details.map((detail) => <div key={detail.label}><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">{detail.label}</p><p className="mt-1 text-sm leading-6 text-white/58">{detail.value}</p></div>)}</div> : null}</motion.article>
}
