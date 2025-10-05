import React, { createContext, useContext, useMemo } from "react";
import { useChat } from "@/hooks/useChat";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chat = useChat();
  
  // Memoizar el contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    messages: chat.messages,
    loading: chat.loading,
    articles: chat.articles,
    relationshipGraph: chat.relationshipGraph,
    sendMessage: chat.sendMessage,
    resetChat: chat.resetChat,
    getMessagesHistorical: chat.getMessagesHistorical,
    setMessages: chat.setMessages,
    responseChat: chat.responseChat,
  }), [
    chat.messages,
    chat.loading,
    chat.articles,
    chat.relationshipGraph,
    chat.sendMessage,
    chat.resetChat,
    chat.getMessagesHistorical,
    chat.setMessages,
    chat.responseChat,
  ]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext debe usarse dentro de un <ChatProvider>");
  }
  return context;
}
