const CLASS_COLORS: Record<string, string> = {
  'Common Rust': '#f97316',
  'Gray Leaf Spot': '#94a3b8',
  'Northern Leaf Blight': '#ef4444',
  Healthy: '#22c55e',
}

const FALLBACK_COLORS = ['#f97316', '#94a3b8', '#ef4444', '#22c55e', '#a78bfa', '#38bdf8']

interface ProbabilityDonutProps {
  probabilities: Record<string, number>
  predictedClass: string
}

export const ProbabilityDonut = ({ probabilities, predictedClass }: ProbabilityDonutProps) => {
  const entries = Object.entries(probabilities).slice(0, 4)
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1

  const radius = 62
  const strokeWidth = 22
  const center = 80
  const circumference = 2 * Math.PI * radius

  let offset = 0

  const segments = entries.map(([label, value], index) => {
    const fraction = value / total
    const dash = fraction * circumference
    const segmentOffset = -offset
    offset += dash

    const color = CLASS_COLORS[label] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]

    return (
      <circle
        key={label}
        cx={center}
        cy={center}
        r={radius}
        fill="transparent"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={segmentOffset}
        transform={`rotate(-90 ${center} ${center})`}
        className="transition-all duration-700"
      />
    )
  })

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width="160" height="160" viewBox="0 0 160 160" aria-label="Probability distribution chart">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#1a2e22"
            strokeWidth={strokeWidth}
          />
          {segments}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">Top pick</span>
          <span className="text-sm font-semibold text-white text-center px-2 leading-tight">
            {predictedClass}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
          Key
        </p>
        {entries.map(([label, value], index) => {
          const color = CLASS_COLORS[label] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
          const isPredicted = label === predictedClass

          return (
            <div key={label} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span
                  className={`text-sm truncate ${
                    isPredicted ? 'text-slate-200 font-medium' : 'text-slate-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              <span className={`text-sm tabular-nums ${isPredicted ? 'text-emerald-400' : 'text-slate-500'}`}>
                {value.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
