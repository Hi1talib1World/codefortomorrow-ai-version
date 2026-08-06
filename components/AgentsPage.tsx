import React, { useEffect, useMemo, useState } from 'react';
import AgentPanel, { AgentLogEntry, AgentState } from './AgentPanel';
import ReportFeed, { GlobalAgentLogEntry } from './ReportFeed';
import api from '../services/api';
import { Code2, Brain, Bot, Activity, ShieldCheck, RefreshCw } from 'lucide-react';

const AGENT_TABS = [
  { id: 'curriculum-factory', label: 'Curriculum Factory Agent', icon: Code2, desc: 'Automated lesson creation & localization' },
  { id: 'student-analytics', label: 'Student Analytics Agent', icon: Brain, desc: 'XP velocity & mastery gap analysis' },
  { id: 'b2b-sales', label: 'B2B Sales Agent', icon: Bot, desc: 'School onboarding & enterprise licensing' },
];

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [logsByAgent, setLogsByAgent] = useState<Record<string, AgentLogEntry[]>>({});
  const [activeTab, setActiveTab] = useState<string>('curriculum-factory');
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

    source.onerror = () => {
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

  const handleTogglePause = async (agentId: string, isCurrentlyPaused: boolean) => {
    try {
      const result = isCurrentlyPaused 
        ? await api.resumeAgent(agentId)
        : await api.pauseAgent(agentId);
      
      if (result.agent) {
        setAgents((current) => current.map((agent) => agent.id === result.agent.id ? result.agent : agent));
      }
    } catch (error) {
      console.error('Agent pause/resume toggle failed:', error);
    }
  };

  const getAgentStatus = (agentId: string) => {
    return agents.find((a) => a.id === agentId)?.status;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* ─── STUNNING ORBITAL AI CORE HERO VISUALIZER ─────────────────────── */}
      <div className="relative w-full rounded-[2.5rem] bg-[#070A12] border border-slate-800/80 shadow-2xl overflow-hidden p-6 sm:p-12 text-white">
        {/* Ambient Radial Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-900/10 to-transparent pointer-events-none" />

        {/* Top Header Title */}
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
            <Activity className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Grid</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            3 Specialized AI Agents
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
            Click any orbiting agent to open its real-time control console, prompt execution pipeline, and telemetry logs.
          </p>
        </div>

        {/* ORBITAL CORE GRAPHIC */}
        <div className="relative z-10 w-full max-w-2xl mx-auto h-[340px] sm:h-[400px] flex items-center justify-center">
          {/* Outer Orbital Line */}
          <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-slate-700/40 pointer-events-none" />
          {/* Inner Orbital Line */}
          <div className="absolute w-[160px] h-[160px] sm:w-[210px] sm:h-[210px] rounded-full border border-slate-800/60 pointer-events-none" />

          {/* Central Glowing Orb Core */}
          <div className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#008BE3] to-[#8B5CF6] animate-pulse shadow-[0_0_60px_rgba(0,210,255,0.5)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-100/90 shadow-inner backdrop-blur-md flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 animate-ping opacity-75" />
            </div>
          </div>

          {/* ── Orbiting Node 1: Curriculum Factory Agent (Top) ── */}
          <button
            type="button"
            onClick={() => setActiveTab('curriculum-factory')}
            className={`absolute -top-1 sm:top-2 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 cursor-pointer group ${activeTab === 'curriculum-factory' ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
          >
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 border backdrop-blur-xl shadow-xl transition-all ${activeTab === 'curriculum-factory' ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-[0_0_25px_rgba(6,182,212,0.4)]' : 'border-slate-700 group-hover:border-slate-500'}`}>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>Curriculum Factory Agent</span>
                  {getAgentStatus('curriculum-factory') === 'Working' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Curriculum & Lesson Generation</div>
              </div>
            </div>
          </button>

          {/* ── Orbiting Node 2: Student Analytics Agent (Bottom Left) ── */}
          <button
            type="button"
            onClick={() => setActiveTab('student-analytics')}
            className={`absolute bottom-2 sm:bottom-6 left-0 sm:left-6 z-30 transition-all duration-300 cursor-pointer group ${activeTab === 'student-analytics' ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
          >
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 border backdrop-blur-xl shadow-xl transition-all ${activeTab === 'student-analytics' ? 'border-purple-400 ring-2 ring-purple-400/30 shadow-[0_0_25px_rgba(168,85,247,0.4)]' : 'border-slate-700 group-hover:border-slate-500'}`}>
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>Student Analytics Agent</span>
                  {getAgentStatus('student-analytics') === 'Working' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">XP Mastery & Retention</div>
              </div>
            </div>
          </button>

          {/* ── Orbiting Node 3: B2B Sales Agent (Bottom Right) ── */}
          <button
            type="button"
            onClick={() => setActiveTab('b2b-sales')}
            className={`absolute bottom-2 sm:bottom-6 right-0 sm:right-6 z-30 transition-all duration-300 cursor-pointer group ${activeTab === 'b2b-sales' ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
          >
            <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0F172A]/90 border backdrop-blur-xl shadow-xl transition-all ${activeTab === 'b2b-sales' ? 'border-emerald-400 ring-2 ring-emerald-400/30 shadow-[0_0_25px_rgba(16,185,129,0.4)]' : 'border-slate-700 group-hover:border-slate-500'}`}>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <span>B2B Sales Agent</span>
                  {getAgentStatus('b2b-sales') === 'Working' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">School Licensing & Outreach</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Top Banner and Agent Selector Pills */}
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Agent Console</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Active Console</h2>
          </div>
          {streamError && (
            <div className="text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-full border border-rose-200">
              {streamError}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {AGENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const status = getAgentStatus(tab.id);
            const isWorking = status === 'Working';
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isWorking && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        {/* Left Column: Active Chat Panel */}
        <div className="lg:col-span-3">
          {agents.length === 0 ? (
            <div className="flex h-[500px] items-center justify-center rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Connecting to agent streaming engine...</p>
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
                  onTogglePause={handleTogglePause}
                />
              ))
          )}
        </div>

        {/* Right column: Global Live Operations Feed */}
        <div className="lg:col-span-1">
          <ReportFeed logs={allLogs} isGlobal />
        </div>
      </div>

      {/* ─── SPECIALIZED AGENT SKILLS CAPABILITIES MATRIX ─────────────────── */}
      <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Autonomous Capabilities</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Specialized Agent Skills Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Each specialized AI agent is equipped with domain-specific skills for offline learning, analytics, and institutional expansion.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 💻 Curriculum Factory Skills */}
          <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/80 dark:border-cyan-900/40 space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Curriculum Factory Skills</span>
            </div>
            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">🎮</span>
                <span><strong>Gamified Challenge Builder:</strong> Generates boss fights, code mazes, and daily streak quests.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">📜</span>
                <span><strong>National Curriculum Mapper:</strong> Aligns modules to Morocco, Tunisian, French, & IB CS standards.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">🧪</span>
                <span><strong>Unit Test Synthesizer:</strong> Generates edge-case test definitions and memory assertion suites.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">🎙️</span>
                <span><strong>Voice & Audio Script Generator:</strong> Crafts Speaking Hub scripts in Moroccan Darija, AR, FR, & EN.</span>
              </li>
            </ul>
          </div>

          {/* 🧠 Student Analytics Skills */}
          <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40 space-y-3">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>Student Analytics Skills</span>
            </div>
            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">📈</span>
                <span><strong>Churn & Retention Predictor:</strong> Forecasts student XP decay curves 30 days in advance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">🎯</span>
                <span><strong>Prerequisite Skill Graph Mapper:</strong> Pinpoints missing prerequisite concept dependencies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">🛡️</span>
                <span><strong>Plagiarism & Anomaly Detector:</strong> Identifies copy-pasted code & abnormal execution speeds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">💬</span>
                <span><strong>Socratic Debug Mentor:</strong> Formulates guided debug clues without spoiling answer code.</span>
              </li>
            </ul>
          </div>

          {/* 🤖 B2B Sales Skills */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Bot className="w-4 h-4" />
              <span>B2B Sales & Onboarding Skills</span>
            </div>
            <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">🏢</span>
                <span><strong>Government Grant & RFP Writer:</strong> Drafts B2G grant tenders and ministry compliance proposals.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">📡</span>
                <span><strong>Offline Hotspot Deployer:</strong> Packages Raspberry Pi / Ollama hotspot bundles for offline classrooms.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">💰</span>
                <span><strong>Tiered License & ROI Calculator:</strong> Computes volume discounts, seat quotas, & ARR projections.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">📊</span>
                <span><strong>Executive Impact Dashboard:</strong> Generates administrative summaries for school stakeholders.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;

