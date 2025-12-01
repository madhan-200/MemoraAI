/**
 * Main App component
 */
import { useState } from 'react';
import { Brain, Trash2, Menu, X } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { InputPanel } from './components/InputPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { useChat } from './hooks/useChat';
import './index.css';

function App() {
  const [userId] = useState('default_user');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useChat(userId);

  const handleSendMessage = async (message) => {
    try {
      await sendMessage(message, memoryEnabled);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearChat = () => {
    console.log('Clear button clicked');
    // if (window.confirm('Are you sure you want to clear all messages?')) {
    clearMessages();
    // }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="glass-effect border-b border-white/10 p-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-2 rounded-lg">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                Memora
              </h1>
              <p className="text-xs text-dark-400 hidden sm:block">AI with Long-Term Memory</p>
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
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-4 p-4 overflow-hidden relative">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-effect rounded-2xl overflow-hidden min-w-0">
          <ChatInterface messages={messages} isLoading={isLoading} />
          <InputPanel
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            memoryEnabled={memoryEnabled}
            onToggleMemory={setMemoryEnabled}
          />
        </div>

        {/* Sidebar - Desktop & Mobile Drawer */}
        <div className={`
          fixed inset-0 z-10 bg-dark-900/80 backdrop-blur-sm lg:hidden transition-opacity duration-300
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `} onClick={() => setIsSidebarOpen(false)} />

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-20 w-80 bg-dark-900 lg:bg-transparent p-4 lg:p-0
          transform transition-transform duration-300 ease-in-out lg:transform-none space-y-4
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          border-r border-white/10 lg:border-none
        `}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="font-bold text-lg">Menu</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
              <X size={20} />
            </button>
          </div>

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
