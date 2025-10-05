import { useChat } from "@/hooks/useChat";
import { useEffect, useRef } from "react";
import GradientText from '../GradientText';
import { Send, Sparkles, Rocket } from 'lucide-react';

export default function RecChat({ onResponse, initialMessage }) {
  const {
    messages,
    currentText,
    setCurrentText,
    sendMessage,
    loading,
    articles,
    resetChat,
  } = useChat();
  
  const hasInitialMessageSent = useRef(false);
  const messagesEndRef = useRef(null);

  // Send initial message if provided (only once)
  useEffect(() => {
    if (initialMessage && initialMessage.trim() && !hasInitialMessageSent.current) {
      hasInitialMessageSent.current = true;
      sendMessage(initialMessage.trim());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  // Listen for new chat events
  useEffect(() => {
    const handleNewChat = () => {
      resetChat();
      hasInitialMessageSent.current = false;
    };

    window.addEventListener('newChatStarted', handleNewChat);
    
    return () => {
      window.removeEventListener('newChatStarted', handleNewChat);
    };
  }, [resetChat]);

  // Auto-scroll cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Interceptar respuestas para pasar datos al Dashboard
  useEffect(() => {
    if (onResponse) {
      // Buscar el último mensaje que tenga rawData
      const lastMessageWithData = messages
        .slice()
        .reverse()
        .find(msg => msg.rawData?.relationship_graph);
      
      if (lastMessageWithData?.rawData?.relationship_graph) {
        console.log("📤 RecChat - Pasando datos al Dashboard:", lastMessageWithData.rawData);
        onResponse(lastMessageWithData.rawData);
      }
    }
  }, [messages, onResponse]);

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
    <div className="h-full w-full relative rounded-lg border border-white/20 bg-navy-blue/20 backdrop-blur-xs shadow-xl overflow-hidden">
      {/* Header - Posición absoluta top */}
      <div className="absolute top-0 left-0 right-0 h-16 p-4 border-b border-white/20 bg-navy-blue/20 backdrop-blur-xs z-10">
        <div className="text-2xl text-center" style={{ fontFamily: "var(--font-zen-dots)" }}>
          <GradientText
            colors={["#E26B40", "#FF7A33", "#FF4F11", "#D63A12", "#A6210A"]}
            animationSpeed={4.5}
            showBorder={false}
          >
            Bioscience Research
          </GradientText>
        </div>
      </div>

      {/* Messages Section - Con scroll personalizado */}
      <div className="absolute top-16 left-0 right-0 bottom-48 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 chat-scroll">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="mb-4">
                <Rocket size={48} className="text-royal-blue mx-auto" />
              </div>
              <p 
                className="text-royal-blue font-bold max-w-md leading-relaxed"
                style={{ fontFamily: 'var(--font-space-mono)' }}
              >
                Start exploring NASA's space bioscience research. Ask about microorganisms, plant growth in space, or any scientific topic.
              </p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-royal-blue text-white"
                        : message.isError
                        ? "bg-hot-pink text-white"
                        : "bg-gray text-white backdrop-blur-sm"
                    }`}
                  >
                    <p 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      {message.text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp?.toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Artículos específicos del mensaje (si los hay) */}
                  {message.sender === "system" && message.articles && message.articles.length > 0 && (
                    <div className="mt-3 max-w-xs lg:max-w-md">
                      <div className="bg-royal-blue/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3">
                        <h4 
                          className="text-sm font-semibold mb-2 text-blue-200 flex items-center gap-2"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          <Sparkles size={14} />
                          Related Articles ({message.articles.length})
                        </h4>
                        
                        <div className="space-y-2">
                          {message.articles.slice(0, 3).map((article, articleIndex) => (
                            <div
                              key={articleIndex}
                              className="bg-white/10 border border-white/20 rounded-lg p-2 hover:bg-white/15 transition-all duration-200"
                            >
                              <h5 
                                className="text-blue-200 hover:text-blue-100 transition-colors text-xs font-medium leading-tight block"
                                style={{ fontFamily: 'var(--font-space-mono)' }}
                              >
                                {article.title}
                              </h5>
                              
                              {(article.year || article.authors) && (
                                <div className="flex items-center justify-between text-xs text-white/60 mt-1">
                                  {article.year && <span>{article.year}</span>}
                                  {article.authors && article.authors.length > 0 && (
                                    <span className="truncate ml-2" title={article.authors.join(', ')}>
                                      {article.authors[0]}{article.authors.length > 1 ? ' et al.' : ''}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {message.articles.length > 3 && (
                            <div className="text-center">
                              <span className="text-xs text-blue-300">
                                +{message.articles.length - 3} more articles
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MOSTRAR ARTÍCULOS GLOBALES - Para debugging */}
                  {message.sender === "system" && !message.articles && articles && articles.length > 0 && (
                    <div className="mt-3 max-w-xs lg:max-w-md">
                      <div className="bg-royal-blue/80 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3">
                        <h4 
                          className="text-sm font-semibold mb-2 text-blue-200 flex items-center gap-2"
                          style={{ fontFamily: 'var(--font-space-mono)' }}
                        >
                          <Sparkles size={14} />
                          Related Articles ({articles.length})
                        </h4>
                        
                        <div className="space-y-2">
                          {articles.slice(0, 3).map((article, articleIndex) => (
                            <div
                              key={articleIndex}
                              className="bg-white/10 border border-white/20 rounded-lg p-2 hover:bg-white/15 transition-all duration-200"
                            >
                              <h5 
                                className="text-blue-200 hover:text-blue-100 transition-colors text-xs font-medium leading-tight block"
                                style={{ fontFamily: 'var(--font-space-mono)' }}
                              >
                                {article.title}
                              </h5>
                              
                              {(article.year || article.authors) && (
                                <div className="flex items-center justify-between text-xs text-white/60 mt-1">
                                  {article.year && <span>{article.year}</span>}
                                  {article.authors && article.authors.length > 0 && (
                                    <span className="truncate ml-2" title={article.authors.join(', ')}>
                                      {article.authors[0]}{article.authors.length > 1 ? ' et al.' : ''}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {articles.length > 3 && (
                            <div className="text-center">
                              <span className="text-xs text-blue-300">
                                +{articles.length - 3} more articles
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="text-left">
                  <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                    <p 
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-space-mono)' }}
                    >
                      Analyzing research... 
                      <span className="animate-pulse">✨</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Referencia para auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Section - Posición absoluta bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 p-6 border-t border-white/20 bg-gradient-to-t from-navy-blue/30 to-transparent backdrop-blur-xs z-10">
        <div className="flex flex-col gap-3 h-full justify-center">
          {/* Título del input */}
          <div className="text-center">
            <p 
              className="text-white/80 text-sm"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              What would you like to explore today?
            </p>
          </div>

          {/* Input container */}
          <div className="relative">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-white/50 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-base"
                  style={{ fontFamily: 'var(--font-space-mono)' }}
                  placeholder="Ask about space biology, microorganisms, plant research..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

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
                  <Send size={28} className="group-hover:animate-pulse transition-transform cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p 
              className="text-white/50 text-xs"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              Powered by NASA's space bioscience research database
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
