"use client"

import Link from "next/link"
import { memo, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Background,
  BackgroundVariant,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  BrainCircuit,
  CheckCircle2,
  FileDown,
  Gauge,
  Home,
  ImageUp,
  Play,
  RotateCcw,
  ScanText,
  ShieldAlert,
  Sparkles,
  WandSparkles,
} from "lucide-react"

type WorkflowStatus = "waiting" | "processing" | "completed"
type WorkflowOrientation = "horizontal" | "vertical"

type WorkflowNodeData = {
  accent: string
  description: string
  icon: keyof typeof workflowIcons
  index: string
  orientation: WorkflowOrientation
  status: WorkflowStatus
  title: string
}

type WorkflowNode = Node<WorkflowNodeData>

const workflowIcons = {
  upload: ImageUp,
  ocr: ScanText,
  cleanup: WandSparkles,
  gemini: BrainCircuit,
  emotion: Sparkles,
  scam: ShieldAlert,
  score: Gauge,
  export: FileDown,
}

const workflowSteps = [
  {
    id: "upload",
    title: "Evidence Intake",
    description: "Screenshot staged securely",
    icon: "upload",
    accent: "#67e8f9",
    log: "Evidence received. Runtime is preparing the conversation image for analysis.",
  },
  {
    id: "ocr",
    title: "Text Capture",
    description: "Conversation text isolated",
    icon: "ocr",
    accent: "#7dd3fc",
    log: "OCR layer isolated message text and preserved source context for review.",
  },
  {
    id: "cleanup",
    title: "Signal Cleanup",
    description: "Noise removed, structure retained",
    icon: "cleanup",
    accent: "#bfdbfe",
    log: "OCR noise reduced. Message boundaries, links, and suspicious phrases are normalized.",
  },
  {
    id: "gemini",
    title: "Context Reasoning",
    description: "Intent and narrative mapped",
    icon: "gemini",
    accent: "#93c5fd",
    log: "Reasoning model is mapping context, intent, and persuasion patterns.",
  },
  {
    id: "emotion",
    title: "Pressure Analysis",
    description: "Emotional leverage inspected",
    icon: "emotion",
    accent: "#22d3ee",
    log: "Emotional pressure, secrecy cues, and urgency triggers are being scored.",
  },
  {
    id: "scam",
    title: "Scam Typology",
    description: "Known tactics matched",
    icon: "scam",
    accent: "#c7d2fe",
    log: "Classifier matched the exchange against known scam and phishing patterns.",
  },
  {
    id: "score",
    title: "Risk Calibration",
    description: "Probability and confidence set",
    icon: "score",
    accent: "#dbeafe",
    log: "Risk score calibrated from behavioral, textual, and forensic signals.",
  },
  {
    id: "export",
    title: "Investigation PDF",
    description: "Dossier ready for export",
    icon: "export",
    accent: "#e0f2fe",
    log: "Investigation dossier compiled with evidence, scoring, and analyst-readable findings.",
  },
] as const

function useIsMobileWorkflow() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const sync = () => setIsMobile(mediaQuery.matches)

    sync()
    mediaQuery.addEventListener("change", sync)

    return () => mediaQuery.removeEventListener("change", sync)
  }, [])

  return isMobile
}

function statusLabel(status: WorkflowStatus) {
  if (status === "completed") return "Complete"
  if (status === "processing") return "Analyzing"
  return "Queued"
}

const TrustLensWorkflowNode = memo(function TrustLensWorkflowNode({ data }: NodeProps<WorkflowNode>) {
  const Icon = workflowIcons[data.icon]
  const isAnalyzing = data.status === "processing"
  const isComplete = data.status === "completed"
  const sourcePosition = data.orientation === "vertical" ? Position.Bottom : Position.Right
  const targetPosition = data.orientation === "vertical" ? Position.Top : Position.Left

  return (
    <div
      className={`group relative w-[184px] rounded-[20px] border bg-[#090d16]/90 px-3.5 py-3.5 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-500 ${
        isAnalyzing
          ? "scale-[1.03] border-cyan-200/80 shadow-[0_0_42px_rgba(34,211,238,0.32),0_18px_70px_rgba(0,0,0,0.45)]"
          : isComplete
            ? "border-sky-200/45 shadow-[0_0_26px_rgba(147,197,253,0.18),0_18px_70px_rgba(0,0,0,0.45)]"
            : "border-white/10"
      }`}
      style={{
        boxShadow: isAnalyzing
          ? `0 0 34px ${data.accent}48, 0 18px 70px rgba(0,0,0,.45)`
          : isComplete
            ? `0 0 22px ${data.accent}24, 0 18px 70px rgba(0,0,0,.45)`
            : undefined,
      }}
    >
      <Handle className="!h-2 !w-2 !border-0 !bg-cyan-200/80" type="target" position={targetPosition} isConnectable={false} />
      <Handle className="!h-2 !w-2 !border-0 !bg-cyan-200/80" type="source" position={sourcePosition} isConnectable={false} />

      <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.13),transparent_32%),linear-gradient(135deg,rgba(56,189,248,0.08),transparent_45%)]" />
      <div
        className={`pointer-events-none absolute -inset-px rounded-[20px] blur-md transition-opacity duration-500 ${isAnalyzing ? "opacity-100" : isComplete ? "opacity-35" : "opacity-0"}`}
        style={{ background: `linear-gradient(135deg, ${data.accent}3d, transparent 58%)` }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white/[0.035] transition-transform duration-500 ${isAnalyzing ? "scale-110 animate-pulse" : ""}`}
            style={{ borderColor: `${data.accent}50`, color: data.accent }}
          >
            <Icon className="h-[18px] w-[18px]" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] tracking-[0.24em] text-white/35">{data.index}</span>
              {isComplete ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-sky-200/20 bg-sky-200/10 px-2 py-0.5 text-[10px] font-medium text-sky-100">
                  <CheckCircle2 className="h-3 w-3" /> Done
                </span>
              ) : (
                <span className={`h-1.5 w-1.5 rounded-full ${isAnalyzing ? "bg-cyan-200 shadow-[0_0_12px_rgba(103,232,249,0.95)]" : "bg-white/20"}`} />
              )}
            </div>
            <h3 className="mt-1.5 truncate text-sm font-medium tracking-[-0.01em] text-white">{data.title}</h3>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/45">{data.description}</p>
          </div>
        </div>

        <div
          className={`relative overflow-hidden rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors duration-500 ${
            isAnalyzing
              ? "border-cyan-200/25 bg-cyan-200/10 text-cyan-100"
              : isComplete
                ? "border-sky-200/20 bg-sky-200/10 text-sky-100"
                : "border-white/10 bg-white/[0.03] text-white/40"
          }`}
        >
          {isAnalyzing ? <span className="absolute inset-y-0 left-0 w-1/2 animate-[trustlens-status-scan_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/15 to-transparent" /> : null}
          <span className="relative">{statusLabel(data.status)}</span>
        </div>
      </div>
    </div>
  )
})

const nodeTypes = { trustlensNode: TrustLensWorkflowNode }

export default function WorkflowVisualization() {
  const isMobile = useIsMobileWorkflow()
  const [activeStep, setActiveStep] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)

  const isComplete = activeStep >= workflowSteps.length
  const orientation: WorkflowOrientation = isMobile ? "vertical" : "horizontal"

  useEffect(() => {
    if (!isRunning || activeStep < 0) return

    const timer = window.setTimeout(() => {
      setActiveStep((current) => {
        if (current >= workflowSteps.length - 1) {
          setIsRunning(false)
          return workflowSteps.length
        }

        return current + 1
      })
    }, 1450)

    return () => window.clearTimeout(timer)
  }, [activeStep, isRunning])

  const startSimulation = () => {
    setActiveStep((current) => (current >= workflowSteps.length || current < 0 ? 0 : current))
    setIsRunning(true)
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setActiveStep(-1)
  }

  const nodes = useMemo<WorkflowNode[]>(() => {
    return workflowSteps.map((step, index) => {
      const status: WorkflowStatus =
        activeStep >= workflowSteps.length || index < activeStep ? "completed" : index === activeStep ? "processing" : "waiting"

      return {
        id: step.id,
        type: "trustlensNode",
        position: isMobile
          ? { x: 28, y: index * 112 }
          : {
              x: (Math.floor(index / 4) === 0 ? index % 4 : 3 - (index % 4)) * 220,
              y: Math.floor(index / 4) * 150 + 42,
            },
        data: {
          accent: step.accent,
          description: step.description,
          icon: step.icon,
          index: `0${index + 1}`,
          orientation,
          status,
          title: step.title,
        },
        draggable: false,
        selectable: false,
      }
    })
  }, [activeStep, isMobile, orientation])

  const edges = useMemo<Edge[]>(() => {
    return workflowSteps.slice(0, -1).map((step, index) => {
      const edgeComplete = activeStep >= workflowSteps.length || index < activeStep
      const edgeActive = isRunning && index === activeStep

      return {
        id: `${step.id}-${workflowSteps[index + 1].id}`,
        source: step.id,
        target: workflowSteps[index + 1].id,
        type: "smoothstep",
        animated: edgeComplete || edgeActive,
        className: edgeActive ? "trustlens-edge-active" : edgeComplete ? "trustlens-edge-complete" : "trustlens-edge-idle",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeComplete || edgeActive ? "#67e8f9" : "rgba(255,255,255,0.18)",
          width: 16,
          height: 16,
        },
        style: {
          stroke: edgeComplete || edgeActive ? "#67e8f9" : "rgba(255,255,255,0.16)",
          strokeWidth: edgeActive ? 2.8 : edgeComplete ? 1.8 : 1.25,
        },
      }
    })
  }, [activeStep, isRunning])

  const visibleEvents = useMemo(() => {
    if (activeStep < 0) return ["Runtime idle. Start the simulation to watch the analysis sequence."]
    if (activeStep >= workflowSteps.length) return [...workflowSteps.map((step) => step.log), "Simulation complete. The TrustLens investigation report is ready."]
    return workflowSteps.slice(0, activeStep + 1).map((step) => step.log)
  }, [activeStep])

  const progress = activeStep < 0 ? 0 : Math.min(((activeStep + (isComplete ? 0 : 1)) / workflowSteps.length) * 100, 100)

  return (
    <main className="trustlens-workflow relative h-screen w-screen overflow-hidden bg-[#050813] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_78%_24%,rgba(125,211,252,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.045),transparent_30%),linear-gradient(180deg,#07111f_0%,#030712_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(125,211,252,0.10)_1px,transparent_1.5px)] bg-[size:24px_24px] opacity-[0.13] [mask-image:radial-gradient(ellipse_76%_70%_at_50%_50%,#000_48%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(147,197,253,0.026)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,197,253,0.026)_1px,transparent_1px)] bg-[size:96px_96px] opacity-40" />

      <div className="relative z-10 flex h-screen w-screen min-w-0 flex-col overflow-hidden p-3 md:p-5">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 flex flex-col gap-3 rounded-[26px] border border-white/[0.08] bg-[#080b12]/70 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white" aria-label="Back to home">
              <Home className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-cyan-100/55">TrustLens Runtime Lab</p>
              </div>
              <h1 className="mt-1.5 text-xl font-light tracking-[-0.04em] text-white md:text-3xl">Scam analysis, staged in real time</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startSimulation}
              disabled={isRunning}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-cyan-100 px-5 text-sm font-semibold text-black shadow-[0_0_28px_rgba(103,232,249,0.25)] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play className="h-4 w-4" />
              {isComplete ? "Run Again" : isRunning ? "Running" : "Start Run"}
            </button>
            <button
              type="button"
              onClick={resetSimulation}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </motion.header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 pt-3 lg:flex-row">
          <motion.section
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative min-h-0 min-w-0 flex-[2] overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#070b14]/78 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:flex-1"
          >
            <div className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-blue-400/[0.07] blur-[100px]" />
            <div className="pointer-events-none absolute -right-24 top-12 h-80 w-80 rounded-full bg-cyan-300/[0.07] blur-[120px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />

            <div className="absolute left-4 right-4 top-4 z-10 flex flex-col gap-3 rounded-3xl border border-white/[0.07] bg-[#070b14]/72 p-3.5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/35">Analysis Pipeline</p>
                <p className="mt-1 text-sm text-white/55">Read-only canvas · fixed sequence · production scanner unchanged</p>
              </div>
              <div className="min-w-[220px]">
                <div className="mb-2 flex items-center justify-between text-xs text-white/45">
                  <span>{isComplete ? "Complete" : isRunning ? "Analyzing" : "Idle"}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-300 via-sky-200 to-cyan-200 transition-[width] duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pt-28 md:pt-24">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: isMobile ? 0.12 : 0.08 }}
                minZoom={0.25}
                maxZoom={0.95}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="rgba(125,211,252,0.14)" gap={30} size={1} variant={BackgroundVariant.Dots} />
              </ReactFlow>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#080c15]/78 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl lg:w-[300px] lg:max-w-[300px] lg:shrink-0 lg:flex-none"
          >
            <div className="border-b border-white/[0.08] pb-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/35">Runtime Feed</p>
              <h2 className="mt-1.5 text-xl font-light tracking-[-0.04em]">Runtime telemetry</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/45">A concise feed of analysis events as TrustLens moves from evidence intake to report generation.</p>
            </div>

            <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden pr-1">
              {visibleEvents.map((log, index) => {
                const newest = index === visibleEvents.length - 1 && activeStep >= 0 && !isComplete
                return (
                  <motion.div
                    key={`${log}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
                      newest
                        ? "border-cyan-200/25 bg-cyan-200/[0.08] text-cyan-50 shadow-[0_0_24px_rgba(103,232,249,0.1)]"
                        : "border-white/[0.07] bg-white/[0.03] text-white/48"
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35">
                      <span className={`h-1.5 w-1.5 rounded-full ${newest ? "animate-pulse bg-cyan-200" : "bg-blue-200/45"}`} />
                      {newest ? "Analyzing" : "Event"}
                    </div>
                    {log}
                  </motion.div>
                )
              })}
            </div>

            <div className="mt-auto pt-5">
              <div className="rounded-3xl border border-sky-200/12 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100/45">Run Mode</p>
                <p className="mt-2 text-sm font-medium text-sky-50">Visual simulation</p>
                <p className="mt-1 text-xs leading-relaxed text-sky-100/45">This view is a safe demo layer. It does not alter scanner logic, backend analysis, or saved reports.</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  )
}
