/**
 * Custom hook for memory operations
 */
import { useState, useCallback } from 'react';
import { getStatus, recallMemories, rememberInfo } from '../services/api';

export const useMemory = (userId = 'default_user') => {
    const [memoryStats, setMemoryStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const status = await getStatus(userId);
            setMemoryStats(status);
            return status;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to fetch status';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const recall = useCallback(async (query, limit = 5) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await recallMemories(query, userId, limit);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to recall memories';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const remember = useCallback(async (key, value, metadata = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await rememberInfo(key, value, userId, metadata);
            // Refresh stats after storing memory
            await fetchStatus();
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to store memory';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [userId, fetchStatus]);

    return {
        memoryStats,
        isLoading,
        error,
        fetchStatus,
        recall,
        remember,
    };
};
