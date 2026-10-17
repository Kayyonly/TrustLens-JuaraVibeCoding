import assert from "node:assert/strict"
import test from "node:test"
import { attachHistoryIds, createCase, resolveCaseEntries, riskPattern } from "../lib/cases.ts"
import { createFeedback, feedbackCounts, parseFeedback } from "../lib/feedback.ts"
import { buildAnalysisPrompt, MalformedAnalysisError, normalizeAnalysisResult, parseProviderJson } from "../lib/analysis-schema.ts"
import { classifyUrlReputation, urlReportId, UrlInputError, validateSubmittedUrl } from "../lib/url-intelligence.ts"
import { readJsonBody, RequestValidationError } from "../lib/server/http.ts"
import { checkRateLimit } from "../lib/server/rate-limit.ts"
import { AiProviderError, analyzeWithConfiguredProvider } from "../lib/ai/provider.ts"

const validProviderJson = JSON.stringify({
  scam_probability: "12%", threat_level: "Low", scam_category: { name: "Suspicious Analysis", confidence: 55 },
  emotional_metrics: { fear: 0, urgency: 0, trust_abuse: 0, isolation: 0 },
  summary: "No clear evidence in the sample.", psychology_explanation: "", analysis: {}, recommended_actions: [], highlighted_segments: [],
})

async function withGroqEnvironment(task) {
  const keys = ["AI_PROVIDER", "GROQ_API_KEY", "GROQ_MODEL"]
  const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]))
  const originalFetch = globalThis.fetch
  process.env.AI_PROVIDER = "groq"
  process.env.GROQ_API_KEY = "test-only-not-a-real-key"
  process.env.GROQ_MODEL = "test-vision-model"
  try {
    await task((fetchMock) => { globalThis.fetch = fetchMock })
  } finally {
    globalThis.fetch = originalFetch
    for (const key of keys) {
      if (originalEnv[key] === undefined) delete process.env[key]
      else process.env[key] = originalEnv[key]
    }
  }
}

test("URL scanner accepts HTTP(S), canonicalizes input, and rejects unsafe URL forms", () => {
  assert.equal(validateSubmittedUrl("https://example.com/path"), "https://example.com/path")
  assert.equal(validateSubmittedUrl("http://example.com"), "http://example.com/")
  for (const value of ["", "example.com", "ftp://example.com", "https://user:pass@example.com", `https://${"a".repeat(2050)}.com`]) {
    assert.throws(() => validateSubmittedUrl(value), UrlInputError)
  }
})

test("URL report IDs use unpadded base64url encoding", () => {
  assert.equal(urlReportId("https://example.com"), Buffer.from("https://example.com").toString("base64url"))
  assert.doesNotMatch(urlReportId("https://example.com"), /=/)
})

test("reputation classification preserves unknown and pending states", () => {
  assert.equal(classifyUrlReputation({ malicious: 2, suspicious: 0, harmless: 3, undetected: 5 }, true).status, "malicious")
  assert.equal(classifyUrlReputation({ malicious: 0, suspicious: 1, harmless: 0, undetected: 5 }, true).status, "suspicious")
  assert.equal(classifyUrlReputation({ malicious: 0, suspicious: 0, harmless: 7, undetected: 20 }, true).status, "no_detections")
  assert.equal(classifyUrlReputation({ malicious: 0, suspicious: 0 }, false).status, "pending")
  assert.equal(classifyUrlReputation({ malicious: 0, suspicious: 0 }, true).status, "unavailable")
  assert.equal(classifyUrlReputation(null, false).status, "pending")
})

test("provider output normalizer clamps values and preserves required contract", () => {
  const value = normalizeAnalysisResult({
    scam_probability: "140%", threat_level: "High", scam_category: { name: "Phishing Scam", confidence: 120 },
    emotional_metrics: { fear: -2, urgency: 55, trust_abuse: 63, isolation: 101 },
    summary: "Suspicious message", psychology_explanation: "Pressure through urgency.",
    analysis: { manipulation_tactics: ["urgency"], emotional_pressure: [], urgency_tactics: [], impersonation_attempts: [], phishing_indicators: ["link"] },
    recommended_actions: ["Verify separately"], highlighted_segments: [{ text: "pay now", reason: "urgency", risk: "imminent" }],
  }, "id")
  assert.equal(value.scam_probability, "100%")
  assert.equal(value.threat_level, "Tinggi")
  assert.equal(value.scam_category.name, "Upaya Phishing")
  assert.equal(value.scam_category.confidence, 100)
  assert.equal(value.emotional_metrics.fear, 0)
  assert.equal(value.emotional_metrics.isolation, 100)
  assert.equal(value.highlighted_segments[0].risk, "medium")
  assert.deepEqual(value.analysis.emotional_pressure, [])
  assert.throws(() => normalizeAnalysisResult({ summary: "" }, "en"), MalformedAnalysisError)
})

test("provider JSON parser handles fenced JSON and prompts for only the selected language", () => {
  assert.deepEqual(parseProviderJson("```json\n{\"ok\":true}\n```"), { ok: true })
  assert.throws(() => parseProviderJson("not json"), MalformedAnalysisError)
  assert.match(buildAnalysisPrompt("id"), /natural Bahasa Indonesia/)
  assert.match(buildAnalysisPrompt("en"), /professional English/)
})

test("configured Groq provider sends server-side configuration and normalizes a successful response", async () => {
  await withGroqEnvironment(async (setFetch) => {
    let requestBody
    setFetch(async (url, init) => {
      assert.equal(String(url), "https://api.groq.com/openai/v1/chat/completions")
      assert.equal(init.headers.Authorization, "Bearer test-only-not-a-real-key")
      requestBody = JSON.parse(init.body)
      return new Response(JSON.stringify({ choices: [{ message: { content: validProviderJson } }] }), { status: 200, headers: { "content-type": "application/json" } })
    })
    const result = await analyzeWithConfiguredProvider({ language: "en", text: "A test message" })
    assert.equal(result.provider, "groq")
    assert.equal(result.result.scam_probability, "12%")
    assert.equal(requestBody.model, "test-vision-model")
    assert.equal(requestBody.messages[1].content.includes("A test message"), true)
  })
})

test("configured Groq provider maps 429 and malformed model output without leaking provider payloads", async () => {
  await withGroqEnvironment(async (setFetch) => {
    setFetch(async () => new Response("quota details", { status: 429 }))
    await assert.rejects(analyzeWithConfiguredProvider({ language: "id", text: "x" }), (error) => error instanceof AiProviderError && error.code === "rate_limit")

    setFetch(async () => new Response(JSON.stringify({ choices: [{ message: { content: "not JSON" } }] }), { status: 200 }))
    await assert.rejects(analyzeWithConfiguredProvider({ language: "id", text: "x" }), (error) => error instanceof AiProviderError && error.code === "malformed_response")
  })
})

test("configured Groq provider rejects missing key without calling the network", async () => {
  const oldProvider = process.env.AI_PROVIDER
  const oldKey = process.env.GROQ_API_KEY
  const oldFetch = globalThis.fetch
  process.env.AI_PROVIDER = "groq"
  delete process.env.GROQ_API_KEY
  globalThis.fetch = async () => { throw new Error("network must not be called") }
  try {
    await assert.rejects(analyzeWithConfiguredProvider({ language: "en", text: "x" }), (error) => error instanceof AiProviderError && error.code === "missing_key")
  } finally {
    globalThis.fetch = oldFetch
    if (oldProvider === undefined) delete process.env.AI_PROVIDER
    else process.env.AI_PROVIDER = oldProvider
    if (oldKey === undefined) delete process.env.GROQ_API_KEY
    else process.env.GROQ_API_KEY = oldKey
  }
})

test("case operations deduplicate report IDs, sort chronologically, and label score trend", () => {
  const record = createCase("   Investigation A   ", 10, "case-1")
  assert.equal(record.title, "Investigation A")
  assert.deepEqual(attachHistoryIds(["a"], ["a", "b"]), ["a", "b"])
  const entries = [
    { id: "b", timestamp: 30, category: "Phishing", threatScore: 80, threatLevel: "High", summary: "Later" },
    { id: "a", timestamp: 10, category: "Phishing", threatScore: 40, threatLevel: "Medium", summary: "Earlier" },
  ]
  const resolved = resolveCaseEntries({ ...record, historyIds: ["b", "a", "missing"] }, entries)
  assert.deepEqual(resolved.map((entry) => entry.id), ["a", "b"])
  assert.equal(riskPattern(resolved), "rising")
  assert.equal(riskPattern([entries[0]]), "insufficient")
  assert.equal(createCase("  ", 0, "empty"), null)
})

test("feedback accepts only categorical local signals and ignores evidence fields", () => {
  assert.equal(createFeedback("not_helpful", null), null)
  const record = createFeedback("not_helpful", "false_positive", 100, "fb-1")
  assert.equal(record.issue, "false_positive")
  const parsed = parseFeedback(JSON.stringify([{ ...record, rawEvidence: "should never persist" }]))
  assert.equal(parsed.length, 1)
  assert.equal(Object.hasOwn(parsed[0], "rawEvidence"), false)
  assert.equal(feedbackCounts(parsed).false_positive, 1)
})

test("JSON API body reader checks content type, parse errors, and maximum byte size", async () => {
  const good = new Request("https://local.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: true }) })
  assert.deepEqual(await readJsonBody(good, 100), { ok: true })
  const wrongType = new Request("https://local.test/api", { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" })
  await assert.rejects(readJsonBody(wrongType, 100), RequestValidationError)
  const tooLarge = new Request("https://local.test/api", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ value: "123456" }) })
  await assert.rejects(readJsonBody(tooLarge, 5), (error) => error instanceof RequestValidationError && error.status === 413)
})

test("rate limit blocks requests after its configured window budget", () => {
  const key = `test-${Math.random()}`
  assert.equal(checkRateLimit(key, 2, 60_000, 1_000).allowed, true)
  assert.equal(checkRateLimit(key, 2, 60_000, 1_001).allowed, true)
  const limited = checkRateLimit(key, 2, 60_000, 1_002)
  assert.equal(limited.allowed, false)
  assert.equal(limited.retryAfterSeconds, 60)
})
