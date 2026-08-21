import React, { useEffect, useMemo, useState } from 'react';
import AgentPanel, { AgentLogEntry, AgentState } from './AgentPanel';
import ReportFeed, { GlobalAgentLogEntry } from './ReportFeed';
import api from '../services/api';
import {
  Code2, Brain, Bot, Activity, ShieldCheck, RefreshCw, Send, CheckCircle2,
  Clock, Coins, Flame, UserCheck, AlertTriangle, Sparkles, FileText, Check, Plus
} from 'lucide-react';

const AGENT_TABS = [
  { id: 'curriculum-factory', label: 'Curriculum Factory Agent', icon: Code2, desc: 'Automated lesson creation & localization' },
  { id: 'student-analytics', label: 'Student Analytics Agent', icon: Brain, desc: 'XP velocity & mastery gap analysis' },
  { id: 'b2b-sales', label: 'B2B Sales Agent', icon: Bot, desc: 'School onboarding & human approval workflow' },
];

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [logsByAgent, setLogsByAgent] = useState<Record<string, AgentLogEntry[]>>({});
  const [activeTab, setActiveTab] = useState<string>('curriculum-factory');
  const [streamError, setStreamError] = useState<string | null>(null);

  // Executions & Cost Observability State
  const [executionsSummary, setExecutionsSummary] = useState<{
    totalExecutions: number;
    totalTokens: number;
    totalCostUsd: number;
  }>({ totalExecutions: 0, totalTokens: 0, totalCostUsd: 0 });

  // ── Curriculum Factory Interactive Workbench State ──
  const [curriculumForm, setCurriculumForm] = useState({
    subject: 'Mathematics',
    grade: '6',
    topic: 'Fractions',
    language: 'French',
    learnerLevel: 'beginner' as const,
    durationMinutes: 40
  });
  const [curriculumResult, setCurriculumResult] = useState<any>(null);
  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);

  // ── Student Analytics State ──
  const [analyticsForm, setAnalyticsForm] = useState({
    studentId: '',
    email: '',
    pathId: 'python'
  });
  const [analyticsResult, setAnalyticsResult] = useState<any>(null);
  const [isAnalyzingStudent, setIsAnalyzingStudent] = useState(false);

  // ── B2B Sales & Lead Approval State ──
  const [b2bLeads, setB2bLeads] = useState<any[]>([]);
  const [leadForm, setLeadForm] = useState({
    organizationName: 'Lycée Ibn Zohr Essaouira',
    organizationType: 'school' as const,
    country: 'Morocco',
    city: 'Essaouira',
    contactName: 'Directeur Mohamed Alami',
    contactEmail: 'm.alami@ibnzohr.edu.ma',
    studentCountEstimate: 350
  });
  const [isProcessingLead, setIsProcessingLead] = useState(false);
  const [approvingLeadId, setApprovingLeadId] = useState<string | null>(null);

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

  const loadData = async () => {
    try {
      const dashboard = await api.getAgentDashboard();
      setAgents(dashboard.agents || []);
      setLogsByAgent(dashboard.logs || {});

      const history = await api.getAgentExecutionsHistory();
      if (history.summary) setExecutionsSummary(history.summary);

      const leads = await api.getB2BLeads();
      setB2bLeads(leads || []);
    } catch (error) {
      console.error('Could not fetch agent dashboard data:', error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const streamUrl = token ? `/api/agents/stream?token=${encodeURIComponent(token)}` : '/api/agents/stream';
    const source = new EventSource(streamUrl);

    source.addEventListener('agentEvent', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent).data);

        if ((payload.eventType === 'snapshot' || payload.eventType === 'status') && Array.isArray(payload.state)) {
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
          // Refresh execution history when logs finish
          loadData();
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
      setTimeout(loadData, 1000);
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

  // ── Curriculum Factory Trigger Handler ──
  const handleGenerateCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCurriculum(true);
    setCurriculumResult(null);
    try {
      const res = await api.generateCurriculum(curriculumForm);
      setCurriculumResult(res);
      await loadData();
    } catch (err) {
      alert(`Curriculum Generation Error: ${(err as Error).message}`);
    } finally {
      setIsGeneratingCurriculum(false);
    }
  };

  // ── Student Analytics Trigger Handler ──
  const handleAnalyzeStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzingStudent(true);
    setAnalyticsResult(null);
    try {
      const res = await api.analyzeStudent(analyticsForm);
      setAnalyticsResult(res);
      await loadData();
    } catch (err) {
      alert(`Student Analytics Error: ${(err as Error).message}`);
    } finally {
      setIsAnalyzingStudent(false);
    }
  };

  // ── B2B Lead Process Handler ──
  const handleProcessLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingLead(true);
    try {
      await api.processB2BLead(leadForm);
      await loadData();
    } catch (err) {
      alert(`B2B Lead Processing Error: ${(err as Error).message}`);
    } finally {
      setIsProcessingLead(false);
    }
  };

  // ── Human Approval Handler ──
  const handleApproveLead = async (leadId: string) => {
    setApprovingLeadId(leadId);
    try {
      await api.approveB2BLead(leadId);
      await loadData();
    } catch (err) {
      alert(`Approval Error: ${(err as Error).message}`);
    } finally {
      setApprovingLeadId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* ─── STUNNING ORBITAL AI CORE HERO VISUALIZER ─────────────────────── */}
      <div className="relative w-full rounded-[2.5rem] bg-[#070A12] border border-slate-800/80 shadow-2xl overflow-hidden p-6 sm:p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-900/10 to-transparent pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
            <Activity className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Grid</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            3 Specialized AI Agents
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
            Coordinated EdTech Multi-Agent System with Shared Context, Structured Output Validation, and Human-in-the-Loop Safeguards.
          </p>
        </div>

        {/* ORBITAL CORE GRAPHIC */}
        <div className="relative z-10 w-full max-w-2xl mx-auto h-[340px] sm:h-[400px] flex items-center justify-center">
          <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-slate-700/40 pointer-events-none" />
          <div className="absolute w-[160px] h-[160px] sm:w-[210px] sm:h-[210px] rounded-full border border-slate-800/60 pointer-events-none" />

          <div className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#00D2FF] via-[#008BE3] to-[#8B5CF6] animate-pulse shadow-[0_0_60px_rgba(0,210,255,0.5)] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-100/90 shadow-inner backdrop-blur-md flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-blue-600 animate-ping opacity-75" />
            </div>
          </div>

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
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Curriculum & Lesson Generation</div>
              </div>
            </div>
          </button>

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
                </div>
                <div className="text-[10px] text-slate-400 font-medium">Deterministic DB & AI Recommendations</div>
              </div>
            </div>
          </button>

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
                </div>
                <div className="text-[10px] text-slate-400 font-medium">School Outreach & Human Approval</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ─── COST & OBSERVABILITY DASHBOARD STATS ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Executions</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{executionsSummary.totalExecutions}</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tokens Used</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{executionsSummary.totalTokens.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. AI Cost (Budget $250)</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${executionsSummary.totalCostUsd}</div>
          </div>
        </div>
      </div>

      {/* Top Agent Selector Pills */}
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Multi-Agent Control Hub</p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Active Agent Workbench</h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
          {AGENT_TABS.map((tab) => {
            const Icon = tab.icon;
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
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── INTERACTIVE AGENT WORKBENCHES ─────────────────────────────────── */}

      {/* TAB 1: CURRICULUM FACTORY AGENT WORKBENCH */}
      {activeTab === 'curriculum-factory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm uppercase tracking-wider">
              <Code2 className="w-5 h-5" />
              <span>Curriculum Factory Request Form</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Submit structured curriculum parameters. The agent validates input, generates structured JSON via Zod schema, and returns a verified lesson package.
            </p>

            <form onSubmit={handleGenerateCurriculum} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={curriculumForm.subject}
                    onChange={(e) => setCurriculumForm({ ...curriculumForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Grade Level</label>
                  <input
                    type="text"
                    value={curriculumForm.grade}
                    onChange={(e) => setCurriculumForm({ ...curriculumForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">Topic</label>
                <input
                  type="text"
                  value={curriculumForm.topic}
                  onChange={(e) => setCurriculumForm({ ...curriculumForm, topic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Language</label>
                  <select
                    value={curriculumForm.language}
                    onChange={(e) => setCurriculumForm({ ...curriculumForm, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="French">French (Français)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Learner Level</label>
                  <select
                    value={curriculumForm.learnerLevel}
                    onChange={(e) => setCurriculumForm({ ...curriculumForm, learnerLevel: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingCurriculum}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingCurriculum ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGeneratingCurriculum ? 'Synthesizing Content...' : 'Generate Curriculum Package'}</span>
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zod Validated Output JSON</span>
              {curriculumResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 font-bold">
                  Status: {curriculumResult.status} ({curriculumResult.latencyMs}ms)
                </span>
              )}
            </div>

            {curriculumResult?.data ? (
              <div className="p-4 bg-slate-950 rounded-2xl text-xs font-mono text-cyan-300 max-h-[380px] overflow-y-auto space-y-3 leading-relaxed">
                <h3 className="font-bold text-white text-sm">{curriculumResult.data.title}</h3>
                <div>
                  <span className="text-amber-400 font-bold">Objectives:</span>
                  <ul className="list-disc pl-4 text-slate-300">
                    {curriculumResult.data.learning_objectives?.map((o: string, i: number) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">Explanation:</span>
                  <p className="text-slate-300 leading-normal mt-1">{curriculumResult.data.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs font-medium">
                Click "Generate Curriculum Package" to inspect structured agent output.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT ANALYTICS AGENT WORKBENCH */}
      {activeTab === 'student-analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-extrabold text-sm uppercase tracking-wider">
              <Brain className="w-5 h-5" />
              <span>Student Analytics Inspector</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Analyzes real database metrics (skill mastery map, quiz scores, XP history) and produces AI recommendations without inventing student performance data.
            </p>

            <form onSubmit={handleAnalyzeStudent} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">Student Email (or leave empty for active student)</label>
                <input
                  type="text"
                  placeholder="e.g. sara@student.ma"
                  value={analyticsForm.email}
                  onChange={(e) => setAnalyticsForm({ ...analyticsForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzingStudent}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzingStudent ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                <span>{isAnalyzingStudent ? 'Analyzing Real Data...' : 'Run AI Diagnostic Analysis'}</span>
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Diagnostic Output</span>
              {analyticsResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 font-bold">
                  Confidence: {analyticsResult.data?.confidence || '0.90'}
                </span>
              )}
            </div>

            {analyticsResult?.data ? (
              <div className="p-4 bg-slate-950 rounded-2xl text-xs font-mono text-purple-300 space-y-3 max-h-[380px] overflow-y-auto">
                <h3 className="font-bold text-white text-sm">Student: {analyticsResult.data.student_name}</h3>
                <div>
                  <span className="text-amber-400 font-bold">Skill Mastery Map:</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {Object.entries(analyticsResult.data.mastery || {}).map(([skill, score]: any) => (
                      <div key={skill} className="bg-slate-900 p-2 rounded-lg flex justify-between">
                        <span className="capitalize">{skill}:</span>
                        <span className="text-emerald-400 font-bold">{Math.round(score * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">Knowledge Gaps:</span>
                  <ul className="list-disc pl-4 text-slate-300">
                    {analyticsResult.data.knowledge_gaps?.map((g: string, i: number) => <li key={i}>{g}</li>)}
                  </ul>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">Recommended Next Topic:</span>
                  <p className="text-white font-bold mt-0.5">{analyticsResult.data.recommended_next_topic}</p>
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs font-medium">
                Click "Run AI Diagnostic Analysis" to view student recommendations.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: B2B SALES LEAD CRM & HUMAN APPROVAL WORKBENCH */}
      {activeTab === 'b2b-sales' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
                <Bot className="w-5 h-5" />
                <span>Qualify New School Lead</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Qualifies leads and generates outreach drafts. <strong>Human approval is strictly required</strong> before transmission.
              </p>

              <form onSubmit={handleProcessLead} className="space-y-3 text-xs font-semibold">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">School / Organization</label>
                  <input
                    type="text"
                    value={leadForm.organizationName}
                    onChange={(e) => setLeadForm({ ...leadForm, organizationName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={leadForm.contactEmail}
                    onChange={(e) => setLeadForm({ ...leadForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessingLead}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingLead ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{isProcessingLead ? 'Drafting Proposal...' : 'Qualify Lead & Draft Outreach'}</span>
                </button>
              </form>
            </div>

            {/* Leads & Human Approval List */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Human Approval Queue ({b2bLeads.length})</span>
                <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200">
                  Human-in-the-Loop Safeguard Active
                </span>
              </div>

              <div className="space-y-4 max-h-[460px] overflow-y-auto">
                {b2bLeads.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-12 font-medium">No B2B leads in database yet.</p>
                ) : (
                  b2bLeads.map((lead) => (
                    <div key={lead._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{lead.organizationName}</h4>
                          <p className="text-slate-500">{lead.contactName} ({lead.contactEmail}) • {lead.city}, {lead.country}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${lead.humanApprovalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'}`}>
                          {lead.humanApprovalStatus === 'approved' ? 'Approved' : 'Awaiting Approval'}
                        </span>
                      </div>

                      {lead.outreachDraft && (
                        <div className="p-3 bg-slate-900 rounded-xl text-slate-300 font-mono text-[11px] space-y-1">
                          <div className="font-bold text-amber-400">Subject: {lead.outreachDraft.subject}</div>
                          <p className="text-slate-400 line-clamp-2">{lead.outreachDraft.body}</p>
                        </div>
                      )}

                      {lead.humanApprovalStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproveLead(lead._id)}
                          disabled={approvingLeadId === lead._id}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Authorize & Send Outreach Draft</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Content for Chat & Logs */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        <div className="lg:col-span-3">
          {agents.length === 0 ? (
            <div className="flex h-[350px] items-center justify-center rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Connecting to multi-agent streaming engine...</p>
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

        <div className="lg:col-span-1">
          <ReportFeed logs={allLogs} isGlobal />
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
