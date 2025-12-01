/**
 * Chat interface component displaying messages
 */
import { useEffect, useRef } from 'react';
import { Bot, User, Loader2 } from 'lucide-react';

export const ChatInterface = ({ messages, isLoading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="glass-effect p-8 rounded-2xl max-w-md">
                        <Bot size={48} className="mx-auto mb-4 text-primary-400" />
                        <h2 className="text-2xl font-semibold mb-2">Welcome to Memora</h2>
                        <p className="text-dark-300">
                            Your AI assistant with long-term memory. I'll remember our conversations
                            and provide personalized responses based on what I learn about you.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-dark-300">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-sm">Thinking...</span>
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
            <div className="text-center text-sm text-red-400 italic">
                {message.content}
            </div>
        );
    }

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-r from-primary-600 to-primary-500' : 'glass-effect'
                }`}>
                {isUser ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={isUser ? 'message-user' : 'message-assistant'}>
                <p className="whitespace-pre-wrap">{message.content}</p>

                {message.memories_used && message.memories_used.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-xs text-dark-300 mb-1">
                            💭 Used {message.memories_used.length} memories
                        </p>
                    </div>
                )}

                <p className="text-xs text-dark-400 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
};
