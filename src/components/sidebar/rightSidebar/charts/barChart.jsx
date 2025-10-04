import { Users } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const chartData = [
  { month: "Jan", researchers: 45 },
  { month: "Feb", researchers: 52 },
  { month: "Mar", researchers: 48 },
  { month: "Apr", researchers: 61 },
  { month: "May", researchers: 58 },
  { month: "Jun", researchers: 67 },
]

export function ResearchersBarChart() {
  const totalResearchers = chartData.reduce((sum, item) => sum + item.researchers, 0);
  const avgResearchers = Math.round(totalResearchers / chartData.length);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-2">
        <h3 className="text-sm font-bold text-white mb-1" style={{fontFamily: 'var(--font-zen-dots)'}}>
          Active Researchers
        </h3>
        <p className="text-white/70 text-xs" style={{fontFamily: 'var(--font-space-mono)'}}>
          Monthly engagement (2024)
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex-1 px-3 py-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              tick={{ fill: 'white', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Bar 
              dataKey="researchers" 
              fill="#00B8EB"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="p-3 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-3 w-3 text-cyan-400" />
          <span className="text-xs font-medium text-white">Avg: {avgResearchers} researchers/month</span>
        </div>
        <div className="text-white/60 text-xs" style={{fontFamily: 'var(--font-space-mono)'}}>
          Peak: {Math.max(...chartData.map(d => d.researchers))} in June
        </div>
      </div>
    </div>
  )
}

export default ResearchersBarChart;