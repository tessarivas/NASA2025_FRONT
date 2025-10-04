import { useState } from "react";
import { chatApi } from "@/services/api";

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseChat, setResponseChat] = useState(null);
    const [currentText, setCurrentText] = useState("");


    const sendMessage = async (userMessage) => {
        // Add user message immediately
        const userMsg = { text: userMessage, sender: "user", timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);

        setLoading(true);
        try {
            const response = await chatApi.chats(userMessage);
            setResponseChat(response);
            console.log('Respuesta del chat:', response);
            
            // Add bot response to messages
            const botMsg = { 
                text: response.answer || response.message || "Respuesta recibida", 
                sender: "bot", 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, botMsg]);
            
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            // Add error message
            const errorMsg = { 
                text: "Error al enviar el mensaje", 
                sender: "bot", 
                timestamp: new Date(),
                isError: true 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    }

    return {
        messages,
        setMessages,
        loading,
        sendMessage,
        responseChat,
        currentText,
        setCurrentText
    };
}