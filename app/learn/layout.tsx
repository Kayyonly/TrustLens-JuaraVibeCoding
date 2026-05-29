import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documents / Learn | TrustLens AI Scam Intelligence",
  description:
    "Learn how TrustLens detects scam psychology, phishing patterns, emotional manipulation, and cybersecurity threats with AI-powered education.",
  keywords: [
    "AI scam detector",
    "romance scam detection",
    "phishing awareness",
    "scam psychology",
    "emotional manipulation detection",
    "cybersecurity AI tool",
    "TrustLens documents",
  ],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "TrustLens Documents / Learn",
    description: "AI scam intelligence, cybersecurity awareness, and emotional manipulation education.",
    type: "website",
  },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
