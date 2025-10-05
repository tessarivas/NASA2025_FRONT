import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";

export default function RecChat({ onResponse }) {
  const { messages, currentText, setCurrentText, sendMessage, loading, lastResponse } =
    useChat();

  // Interceptar la última respuesta del useChat
  useEffect(() => {
    if (lastResponse && lastResponse.relationship_graph) {
      console.log("🎯 RecChat - Interceptando respuesta de useChat:", lastResponse);
      console.log("📤 RecChat - Pasando datos al Dashboard:", lastResponse);
      
      if (onResponse) {
        onResponse(lastResponse);
      }
    }
  }, [lastResponse, onResponse]);

  const handleChat = async () => {
    if (currentText.trim()) {
      console.log("💬 RecChat - Enviando mensaje:", currentText);
      
      // Solo usar el sistema useChat (quitar el fetch duplicado)
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
      <div className="p-4 border-b border-white/20">
        <h2
          className="text-xl font-bold text-white text-center"
          style={{ fontFamily: "var(--font-zen-dots)" }}
        >
          Chat Central
        </h2>
      </div>

      {/* Messages Display */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        {messages.length === 0 ? (
          <p className="text-white/50 text-center">No hay mensajes aún...</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.isError
                    ? "bg-red-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp?.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg">
              <p className="text-sm">Escribiendo...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-white/20 bg-transparent px-4 py-2 text-white placeholder:text-white/50 focus:border-blue-500 focus:outline-none"
            placeholder="Escribe tu mensaje..."
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button
            onClick={handleChat}
            disabled={loading || !currentText.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
