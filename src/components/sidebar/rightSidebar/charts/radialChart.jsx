import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer
} from "recharts"
import { useEffect, useMemo, useState } from "react"
import { useChatContext } from "@/context/ChatContext";

// Función para procesar artículos y generar datos del radial chart
function processRadialData(articles) {
  if (!articles || articles.length === 0) {
    // Datos por defecto si no hay artículos
    return {
      data: [{ name: "research", value: 156, total: 200, fill: "rgba(255, 107, 53)" }],
      category: "Space Research",
      description: "Sample research articles"
    };
  }

  // Mapear tags a categorías conocidas
  const tagMapping = {
    'microgravity': {
      keywords: ['microgravity', 'zero gravity', 'weightlessness', 'micro-gravity'],
      label: 'Microgravity Studies',
      color: 'rgba(0, 184, 235, 0.7)',
      target: 100
    },
    'biology': {
      keywords: ['biology', 'organisms', 'cells', 'genetics', 'dna', 'molecular', 'cellular'],
      label: 'Space Biology',
      color: 'rgba(155, 89, 182, 0.7)',
      target: 150
    },
    'agriculture': {
      keywords: ['agriculture', 'plants', 'photosynthesis', 'crops', 'food', 'botanical'],
      label: 'Space Agriculture',
      color: 'rgba(0, 212, 170, 0.7)',
      target: 80
    },
    'radiation': {
      keywords: ['radiation', 'cosmic rays', 'space radiation', 'solar', 'ionizing'],
      label: 'Radiation Research',
      color: 'rgba(255, 107, 53, 0.7)',
      target: 120
    },
    'physiology': {
      keywords: ['physiology', 'human', 'medical', 'health', 'physiological'],
      label: 'Human Physiology',
      color: 'rgba(231, 76, 60, 0.7)',
      target: 90
    },
    'materials': {
      keywords: ['materials', 'crystal', 'manufacturing', 'processing'],
      label: 'Materials Science',
      color: 'rgba(243, 156, 18, 0.7)',
      target: 60
    }
  };

  // Función para categorizar una tag
  function categorizeTag(tag) {
    const lowerTag = tag.toLowerCase().trim();
    for (const [category, config] of Object.entries(tagMapping)) {
      if (config.keywords.some(keyword => lowerTag.includes(keyword) || keyword.includes(lowerTag))) {
        return category;
      }
    }
    return null;
  }

  // Contar artículos por categoría
  const categoryCounts = {};
  
  articles.forEach(article => {
    (article.tags || []).forEach(tag => {
      const category = categorizeTag(tag);
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
  });

  console.log("📊 Radial Chart - Conteo por categoría:", categoryCounts);

  // Encontrar la categoría con más artículos
  const topCategory = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)[0];

  if (!topCategory) {
    // Si no hay categorías, usar datos por defecto
    return {
      data: [{ name: "articles", value: articles.length, total: articles.length + 20, fill: "rgba(255, 107, 53, 0.7)" }],
      category: "Research Articles",
      description: `${articles.length} articles analyzed`
    };
  }

  const [categoryKey, count] = topCategory;
  const categoryConfig = tagMapping[categoryKey];
  const target = Math.max(categoryConfig.target, count + 10); // Target dinámico

  return {
    data: [{
      name: categoryKey,
      value: count,
      total: target,
      fill: categoryConfig.color
    }],
    category: categoryConfig.label,
    description: `Most researched topic`,
    percentage: Math.round((count / target) * 100),
    growth: calculateGrowth(articles, categoryKey),
    totalArticles: articles.length
  };
}

// Función auxiliar para calcular el crecimiento de una categoría
function calculateGrowth(articles, categoryKey) {
  // Agrupar por año
  const yearlyCounts = {};
  articles.forEach(article => {
    if (!article.year) return;
    (article.tags || []).forEach(tag => {
      const tagLower = tag.toLowerCase();
      if (tagLower.includes(categoryKey)) {
        yearlyCounts[article.year] = (yearlyCounts[article.year] || 0) + 1;
      }
    });
  });

  const years = Object.keys(yearlyCounts).map(Number).sort();
  if (years.length < 2) return 0;

  const lastYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const lastValue = yearlyCounts[lastYear];
  const prevValue = yearlyCounts[prevYear];

  if (!prevValue) return 0;
  return ((lastValue - prevValue) / prevValue * 100).toFixed(1);
}


export function ResearchProgressRadialChart() {
  const { articles } = useChatContext();
  const [chartInfo, setChartInfo] = useState(null);

  useEffect(() => {
    const info = processRadialData(articles);
    setChartInfo(info);
  }, [articles]);

  // ⛔ Evita destructurar si chartInfo aún es null
  if (!chartInfo) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/60 text-sm">
        Loading chart...
      </div>
    );
  }

  const {
    data = [],
    category = "",
    description = "",
    percentage = 0,
    growth = 0,
    totalArticles = 0
  } = chartInfo || {};

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-2">
        <h3 className="text-sm font-bold text-white" style={{fontFamily: 'var(--font-zen-dots)'}}>
          Research Focus
        </h3>
        <p className="text-white/70 text-xs mb-1" style={{fontFamily: 'var(--font-space-mono)'}}>
          {articles.length > 0 
            ? `${totalArticles} articles analyzed`
            : description
          }
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex items-center justify-center px-3">
        <ResponsiveContainer width="100%" height="150%">
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={-270}
            innerRadius="60%"
            outerRadius="90%"
          >
            <defs>
              <linearGradient id="dynamicGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={data[0].fill} />
                <stop offset="100%" stopColor={data[0].fill.replace('0.7', '0.4')} />
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
              fill="url(#dynamicGradient)"
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
                          {data[0].value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy + 15}
                          className="text-xs"
                          fill="rgba(255,255,255,0.7)"
                          style={{fontFamily: 'var(--font-space-mono)'}}
                        >
                          Articles
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
      <div className="p-3 pt-2 items-center">
        <div className="mt-1.5 flex items-center justify-center">
          <h4 className="text-white text-sm bg-orange-400/20 p-2 px-3 border border-orange-400 rounded-xl font-semibold truncate" style={{fontFamily: 'var(--font-space-mono)'}}>
            {category}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default ResearchProgressRadialChart;