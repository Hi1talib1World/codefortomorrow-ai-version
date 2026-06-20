import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Bot, User, Copy, Check, ShieldAlert, Plus, MessageSquare, Trash2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string; // ISO string for serialization
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface AIAssistantScreenProps {
  currentUser: {
    name: string;
    role?: string;
  };
}

const STORAGE_KEY = 'cft_ai_chat_history';

const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const loadSessions = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
};

const saveSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch { /* ignore */ }
};

/** Derive a short title from the first user message */
const deriveTitleFromMessages = (msgs: Message[]): string => {
  const firstUserMsg = msgs.find(m => m.sender === 'user');
  if (!firstUserMsg) return 'New Chat';
  const text = firstUserMsg.text.trim();
  return text.length > 40 ? text.slice(0, 40) + '…' : text;
};

const CodeBlock = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children).replace(/\n$/, '');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (match) {
    return (
      <div className="relative my-4 rounded-xl overflow-hidden border border-slate-700/40 bg-slate-950/80 font-mono text-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">{match[1]}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto text-slate-200 text-left">
          <code>{children}</code>
        </pre>
      </div>
    );
  }

  return <code className="bg-slate-900/60 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-xs">{children}</code>;
};

const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ currentUser }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || null;
  const messages = activeSession?.messages || [];

  // Check AI status on mount
  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const status = await api.getAIStatus();
        setIsSimulation(status.isSimulation);
      } catch (e) {
        console.error('Failed to fetch AI status:', e);
      }
    };
    checkAIStatus();
  }, []);

  // Auto-select the most recent session or create one on first load
  useEffect(() => {
    if (sessions.length === 0) {
      handleNewChat();
    } else if (!activeSessionId || !sessions.find(s => s.id === activeSessionId)) {
      setActiveSessionId(sessions[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleNewChat = useCallback(() => {
    const welcomeMsg: Message = {
      text: `Hi ${currentUser.name}!  I'm your C4T AI Coding Assistant. Ask me anything about coding, algorithms, debugging, or programming concepts. How can I help you learn today?`,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [welcomeMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setInput('');
  }, [currentUser.name]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        if (updated.length > 0) {
          setActiveSessionId(updated[0].id);
        } else {
          // Will trigger new chat creation via the useEffect
          setActiveSessionId(null);
        }
      }
      return updated;
    });
  }, [activeSessionId]);

  const updateActiveSession = useCallback((updater: (session: ChatSession) => ChatSession) => {
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? updater(s) : s))
    );
  }, [activeSessionId]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading || !activeSessionId) return;

    if (!textToSend) setInput('');

    const userMsg: Message = { text, sender: 'user', timestamp: new Date().toISOString() };

    // Add user message and update title if it's the first user message
    updateActiveSession(session => {
      const newMessages = [...session.messages, userMsg];
      const hasUserMsg = session.messages.some(m => m.sender === 'user');
      return {
        ...session,
        messages: newMessages,
        title: hasUserMsg ? session.title : deriveTitleFromMessages(newMessages),
        updatedAt: new Date().toISOString(),
      };
    });

    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const res = await api.chatWithAssistant(text, chatHistory);
      const aiMsg: Message = { text: res.text, sender: 'ai', timestamp: new Date().toISOString() };

      updateActiveSession(session => ({
        ...session,
        messages: [...session.messages, aiMsg],
        updatedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.error('AI Assistant Error:', err);
      const errorMsg: Message = {
        text: "Oops, I encountered a connection error. Please try asking again!",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      updateActiveSession(session => ({
        ...session,
        messages: [...session.messages, errorMsg],
        updatedAt: new Date().toISOString(),
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const suggestedPrompts = [
    { label: 'Explain recursion ', text: 'Explain the concept of recursion with an example.' },
    { label: 'Python loops ', text: 'How do loops work in Python? Give me a simple code snippet.' },
    { label: 'Java debugging ', text: 'I am getting a NullPointerException in Java. How do I debug it?' },
    { label: 'How to build games ', text: 'What are the basic steps to build a 2D game in code?' },
  ];

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative transition-colors duration-300">

      {/* ─── Sidebar: Chat History ─── */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Sidebar header */}
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {sessions.length === 0 && (
            <p className="text-center text-slate-400 dark:text-slate-600 text-xs font-semibold mt-6">No conversations yet</p>
          )}
          {sessions.map(session => (
            <button
              key={session.id}
              type="button"
              onClick={() => setActiveSessionId(session.id)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all group flex items-start gap-2.5 cursor-pointer ${
                session.id === activeSessionId
                  ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'hover:bg-white/60 dark:hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                session.id === activeSessionId ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-600'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  session.id === activeSessionId ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {session.title}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(session.updatedAt)}
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  {session.messages.filter(m => m.sender === 'user').length} msgs
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer flex-shrink-0"
                title="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Main Chat Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Banner */}
        <div className="px-4 md:px-6 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between select-none flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Toggle sidebar button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title={sidebarOpen ? 'Hide history' : 'Show history'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">AI Coding Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isSimulation ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500 animate-ping'}`} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {isSimulation ? 'Simulation Mode' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          {isSimulation && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Set GEMINI_API_KEY in .env</span>
            </div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6 scrollbar-thin dark:scrollbar-thumb-slate-700">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-cyan-400'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div>
                <div className={`p-4 rounded-3xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.sender === 'ai' ? (
                    <div className="prose dark:prose-invert max-w-none text-left leading-relaxed text-sm">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: CodeBlock as any,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-left leading-relaxed whitespace-pre-line">{msg.text}</p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block px-1 text-left select-none">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-cyan-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm flex items-center justify-center">
                <div className="flex items-center space-x-1 px-2 py-0.5">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested chips (only for fresh chats) */}
        {messages.length === 1 && (
          <div className="px-4 md:px-6 py-2 flex flex-wrap gap-2 justify-center select-none flex-shrink-0">
            {suggestedPrompts.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(chip.text)}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="px-4 md:px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 flex-shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your coding question here..."
            className="flex-grow px-5 py-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-medium text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:shadow-none cursor-pointer focus:outline-none"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantScreen;
