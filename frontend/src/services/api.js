/**
 * API service for communicating with the backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Send a chat message
 */
export const sendMessage = async (message, userId = 'default_user', memoryEnabled = true) => {
    const response = await api.post('/chat', {
        message,
        user_id: userId,
        memory_enabled: memoryEnabled,
    });
    return response.data;
};

/**
 * Explicitly store a memory
 */
export const rememberInfo = async (key, value, userId = 'default_user', metadata = null) => {
    const response = await api.post('/remember', {
        key,
        value,
        user_id: userId,
        metadata,
    });
    return response.data;
};

/**
 * Recall memories based on query
 */
export const recallMemories = async (query, userId = 'default_user', limit = 5) => {
    const response = await api.post('/recall', {
        query,
        user_id: userId,
        limit,
    });
    return response.data;
};

/**
 * Get system status
 */
export const getStatus = async (userId = 'default_user') => {
    const response = await api.get('/status', {
        params: { user_id: userId },
    });
    return response.data;
};

export default api;
