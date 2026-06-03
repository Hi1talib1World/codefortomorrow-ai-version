import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Sparkles, Bot, User, Copy, Check, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantScreenProps {
  currentUser: {
    name: string;
    role?: string;
  };
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulation, setIsSimulation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Initial welcome message from AI
    setMessages([
      {
        text: `Hi ${currentUser.name}! 🤖 I'm your C4T AI Coding Assistant. Ask me anything about coding, algorithms, debugging, or programming concepts. How can I help you learn today?`,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, [currentUser.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    if (!textToSend) {
      setInput('');
    }

    const userMsg: Message = { text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

      const res = await api.chatWithAssistant(text, chatHistory);
      const reply = res.text;

      setMessages(prev => [...prev, { text: reply, sender: 'ai', timestamp: new Date() }]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      const errorText = "Oops, I encountered a connection error. Please try asking again!";
      setMessages(prev => [...prev, { text: errorText, sender: 'ai', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const suggestedPrompts = [
    { label: 'Explain recursion 💡', text: 'Explain the concept of recursion with an example.' },
    { label: 'Python loops 🔁', text: 'How do loops work in Python? Give me a simple code snippet.' },
    { label: 'Java debugging 🐛', text: 'I am getting a NullPointerException in Java. How do I debug it?' },
    { label: 'How to build games 🎮', text: 'What are the basic steps to build a 2D game in code?' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative transition-colors duration-300">
      {/* Top Banner status */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
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
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin dark:scrollbar-thumb-slate-700">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-cyan-400'}`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
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
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-slate-700 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4" />
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

      {/* Suggested chips (Only show if messages is just the initial welcome message) */}
      {messages.length === 1 && (
        <div className="px-6 py-2 flex flex-wrap gap-2 justify-center select-none">
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
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3">
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
  );
};

export default AIAssistantScreen;
