/* eslint-disable */

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
  highlighted_segments?: { text: string; risk: "low" | "medium" | "high" | "critical"; reason: string }[]
}

type PdfLabels = {
  title: string; subtitle: string; generatedAt: string; analysisId: string;
  sectionThreatSummary: string; sectionAiAnalysis: string; sectionMetrics: string;
  sectionHeatmap: string; sectionRecommendations: string; sectionFooter: string;
  threatScore: string; threatLevel: string; aiConfidence: string; detectedCategory: string;
  manipulation: string; phishing: string; emotional: string; classification: string;
  urgencyManipulation: string; trustExploitation: string; isolationTactics: string;
}

export async function exportInvestigationPdf(result: AnalysisResult, labels: PdfLabels) {
  const analysisId = `TL-${Date.now().toString().slice(-8)}`
  const threatScore = parseInt(result.scam_probability.replace(/\D/g, "")) || 0
  const generatedAt = new Date().toLocaleString()
  const dateSlug = new Date().toISOString().slice(0, 10)
  const levelSlug = (result.threat_level || "analysis").toLowerCase().replace(/\s+/g, "-")
  const fileName = `trustlens-analysis-${levelSlug}-${dateSlug}.pdf`

  const win = window.open("", "_blank", "width=900,height=1200")
  if (!win) throw new Error("Popup blocked")

  const segs = (result.highlighted_segments || []).map((s, i) => `<li><strong>[${s.risk.toUpperCase()}]</strong> ${i + 1}. ${s.text}<br/><span>${s.reason}</span></li>`).join("")
  const recs = result.recommended_actions.map((r, i) => `<li>${i + 1}. ${r}</li>`).join("")

  win.document.write(`<!doctype html><html><head><title>${fileName}</title><style>
  *{box-sizing:border-box} body{font-family:Arial,sans-serif;padding:32px;color:#0f0f0f;background:#fff} 
  .cover{background:#0b0b0b;color:#fff;padding:24px;border-radius:18px;margin-bottom:24px}
  .s{margin:16px 0;padding-top:8px;border-top:1px solid #dcdcdc}
  h1{margin:0 0 6px;font-size:28px} h2{font-size:16px;margin:0 0 8px} p,li{font-size:12px;line-height:1.6}
  ul{padding-left:18px} .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .footer{position:fixed;bottom:10px;left:32px;color:#666;font-size:11px}
  @media print { body{padding:16px} }
  </style></head><body>
  <div class='cover'><h1>${labels.title}</h1><p>${labels.subtitle}</p><p>${labels.generatedAt}: ${generatedAt}</p><p>${labels.analysisId}: ${analysisId}</p></div>
  <section class='s'><h2>${labels.sectionThreatSummary}</h2><div class='grid'>
  <p><strong>${labels.threatScore}:</strong> ${threatScore}%</p><p><strong>${labels.threatLevel}:</strong> ${result.threat_level}</p>
  <p><strong>${labels.aiConfidence}:</strong> ${result.scam_category?.confidence || 0}%</p><p><strong>${labels.detectedCategory}:</strong> ${result.scam_category?.name || "-"}</p></div></section>
  <section class='s'><h2>${labels.sectionAiAnalysis}</h2><p><strong>${labels.manipulation}:</strong> ${result.analysis.manipulation_tactics.join("; ")}</p><p><strong>${labels.phishing}:</strong> ${result.analysis.phishing_indicators.join("; ")}</p><p><strong>${labels.emotional}:</strong> ${result.psychology_explanation}</p><p><strong>${labels.classification}:</strong> ${result.summary}</p></section>
  <section class='s'><h2>${labels.sectionMetrics}</h2><p>${labels.urgencyManipulation}: ${result.emotional_metrics.urgency}</p><p>${labels.trustExploitation}: ${result.emotional_metrics.trust_abuse}</p><p>${labels.isolationTactics}: ${result.emotional_metrics.isolation}</p></section>
  <section class='s'><h2>${labels.sectionHeatmap}</h2><ul>${segs || "<li>-</li>"}</ul></section>
  <section class='s'><h2>${labels.sectionRecommendations}</h2><ul>${recs}</ul></section>
  <div class='footer'>${labels.sectionFooter}</div>
  <script>window.onload=()=>{window.print();}</script></body></html>`)
  win.document.close()
}
