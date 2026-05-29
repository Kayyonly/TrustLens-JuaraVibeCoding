export default function AnalysisShowcase() {
  return (
    <section className="relative z-10 px-6 py-32">

      <div className="max-w-6xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="space-y-6">

            <p className="text-sm text-[#8B9DFF]">
              RISK ANALYSIS SYSTEM
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.04em] leading-tight">
              TrustLens turns suspicious conversations into clear behavioral evidence.
            </h2>

            <p className="text-lg text-white/60 leading-relaxed">
              Instead of cold alerts, TrustLens explains the pressure, pretext, and risk signals in language people can act on.
            </p>

            <div className="space-y-4 pt-4">

              <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-4">
                <p className="text-white font-medium">
                  Emotional Pressure
                </p>

                <p className="text-white/60 text-sm mt-2">
                  The sender is creating panic and urgency to shorten the user’s decision window.
                </p>
              </div>

              <div className="border border-white/10 bg-white/[0.03] rounded-2xl p-4">
                <p className="text-white font-medium">
                  Identity Mismatch
                </p>

                <p className="text-white/60 text-sm mt-2">
                  The claimed identity conflicts with channel behavior and verification cues.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <div className="absolute inset-0 bg-[#8B9DFF]/10 blur-[100px]" />

            <div className="relative border border-white/10 bg-white/[0.04] backdrop-blur-2xl rounded-[32px] p-8 space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-sm">
                    Scam Probability
                  </p>

                  <h3 className="text-5xl font-semibold text-red-400">
                    98%
                  </h3>
                </div>

                <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse" />
              </div>

              <div className="space-y-3">

                <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300">
                  Manufactured Urgency
                </div>

                <div className="px-4 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                  Authority Pretext
                </div>

                <div className="px-4 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  OTP Extraction Attempt
                </div>

              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-white/40 text-sm mb-2">
                  Analyst Note
                </p>

                <p className="text-white/70 leading-relaxed">
                  This message combines fear and time pressure to push the recipient toward sharing sensitive verification credentials.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}