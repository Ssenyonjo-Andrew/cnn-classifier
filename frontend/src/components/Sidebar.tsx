import { Plus, RotateCcw } from 'lucide-react'
import { RecentScan } from '../types/index'
import { UploadZone } from './UploadZone'

interface SidebarProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
  disabled: boolean
  recentScans: RecentScan[]
  activeScanId: string | null
  onSelectScan: (scan: RecentScan) => void
  onAnalyseNew: () => void
  hasPrediction: boolean
}

export const Sidebar = ({
  onFileSelect,
  isLoading,
  disabled,
  recentScans,
  activeScanId,
  onSelectScan,
  onAnalyseNew,
  hasPrediction,
}: SidebarProps) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col border-r border-emerald-900/30 bg-[#080d0a] min-h-screen">
      <div className="p-5 border-b border-emerald-900/30">
        <div className="flex items-center gap-2.5">
          {/* <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
            <span className="text-emerald-400 text-lg">🌿</span>
          </div> */}
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">Multi-Crop Guard</h1>
            <p className="text-[11px] text-emerald-500/70">AI disease detection</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-5">
        {!hasPrediction && (
          <UploadZone onFileSelect={onFileSelect} isLoading={isLoading} disabled={disabled} />
        )}

        {recentScans.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
              Recent Scans
            </p>
            <div className="grid grid-cols-2 gap-2">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => onSelectScan(scan)}
                  className={`group relative rounded-xl overflow-hidden border aspect-square ${
                    activeScanId === scan.id
                      ? 'border-emerald-500 ring-1 ring-emerald-500/40'
                      : 'border-emerald-900/40 hover:border-emerald-700/60'
                  }`}
                >
                  <img
                    src={scan.imagePreview}
                    alt={scan.predictedClass}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                    <p className="text-[10px] text-emerald-300 truncate">{scan.predictedClass}</p>
                  </div>
                </button>
              ))}

              <button
                onClick={onAnalyseNew}
                className="rounded-xl border border-dashed border-emerald-800/50 aspect-square flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-emerald-400 hover:border-emerald-700/60 transition-colors"
              >
                <Plus size={18} />
                <span className="text-[10px]">new</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {hasPrediction && (
        <div className="p-4 border-t border-emerald-900/30">
          <button
            onClick={onAnalyseNew}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/30 text-emerald-300 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Analyse new leaf
          </button>
        </div>
      )}
    </aside>
  )
}
