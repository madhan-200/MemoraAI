/**
 * Main App component
 */
import { useState } from 'react';
import { Brain, Trash2 } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { InputPanel } from './components/InputPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { useChat } from './hooks/useChat';
import './index.css';

function App() {
  const [userId] = useState('default_user');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const { messages, isLoading, sendMessage, clearMessages } = useChat(userId);

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message, memoryEnabled);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      clearMessages();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-effect border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-2 rounded-lg">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Memora
              </h1>
              <p className="text-xs text-dark-400">AI with Long-Term Memory</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="btn-secondary text-sm flex items-center gap-2"
            title="Clear chat history"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-4 p-4 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-effect rounded-2xl overflow-hidden">
          <ChatInterface messages={messages} isLoading={isLoading} />
          <InputPanel
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            memoryEnabled={memoryEnabled}
            onToggleMemory={setMemoryEnabled}
          />
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-80 space-y-4">
          <MemoryPanel userId={userId} />

          <div className="glass-effect p-4 rounded-2xl">
            <h3 className="font-semibold mb-2 text-sm">About Memora</h3>
            <p className="text-xs text-dark-300 leading-relaxed">
              Memora is an AI assistant that remembers your preferences, goals, and
              conversations. The more you chat, the better it understands you.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
