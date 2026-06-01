import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { User } from '../../types';
import { PATHS, LESSONS_BY_PATH } from '../../constants';
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
  const { t } = useLanguage();
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
          // First pass: calculate progress for all paths using constants
          const calculatedMissions = PATHS.map((path) => {
            const pathId = path.id;

            // Count total lessons in LESSONS_BY_PATH for this path
            const sections = LESSONS_BY_PATH[pathId] || [];
            let totalLessons = 0;
            sections.forEach((section: any) => {
              totalLessons += section.lessons ? section.lessons.length : 0;
            });

            // Completed lessons count from currentUser
            const completedList = currentUser.progress?.completedLessons?.[pathId];
            const completedCount = Array.isArray(completedList) ? completedList.length : 0;

            // completion ratio
            const completionRatio = totalLessons > 0 ? completedCount / totalLessons : 0.0;

            // proficiency fallback to skillMastery
            const masteryVal = currentUser.progress?.skillMastery?.[pathId];
            const proficiency = masteryVal ? (masteryVal / 100) : 0.0;

            // Formula: progress = (proficiency * 70) + (completion_ratio * 30)
            const calculatedProgress = (proficiency * 70) + (completionRatio * 30);
            const progress = Math.round(Math.max(0, Math.min(100, calculatedProgress)));

            // Prerequisite
            let prerequisiteText: string | null = null;
            if (pathId === 'block_coding' || pathId === 'math') {
              prerequisiteText = null;
            } else if (pathId === 'python' || pathId === 'javascript') {
              prerequisiteText = 'Requires Block Coding progress >= 30%';
            } else if (['web_dev', 'typescript', 'lua'].includes(pathId)) {
              prerequisiteText = 'Requires Javascript progress >= 30%';
            } else {
              prerequisiteText = 'Requires Javascript progress >= 40%';
            }

            return {
              mission_id: pathId,
              title: t(path.titleKey as any) || path.id,
              skill: pathId,
              progress,
              status: 'in-progress' as 'locked' | 'in-progress' | 'completed',
              difficulty: (pathId === 'block_coding' || pathId === 'math') 
                ? 'easy' 
                : (['python', 'javascript', 'web_dev', 'typescript', 'lua', 'sql'].includes(pathId) ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
              telemetry: {
                attempts: 0,
                successes: completedCount,
                failures: 0,
                trend: 'stable' as 'improving' | 'stable' | 'declining',
                confidence: Math.round(proficiency * 100),
                prerequisiteText
              }
            };
          });

          // Second pass: apply lock overrides based on prerequisite progress
          const finalMockMissions = calculatedMissions.map((mission) => {
            let status = mission.progress >= 90 ? 'completed' : 'in-progress';
            
            if (mission.mission_id !== 'block_coding' && mission.mission_id !== 'math') {
              let isLocked = false;
              if (mission.mission_id === 'python' || mission.mission_id === 'javascript') {
                const blockCodingMission = calculatedMissions.find(m => m.mission_id === 'block_coding');
                if (!blockCodingMission || blockCodingMission.progress < 30) {
                  isLocked = true;
                }
              } else if (['web_dev', 'typescript', 'lua'].includes(mission.mission_id)) {
                const jsMission = calculatedMissions.find(m => m.mission_id === 'javascript');
                if (!jsMission || jsMission.progress < 30) {
                  isLocked = true;
                }
              } else {
                // Hard difficulty: requires javascript >= 40%
                const jsMission = calculatedMissions.find(m => m.mission_id === 'javascript');
                if (!jsMission || jsMission.progress < 40) {
                  isLocked = true;
                }
              }

              if (isLocked) {
                status = 'locked';
              }
            }

            return {
              ...mission,
              progress: status === 'locked' ? 0 : mission.progress,
              status
            };
          });

          setMissions(finalMockMissions as Mission[]);
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
      case 'block_coding':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M12 28 C12 24, 16 20, 20 20 H28 C30 20, 32 16, 32 14 C32 12, 34 10, 36 10 C38 10, 40 12, 40 14 C40 16, 42 20, 44 20 H52 C56 20, 60 24, 60 28 V44 C60 48, 56 52, 52 52 H44 C42 52, 40 56, 40 58 C40 60, 38 62, 36 62 C34 62, 32 60, 32 58 C32 56, 30 52, 28 52 H20 C16 52, 12 48, 12 44 Z" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="36" cy="31" r="3" fill="#10b981" />
            <path d="M24 38 H48" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'python':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M30 14 C30 10, 36 10, 40 10 H48 C52 10, 54 12, 54 16 V24 C54 28, 50 30, 46 30 H32 C26 30, 24 32, 24 38 V42 C24 46, 28 50, 32 50 H38" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 50 C34 54, 28 54, 24 54 H16 C12 54, 10 52, 10 48 V40 C10 36, 14 34, 18 34 H32 C38 34, 40 32, 40 26 V22 C40 18, 36 14, 32 14 H26" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="16" r="2.5" fill="#f59e0b" />
            <circle cx="16" cy="48" r="2.5" fill="#3b82f6" />
          </svg>
        );
      case 'javascript':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M12 12 H52 V44 L32 54 L12 44 Z" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 24 C22 20, 26 20, 26 20 M26 28 H22 M22 36 C22 40, 26 40, 26 40" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 24 C42 20, 38 20, 38 20 M38 28 H42 M42 36 C42 40, 38 40, 38 40" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'math':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M16 22 H32 M24 14 V30" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40 22 H52" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 46 H28 M16 50 H28" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="42" r="2.5" fill={strokeColor} />
            <path d="M40 50 L52 38" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="46" r="2.5" fill={strokeColor} />
          </svg>
        );
      case 'web_dev':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <rect x="10" y="14" width="44" height="36" rx="4" stroke={strokeColor} strokeWidth="2.5" />
            <line x1="10" y1="24" x2="54" y2="24" stroke={strokeColor} strokeWidth="2" />
            <circle cx="16" cy="19" r="1.5" fill="#ef4444" />
            <circle cx="22" cy="19" r="1.5" fill="#f59e0b" />
            <circle cx="28" cy="19" r="1.5" fill="#10b981" />
            <path d="M20 32 L15 37 L20 42" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M44 32 L49 37 L44 42" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="35" y1="31" x2="29" y2="43" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'typescript':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M12 12 H52 V44 L32 54 L12 44 Z" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 20 H34 M28 20 V40" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 38 C38 42, 44 42, 44 38 C44 34, 38 35, 38 31 C38 27, 44 27, 44 31" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'lua':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="20" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M32 12 A 10 10 0 0 1 32 52 A 15 15 0 0 0 32 12" fill={strokeColor} opacity="0.3" />
            <circle cx="32" cy="12" r="4.5" fill="#38bdf8" />
            <circle cx="48" cy="32" r="2.5" fill="#f59e0b" />
          </svg>
        );
      case 'c++':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M28 20 C22 20, 16 24, 16 32 C16 40, 22 44, 28 44" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 32 H44 M40 28 V36" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M48 32 H56 M52 28 V36" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'c_sharp':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M28 20 C22 20, 16 24, 16 32 C16 40, 22 44, 28 44" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 26 V42 M44 22 V38 M34 30 H48 M34 36 H48" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'java':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M16 30 C16 42, 20 46, 36 46 C46 46, 48 42, 48 30 H16 Z" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M48 34 C54 34, 54 40, 48 40" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 14 C24 14, 28 10, 26 22" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <path d="M32 14 C32 14, 36 10, 34 22" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <path d="M40 14 C40 14, 44 10, 42 22" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'go':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M10 26 H44 M10 32 H50 M10 38 H42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="24" r="3" fill={strokeColor} />
            <circle cx="50" cy="30" r="3" fill={strokeColor} />
          </svg>
        );
      case 'rust':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="14" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="32" cy="32" r="6" stroke={strokeColor} strokeWidth="2" />
            <path d="M32 10 V14 M32 50 V54 M10 32 H14 M50 32 H54 M16 16 L20 20 M44 44 L48 48 M16 48 L20 44 M44 16 L48 20" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'sql':
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="18" rx="18" ry="6" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M14 18 V30 C14 34, 20 36, 32 36 C44 36, 50 34, 50 30 V18" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M14 30 V42 C14 46, 20 48, 32 48 C44 48, 50 46, 50 42 V30" stroke={strokeColor} strokeWidth="2.5" />
          </svg>
        );
      default:
        // Generic code tag </> fallback
        return (
          <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
            <path d="M22 22 L12 32 L22 42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 22 L52 32 L42 42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="18" x2="28" y2="46" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
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
