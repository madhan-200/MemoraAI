/**
 * Input panel with text and voice input
 */
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Brain, Sparkles } from 'lucide-react';
import { VoiceInput } from './VoiceInput';

export const InputPanel = ({ onSendMessage, isLoading, memoryEnabled, onToggleMemory }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    return (
        <form onSubmit={handleSubmit} className="relative z-20">
            <div className={`
                relative flex items-end gap-2 p-2 rounded-3xl transition-all duration-300
                bg-dark-800/80 backdrop-blur-xl border border-white/10 shadow-2xl
                ${isLoading ? 'opacity-80 pointer-events-none' : 'hover:border-primary-500/30 hover:shadow-primary-500/10'}
            `}>
                {/* Memory Toggle */}
                <button
                    type="button"
                    onClick={() => onToggleMemory(!memoryEnabled)}
                    className={`
                        p-3 rounded-2xl transition-all duration-300 flex-shrink-0
                        ${memoryEnabled
                            ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-white/5 text-dark-400 hover:bg-white/10 hover:text-white'}
                    `}
                    title={memoryEnabled ? "Memory Active" : "Memory Paused"}
                >
                    <Brain size={20} className={memoryEnabled ? 'animate-pulse' : ''} />
                </button>

                {/* Text Input */}
                <div className="flex-1 min-w-0 py-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        rows={1}
                        className="w-full bg-transparent text-white placeholder-dark-400 resize-none focus:outline-none max-h-[120px] py-1 px-2 leading-relaxed"
                        style={{ minHeight: '24px' }}
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-1 pb-1">
                    <VoiceInput onTranscript={(text) => setMessage(text)} isLoading={isLoading} />

                    <button
                        type="button"
                        className="p-2 text-dark-400 hover:text-primary-400 transition-colors rounded-xl hover:bg-white/5"
                        title="Enhance prompt (Coming soon)"
                    >
                        <Sparkles size={18} />
                    </button>

                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className={`
                            p-3 rounded-2xl transition-all duration-300 flex-shrink-0 ml-1
                            ${message.trim() && !isLoading
                                ? 'bg-white text-primary-600 shadow-lg hover:scale-105 active:scale-95'
                                : 'bg-white/5 text-dark-500 cursor-not-allowed'}
                        `}
                    >
                        <Send size={20} className={message.trim() && !isLoading ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            {/* Helper Text */}
            <div className="absolute -bottom-6 left-0 right-0 text-center">
                <p className="text-[10px] text-dark-500 font-medium tracking-wide">
                    MEMORA AI • POWERED BY GEMINI 2.0
                </p>
            </div>
        </form>
    );
};
