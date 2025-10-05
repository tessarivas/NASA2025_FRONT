import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatApi, historyAPI } from "@/services/api";

export function useChat() {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseChat, setResponseChat] = useState(null);
    const [currentText, setCurrentText] = useState("");
    const [articles, setArticles] = useState([]);
    const [relationshipGraph, setRelationshipGraph] = useState(null);

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
                // Add bot response to messages CON ARTÍCULOS Y RAWDATA
                const botMsg = { 
                    text: response.response.answer, 
                    sender: "system", // ← CAMBIAR DE "bot" A "system"
                    timestamp: new Date(),
                    articles: response.response.related_articles || [], // ← ARTÍCULOS POR MENSAJE
                    rawData: response.response // ← DATOS COMPLETOS PARA GRAFOS
                };
                setMessages(prev => [...prev, botMsg]);

                // MANTENER artículos globales para backward compatibility
                if (response.response.related_articles) {
                    setArticles(response.response.related_articles);
                }

                // Extract and set relationship graph from response
                if (response.response.relationship_graph) {
                    setRelationshipGraph(response.response.relationship_graph);
                }

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
                    sender: "system",
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
                sender: "system",
                timestamp: new Date(),
                isError: true 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const getMessagesHistorical = async (historicalId) => {
        try {
            localStorage.setItem("historical_id", historicalId);
            setMessages([]);
            setArticles([]);
            setRelationshipGraph(null);
            
            const response = await historyAPI.getMessagesFromHistorical(historicalId);
            console.log('Mensajes del historial:', response);
            
            const rawMessages = Array.isArray(response)
                ? response
                : response.messages || response.data || [];

            console.log('Mensajes raw del backend:', rawMessages);

            const formattedMessages = rawMessages.map(({ rol, message }) => {
                console.log(`Mapeando mensaje: rol="${rol}" -> sender="${rol === "User" ? "user" : "bot"}"`);
                return {
                    sender: rol === "User" ? "user" : "bot", // Cambiar a lowercase para consistencia
                    text: message,
                    timestamp: new Date(),
                };
            });

            setMessages(formattedMessages);
            console.log('Mensajes formateados del historial:', formattedMessages);
            
            // Invalidate history query to refresh the sidebar
            queryClient.invalidateQueries({ queryKey: ['userHistory'] });
            
            return formattedMessages;
        } catch (error) {
            console.error('Error al obtener mensajes del historial:', error);
            return [];
        }
    };

    const resetChat = () => {
        setMessages([]);
        setResponseChat(null);
        setCurrentText("");
        setArticles([]);
        setRelationshipGraph(null);
        // Clear historical_id from localStorage when starting a new chat
        localStorage.removeItem('historical_id');
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
        relationshipGraph,
        setRelationshipGraph,
        resetChat,
        articles,
        getMessagesHistorical
    };
}