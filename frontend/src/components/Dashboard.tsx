import StatsCard from './StatsCard'
import DiseaseChart from './DiseaseChart'
import ScanLog from './ScanLog'
import { RecentScan } from '../types'

interface DashboardProps {
  scans: RecentScan[]
  onSelectScan?: (scan: RecentScan) => void
}

export const Dashboard = ({ scans, onSelectScan }: DashboardProps) => {
  const total = scans.length || 0
  const healthyRate = `${Math.round((scans.filter((s) => s.predictedClass === 'Healthy').length / Math.max(1, total)) * 100)}%`
  const mostCommon = scans[0]?.predictedClass ?? '—'

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard value={total} label="Total scans" />
        <StatsCard value={healthyRate} label="Healthy rate" color="text-emerald-400" />
        <StatsCard value={mostCommon} label="Most common" />
        <StatsCard value={3} label="Plots tracked" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DiseaseChart />
        <ScanLog scans={scans} onSelect={onSelectScan} />
      </div>
    </div>
  )
}

export default Dashboard
