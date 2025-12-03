import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import axios from 'axios';

export const MemoryPanel = ({ userId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/status`, {
                    params: { user_id: userId }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch memory stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    if (loading) return (
        <div className="glass-panel p-6 rounded-3xl animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
        </div>
    );

    return (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Activity size={18} className="text-secondary-400" />
                    Memory Core
                </h3>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${stats
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${stats ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className={`text-xs font-semibold ${stats ? 'text-green-400' : 'text-red-400'}`}>
                        {stats ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>
        </div>
    );
};
