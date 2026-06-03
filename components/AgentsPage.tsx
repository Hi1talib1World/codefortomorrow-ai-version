import React, { useEffect, useMemo, useState } from 'react';
import AgentPanel, { AgentLogEntry, AgentState } from './AgentPanel';
import ReportFeed, { GlobalAgentLogEntry } from './ReportFeed';
import api from '../services/api';

const AGENT_TABS = [
  { id: 'student-analytics', label: 'Student Analytics' },
  { id: 'curriculum-factory', label: 'Curriculum Factory' },
  { id: 'b2b-sales', label: 'B2B Sales' },
];

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [logsByAgent, setLogsByAgent] = useState<Record<string, AgentLogEntry[]>>({});
  const [activeTab, setActiveTab] = useState<string>('student-analytics');
  const [streamError, setStreamError] = useState<string | null>(null);

  // Centralized operations log aggregator
  const allLogs = useMemo(() => {
    const combined: GlobalAgentLogEntry[] = [];
    Object.entries(logsByAgent).forEach(([agentId, logsList]) => {
      const agent = agents.find((a) => a.id === agentId);
      logsList.forEach((log) => {
        combined.push({
          ...log,
          agentId,
          agentName: agent ? agent.name : agentId,
        });
      });
    });
    return combined
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50);
  }, [logsByAgent, agents]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await api.getAgentDashboard();
        setAgents(data.agents || []);
        setLogsByAgent(data.logs || {});
      } catch (error) {
        console.error('Could not fetch agent dashboard:', error);
      }
    };

    loadDashboard();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const streamUrl = token ? `/api/agents/stream?token=${encodeURIComponent(token)}` : '/api/agents/stream';
    const source = new EventSource(streamUrl);

    source.addEventListener('agentEvent', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data);

        if (payload.eventType === 'snapshot' && Array.isArray(payload.state)) {
          setAgents(payload.state);
        }

        if (payload.eventType === 'status' && Array.isArray(payload.state)) {
          setAgents(payload.state);
        }

        if (payload.eventType === 'log' && payload.agentId && payload.log) {
          setLogsByAgent((current) => {
            const previous = current[payload.agentId] || [];
            return {
              ...current,
              [payload.agentId]: [payload.log, ...previous].slice(0, 50),
            };
          });
        }
      } catch (error) {
        console.error('Error parsing server-sent event:', error);
      }
    });

    source.onerror = (event) => {
      setStreamError('Live agent stream disconnected. Refresh page to reconnect.');
      source.close();
    };

    return () => {
      source.close();
    };
  }, []);

  const handleCommand = async (agentId: string, command: string) => {
    try {
      const result = await api.sendAgentCommand(agentId, command);
      if (result.agent) {
        setAgents((current) => current.map((agent) => agent.id === result.agent.id ? result.agent : agent));
      }
    } catch (error) {
      console.error('Agent command failed:', error);
      throw error;
    }
  };

  const getAgentStatus = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.status;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Banner and Tabs */}
      <div className="mb-8 flex flex-col gap-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm shadow-slate-100/50 dark:shadow-none backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">AI Agent Monitoring</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Agents Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Communicate with Student Analytics, Curriculum Factory, and B2B Sales in real time. Choose an agent below to open their chat room, verify analysis reasoning, and review global operation streams.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-5">
          {AGENT_TABS.map((tab) => {
            const status = getAgentStatus(tab.id);
            const isWorking = status === 'Working';
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-100 dark:shadow-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isWorking && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {streamError && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30 px-6 py-4 text-sm text-rose-700 dark:text-rose-400">
          {streamError}
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Left Column: Active Chat Panel */}
        <div className="lg:col-span-3">
          {agents.length === 0 ? (
            <div className="flex h-[600px] items-center justify-center rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-4 border-brand-600 border-t-transparent animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading agents...</p>
              </div>
            </div>
          ) : (
            agents
              .filter((agent) => agent.id === activeTab)
              .map((agent) => (
                <AgentPanel 
                  key={agent.id} 
                  agent={agent} 
                  logs={logsByAgent[agent.id] || []} 
                  onCommand={handleCommand} 
                />
              ))
          )}
        </div>

        {/* Right column: Global Live Operations Feed */}
        <div className="lg:col-span-1">
          <ReportFeed logs={allLogs} isGlobal />
        </div>
      </div>

      {/* Bottom Information Details */}
      <div className="mt-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 p-6 text-sm text-slate-700 dark:text-slate-400">
        <p className="font-semibold text-slate-900 dark:text-white">Conversational Agents Console</p>
        <ul className="mt-3 space-y-2 pl-4 list-disc">
          <li>Dashboard loads existing records from backend REST services.</li>
          <li>Conversations, thoughts, and telemetry events stream in real-time over EventSource SSE.</li>
          <li>Conversational messages are posted directly to the server's command execution handler.</li>
        </ul>
      </div>
    </div>
  );
};

export default AgentsPage;
