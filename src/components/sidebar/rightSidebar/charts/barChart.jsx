import { Tag } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { useChatContext } from "@/context/ChatContext";


// Función para procesar tags más populares
function processTagsData(articles) {
  if (!articles || articles.length === 0) {
    return [
      { tag: "Microgravity", count: 45 },
      { tag: "Biology", count: 258 },
      { tag: "Radiation", count: 92 },
      { tag: "Plants", count: 78 },
      { tag: "Materials", count: 94 },
      { tag: "Human", count: 121 },
    ];
  }

  // Contar tags
  const tagCounts = {};

  articles.forEach((article) => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach((tag) => {
        const cleanTag = tag.trim();
        // Capitalizar primera letra
        const displayTag =
          cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1).toLowerCase();
        tagCounts[displayTag] = (tagCounts[displayTag] || 0) + 1;
      });
    }
  });

  console.log("🏷️ Tags más populares:", tagCounts);

  // Obtener top 6 tags
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([tag, count]) => ({
      tag: tag.length > 10 ? tag.substring(0, 10) + "..." : tag,
      count,
    }));

  return topTags.length > 0 ? topTags : [{ tag: "No tags", count: 0 }];
}

export function ResearchersBarChart() {
  const { articles } = useChatContext();
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const data = processTagsData(articles);
    setChartData(data);
  }, [articles]);
  const totalTags = chartData.reduce((sum, item) => sum + item.count, 0);
  const mostPopular = chartData[0] || { tag: "N/A", count: 0 };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-navy-blue/20 to-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-2">
        <h3
          className="text-sm font-bold text-white mb-1"
          style={{ fontFamily: "var(--font-zen-dots)" }}
        >
          Popular Topics
        </h3>
        <p
          className="text-white/70 text-xs"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {articles.length > 0
            ? `Most researched topics (${totalTags} tags)`
            : "Sample research topics"}
        </p>
      </div>

      {/* Chart Container */}
      <div className="flex-1 px-3 py-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="tagGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B8EB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00B8EB" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="tag"
              tick={{ fill: "white", fontSize: 9 }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis hide />
            <Bar
              dataKey="count"
              fill="url(#tagGradient)"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="p-3 pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-3 w-3 text-(--blue)" />
          <span className="text-xs font-medium text-white">
            {totalTags} total research tags
          </span>
        </div>
        <div
          className="text-white/60 text-xs"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          Trending: {mostPopular.tag} ({mostPopular.count} mentions)
        </div>
      </div>
    </div>
  );
}

export default ResearchersBarChart;
