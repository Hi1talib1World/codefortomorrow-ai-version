import React, { useEffect, useMemo, useState } from 'react';
import AgentPanel, { AgentLogEntry, AgentState } from './AgentPanel';
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
    const source = new EventSource('/api/agents/stream');

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm shadow-slate-100 backdrop-blur">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">AI Agent Monitoring</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Agents Dashboard</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Monitor Student Analytics, Curriculum Factory, and B2B Sales in real time. Trigger commands, review live logs, and watch status changes without refreshing.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {AGENT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {streamError && (
        <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
          {streamError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {agents.map((agent) => (
          <AgentPanel key={agent.id} agent={agent} logs={logsByAgent[agent.id] || []} onCommand={handleCommand} />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">How it works</p>
        <ul className="mt-3 space-y-2 pl-4 list-disc">
          <li>Initial state and history are loaded from the backend via REST.</li>
          <li>Live reports stream over Server-Sent Events from <code>/api/agents/stream</code>.</li>
          <li>Manual commands are posted to <code>/api/agents/:agentId/command</code>.</li>
        </ul>
      </div>
    </div>
  );
};

export default AgentsPage;
