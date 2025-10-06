import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatApi, historyAPI } from "@/services/api";

export function useChat() {
    const queryClient = useQueryClient();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [responseChat, setResponseChat] = useState(null);
    const [articles, setArticles] = useState([]);
    const [relationshipGraph, setRelationshipGraph] = useState(null);
    const [researchGaps, setResearchGaps] = useState([]);

    const sendMessage = useCallback(async (userMessage) => {
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
                const relationshipGraph = response.response?.relationship_graph;
                
                if (relationshipGraph && 
                    relationshipGraph.nodes && 
                    relationshipGraph.links && 
                    relationshipGraph.nodes.length > 0 && 
                    relationshipGraph.links.length > 0) {
                    
                    // Force a new object reference to trigger re-render with deep copy
                    setRelationshipGraph({
                        nodes: [...relationshipGraph.nodes.map(node => ({...node}))],
                        links: [...relationshipGraph.links.map(link => ({...link}))]
                    });
                } else {
                    setRelationshipGraph(null);
                }

                // Extract and set research gaps from RAG response
                if (response.response.research_gaps) {
                    setResearchGaps(response.response.research_gaps);
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
    }, [queryClient]);

    const getMessagesHistorical = useCallback(async (historicalId) => {
        try {
            localStorage.setItem("historical_id", historicalId);
            setMessages([]);
            setArticles([]);
            setRelationshipGraph(null);
            setResearchGaps([]);
            
            const response = await historyAPI.getMessagesFromHistorical(historicalId);
            const rawMessages = Array.isArray(response)
                ? response
                : response.messages || response.data || [];
            const formattedMessages = rawMessages.map((msgData) => {
                const { rol, message, related_articles, relationship_graph } = msgData;
                const formattedMessage = {
                    sender: rol === "User" ? "user" : "system", // Cambiar a "system" para consistencia
                    text: message,
                    timestamp: new Date(),
                };

                // Add articles and rawData for system messages
                if (rol === "System" && related_articles) {
                    formattedMessage.articles = related_articles;
                    formattedMessage.rawData = {
                        answer: message,
                        related_articles,
                        relationship_graph,
                        research_gaps
                    };
                }

                return formattedMessage;
            });

            setMessages(formattedMessages);
            // Set global articles and graph from the last system message
            const lastSystemMessage = formattedMessages
                .filter(msg => msg.sender === "system")
                .pop();

            if (lastSystemMessage) {
                if (lastSystemMessage.articles) {
                    setArticles(lastSystemMessage.articles);
                }
                if (lastSystemMessage.rawData?.relationship_graph) {
                    setRelationshipGraph(lastSystemMessage.rawData.relationship_graph);
                }
                if (lastSystemMessage.rawData?.research_gaps) {
                    setResearchGaps(lastSystemMessage.rawData.research_gaps);
                }
            }
            
            // Invalidate history query to refresh the sidebar
            queryClient.invalidateQueries({ queryKey: ['userHistory'] });
            
            return formattedMessages;
        } catch (error) {
            console.error('Error al obtener mensajes del historial:', error);
            return [];
        }
    }, [queryClient]);

    const resetChat = useCallback(() => {
        setMessages([]);
        setResponseChat(null);
        setArticles([]);
        setRelationshipGraph(null);
        setResearchGaps([]);
        // Clear historical_id from localStorage when starting a new chat
        localStorage.removeItem('historical_id');
        // Invalidate history query to refresh the sidebar when starting a new chat
        queryClient.invalidateQueries({ queryKey: ['userHistory'] });
    }, [queryClient]);

    return {
        messages,
        setMessages,
        loading,
        sendMessage,
        responseChat,
        relationshipGraph,
        researchGaps,
        resetChat,
        articles,
        getMessagesHistorical
    };
}