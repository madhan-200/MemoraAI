/**
 * Custom hook for managing chat state and interactions
 */
import { useState, useEffect, useCallback } from 'react';
import { sendMessage } from '../services/api';

export const useChat = (userId = 'default_user') => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_${userId}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error('Failed to load messages:', e);
            }
        }
    }, [userId]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_${userId}`, JSON.stringify(messages));
        }
    }, [messages, userId]);

    const addMessage = useCallback((role, content, metadata = {}) => {
        const newMessage = {
            id: Date.now(),
            role,
            content,
            timestamp: new Date().toISOString(),
            ...metadata,
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    }, []);

    const sendChatMessage = useCallback(async (message, memoryEnabled = true) => {
        setError(null);
        setIsLoading(true);

        // Add user message
        addMessage('user', message);

        try {
            // Send to backend
            const response = await sendMessage(message, userId, memoryEnabled);

            // Add assistant response
            addMessage('assistant', response.response, {
                memories_used: response.memories_used || [],
            });

            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to send message';
            setError(errorMessage);
            addMessage('system', `Error: ${errorMessage}`);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId, addMessage]);

    const clearMessages = useCallback(() => {
        console.log('Clearing messages...');
        setMessages([]);
        localStorage.removeItem(`chat_${userId}`);
    }, [userId]);

    return {
        messages,
        isLoading,
        error,
        sendMessage: sendChatMessage,
        clearMessages,
    };
};
