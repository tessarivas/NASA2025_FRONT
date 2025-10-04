import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

const chartData = [
  { year: "2018", microgravity: 45, radiation: 32, photosynthesis: 28, lifeSupport: 21 },
  { year: "2019", microgravity: 52, radiation: 41, photosynthesis: 35, lifeSupport: 29 },
  { year: "2020", microgravity: 68, radiation: 55, photosynthesis: 48, lifeSupport: 42 },
  { year: "2021", microgravity: 89, radiation: 73, photosynthesis: 61, lifeSupport: 58 },
  { year: "2022", microgravity: 112, radiation: 95, photosynthesis: 82, lifeSupport: 71 },
  { year: "2023", microgravity: 134, radiation: 118, photosynthesis: 105, lifeSupport: 89 },
  { year: "2024", microgravity: 156, radiation: 142, photosynthesis: 128, lifeSupport: 114 },
]

export function SpaceResearchChart() {
  const totalArticles2024 = chartData[6].microgravity + chartData[6].radiation + chartData[6].photosynthesis + chartData[6].lifeSupport;
  const totalArticles2023 = chartData[5].microgravity + chartData[5].radiation + chartData[5].photosynthesis + chartData[5].lifeSupport;
  const growthPercentage = ((totalArticles2024 - totalArticles2023) / totalArticles2023 * 100).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header compacto */}
      <div className="p-3 pb-0">
        <h3 className="text-md font-bold text-white" style={{fontFamily: 'var(--font-zen-dots)'}}>
          Research Publications
        </h3>
        <p className="text-white/70 text-xs" style={{fontFamily: 'var(--font-space-mono)'}}>
          Articles by topic (2018-2024)
        </p>
      </div>

      {/* Chart Container - flex-1 para ocupar espacio disponible */}
      <div className="flex-1 px-3 py-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="fillMicrogravity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B8EB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00B8EB" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillRadiation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF6B35" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPhotosynthesis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLifeSupport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F63564" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F63564" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'white', fontSize: 10 }}
              tickFormatter={(value) => `'${value.slice(2)}`}
            />

            <Area dataKey="lifeSupport" type="monotone" fill="url(#fillLifeSupport)" stroke="#F63564" strokeWidth={1} stackId="1" />
            <Area dataKey="photosynthesis" type="monotone" fill="url(#fillPhotosynthesis)" stroke="#00D4AA" strokeWidth={1} stackId="1" />
            <Area dataKey="radiation" type="monotone" fill="url(#fillRadiation)" stroke="#FF6B35" strokeWidth={1} stackId="1" />
            <Area dataKey="microgravity" type="monotone" fill="url(#fillMicrogravity)" stroke="#00B8EB" strokeWidth={1} stackId="1" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer compacto */}
      <div className="p-3 pt-0 mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-3 w-3 text-green-400" />
          <span className="text-xs font-medium text-white">+{growthPercentage}% growth</span>
        </div>
        
        {/* Leyenda mini */}
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#00B8EB'}}></div>
            <span className="text-white/80 truncate">Microgravity</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#FF6B35'}}></div>
            <span className="text-white/80 truncate">Radiation</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#00D4AA'}}></div>
            <span className="text-white/80 truncate">Agriculture</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#F63564'}}></div>
            <span className="text-white/80 truncate">Life Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpaceResearchChart;