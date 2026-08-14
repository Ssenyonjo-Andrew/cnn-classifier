import { RecentScan } from '../types'

interface ScanLogProps {
  scans: RecentScan[]
  onSelect?: (scan: RecentScan) => void
}

export const ScanLog = ({ scans, onSelect }: ScanLogProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-400 font-medium mb-2">Scan log</p>
      <div className="bg-[#0f1612] border border-emerald-900/30 rounded-xl p-3">
        {scans.length === 0 ? (
          <p className="text-sm text-slate-500">No scans yet</p>
        ) : (
          <ul className="space-y-2">
            {scans.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between text-sm text-slate-200 hover:text-emerald-400 cursor-pointer"
                onClick={() => onSelect && onSelect(s)}
              >
                <div className="flex items-center gap-3">
                  <img src={s.imagePreview} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <div className="font-medium">{s.filename}</div>
                    <div className="text-xs text-slate-500">{s.predictedClass}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">{/* placeholder for confidence */}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ScanLog
