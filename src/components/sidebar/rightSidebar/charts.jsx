import { useState } from "react";
import { ChevronDown, BarChart3, TrendingUp, Users } from "lucide-react";
import SpaceResearchChart from "../rightSidebar/charts/areaChart.jsx";
import PostsRadialChart from "../rightSidebar/charts/radialChart.jsx";
import ResearchersBarChart from "../rightSidebar/charts/barChart.jsx";

const chartOptions = [
  {
    id: "publications",
    name: "Publications",
    icon: TrendingUp,
    component: SpaceResearchChart,
  },
  {
    id: "posts",
    name: "Research Focus",
    icon: BarChart3,
    component: PostsRadialChart,
  },
  {
    id: "researchers",
    name: "Popular Topics",
    icon: Users,
    component: ResearchersBarChart,
  },
];

export function ChartSelector({ articlesData }) {
  const [selectedChart, setSelectedChart] = useState(chartOptions[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log("📊 ChartSelector - articlesData:", articlesData);
  const SelectedComponent = selectedChart.component;
  const SelectedIcon = selectedChart.icon;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header con dropdown */}
      <div className="relative mb-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/20 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <SelectedIcon size={16} className="text-orange-400" />
            <span
              className="text-sm font-medium text-white"
              style={{ fontFamily: "var(--font-zen-dots)" }}
            >
              {selectedChart.name}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-white/70 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-10 overflow-hidden">
            {chartOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedChart(option);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 text-left hover:bg-white/10 transition-colors cursor-pointer ${
                    selectedChart.id === option.id ? "bg-white/5" : ""
                  }`}
                >
                  <IconComponent size={14} className="text-orange-400" />
                  <span
                    className="text-sm text-white"
                    style={{ fontFamily: "var(--font-space-mono)" }}
                  >
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-0">
        <SelectedComponent articles={articlesData} />
      </div>
    </div>
  );
}

export default ChartSelector;
