import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";
import GradientText from "../GradientText";
import { Send, Sparkles, Rocket } from "lucide-react";
import { on } from "events";

export default function RecChat({ onResponse = () => {} }) {
  // ← SOLO AGREGAR ESTA PROP
  const {
    messages,
    currentText,
    setCurrentText,
    sendMessage,
    loading,
    articles,
    relationshipGraph,
  } = useChat();

  useEffect(() => {
    if (relationshipGraph) {
      onResponse({ relationship_graph: relationshipGraph });
    }
  }, [relationshipGraph, onResponse]); // ← dependencias correctas

  const handleChat = async () => {
    if (currentText.trim()) {
      console.log("💬 RecChat - Enviando mensaje:", currentText);

      sendMessage(currentText);
      setCurrentText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleChat();
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl">
      {/* Header con estilo Welcome */}
      <div className="p-4 border-b border-white/20">
        <div
          className="text-2xl text-center"
          style={{ fontFamily: "Zen Dots" }}
        >
          <GradientText
            colors={["#E26B40", "#FF7A33", "#FF4F11", "#D63A12", "#A6210A"]}
            animationSpeed={4.5}
            showBorder={false}
          >
            Bioscience Research
          </GradientText>
        </div>
      </div>

      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto h-full">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center mix-blend-color-burn">
            <div className="mb-4">
              <Rocket size={48} className="text-(--royal-blue) mx-auto" />
            </div>
            <p
              className="text-(--royal-blue) font-bold max-w-md leading-relaxed"
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              Start exploring NASA's space bioscience research. Ask about
              microorganisms, plant growth in space, or any scientific topic.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 ${
                message.sender === "User" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "User"
                    ? "bg-(--royal-blue) text-white"
                    : message.isError
                    ? "bg-(--hot-pink) text-white"
                    : "bg-(--gray) text-white backdrop-blur-sm"
                }`}
              >
                <p
                  className="text-sm"
                  style={{ fontFamily: "Space Mono, monospace" }}
                >
                  {message.text}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp?.toLocaleTimeString()}
                </p>
              </div>

              {message.sender === "System"
                ? articles.map((article, idx) => (
                    <div
                      key={idx}
                      className="mt-2 bg-(--royal-blue) backdrop-blur-sm p-3 rounded-lg inline-block text-left max-w-xs lg:max-w-md border border-blue-500/30"
                    >
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ fontFamily: "Space Mono, monospace" }}
                      >
                        Related Articles:
                      </h4>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-200 hover:text-blue-100 transition-colors"
                        style={{ fontFamily: "Space Mono, monospace" }}
                      >
                        {article.title}
                      </a>
                    </div>
                  ))
                : null}
            </div>
          ))
        )}
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <p
                className="text-sm"
                style={{ fontFamily: "Space Mono, monospace" }}
              >
                Analyzing research...
                <span className="animate-pulse">✨</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Section con estilo Welcome */}
      <div className="p-6 border-t border-white/20 bg-gradient-to-t from-navy-blue/30 to-transparent">
        <div className="flex flex-col gap-3">
          {/* Título del input */}
          <div className="text-center">
            <p
              className="text-white/80 text-sm"
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              What would you like to explore today?
            </p>
          </div>

          {/* Input container con diseño elegante */}
          <div className="relative">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/50 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-base"
                  style={{ fontFamily: "Space Mono, monospace" }}
                  placeholder="Ask about space biology, microorganisms, plant research..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />

                {/* Indicador de focus */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Botón send elegante */}
              <button
                onClick={handleChat}
                disabled={loading || !currentText.trim()}
                className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
              >
                {loading ? (
                  <div className="animate-spin">
                    <Sparkles size={28} />
                  </div>
                ) : (
                  <Send
                    size={28}
                    className="group-hover:animate-pulse transition-transform cursor-pointer"
                  />
                )}
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div className="text-center">
            <p
              className="text-white/50 text-xs"
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              Powered by NASA's space bioscience research database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
