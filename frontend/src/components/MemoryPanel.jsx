import { useState, useEffect } from 'react';
import { Database, HardDrive, Activity, Zap } from 'lucide-react';
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
                <div className="h-8 bg-white/10 rounded"></div>
            </div>
        </div>
    );

    const memoryCount = stats?.total_memories || 0;
    const maxMemories = 100; // Arbitrary limit for visual progress
    const usagePercent = Math.min((memoryCount / maxMemories) * 100, 100);

    return (
        <div className="glass-panel p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database size={64} />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <Activity size={18} className="text-secondary-400" />
                    Memory Core
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900/50 border border-white/5">
                    <div className={`w-2 h-2 rounded-full ${stats ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className="text-xs font-medium text-dark-300">
                        {stats ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* Memory Usage Stat */}
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-dark-300 flex items-center gap-2">
                            <HardDrive size={14} /> Storage
                        </span>
                        <span className="text-white font-mono">{memoryCount} / {maxMemories}</span>
                    </div>
                    <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000 ease-out relative"
                            style={{ width: `${usagePercent}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-primary-500/30 transition-colors">
                        <div className="text-xs text-dark-400 mb-1 flex items-center gap-1">
                            <Zap size={12} /> Latency
                        </div>
                        <div className="text-lg font-bold text-white">
                            ~120<span className="text-xs text-dark-400 font-normal ml-1">ms</span>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/5 hover:border-secondary-500/30 transition-colors">
                        <div className="text-xs text-dark-400 mb-1">Vector Dim</div>
                        <div className="text-lg font-bold text-white">768</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
