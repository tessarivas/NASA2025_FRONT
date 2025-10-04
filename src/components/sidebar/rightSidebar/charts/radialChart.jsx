import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer
} from "recharts"

const chartData = [
  { name: "posts", value: 1247, total: 1500, fill: "rgba(255, 107, 53, 0.7)" },
]

export function PostsRadialChart() {
  const percentage = Math.round((chartData[0].value / chartData[0].total) * 100);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-2">
        <h3 className="text-sm font-bold text-white mb-1" style={{fontFamily: 'var(--font-zen-dots)'}}>
          Research Posts Progress
        </h3>
        <p className="text-white/70 text-xs" style={{fontFamily: 'var(--font-space-mono)'}}>
          Published articles this year
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex items-center justify-center px-3">
        <ResponsiveContainer width="100%" height="150%">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="60%"
            outerRadius="90%"
          >
            <defs>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255, 107, 53, 0.8)" />
                <stop offset="100%" stopColor="rgba(255, 107, 53, 0.4)" />
              </linearGradient>
            </defs>
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="rgba(255,255,255,0.1)"
              polarRadius={[60, 50]}
            />
            <RadialBar 
              dataKey="value" 
              background={{ fill: "rgba(255,255,255,0.05)" }}
              cornerRadius={10}
              fill="url(#orangeGradient)"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy - 10}
                          className="text-2xl font-bold"
                          fill="white"
                          style={{fontFamily: 'var(--font-zen-dots)'}}
                        >
                          {chartData[0].value.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 15}
                          className="text-xs"
                          fill="rgba(255,255,255,0.7)"
                          style={{fontFamily: 'var(--font-space-mono)'}}
                        >
                          Posts Published
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="p-3 pt-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-green-400" />
            <span className="text-white font-medium">+12.5% vs target</span>
          </div>
          <span className="text-white/60">{percentage}% Complete</span>
        </div>
        <div className="text-white/50 text-xs mt-1" style={{fontFamily: 'var(--font-space-mono)'}}>
          Target: {chartData[0].total.toLocaleString()} posts
        </div>
      </div>
    </div>
  )
}

export default PostsRadialChart;