# TrustLens

TrustLens is a bilingual scam-intelligence application built with Next.js App Router and TypeScript. It analyzes conversation text and screenshots, and provides local investigation tools.

## Local setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Do not commit `.env.local` or place API keys in browser code. Configure keys only in the server environment.

## AI analysis provider

`AI_PROVIDER` selects `gemini` (default) or `groq`. The existing `/api/analyze` response contract is retained. Provider selection happens only on the server; there is no automatic fallback or duplicate AI request.

- Gemini uses `GOOGLE_API_KEY` and the existing `gemini-3.1-flash-lite` model.
- Groq uses `GROQ_API_KEY`; `GROQ_MODEL` can select a model. The current example is `qwen/qwen3.8-27b`, documented by Groq as vision-capable and currently marked preview in its model catalogue. Availability, rate limits, and free-tier quotas can change; confirm eligibility in your Groq account before production use.
- Submitted text or screenshots are processed by the configured external AI provider when the user starts an analysis. The local history remains in browser storage.

Provider references: [Groq vision](https://console.groq.com/docs/vision), [Groq supported models](https://console.groq.com/docs/models), and [Gemini API](https://ai.google.dev/gemini-api/docs).

## URL reputation scanner

`/url-scanner` requires `VIRUSTOTAL_API_KEY`. The app submits the entered URL to VirusTotal's documented API, reads the corresponding analysis/report, and shows returned detections and timestamps. It never fetches the submitted website from the TrustLens server.

**Privacy and terms:** before scanning, the user must confirm that the URL will be shared with VirusTotal. VirusTotal documents that submitted indicators enter its dataset. Its Public API currently documents limits of 500 requests/day and 4 requests/minute and prohibits use in commercial products/services; check the current [VirusTotal API terms](https://docs.virustotal.com/reference/public-vs-premium-api) and account licence before enabling it for production or commercial use. The route also applies a best-effort per-instance application rate limit. A missing key shows a setup message; there are no simulated reputation results.

## Other tools

- `/recovery` is a deterministic, bilingual incident guide and does not require an AI key. It links to the official [IASC/OJK](https://iasc.ojk.go.id/), [Polri cybercrime reporting](https://patrolisiber.id/submit-report), [AduanKonten](https://aduankonten.id/), and [CekRekening](https://cekrekening.id/) channels.
- Safe replies are predefined local templates. They reuse no model call and tell users not to reply when stopping contact is safer.
- `/cases` stores case names and history-entry IDs in local storage; it does not copy case evidence or rerun AI. Deleting a case leaves reports in the existing local history.
- `/feedback` and the inline rating widget store only a rating and a categorical issue type locally. No evidence, raw conversation, screenshot, analysis result, personal identifier, or feedback record is sent to a server. Feedback does not retrain a model.

Local storage is browser/device-specific and can be cleared by the user. Scan history itself may include a report, text preview, and screenshot thumbnail; use the existing history deletion controls when you want those removed.

## Checks

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

The API rate limiter is in-memory and per serverless instance; it is not a distributed quota system. Enforce provider/account quotas and edge-level controls for production traffic.

## Review this development branch

This feature work is on `feat/trustlens-intelligence-upgrade`, based on the verified `main` commit `3c62ab861477d1db24249a909b8b7c36241c9352`. Pushes to this branch may create a Vercel Preview deployment when the repository's existing Vercel Git integration is configured. Review the branch/commit and the Preview URL before requesting any merge. Do not merge to `main`, alter Production environment variables/settings, or deploy to production without explicit approval.

For a preview requiring provider-backed features, configure only the needed secrets in the **Preview** environment: select `AI_PROVIDER` and its provider key for `/api/analyze`, and `VIRUSTOTAL_API_KEY` for `/url-scanner`. Do not copy Production secrets into Preview unless you explicitly intend to use them. Without those keys, AI and VirusTotal show safe setup/error states; local cases, recovery, safe replies, and feedback remain usable.
