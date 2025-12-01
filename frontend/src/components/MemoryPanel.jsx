/**
 * Memory panel showing statistics and active memories
 */
import { useEffect } from 'react';
import { Brain, Database, Clock } from 'lucide-react';
import { useMemory } from '../hooks/useMemory';

export const MemoryPanel = ({ userId }) => {
    const { memoryStats, fetchStatus } = useMemory(userId);

    useEffect(() => {
        fetchStatus();
        // Refresh stats every 30 seconds
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, [fetchStatus]);

    if (!memoryStats) {
        return null;
    }

    return (
        <div className="glass-effect p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="text-primary-400" size={20} />
                <h3 className="font-semibold">Memory Status</h3>
            </div>

            <div className="space-y-3">
                <StatItem
                    icon={<Database size={16} />}
                    label="Total Memories"
                    value={memoryStats.memory_count || 0}
                />

                <StatItem
                    icon={<Clock size={16} />}
                    label="Last Update"
                    value={
                        memoryStats.last_update
                            ? new Date(memoryStats.last_update).toLocaleString()
                            : 'Never'
                    }
                />

                <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${memoryStats.storage_status === 'operational'
                            ? 'bg-green-400 animate-pulse'
                            : 'bg-red-400'
                            }`} />
                        <span className="text-dark-300">
                            {memoryStats.storage_status === 'operational' ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dark-300 text-sm">
            {icon}
            <span>{label}</span>
        </div>
        <span className="font-semibold text-primary-400">{value}</span>
    </div>
);
