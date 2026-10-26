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

function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export async function exportInvestigationPdf(result: AnalysisResult, labels: PdfLabels) {
  const analysisId = `TL-${Date.now().toString().slice(-8)}`
  const threatScore = parseInt(result.scam_probability.replace(/\D/g, "")) || 0
  const generatedAt = new Date().toLocaleString()
  const dateSlug = new Date().toISOString().slice(0, 10)
  const levelSlug = (result.threat_level || "analysis").toLowerCase().replace(/\s+/g, "-")
  const fileName = `trustlens-analysis-${levelSlug}-${dateSlug}.pdf`

  const win = window.open("", "_blank", "width=900,height=1200")
  if (!win) throw new Error("The PDF window was blocked by the browser.")

  const segs = (result.highlighted_segments || []).map((s, i) => `<li><strong>[${escapeHtml(s.risk.toUpperCase())}]</strong> ${i + 1}. ${escapeHtml(s.text)}<br/><span>${escapeHtml(s.reason)}</span></li>`).join("")
  const recs = result.recommended_actions.map((r, i) => `<li>${i + 1}. ${escapeHtml(r)}</li>`).join("")

  win.document.write(`<!doctype html><html><head><title>${escapeHtml(fileName)}</title><style>
  *{box-sizing:border-box} body{font-family:Arial,sans-serif;padding:32px;color:#0f0f0f;background:#fff} 
  .cover{background:#0b0b0b;color:#fff;padding:24px;border-radius:18px;margin-bottom:24px}
  .s{margin:16px 0;padding-top:8px;border-top:1px solid #dcdcdc}
  h1{margin:0 0 6px;font-size:28px} h2{font-size:16px;margin:0 0 8px} p,li{font-size:12px;line-height:1.6}
  ul{padding-left:18px} .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  .footer{position:fixed;bottom:10px;left:32px;color:#666;font-size:11px}
  @media print { body{padding:16px} }
  </style></head><body>
  <div class='cover'><h1>${escapeHtml(labels.title)}</h1><p>${escapeHtml(labels.subtitle)}</p><p>${escapeHtml(labels.generatedAt)}: ${escapeHtml(generatedAt)}</p><p>${escapeHtml(labels.analysisId)}: ${escapeHtml(analysisId)}</p></div>
  <section class='s'><h2>${escapeHtml(labels.sectionThreatSummary)}</h2><div class='grid'>
  <p><strong>${escapeHtml(labels.threatScore)}:</strong> ${threatScore}%</p><p><strong>${escapeHtml(labels.threatLevel)}:</strong> ${escapeHtml(result.threat_level)}</p>
  <p><strong>${escapeHtml(labels.aiConfidence)}:</strong> ${escapeHtml(result.scam_category?.confidence || 0)}%</p><p><strong>${escapeHtml(labels.detectedCategory)}:</strong> ${escapeHtml(result.scam_category?.name || "-")}</p></div></section>
  <section class='s'><h2>${escapeHtml(labels.sectionAiAnalysis)}</h2><p><strong>${escapeHtml(labels.manipulation)}:</strong> ${result.analysis.manipulation_tactics.map(escapeHtml).join("; ")}</p><p><strong>${escapeHtml(labels.phishing)}:</strong> ${result.analysis.phishing_indicators.map(escapeHtml).join("; ")}</p><p><strong>${escapeHtml(labels.emotional)}:</strong> ${escapeHtml(result.psychology_explanation)}</p><p><strong>${escapeHtml(labels.classification)}:</strong> ${escapeHtml(result.summary)}</p></section>
  <section class='s'><h2>${escapeHtml(labels.sectionMetrics)}</h2><p>${escapeHtml(labels.urgencyManipulation)}: ${escapeHtml(result.emotional_metrics.urgency)}</p><p>${escapeHtml(labels.trustExploitation)}: ${escapeHtml(result.emotional_metrics.trust_abuse)}</p><p>${escapeHtml(labels.isolationTactics)}: ${escapeHtml(result.emotional_metrics.isolation)}</p></section>
  <section class='s'><h2>${escapeHtml(labels.sectionHeatmap)}</h2><ul>${segs || "<li>-</li>"}</ul></section>
  <section class='s'><h2>${escapeHtml(labels.sectionRecommendations)}</h2><ul>${recs}</ul></section>
  <div class='footer'>${escapeHtml(labels.sectionFooter)}</div>
  <script>window.onload=()=>{window.print();}</script></body></html>`)
  win.document.close()
}
