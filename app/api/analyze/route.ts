import { GoogleGenerativeAI, Part } from "@google/generative-ai"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" })

// --- LAPIS 2: KAMUS DARURAT (NORMALIZATION MAP) ---
// Jika Gemini masih membandel memberikan kategori bahasa Inggris saat mode 'id', ini akan menimpanya.
const categoryTranslationMap: Record<string, string> = {
  "Romance Scam": "Penipuan Romansa",
  "Pig Butchering": "Manipulasi Investasi Berkedok Romansa",
  "Pig Butchering Prelude": "Manipulasi Investasi Berkedok Romansa",
  "Romance Scam / Pig Butchering Prelude": "Penipuan Romansa & Investasi",
  "Impersonation Scam": "Penipuan Penyamaran Identitas",
  "Impersonation": "Penyamaran Identitas",
  "Emergency Scam": "Penipuan Kondisi Darurat",
  "Giveaway Scam": "Penipuan Hadiah / Undian",
  "Crypto Scam": "Penipuan Investasi Kripto",
  "Investment Scam": "Penipuan Investasi Fiktif",
  "Job Scam": "Penipuan Lowongan Kerja",
  "OTP Scam": "Pencurian Kode OTP",
  "Sextortion Scam": "Pemerasan Seksual (Sextortion)",
  "Phishing Scam": "Upaya Phishing",
  "Social Engineering": "Rekayasa Sosial",
  "Unknown / Suspicious Activity": "Aktivitas Mencurigakan",
  "Financial Fraud": "Penipuan Finansial",
  "Tech Support Scam": "Penipuan Dukungan Teknis",
  "Suspicious Analysis": "Analisis Mencurigakan"
}

// Fungsi pembantu untuk memastikan kategori diterjemahkan
function normalizeCategory(categoryName: string, lang: string): string {
  if (lang !== "id") return categoryName;
  
  // Cek apakah ada di kamus secara langsung
  if (categoryTranslationMap[categoryName]) {
    return categoryTranslationMap[categoryName];
  }

  // Jika tidak ada persis, coba cari kata kuncinya
  for (const [eng, ind] of Object.entries(categoryTranslationMap)) {
    if (categoryName.toLowerCase().includes(eng.toLowerCase())) {
      return ind;
    }
  }

  return categoryName; // Kembalikan apa adanya jika tidak ditemukan
}

const JSON_STRUCTURE = `{
  "scam_probability": "e.g. '98%'",
  "threat_level": "Critical | High | Medium | Low",
  "scam_category": {
    "name": "Insert Category Name Here",
    "confidence": 95
  },
  "emotional_metrics": {
    "fear": 82,
    "urgency": 91,
    "trust_abuse": 63,
    "isolation": 74
  },
  "summary": "1-2 sentence summary",
  "psychology_explanation": "calm, empathetic explanation of how this manipulation works psychologically",
  "analysis": {
    "manipulation_tactics": ["string"],
    "emotional_pressure": ["string"],
    "urgency_tactics": ["string"],
    "impersonation_attempts": ["string"],
    "phishing_indicators": ["string"]
  },
  "recommended_actions": ["string"]
}`

function buildPrompt(language: string, conversationNote: string): string {
  // --- LAPIS 1: DYNAMIC LANGUAGE INSTRUCTION SANGAT KETAT ---
  const languageInstruction = language === "id" 
    ? `
CRITICAL LANGUAGE REQUIREMENT:
Respond FULLY in natural, modern, and premium Indonesian (Bahasa Indonesia). 
- ABSOLUTELY NO ENGLISH WORDS ALLOWED in the generated content.
- All scam category names MUST be translated into natural Indonesian. 
  (Examples: "Romance Scam" -> "Penipuan Romansa", "Impersonation" -> "Penipuan Penyamaran", "Pig Butchering" -> "Manipulasi Investasi Emosional").
- The summary, psychological explanation, manipulation tactics, and recommendations MUST be 100% in Indonesian.
- Keep the tone calm, highly intelligent, empathetic, and premium (like an elite cyber-security advisor).
`
    : `
CRITICAL LANGUAGE REQUIREMENT:
Respond FULLY in professional, modern, and premium English.
- Keep a cinematic AI tone.
- Keep an intelligent cybersecurity advisory style.
- Maintain calm, empathetic, and highly analytical explanations.
`

  return `
You are TrustLens AI — an elite, emotionally intelligent psychological cyber defense AI.

${languageInstruction}

Your job is to analyze a conversation, identify manipulation tactics, and determine the exact scam category in a natural, non-robotic way.

CRITICAL TASKS:
1. Determine the most likely scam category and your confidence (0-100). (Remember to translate the category name if Indonesian is requested).
2. Evaluate the emotional manipulation intensity. Give scores from 0-100 for these metrics:
   - fear (panic or anxiety induction)
   - urgency (forced quick action)
   - trust_abuse (exploiting relationship familiarity)
   - isolation (discouraging verification with others)

Analyze and detect:
- Scam probability
- Emotional metrics (0-100 scale)
- The exact scam category
- Manipulation and psychological pressure tactics

${conversationNote}

Respond ONLY with a valid raw JSON object. No markdown, no explanation, no code blocks.
Follow this EXACT structure:
${JSON_STRUCTURE}
`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const language: string = body.language ?? "id"

    let result

    if (body.image) {
      const parts: Part[] = [
        { inlineData: { mimeType: body.mimeType ?? "image/jpeg", data: body.image } },
        { text: buildPrompt(language, "Analyze the conversation visible in this screenshot image.") },
      ]
      result = await model.generateContent(parts)
    } else {
      const prompt = buildPrompt(language, `Conversation to analyze:\n${body.text}`)
      result = await model.generateContent(prompt)
    }

    const raw = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsedJson = JSON.parse(raw);

    // --- EKSEKUSI LAPIS 2: NORMALISASI KATEGORI ---
    if (parsedJson.scam_category && parsedJson.scam_category.name) {
      parsedJson.scam_category.name = normalizeCategory(parsedJson.scam_category.name, language);
    }
    
    // Normalisasi threat_level (Optional tapi bagus untuk UX)
    if (language === "id") {
       if (parsedJson.threat_level === "Critical") parsedJson.threat_level = "Kritis";
       if (parsedJson.threat_level === "High") parsedJson.threat_level = "Tinggi";
       if (parsedJson.threat_level === "Medium") parsedJson.threat_level = "Sedang";
       if (parsedJson.threat_level === "Low") parsedJson.threat_level = "Rendah";
    }

    return NextResponse.json({
      success: true,
      result: parsedJson,
    })
  } catch (error) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json(
      { success: false, error: "AI analysis failed. Please try again." },
      { status: 500 }
    )
  }
}