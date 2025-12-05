/**
 * Main App component
 */
import { useState } from 'react';
import { Brain, Trash2, Menu, X, Settings } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { InputPanel } from './components/InputPanel';
import { MemoryPanel } from './components/MemoryPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { useChat } from './hooks/useChat';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

function App() {
  const [userId] = useState(() => {
    const stored = localStorage.getItem('memora_user_id');
    if (stored) return stored;
    // Generate simple unique ID if crypto.randomUUID not available
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('memora_user_id', newId);
    return newId;
  });
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-dark-950">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[100px] animate-pulse-slow delay-1000 pointer-events-none" />

      {/* Floating Header */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div className="glass-button px-4 py-2 rounded-xl flex items-center gap-3">
            <button
              className="lg:hidden p-1 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-1.5 rounded-lg shadow-lg shadow-primary-500/20">
                <Brain size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-200 to-white">
                Memora
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="glass-button px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-primary-500/20 hover:border-primary-500/30 group"
              title="Appearance Settings"
            >
              <Settings size={16} className="text-dark-300 group-hover:text-primary-400 transition-colors" />
              <span className="hidden sm:inline text-dark-300 group-hover:text-white transition-colors">Settings</span>
            </button>

            <button
              onClick={handleClearChat}
              className="glass-button px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-red-500/20 hover:border-red-500/30 group"
              title="Clear chat history"
            >
              <Trash2 size={16} className="text-dark-300 group-hover:text-red-400 transition-colors" />
              <span className="hidden sm:inline text-dark-300 group-hover:text-red-100 transition-colors">Clear Chat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto flex gap-6 p-4 pt-24 md:pt-28 pb-4 overflow-hidden relative z-10">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col glass-panel rounded-3xl overflow-hidden min-w-0 shadow-2xl shadow-black/50">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSuggestionClick={handleSuggestionClick}
          />
          <InputPanel
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            memoryEnabled={memoryEnabled}
            onToggleMemory={setMemoryEnabled}
          />
        </div>

        {/* Sidebar - Desktop & Mobile Drawer */}
        <div className={`
          fixed inset-0 z-40 bg-dark-950/80 backdrop-blur-md lg:hidden transition-opacity duration-300
          ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `} onClick={() => setIsSidebarOpen(false)} />

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 p-4 lg:p-0
          transform transition-transform duration-300 ease-out lg:transform-none space-y-4
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col gap-4 lg:h-auto">
            <div className="flex items-center justify-between lg:hidden mb-2 px-2">
              <h2 className="font-bold text-lg text-white">Menu</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg text-white">
                <X size={20} />
              </button>
            </div>

            <MemoryPanel userId={userId} />

            <div className="glass-panel p-5 rounded-2xl mt-auto lg:mt-0">
              <h3 className="font-semibold mb-2 text-sm text-foreground flex items-center gap-2">
                <Brain size={14} className="text-primary-400" />
                About Memora
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Your personal AI companion that evolves with you. It remembers your context, preferences, and history to provide a truly personalized experience.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
