/**
 * Chat interface component displaying messages
 */
import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

export const ChatInterface = ({ messages, isLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in-up">
                    <div className="glass-panel p-8 md:p-12 rounded-3xl max-w-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5 animate-float">
                                <div className="w-full h-full bg-dark-900 rounded-2xl flex items-center justify-center">
                                    <Bot size={40} className="text-primary-400" />
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#f1f5f9' }}>
                                Hello, I'm <span className="text-gradient">Memora</span>
                            </h2>

                            <p className="text-lg leading-relaxed mb-8" style={{ color: '#cbd5e1' }}>
                                I'm your personal AI companion with long-term memory.
                                I learn from our conversations to serve you better.
                            </p>

                            <div className="flex flex-wrap justify-center gap-3">
                                {['What can you remember?', 'Who am I?', 'Tell me a joke'].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        className="glass-button px-4 py-2 rounded-xl text-sm cursor-pointer hover:scale-105 transition-transform"
                                        style={{ color: '#e2e8f0' }}
                                    >
                                        "{suggestion}"
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
                        <div className="flex items-center gap-3 ml-4 animate-pulse" style={{ color: '#94a3b8' }}>
                            <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                                <Bot size={16} className="text-primary-400" />
                            </div>
                            <span className="text-sm font-medium">Thinking...</span>
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

    if (isSystem) {
        return (
            <div className="text-center text-sm text-red-400 italic my-4 bg-red-500/10 py-2 rounded-lg">
                {message.content}
            </div>
        );
    }

    return (
        <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''} group relative`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-lg ${isUser
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
                    : 'glass-panel text-primary-400'
                }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={isUser ? 'message-user' : 'message-assistant'}>
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                {message.memories_used && message.memories_used.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
                        <p className="text-xs text-secondary-300 font-medium">
                            Recalled {message.memories_used.length} memories
                        </p>
                    </div>
                )}

                <p className={`text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 ${isUser ? 'right-0' : 'left-0'} whitespace-nowrap`} style={{ color: '#94a3b8' }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};
