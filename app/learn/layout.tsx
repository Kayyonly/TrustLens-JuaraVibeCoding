import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Learn | TrustLens Scam Intelligence",
  description:
    "Learn how TrustLens analyzes scam psychology, phishing patterns, emotional manipulation, and safer response workflows.",
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
    description: "Scam intelligence, phishing awareness, and emotional manipulation education.",
    type: "website",
  },
}

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
