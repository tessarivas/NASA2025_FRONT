import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/services/api";

export function useChat() {
    const queryClient = useQueryClient();
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
            // Get user info from localStorage
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            const userId = user?.id;

            if (!userId) {
                throw new Error('No user found');
            }

            // Get existing historical_id from localStorage (if any)
            const existingHistoricalId = localStorage.getItem('historical_id');

            // Send message using the new unified API
            const response = await chatApi.chats(userMessage, userId, existingHistoricalId);
            
            console.log('Chat response:', response);
            setResponseChat(response);

            if (response.success) {
                // Add bot response to messages
                const botMsg = { 
                    text: response.response.answer, 
                    sender: "bot", 
                    timestamp: new Date() 
                };
                setMessages(prev => [...prev, botMsg]);

                // Update localStorage with historical_id (for new chats or existing ones)
                if (response.historical_id) {
                    localStorage.setItem('historical_id', response.historical_id);
                    
                    // Invalidate history query to refresh the sidebar
                    queryClient.invalidateQueries({ queryKey: ['userHistory'] });
                }
            } else {
                // Handle error response
                const errorMsg = { 
                    text: response.error || "Error processing message", 
                    sender: "bot", 
                    timestamp: new Date(),
                    isError: true 
                };
                setMessages(prev => [...prev, errorMsg]);
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message
            const errorMsg = { 
                text: "Error sending message", 
                sender: "bot", 
                timestamp: new Date(),
                isError: true 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const resetChat = () => {
        setMessages([]);
        setResponseChat(null);
        setCurrentText("");
        // Invalidate history query to refresh the sidebar when starting a new chat
        queryClient.invalidateQueries({ queryKey: ['userHistory'] });
    };

    return {
        messages,
        setMessages,
        loading,
        sendMessage,
        responseChat,
        currentText,
        setCurrentText,
        resetChat
    };
}