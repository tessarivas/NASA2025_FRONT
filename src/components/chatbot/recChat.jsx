import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";

export default function RecChat() {
  const {
    messages,
    currentText,
    setCurrentText,
    sendMessage,
    loading,
    articles,
  } = useChat();


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
          // Toma el array de mensajses y lo muestra
          messages.map((message, index) => (
            //Aqui valida si el mensaje fue enviado por el usuario o por el sistema
            //Alinea a la derecha si es del usuario, a la izquierda si es del sistema
            <div
              key={index}
              className={`mb-3 ${
                message.sender === "user" ? "text-right" : "text-left" //
              }`}
            >
              {/* Elige el estilo del mensaje, azul para usuario y gris para sistema y rojo para error*/}
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : message.isError
                    ? "bg-red-600 text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                {/* Muestra el mensaje en cuestión */}
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp?.toLocaleTimeString()}
                </p>
              </div>

              {/* Muestra los artículos relacionados si existen */}
              {articles.map((article, idx) => (
                <div
                  key={idx}
                  className="mt-2 bg-blue-700 p-3 rounded-lg inline-block text-left max-w-xs lg:max-w-md"
                >
                  <h4 className="text-sm font-semibold mb-1">
                    Artículos relacionados:
                  </h4>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {article.title}
                  </a>
                </div>
              ))}
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
