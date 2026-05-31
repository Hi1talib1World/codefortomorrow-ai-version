import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { User } from '../../types';
import { 
  Lock, 
  Target, 
  ChevronRight, 
  TrendingUp, 
  X, 
  Activity, 
  Award, 
  BookOpen,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface MissionTelemetry {
  attempts: number;
  successes: number;
  failures: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
  prerequisiteText: string | null;
}

interface Mission {
  mission_id: string;
  title: string;
  skill: string;
  progress: number;
  status: 'locked' | 'in-progress' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
  telemetry: MissionTelemetry;
}

interface MissionsScreenProps {
  currentUser: User;
}

const MissionsScreen: React.FC<MissionsScreenProps> = ({ currentUser }) => {
  const { t, currentLanguage } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [pollingActive, setPollingActive] = useState(true);

  // Poll missions endpoint every 5 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchMissions = async () => {
      try {
        const data = await api.getMissions(currentUser._id);
        if (isMounted) {
          setMissions(data);
          setError(null);
          if (loading) setLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to load missions:', err);
        // Fallback mock data in case backend is offline
        if (isMounted) {
          const mockMissions: Mission[] = [
            {
              mission_id: 'variables',
              title: t('variables') || 'Variables',
              skill: 'variables',
              progress: 90,
              status: 'completed',
              difficulty: 'easy',
              telemetry: { attempts: 10, successes: 8, failures: 2, trend: 'improving', confidence: 90, prerequisiteText: null }
            },
            {
              mission_id: 'conditionals',
              title: t('conditionals') || 'Conditionals',
              skill: 'conditionals',
              progress: 79,
              status: 'in-progress',
              difficulty: 'easy',
              telemetry: { attempts: 8, successes: 5, failures: 3, trend: 'stable', confidence: 80, prerequisiteText: null }
            },
            {
              mission_id: 'loops',
              title: t('loops') || 'Loops',
              skill: 'loops',
              progress: 50,
              status: 'in-progress',
              difficulty: 'medium',
              telemetry: { attempts: 7, successes: 3, failures: 4, trend: 'improving', confidence: 60, prerequisiteText: 'Requires Variables progress >= 40%' }
            },
            {
              mission_id: 'arrays',
              title: t('arrays') || 'Arrays',
              skill: 'arrays',
              progress: 17,
              status: 'in-progress',
              difficulty: 'medium',
              telemetry: { attempts: 4, successes: 1, failures: 3, trend: 'stable', confidence: 40, prerequisiteText: 'Requires Variables progress >= 40%' }
            },
            {
              mission_id: 'functions',
              title: t('functions') || 'Functions',
              skill: 'functions',
              progress: 0,
              status: 'in-progress',
              difficulty: 'hard',
              telemetry: { attempts: 0, successes: 0, failures: 0, trend: 'stable', confidence: 0, prerequisiteText: 'Requires Loops progress >= 50%' }
            },
            {
              mission_id: 'objects',
              title: t('objects') || 'Objects',
              skill: 'objects',
              progress: 0,
              status: 'locked',
              difficulty: 'hard',
              telemetry: { attempts: 0, successes: 0, failures: 0, trend: 'stable', confidence: 0, prerequisiteText: 'Requires Loops progress >= 50%' }
            }
          ];
          setMissions(mockMissions);
          if (loading) setLoading(false);
        }
      }
    };

    fetchMissions();

    const interval = setInterval(() => {
      if (pollingActive) {
        fetchMissions();
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser._id, pollingActive, loading]);

  // SVG Concept illustrations rendering
  const renderConceptArt = (skillId: string, status: string) => {
    const isLocked = status === 'locked';
    const strokeColor = isLocked ? '#64748b' : '#38bdf8'; // slate vs cyan

    switch (skillId) {
      case 'variables':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <rect x="16" y="20" width="32" height="24" rx="4" stroke={strokeColor} strokeWidth="2.5" className="animate-pulse" />
            <line x1="24" y1="32" x2="40" y2="32" stroke={strokeColor} strokeWidth="3" />
            <circle cx="20" cy="32" r="3" fill="#10b981" />
            <circle cx="44" cy="32" r="3" fill="#f59e0b" />
          </svg>
        );
      case 'conditionals':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M32 12 L50 30 L32 48 L14 30 Z" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="32" cy="30" r="4" fill="#38bdf8" />
            <path d="M32 34 L32 44" stroke="#e11d48" strokeWidth="2" strokeDasharray="2,2" />
            <path d="M36 30 L46 30" stroke="#10b981" strokeWidth="2" strokeDasharray="2,2" />
          </svg>
        );
      case 'loops':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="18" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="80" strokeDashoffset="10" className="animate-spin-slow" />
            <path d="M46 26 L48 32 L42 34" stroke={strokeColor} strokeWidth="2" fill="none" />
            <circle cx="32" cy="32" r="6" fill="#f59e0b" />
          </svg>
        );
      case 'arrays':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <rect x="10" y="24" width="12" height="16" rx="2" stroke={strokeColor} strokeWidth="2" />
            <rect x="26" y="24" width="12" height="16" rx="2" stroke={strokeColor} strokeWidth="2" />
            <rect x="42" y="24" width="12" height="16" rx="2" stroke={strokeColor} strokeWidth="2" />
            <line x1="22" y1="32" x2="26" y2="32" stroke={strokeColor} strokeWidth="2" />
            <line x1="38" y1="32" x2="42" y2="32" stroke={strokeColor} strokeWidth="2" />
          </svg>
        );
      case 'functions':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <rect x="20" y="16" width="24" height="32" rx="4" stroke={strokeColor} strokeWidth="2" />
            <circle cx="32" cy="32" r="5" stroke={strokeColor} strokeWidth="2.5" className="animate-spin-slow" />
            <line x1="12" y1="24" x2="20" y2="24" stroke={strokeColor} strokeWidth="2" />
            <line x1="44" y1="40" x2="52" y2="40" stroke={strokeColor} strokeWidth="2" />
          </svg>
        );
      case 'objects':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M32 12 L50 22 L50 42 L32 52 L14 42 L14 22 Z" stroke={strokeColor} strokeWidth="2" />
            <line x1="32" y1="12" x2="32" y2="32" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="14" y1="22" x2="32" y2="32" stroke={strokeColor} strokeWidth="1.5" />
            <line x1="50" y1="22" x2="32" y2="32" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="32" cy="32" r="4" fill="#a855f7" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="20" stroke={strokeColor} strokeWidth="2" />
          </svg>
        );
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{t('easy') || 'Easy'}</span>;
      case 'medium':
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{t('medium') || 'Medium'}</span>;
      case 'hard':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{t('hard') || 'Hard'}</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return (
          <span className="flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-700/50 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" /> {t('locked') || 'Locked'}
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
            <Activity className="w-3.5 h-3.5" /> {t('in_progress') || 'In Progress'}
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" /> {t('completed') || 'Completed'}
          </span>
        );
      default:
        return null;
    }
  };

  const completedCount = missions.filter(m => m.status === 'completed').length;
  const xpGained = missions.reduce((sum, m) => sum + (m.progress * 2), 0); // Mock score XP

  if (loading && missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold animate-pulse">Initializing Missions Map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* HUD Telemetry Header */}
      <div className="relative overflow-hidden backdrop-blur-md bg-slate-900/40 dark:bg-slate-950/30 border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
              <Target className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white">{t('missions') || 'Missions Dashboard'}</h2>
              <p className="text-xs text-slate-400 font-medium">{t('missions_desc') || 'Complete quests and master coding skills to achieve badges!'}</p>
            </div>
          </div>
        </div>

        {/* HUD Statistics */}
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          <div className="px-5 py-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
            <span className="text-2xl font-black text-emerald-400">{completedCount} <span className="text-xs text-slate-500">/ {missions.length}</span></span>
          </div>

          <div className="px-5 py-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col items-center min-w-[90px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Missions XP</span>
            <span className="text-2xl font-black text-amber-400 flex items-center gap-1">⭐ {xpGained}</span>
          </div>

          {/* Live Sync Status indicator */}
          <button 
            onClick={() => setPollingActive(!pollingActive)}
            className="px-4 py-3.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 group"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pollingActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${pollingActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              {pollingActive ? 'Live Polling' : 'Paused'}
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 transition-transform ${pollingActive ? 'animate-spin-slow' : 'group-hover:rotate-45'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map((mission) => {
          const isLocked = mission.status === 'locked';
          const isCompleted = mission.status === 'completed';

          return (
            <div
              key={mission.mission_id}
              onClick={() => {
                if (!isLocked) {
                  setSelectedMission(mission);
                }
              }}
              className={`relative overflow-hidden group backdrop-blur-md bg-slate-900/40 dark:bg-slate-950/20 border rounded-3xl p-6 transition-all duration-300 ${
                isLocked 
                  ? 'border-slate-800 opacity-60' 
                  : 'border-slate-700/50 hover:border-cyan-500/50 cursor-pointer shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1'
              }`}
            >
              {/* Card visual elements */}
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl border transition-all ${
                  isLocked 
                    ? 'bg-slate-950/40 border-slate-800' 
                    : isCompleted 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                }`}>
                  {renderConceptArt(mission.skill, mission.status)}
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {getStatusBadge(mission.status)}
                  {getDifficultyBadge(mission.difficulty)}
                </div>
              </div>

              {/* Title & info */}
              <div className="space-y-1.5 mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  {mission.title}
                  {!isLocked && <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors group-hover:translate-x-0.5" />}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {isLocked 
                    ? mission.telemetry.prerequisiteText || 'Prerequisite locked.'
                    : `Learn and master ${mission.title} concepts in code editor.`}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold tracking-wide">
                  <span className="text-slate-400 uppercase">Progress</span>
                  <span className={isCompleted ? 'text-emerald-400' : 'text-cyan-400'}>{mission.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-[2px] border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                        : 'bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                    }`}
                    style={{ width: `${isLocked ? 0 : mission.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Lock overlay for locked state */}
              {isLocked && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
                  <div className="p-3 bg-slate-900 border border-slate-700 rounded-full mb-2.5 shadow-lg">
                    <Lock className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Locked</h4>
                  <p className="text-[11px] text-slate-400 font-medium px-4">
                    {mission.telemetry.prerequisiteText || 'Clear previous path levels to unlock.'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative overflow-hidden bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Corner highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full border-b border-l border-cyan-500/20 pointer-events-none"></div>

            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                  {renderConceptArt(selectedMission.skill, selectedMission.status)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedMission.title} Stats</h3>
                  <div className="flex gap-2 mt-1">
                    {getStatusBadge(selectedMission.status)}
                    {getDifficultyBadge(selectedMission.difficulty)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMission(null)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center min-h-[75px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Attempts</span>
                <span className="text-2xl font-black text-white font-mono">{selectedMission.telemetry.attempts}</span>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center min-h-[75px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Success / Failures</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {selectedMission.telemetry.successes} <span className="text-xs text-slate-500">/</span> <span className="text-rose-400">{selectedMission.telemetry.failures}</span>
                </span>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center min-h-[75px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Proficiency Score</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{selectedMission.progress}%</span>
              </div>

              <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center min-h-[75px]">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Concept Trend</span>
                <span className="text-lg font-black text-white flex items-center gap-1.5 uppercase font-mono">
                  {selectedMission.telemetry.trend === 'improving' ? 'Improving 📈' : selectedMission.telemetry.trend === 'declining' ? 'Declining 📉' : 'Stable ➡️'}
                </span>
              </div>
            </div>

            {/* AI Diagnostics Advice */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-2xl p-4 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-black text-cyan-300 uppercase tracking-wide">AI Code Doctor Advice</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {selectedMission.progress >= 90 
                  ? `Incredible mastery! You have unlocked deep understanding of ${selectedMission.title}. Continue onto complex tasks.` 
                  : selectedMission.progress > 0 
                    ? `We noticed some compiler bugs with ${selectedMission.title}. Try breaking nested blocks into clear components and using console logs to print variables.` 
                    : `Ready to start! Begin study by opening the learning path roadmap and launching the starter code tutorial.`}
              </p>
            </div>

            {/* Resume button */}
            <button
              onClick={() => {
                setSelectedMission(null);
                // Redirect user to roadmap
                window.location.href = `/dashboard/learn`;
              }}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 border border-cyan-400/30 text-white font-black uppercase text-sm tracking-wider rounded-2xl cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Start Learning {selectedMission.title}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionsScreen;
