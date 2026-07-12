import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User as UserIcon, Lightbulb, Activity, BookOpen, Zap, Cpu, Clock, Terminal, AlertCircle, Play, Pause } from 'lucide-react';

export type AgentStatus = 'Idle' | 'Working' | 'Offline';

export type AgentLogEntry = {
  id: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
};

export type AgentState = {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  activeTask: string | null;
  lastUpdated: string;
  processedJobs: number;
  isPaused: boolean;
};

interface AgentPanelProps {
  agent: AgentState;
  logs: AgentLogEntry[];
  onCommand: (agentId: string, command: string) => Promise<void>;
  onTogglePause: (agentId: string, isPaused: boolean) => Promise<void>;
}

const statusStyles: Record<AgentStatus, string> = {
  Idle: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
  Working: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
  Offline: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800',
};

const agentIconBgStyles: Record<string, string> = {
  'student-analytics': 'bg-indigo-600 dark:bg-indigo-500 shadow-indigo-100 dark:shadow-none',
  'curriculum-factory': 'bg-amber-600 dark:bg-amber-500 shadow-amber-100 dark:shadow-none',
  'b2b-sales': 'bg-emerald-600 dark:bg-emerald-500 shadow-emerald-100 dark:shadow-none',
};

const getAgentIcon = (agentId: string, className = "w-5 h-5") => {
  switch (agentId) {
    case 'student-analytics':
      return <Activity className={className} />;
    case 'curriculum-factory':
      return <BookOpen className={className} />;
    case 'b2b-sales':
      return <Zap className={className} />;
    default:
      return <Bot className={className} />;
  }
};

const AgentPanel: React.FC<AgentPanelProps> = ({ agent, logs, onCommand, onTogglePause }) => {
  const [command, setCommand] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!command.trim() || isSending) return;
    setIsSending(true);
    try {
      await onCommand(agent.id, command.trim());
      setCommand('');
    } finally {
      setIsSending(false);
    }
  };

  const handlePauseClick = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onTogglePause(agent.id, agent.isPaused);
    } finally {
      setIsToggling(false);
    }
  };

  // Scroll to bottom whenever logs or status change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, agent.status]);

  // Sort logs chronologically (oldest to newest)
  const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Parse logs into structured chat messages
  const chatMessages = sortedLogs.map((log) => {
    const userMsgMatch = log.message.match(/^Message received: "(.*)". Processing\.\.\.$/) ||
                         log.message.match(/^Manual trigger received: "(.*)". Initializing sequence\.\.\.$/);
    if (userMsgMatch) {
      return {
        id: log.id,
        type: 'user' as const,
        content: userMsgMatch[1],
        timestamp: log.timestamp,
      };
    }

    if (log.message.startsWith('[Analysis] ')) {
      return {
        id: log.id,
        type: 'thought' as const,
        content: log.message.replace('[Analysis] ', ''),
        timestamp: log.timestamp,
      };
    }

    const isSystem = log.message.startsWith('Initializing:') ||
                     log.message.includes('completed successfully') ||
                     log.message.includes('Initializing sequence') ||
                     log.message.includes('Error processing message:');

    if (isSystem) {
      return {
        id: log.id,
        type: 'system' as const,
        content: log.message,
        timestamp: log.timestamp,
        severity: log.severity,
      };
    }

    return {
      id: log.id,
      type: 'agent' as const,
      content: log.message,
      timestamp: log.timestamp,
    };
  });

  return (
    <section className="flex flex-col h-[650px] rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl shadow-slate-100/50 dark:shadow-none">
      {/* Agent Panel Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${agentIconBgStyles[agent.id] || 'bg-brand-600'}`}>
            {getAgentIcon(agent.id, "w-6 h-6")}
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">{agent.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Pause / Resume button */}
          <button
            onClick={handlePauseClick}
            disabled={isToggling || agent.status === 'Offline'}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
              agent.isPaused
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
            }`}
          >
            {agent.isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {agent.isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[agent.status]}`}>
            {agent.status === 'Working' && (
              <span className="relative flex h-1.5 w-1.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
            )}
            {agent.status}
          </span>
        </div>
      </div>

      {/* Stats Quickbar */}
      <div className="grid grid-cols-2 gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20 px-6 py-2.5">
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 uppercase tracking-wider font-medium">Jobs Run:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{agent.processedJobs}</span>
        </div>
        <div className="flex items-center gap-2 text-xs justify-end">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 uppercase tracking-wider font-medium truncate max-w-[80px]">Active:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]" title={agent.activeTask || 'None'}>
            {agent.activeTask || 'Idle'}
          </span>
        </div>
      </div>

      {/* Chat Conversation Stream */}
      <div className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-900/10 px-6 py-4 space-y-4">
        {/* Execution Paused Alert Banner */}
        {agent.isPaused && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-amber-50/50 border border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/20 px-4 py-3 text-xs text-amber-700 dark:text-amber-400 my-1 shadow-sm">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span><span className="font-bold">Execution Paused</span>: Automated background jobs are suspended.</span>
          </div>
        )}

        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
              <Bot className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start a conversation</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Send a query or trigger a command to begin interacting with the agent.</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            if (msg.type === 'user') {
              return (
                <div key={msg.id} className="flex justify-end items-start gap-3 my-2">
                  <div className="max-w-[80%] flex flex-col items-end">
                    <div className="bg-brand-600 text-white rounded-[1.5rem] rounded-tr-none px-4 py-3 text-sm font-medium shadow-sm shadow-brand-100 dark:shadow-none leading-relaxed">
                      {msg.content}
                    </div>
                    <span className="text-[9px] font-medium text-slate-400 mt-1 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 select-none">
                    <UserIcon className="w-4 h-4" />
                  </div>
                </div>
              );
            }

            if (msg.type === 'thought') {
              return (
                <div key={msg.id} className="flex items-start gap-2 max-w-[85%] text-slate-500 dark:text-slate-400 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl p-3 my-1">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 animate-pulse" />
                  <div className="text-xs font-medium italic">
                    Thinking: {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.type === 'system') {
              const isError = msg.content.includes('Error') || msg.severity === 'error';
              const isSuccess = msg.content.includes('completed successfully') || msg.severity === 'success';
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold border uppercase tracking-wider
                    ${isError 
                      ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30' 
                      : isSuccess
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      : 'bg-slate-100 text-slate-500 border-slate-200/50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-800'
                    }`}
                  >
                    {isError ? <AlertCircle className="w-3 h-3" /> : <Terminal className="w-3 h-3 text-slate-400" />}
                    {msg.content}
                  </span>
                </div>
              );
            }

            // Otherwise msg.type === 'agent'
            return (
              <div key={msg.id} className="flex justify-start items-start gap-3 my-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${agentIconBgStyles[agent.id] || 'bg-brand-600'}`}>
                  {getAgentIcon(agent.id, "w-4 h-4")}
                </div>
                <div className="max-w-[80%] flex flex-col items-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-[1.5rem] rounded-tl-none px-4 py-3 text-sm font-medium shadow-sm leading-relaxed">
                    {msg.content}
                  </div>
                  <span className="text-[9px] font-medium text-slate-400 mt-1 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Live typing indicator bubble when agent is actively thinking */}
        {agent.status === 'Working' && (
          <div className="flex justify-start items-start gap-3 my-2 animate-pulse">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 ${agentIconBgStyles[agent.id] || 'bg-brand-600'}`}>
              {getAgentIcon(agent.id, "w-4 h-4")}
            </div>
            <div className="max-w-[80%] flex flex-col items-start">
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[1.5rem] rounded-tl-none px-4 py-3 text-xs font-semibold shadow-sm">
                <span className="flex items-center gap-2">
                  Formulating analysis
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
        <div className="flex items-center gap-2">
          <input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isSending || agent.status === 'Offline'}
            placeholder={
              agent.status === 'Offline'
                ? "Agent is offline..."
                : agent.status === 'Working'
                ? "Agent is working, please wait..."
                : "Ask this agent a question or run a task..."
            }
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-950 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isSending || !command.trim() || agent.status === 'Offline' || agent.status === 'Working'}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-100 dark:shadow-none transition disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </section>
  );
};

export default AgentPanel;
