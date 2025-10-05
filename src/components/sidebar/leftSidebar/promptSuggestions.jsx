import { useState } from 'react';
import { Lightbulb, Rocket, Leaf, Zap, Heart, Dna, ChevronDown, ChevronUp, Send } from 'lucide-react';

const PromptSuggestions = ({ onSendPrompt }) => {
  const [isExpanded, setIsExpanded] = useState(true); // ← CAMBIO: empezar con true

  // Sugerencias organizadas por categorías para usuarios no científicos
  const suggestionCategories = [
    {
      id: 'basics',
      title: 'Space Basics',
      icon: Rocket,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/40',
      hoverColor: 'hover:bg-blue-900/60',
      prompts: [
        "What happens to the human body in space?",
        "How do astronauts grow food in space?",
        "Why is gravity important for life?",
        "How does space radiation affect living things?"
      ]
    },
    {
      id: 'plants',
      title: 'Space Plants',
      icon: Leaf,
      color: 'text-green-400',
      bgColor: 'bg-green-900/40',
      hoverColor: 'hover:bg-green-900/60',
      prompts: [
        "Can plants really grow without soil in space?",
        "What vegetables do astronauts eat?",
        "How do plants know which way to grow in zero gravity?",
        "Could we farm on Mars someday?"
      ]
    },
    {
      id: 'health',
      title: 'Space Health',
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-900/40',
      hoverColor: 'hover:bg-red-900/60',
      prompts: [
        "Do astronauts get sick in space?",
        "How do bones and muscles change in zero gravity?",
        "What medicines work differently in space?",
        "How do astronauts exercise in space?"
      ]
    },
    {
      id: 'biology',
      title: 'Space Biology',
      icon: Dna,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/40',
      hoverColor: 'hover:bg-purple-900/60',
      prompts: [
        "Do bacteria behave differently in space?",
        "How do cells divide without gravity?",
        "Can animals reproduce in space?",
        "What happens to DNA in space?"
      ]
    },
    {
      id: 'future',
      title: 'Future in Space',
      icon: Zap,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/40',
      hoverColor: 'hover:bg-yellow-900/60',
      prompts: [
        "Could humans live permanently on Mars?",
        "How would we create oxygen on other planets?",
        "What would space hospitals look like?",
        "Could we 3D print organs in space?"
      ]
    }
  ];

  const handlePromptClick = (prompt) => {
    if (onSendPrompt) {
      onSendPrompt(prompt);
    }
  };

  return (
    <div className="w-full">
      {/* Header Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-14 rounded-xl bg-purple-900/40 backdrop-blur-sm px-3 shadow-md hover:bg-purple-900/60 hover:border-white/30 transition-all duration-300 ease-out cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg mb-3"
      >
        <div className="flex items-center gap-3 pl-4">
          <Lightbulb className="w-5 h-5 text-purple-400 flex-shrink-0 transition-all duration-200" />
          <span 
            className="text-white text-sm font-medium tracking-wide transition-all duration-300 ease-out flex-1 text-left" 
            style={{fontFamily: 'var(--font-space-mono)'}}
          >
            Get Ideas
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {/* Expandable Content - SIN animate-in problemático */}
      {isExpanded && (
        <div className="mb-3 animate-fadeIn">
          {/* Contenedor que se adapta al espacio disponible */}
          <div className="max-h-[28vh] bg-gradient-to-b from-purple-900/20 to-purple-900/5 rounded-xl border border-purple-500/20 backdrop-blur-sm overflow-hidden flex flex-col">
            {/* Content scrolleable - CON SCROLL PERSONALIZADO */}
            <div className="flex-1 overflow-y-auto px-3 py-2 suggestions-scroll">
              <div className="space-y-4">
                {suggestionCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="space-y-2">
                      {/* Category Header */}
                      <div className="flex items-center gap-2 px-2 py-1.5 sticky top-0 bg-gradient-to-r from-purple-900/60 to-purple-900/20 backdrop-blur-md rounded-lg border border-purple-500/30 shadow-sm">
                        <Icon className={`w-4 h-4 ${category.color}`} />
                        <span 
                          className={`text-xs font-semibold ${category.color}`}
                          style={{fontFamily: 'var(--font-zen-dots)'}}
                        >
                          {category.title}
                        </span>
                      </div>

                      {/* Category Prompts */}
                      <div className="space-y-1.5 pl-1">
                        {category.prompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => handlePromptClick(prompt)}
                            className={`w-full text-left p-2 rounded-lg ${category.bgColor} backdrop-blur-sm ${category.hoverColor} transition-all duration-200 group cursor-pointer border border-transparent hover:border-white/20 hover:shadow-md`}
                          >
                            <div className="flex items-center gap-3">
                              <span 
                                className="text-white/80 text-xs leading-relaxed group-hover:text-white transition-colors flex-1"
                                style={{fontFamily: 'var(--font-space-mono)'}}
                              >
                                {prompt}
                              </span>
                              <Send className="w-3.5 h-3.5 text-white/40 group-hover:text-purple-300 transition-all duration-200 opacity-0 group-hover:opacity-100 flex-shrink-0 group-hover:scale-110" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptSuggestions;