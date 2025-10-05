import React, { createContext, useContext } from "react";
import { useChat } from "@/hooks/useChat";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chat = useChat(); // <-- toda tu lógica del hook
  return (
    <ChatContext.Provider value={chat}>
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
