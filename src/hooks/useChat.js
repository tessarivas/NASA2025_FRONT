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
            
            const botMsg = { 
                text: response.answer || response.message || "Respuesta recibida", 
                sender: "bot", 
                timestamp: new Date() 
            };
            setMessages(prev => [...prev, botMsg]);
            
            const historicalId = localStorage.getItem('historical_id');
            if (!historicalId) {
                const newHistoricalId = await generateHistorical(response.answer || response.message || "Respuesta recibida");
                if (newHistoricalId) {
                    localStorage.setItem('historical_id', newHistoricalId);
                }
            }
            await addToHistorial({'rol': 'User', 'text': userMessage});
            await addToHistorial({'rol': 'System', 'text': botMsg.text});

            
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

    const generateHistorical = async (message) => {
    try {
        // Obtener el usuario desde localStorage
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;

        // Obtener el ID del usuario
        const userId = user?.id;

        if (!userId) {
            console.error('No se encontró el ID del usuario');
            return null;
        }

        // Generar título para el historial
        const titleResponse = await chatApi.generateTitle(message);
        const title = titleResponse.title || titleResponse.message;
        console.log('Generated title:', title);
        console.log('User ID:', userId);

        // Agregar al historial
        const historicalResponse = await chatApi.addToHistorical(title, userId);
        console.log('Historical response:', historicalResponse);

        return (
            historicalResponse._id ||
            historicalResponse.id ||
            historicalResponse.historicalId ||
            historicalResponse.historical_id
        );
    } catch (error) {
        console.error('Error al agregar al historial:', error);
        return null;
    }
};

 const addToHistorial = async (message) => {
    const historicalId = localStorage.getItem('historical_id');
    if (!historicalId) {
        console.error('No se encontró el ID del historial');
        return null;
    }

    try {

        const response = await chatApi.addMessageToHistorial({
            historical_user_id: historicalId,
            rol: message.rol,
            message: message.text
        });
        console.log('Mensaje agregado al historial:', response);
        return response;
    } catch (error) {
        console.error('Error al agregar mensaje al historial:', error);
        return null;
    }
};




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