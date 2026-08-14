import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DiseaseChartProps {
  // accepts precomputed data or generates a small mock when empty
  data?: Array<Record<string, any>>
}

export const DiseaseChart = ({ data }: DiseaseChartProps) => {
  const sample =
    data ?? [
      { week: 'Wk1', Rust: 1, Spot: 0, Healthy: 6 },
      { week: 'Wk2', Rust: 1, Spot: 1, Healthy: 5 },
      { week: 'Wk3', Rust: 2, Spot: 1, Healthy: 5 },
      { week: 'Wk4', Rust: 3, Spot: 1, Healthy: 4 },
      { week: 'Wk5', Rust: 4, Spot: 2, Healthy: 3 },
      { week: 'Wk6', Rust: 4, Spot: 2, Healthy: 3 },
      { week: 'Wk7', Rust: 5, Spot: 1, Healthy: 4 },
      { week: 'Wk8', Rust: 6, Spot: 1, Healthy: 3 },
    ]

  return (
    <div className="bg-[#0f1612] border border-emerald-900/30 rounded-xl p-4">
      <p className="text-sm text-slate-400 font-medium mb-4">Disease occurrence over time</p>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={sample}>
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Rust" stroke="#ea580c" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Spot" stroke="#b45309" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Healthy" stroke="#16a34a" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DiseaseChart
