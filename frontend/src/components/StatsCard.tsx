interface StatsCardProps {
  value: string | number
  label: string
  color?: string
}

export const StatsCard = ({ value, label, color = 'text-white' }: StatsCardProps) => {
  return (
    <div className="rounded-2xl bg-[#0f1612] border border-emerald-900/30 p-4 flex flex-col items-center justify-center">
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  )
}

export default StatsCard
