import React, { useState } from 'react';
import ReportFeed from './ReportFeed';

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
};

interface AgentPanelProps {
  agent: AgentState;
  logs: AgentLogEntry[];
  onCommand: (agentId: string, command: string) => Promise<void>;
}

const statusStyles: Record<AgentStatus, string> = {
  Idle: 'bg-emerald-100 text-emerald-700',
  Working: 'bg-amber-100 text-amber-700',
  Offline: 'bg-slate-100 text-slate-600',
};

const AgentPanel: React.FC<AgentPanelProps> = ({ agent, logs, onCommand }) => {
  const [command, setCommand] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async () => {
    if (!command.trim()) return;
    setIsSending(true);
    try {
      await onCommand(agent.id, command.trim());
      setCommand('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{agent.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{agent.description}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[agent.status]}`}>
          {agent.status}
        </span>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active task</p>
          <p className="mt-2 text-sm text-slate-800">{agent.activeTask || 'No active task'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Processed jobs</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{agent.processedJobs}</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
        <p>Last updated: {new Date(agent.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Run manual job (e.g. refresh model)"
          className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isSending ? 'Sending...' : 'Trigger'}
        </button>
      </div>

      <ReportFeed logs={logs} />
    </section>
  );
};

export default AgentPanel;
