import { useState, useEffect } from 'react';
import { HardDrive, Activity } from 'lucide-react';
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
            <div className="space-y-3">
                <div className="h-8 bg-white/10 rounded"></div>
            </div>
        </div>
    );

    const memoryCount = stats?.memory_count || 0;
    const maxMemories = 100; // Arbitrary limit for visual progress
    const usagePercent = Math.min((memoryCount / maxMemories) * 100, 100);

    return (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
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

            <div className="space-y-4">
                {/* Memory Usage Stat */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted flex items-center gap-2">
                            <HardDrive size={14} /> Memories Stored
                        </span>
                        <span className="text-foreground font-mono font-semibold">{memoryCount} / {maxMemories}</span>
                    </div>
                    <div className="h-2.5 bg-dark-900/50 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${usagePercent}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
