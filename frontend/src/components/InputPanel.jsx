/**
 * Input panel with text and voice input
 */
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Brain, Sparkles } from 'lucide-react';
import axios from 'axios';
import { VoiceInput } from './VoiceInput';

export const InputPanel = ({ onSendMessage, isLoading, memoryEnabled, onToggleMemory }) => {
    const [message, setMessage] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);
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

    const handleEnhancePrompt = async () => {
        if (!message.trim() || isEnhancing || isLoading) return;

        setIsEnhancing(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${apiUrl}/enhance`, {
                prompt: message
            });

            // Replace message with enhanced version
            setMessage(response.data.enhanced);
        } catch (error) {
            console.error('Failed to enhance prompt:', error);
            // Optionally show error to user
        } finally {
            setIsEnhancing(false);
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
                relative flex items-end gap-2 p-2 rounded-[24px] transition-all duration-300
                input-container border border-white/5
                focus-within:border-primary-500/30 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.1)] focus-within:bg-dark-800/90
                ${isLoading ? 'opacity-80 pointer-events-none' : 'hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5'}
            `}>
                {/* Memory Toggle */}
                <button
                    type="button"
                    onClick={() => onToggleMemory(!memoryEnabled)}
                    className={`
                        p-3 rounded-2xl transition-all duration-300 flex-shrink-0 group relative overflow-hidden
                        ${memoryEnabled
                            ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-white/5 text-dark-400 hover:bg-white/10 hover:text-white'}
                    `}
                    title={memoryEnabled ? "Memory Active" : "Memory Paused"}
                >
                    <div className={`absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${memoryEnabled ? 'block' : 'hidden'}`} />
                    <Brain size={20} className={`relative z-10 ${memoryEnabled ? 'animate-pulse' : ''}`} />
                </button>

                {/* Text Input */}
                <div className="flex-1 min-w-0 py-2.5">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        rows={1}
                        className="w-full bg-transparent text-foreground placeholder-muted resize-none focus:outline-none max-h-[120px] py-1 px-3 leading-relaxed text-[15px]"
                        style={{ minHeight: '24px' }}
                    />
                </div>

                {/* Actions Group */}
                <div className="flex items-center gap-1.5">
                    <VoiceInput onTranscript={(text) => setMessage(text)} isLoading={isLoading} />

                    <button
                        type="button"
                        onClick={handleEnhancePrompt}
                        disabled={!message.trim() || isEnhancing || isLoading}
                        className={`p-2.5 transition-colors rounded-xl ${isEnhancing
                            ? 'text-primary-400 bg-primary-500/20 animate-pulse'
                            : 'text-muted hover:text-primary-400 hover:bg-primary-500/10'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={isEnhancing ? "Enhancing..." : "Enhance prompt with AI"}
                    >
                        <Sparkles size={18} />
                    </button>

                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className={`
                            p-3 rounded-2xl transition-all duration-300 flex-shrink-0 ml-1
                            ${message.trim() && !isLoading
                                ? 'bg-white text-primary-600 shadow-lg hover:scale-105 active:scale-95 hover:shadow-white/20'
                                : 'bg-white/5 text-dark-500 cursor-not-allowed'}
                        `}
                    >
                        <Send size={20} className={message.trim() && !isLoading ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            {/* Helper Text */}
            <div className="absolute -bottom-7 left-0 right-0 text-center">
                <p className="text-[10px] text-muted-dark font-medium tracking-widest opacity-50 uppercase">
                    Memora AI • Powered by Gemini 2.0
                </p>
            </div>
        </form>
    );
};
