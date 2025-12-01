/**
 * Input panel with text and voice input
 */
import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

export const InputPanel = ({ onSendMessage, isLoading, memoryEnabled, onToggleMemory }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleVoiceTranscript = (transcript) => {
        setMessage(transcript);
    };

    return (
        <div className="glass-effect p-4 rounded-t-2xl border-t border-white/10">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
                <div className="flex-1">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Type your message..."
                        className="input-field w-full resize-none min-h-[50px] max-h-[150px]"
                        rows={1}
                        disabled={isLoading}
                    />

                    <div className="flex items-center gap-2 mt-2">
                        <label className="flex items-center gap-2 text-sm text-dark-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={memoryEnabled}
                                onChange={(e) => onToggleMemory(e.target.checked)}
                                className="w-4 h-4 rounded accent-primary-500"
                            />
                            <span>Enable Memory</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <VoiceInput
                        onTranscript={handleVoiceTranscript}
                        disabled={isLoading}
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
