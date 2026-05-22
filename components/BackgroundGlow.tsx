export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0A0A0F]">

      {/* Top Ambient */}
      <div className="absolute top-[-300px] left-[-200px] w-[700px] h-[700px] rounded-full bg-white/[0.03] blur-[160px]" />

      {/* Bottom Ambient */}
      <div className="absolute bottom-[-300px] right-[-200px] w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-[180px]" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] opacity-60" />

    </div>
  )
}