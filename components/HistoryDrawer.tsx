"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Trash2, ShieldAlert, Fingerprint } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { HistoryItem } from "@/hooks/useScanHistory"

type Props = {
  isOpen: boolean
  onClose: () => void
  history: HistoryItem[]
  onSelect: (item: HistoryItem) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export default function HistoryDrawer({ isOpen, onClose, history, onSelect, onDelete, onClear }: Props) {
  const { t } = useLanguage()

  const getThreatColor = (score: number) => {
    if (score >= 80) return "text-red-400 bg-red-400/10 border-red-400/20"
    if (score >= 60) return "text-orange-400 bg-orange-400/10 border-orange-400/20"
    if (score >= 30) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    return "text-green-400 bg-green-400/10 border-green-400/20"
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#050505]/95 backdrop-blur-3xl border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="h-16 border-b border-white/[0.08] flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="text-sm font-medium text-white/80">{t.historyTitle}</span>
              </div>
              <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 px-6">
                  <Fingerprint className="w-12 h-12 text-white/20" />
                  <div>
                    <p className="text-white font-medium">{t.historyEmpty}</p>
                    <p className="text-xs text-white/50 mt-1">{t.historyEmptyDesc}</p>
                  </div>
                </div>
              ) : (
                history.map((item) => (
                  <motion.div
                    key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-3 flex gap-4 cursor-pointer transition-colors"
                    onClick={() => { onSelect(item); onClose(); }}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10 flex items-center justify-center relative">
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt="thumb" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <ShieldAlert className="w-6 h-6 text-white/20" />
                      )}
                      <div className={`absolute bottom-0 inset-x-0 h-1 ${getThreatColor(item.threatScore).split(' ')[0].replace('text-', 'bg-')}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="opacity-0 group-hover:opacity-100 p-1 -mt-1 -mr-1 rounded-md hover:bg-red-500/20 hover:text-red-400 text-white/30 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${getThreatColor(item.threatScore)}`}>
                          {item.threatScore}%
                        </span>
                        <span className="text-xs text-white/40 truncate">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="p-4 border-t border-white/[0.08] shrink-0">
                <button onClick={onClear} className="w-full py-2.5 rounded-xl border border-white/10 bg-transparent text-white/40 text-xs font-medium hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors">
                  {t.historyClear}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}