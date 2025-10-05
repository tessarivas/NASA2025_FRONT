import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { context } from "three/tsl";
import { useChatContext } from "@/context/ChatContext";

// Función para procesar artículos y generar datos REALES del chart
function processArticlesData({ articles }) {
  if (!articles || articles.length === 0) {
    // Datos por defecto si no hay artículos
    return [
      {
        year: "2018",
        microgravity: 45,
        radiation: 32,
        agriculture: 28,
        lifesupport: 21,
        other: 15,
      },
      {
        year: "2019",
        microgravity: 52,
        radiation: 41,
        agriculture: 35,
        lifesupport: 29,
        other: 18,
      },
      {
        year: "2020",
        microgravity: 68,
        radiation: 55,
        agriculture: 48,
        lifesupport: 42,
        other: 25,
      },
      {
        year: "2021",
        microgravity: 89,
        radiation: 73,
        agriculture: 61,
        lifesupport: 58,
        other: 34,
      },
      {
        year: "2022",
        microgravity: 112,
        radiation: 95,
        agriculture: 82,
        lifesupport: 71,
        other: 43,
      },
      {
        year: "2023",
        microgravity: 134,
        radiation: 118,
        agriculture: 105,
        lifesupport: 89,
        other: 55,
      },
      {
        year: "2024",
        microgravity: 156,
        radiation: 142,
        agriculture: 128,
        lifesupport: 114,
        other: 67,
      },
    ];
  }

  // Mapear tags a categorías conocidas
  const tagMapping = {
    microgravity: [
      "microgravity",
      "zero gravity",
      "weightlessness",
      "micro-gravity",
    ],
    radiation: [
      "radiation",
      "cosmic rays",
      "space radiation",
      "solar",
      "ionizing",
    ],
    agriculture: [
      "agriculture",
      "plants",
      "photosynthesis",
      "crops",
      "food",
      "botanical",
    ],
    lifesupport: [
      "life support",
      "oxygen",
      "air",
      "atmosphere",
      "breathing",
      "environmental",
    ],
    biology: [
      "biology",
      "organisms",
      "cells",
      "genetics",
      "dna",
      "molecular",
      "cellular",
    ],
    physiology: ["physiology", "human", "medical", "health", "physiological"],
    materials: ["materials", "crystal", "manufacturing", "processing"],
    astronomy: ["astronomy", "astrophysics", "planetary", "solar system"],
  };

  // Función para categorizar una tag
  function categorizeTag(tag) {
    const lowerTag = tag.toLowerCase().trim();
    for (const [category, keywords] of Object.entries(tagMapping)) {
      if (
        keywords.some(
          (keyword) => lowerTag.includes(keyword) || keyword.includes(lowerTag)
        )
      ) {
        return category;
      }
    }
    return "other";
  }

  // Crear estructura de datos por año y categoría
  const yearCategoryData = {};

  // Procesar cada artículo
  articles.forEach((article) => {
    const year = article.year ? article.year.toString() : null;
    if (!year || year < 2015 || year > 2024) return; // Filtrar años válidos

    if (!yearCategoryData[year]) {
      yearCategoryData[year] = {};
    }

    // Procesar las tags del artículo
    (article.tags || []).forEach((tag) => {
      const category = categorizeTag(tag);
      yearCategoryData[year][category] =
        (yearCategoryData[year][category] || 0) + 1;
    });
  });
  // Obtener rango de años de los datos reales
  const availableYears = Object.keys(yearCategoryData)
    .map((y) => parseInt(y))
    .sort();
  const minYear =
    availableYears.length > 0 ? Math.min(...availableYears) : 2018;
  const maxYear =
    availableYears.length > 0 ? Math.max(...availableYears) : 2024;

  // Generar años completos en el rango
  const allYears = [];
  for (let year = minYear; year <= maxYear; year++) {
    allYears.push(year);
  }

  // Obtener todas las categorías que aparecen
  const allCategories = new Set();
  Object.values(yearCategoryData).forEach((yearData) => {
    Object.keys(yearData).forEach((category) => allCategories.add(category));
  });
  // Crear datos del gráfico
  const chartData = allYears.map((year) => {
    const data = { year: year.toString() };

    // Para cada categoría, obtener el conteo real o 0
    Array.from(allCategories).forEach((category) => {
      data[category] = yearCategoryData[year.toString()]?.[category] || 0;
    });

    return data;
  });

  return chartData;
}

export function SpaceResearchChart() {
  const { articles } = useChatContext();
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const data = processArticlesData({ articles });
    setChartData(data);
  }, [articles]);
  // Obtener las categorías dinámicamente
  const categories = useMemo(() => {
    if (chartData.length === 0) return [];

    const keys = Object.keys(chartData[0]).filter((key) => key !== "year");

    // Ordenar categorías por frecuencia total (mayor a menor)
    const categoryTotals = keys
      .map((category) => {
        const total = chartData.reduce(
          (sum, yearData) => sum + (yearData[category] || 0),
          0
        );
        return { category, total };
      })
      .sort((a, b) => b.total - a.total);

    return categoryTotals.map((item) => item.category);
  }, [chartData]);

  // Colores para las categorías (más variados)
  const categoryColors = {
    microgravity: "#00B8EB",
    radiation: "#FF6B35",
    agriculture: "#00D4AA",
    lifesupport: "#F63564",
    biology: "#9B59B6",
    physiology: "#E74C3C",
    materials: "#F39C12",
    astronomy: "#3498DB",
    other: "#95A5A6",
  };

  // Calcular estadísticas REALES
  const currentYearData = chartData[chartData.length - 1] || {};
  const previousYearData = chartData[chartData.length - 2] || {};

  const currentTotal = Object.keys(currentYearData)
    .filter((key) => key !== "year")
    .reduce((sum, key) => sum + (currentYearData[key] || 0), 0);

  const previousTotal = Object.keys(previousYearData)
    .filter((key) => key !== "year")
    .reduce((sum, key) => sum + (previousYearData[key] || 0), 0);

  const growthPercentage =
    previousTotal > 0
      ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
      : "0";

  // Calcular total de publicaciones
  const totalPublications = chartData.reduce((total, yearData) => {
    return (
      total +
      Object.keys(yearData)
        .filter((key) => key !== "year")
        .reduce((sum, key) => sum + (yearData[key] || 0), 0)
    );
  }, 0);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header compacto */}
      <div className="p-3 pb-0">
        <h3
          className="text-md font-bold text-white"
          style={{ fontFamily: "var(--font-zen-dots)" }}
        >
          Research Publications
        </h3>
        <p
          className="text-white/70 text-xs"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {articles.length > 0
            ? `${articles.length} articles, ${totalPublications} tags analyzed`
            : "Sample data (2018-2024)"}
        </p>
      </div>

      {/* Chart Container - flex-1 para ocupar espacio disponible */}
      <div className="flex-1 px-3 py-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              {categories.map((category) => (
                <linearGradient
                  key={category}
                  id={`fill${category}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={categoryColors[category] || "#95A5A6"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={categoryColors[category] || "#95A5A6"}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "white", fontSize: 10 }}
              tickFormatter={(value) => `'${value.slice(2)}`}
            />

            {categories.reverse().map((category, index) => (
              <Area
                key={category}
                dataKey={category}
                type="monotone"
                fill={`url(#fill${category})`}
                stroke={categoryColors[category] || "#95A5A6"}
                strokeWidth={1}
                stackId="1"
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer compacto */}
      <div className="p-3 pt-0 mt-auto">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-3 w-3 text-green-400" />
          <span className="text-xs font-medium text-white">
            {growthPercentage > 0 ? "+" : ""}
            {growthPercentage}% vs prev year
          </span>
        </div>

        {/* Leyenda dinámica - mostrar solo las más importantes */}
        <div className="grid grid-cols-3 gap-1 text-xs">
          {categories.slice(0, 6).map((category) => (
            <div key={category} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: categoryColors[category] || "#95A5A6",
                }}
              ></div>
              <span className="text-white/80 truncate capitalize">
                {category.replace("lifesupport", "Life Support")}
              </span>
            </div>
          ))}
        </div>

        {/* Mostrar total de categorías si hay más */}
        {categories.length > 6 && (
          <div className="text-center mt-1">
            <span className="text-white/60 text-xs">
              +{categories.length - 6} more categories
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default SpaceResearchChart;
