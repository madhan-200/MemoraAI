/**
 * Chat interface component displaying messages
 */
import { useEffect, useRef, useState } from 'react';
import { Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ChatInterface = ({ messages, isLoading, onSuggestionClick }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
                    <div className="glass-panel p-8 md:p-10 rounded-[2rem] max-w-lg relative overflow-hidden group border border-white/10 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5 animate-float shadow-lg shadow-primary-500/20">
                                <div className="w-full h-full bg-background-panel rounded-[22px] flex items-center justify-center backdrop-blur-xl">
                                    <Bot size={40} className="text-primary-400" />
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">
                                Hello, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Memora</span>
                            </h2>

                            <p className="text-lg leading-relaxed mb-8 text-muted max-w-sm mx-auto">
                                Your personal AI companion with long-term memory.
                                I learn from our conversations to serve you better.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {['What can you remember?', 'Who am I?', 'Tell me a joke'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => onSuggestionClick?.(suggestion)}
                                        className="glass-button px-5 py-3 rounded-2xl text-sm font-medium cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-primary-500/10 hover:-translate-y-0.5 transition-all duration-300 text-foreground border border-white/5 bg-white/5 hover:bg-white/10"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-4 ml-2 animate-pulse text-muted">
                            <div className="w-10 h-10 rounded-2xl glass-panel flex items-center justify-center shadow-sm">
                                <Bot size={20} className="text-primary-400" />
                            </div>
                            <span className="text-sm font-medium tracking-wide">Thinking...</span>
                        </div>
                    )}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const [feedback, setFeedback] = useState(null);

    if (isSystem) {
        return (
            <div className="flex justify-center my-6">
                <div className="text-center text-xs font-medium text-red-400 bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-4 ${isUser ? 'flex-row-reverse' : ''} group relative`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 ${isUser
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-primary-500/20'
                : 'glass-panel text-primary-400 border border-white/10'
                }`}>
                {isUser ? <User size={20} /> : <Bot size={20} />}
            </div>

            <div className={`max-w-[80%] md:max-w-[70%] relative ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-5 rounded-3xl shadow-sm relative ${isUser
                        ? 'bg-primary-600/90 text-white rounded-br-none backdrop-blur-sm'
                        : 'glass-panel text-foreground rounded-bl-none border border-white/5'
                    }`}>
                    <p className="whitespace-pre-wrap leading-7 text-[15px]">{message.content}</p>

                    {message.memories_used && message.memories_used.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                            <p className="text-xs text-secondary-300 font-medium tracking-wide">
                                Recalled {message.memories_used.length} memories
                            </p>
                        </div>
                    )}
                </div>

                <div className={`flex items-center gap-3 mt-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[11px] text-muted font-medium opacity-60">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {!isUser && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={() => setFeedback('up')}
                                className={`p-1.5 rounded-lg transition-colors ${feedback === 'up' ? 'text-green-400 bg-green-400/10' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                                title="Helpful"
                            >
                                <ThumbsUp size={14} />
                            </button>
                            <button
                                onClick={() => setFeedback('down')}
                                className={`p-1.5 rounded-lg transition-colors ${feedback === 'down' ? 'text-red-400 bg-red-400/10' : 'text-muted hover:text-foreground hover:bg-white/5'}`}
                                title="Not helpful"
                            >
                                <ThumbsDown size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
