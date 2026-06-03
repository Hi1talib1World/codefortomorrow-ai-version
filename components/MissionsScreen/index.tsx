import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Trophy,
  Filter,
  ArrowRight,
  ShieldAlert,
  Flame,
  User as UserIcon,
  Compass
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

// Maps path IDs to their educational Tier (1-4)
const TIER_MAPPING: { [key: string]: { tier: number; name: string; color: string } } = {
  block_coding: { tier: 1, name: 'Tier 1: Foundations', color: '#10b981' }, // Emerald
  math: { tier: 1, name: 'Tier 1: Foundations', color: '#10b981' },
  python: { tier: 2, name: 'Tier 2: Core Coding', color: '#06b6d4' }, // Cyan
  javascript: { tier: 2, name: 'Tier 2: Core Coding', color: '#06b6d4' },
  sql: { tier: 2, name: 'Tier 2: Core Coding', color: '#06b6d4' },
  web_dev: { tier: 3, name: 'Tier 3: Web & Engine', color: '#a855f7' }, // Purple
  lua: { tier: 3, name: 'Tier 3: Web & Engine', color: '#a855f7' },
  typescript: { tier: 3, name: 'Tier 3: Web & Engine', color: '#a855f7' },
  'c++': { tier: 4, name: 'Tier 4: Advanced Systems', color: '#f43f5e' }, // Rose
  c_sharp: { tier: 4, name: 'Tier 4: Advanced Systems', color: '#f43f5e' },
  java: { tier: 4, name: 'Tier 4: Advanced Systems', color: '#f43f5e' },
  go: { tier: 4, name: 'Tier 4: Advanced Systems', color: '#f43f5e' },
  rust: { tier: 4, name: 'Tier 4: Advanced Systems', color: '#f43f5e' },
};

// Generates flat color themes dynamically for each card
const getCardStyles = (missionId: string, status: string) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const tier = TIER_MAPPING[missionId]?.tier || 2;

  if (isLocked) {
    return {
      cardBg: 'bg-slate-100/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-600',
      textTitle: 'text-slate-450 dark:text-slate-500',
      textDesc: 'text-slate-500 dark:text-slate-600',
      progressBarBg: 'bg-slate-200/50 dark:bg-slate-950 border-slate-350/20 dark:border-slate-850',
      progressFill: 'bg-slate-300 dark:bg-slate-800',
      glowShadow: '',
      iconContainer: 'bg-slate-200/45 dark:bg-slate-800/30 border-slate-300/30 dark:border-slate-700/20 text-slate-400 dark:text-slate-600',
    };
  }

  // Emerald theme for Tier 1
  if (tier === 1) {
    return {
      cardBg: isCompleted 
        ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-500/20 dark:border-emerald-500/30 shadow-sm' 
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-850/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm',
      textTitle: 'text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-black',
      textDesc: 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300',
      progressBarBg: 'bg-slate-100 dark:bg-slate-950 border-slate-200/50 dark:border-slate-900',
      progressFill: 'bg-emerald-500',
      glowShadow: '',
      iconContainer: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450',
    };
  }
  // Cyan theme for Tier 2
  if (tier === 2) {
    return {
      cardBg: isCompleted 
        ? 'bg-cyan-50/20 dark:bg-cyan-950/10 border-cyan-500/20 dark:border-cyan-500/30 shadow-sm' 
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-850/80 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 shadow-sm',
      textTitle: 'text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 font-black',
      textDesc: 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300',
      progressBarBg: 'bg-slate-100 dark:bg-slate-950 border-slate-200/50 dark:border-slate-900',
      progressFill: 'bg-cyan-500',
      glowShadow: '',
      iconContainer: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900/30 text-cyan-600 dark:text-cyan-450',
    };
  }
  // Purple theme for Tier 3
  if (tier === 3) {
    return {
      cardBg: isCompleted 
        ? 'bg-purple-50/20 dark:bg-purple-950/10 border-purple-500/20 dark:border-purple-500/30 shadow-sm' 
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-850/80 hover:border-purple-500/40 dark:hover:border-purple-500/40 shadow-sm',
      textTitle: 'text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 font-black',
      textDesc: 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300',
      progressBarBg: 'bg-slate-100 dark:bg-slate-950 border-slate-200/50 dark:border-slate-900',
      progressFill: 'bg-purple-500',
      glowShadow: '',
      iconContainer: 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/30 text-purple-600 dark:text-purple-450',
    };
  }
  // Rose theme for Tier 4
  return {
    cardBg: isCompleted 
      ? 'bg-rose-50/20 dark:bg-rose-950/10 border-rose-500/20 dark:border-rose-500/30 shadow-sm' 
      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-850/80 hover:border-rose-500/40 dark:hover:border-rose-500/40 shadow-sm',
    textTitle: 'text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 font-black',
    textDesc: 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300',
    progressBarBg: 'bg-slate-100 dark:bg-slate-950 border-slate-200/50 dark:border-slate-900',
    progressFill: 'bg-rose-500',
    glowShadow: '',
    iconContainer: 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-450',
  };
};

const MissionsScreen: React.FC<MissionsScreenProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [pollingActive, setPollingActive] = useState(true);
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'locked' | 'in-progress' | 'completed'>('all');

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
  const renderConceptArt = (skillId: string, status: string, customSizeClass = "w-16 h-16") => {
    const isLocked = status === 'locked';
    const strokeColor = isLocked ? 'rgba(148, 163, 184, 0.4)' : '#38bdf8'; // slate vs cyan

    switch (skillId) {
      case 'block_coding':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="blockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M12 28 C12 24, 16 20, 20 20 H28 C30 20, 32 16, 32 14 C32 12, 34 10, 36 10 C38 10, 40 12, 40 14 C40 16, 42 20, 44 20 H52 C56 20, 60 24, 60 28 V44 C60 48, 56 52, 52 52 H44 C42 52, 40 56, 40 58 C40 60, 38 62, 36 62 C34 62, 32 60, 32 58 C32 56, 30 52, 28 52 H20 C16 52, 12 48, 12 44 Z" fill={isLocked ? 'none' : 'url(#blockGrad)'} stroke={isLocked ? strokeColor : '#10b981'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="36" cy="31" r="3.5" fill={isLocked ? 'none' : '#34d399'} stroke={isLocked ? strokeColor : 'none'} />
            <path d="M24 38 H48" stroke={isLocked ? strokeColor : '#34d399'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'python':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M30 14 C30 10, 36 10, 40 10 H48 C52 10, 54 12, 54 16 V24 C54 28, 50 30, 46 30 H32 C26 30, 24 32, 24 38 V42 C24 46, 28 50, 32 50 H38" stroke={isLocked ? strokeColor : '#3b82f6'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M34 50 C34 54, 28 54, 24 54 H16 C12 54, 10 52, 10 48 V40 C10 36, 14 34, 18 34 H32 C38 34, 40 32, 40 26 V22 C40 18, 36 14, 32 14 H26" stroke={isLocked ? strokeColor : '#ffd43b'} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="48" cy="16" r="2.5" fill={isLocked ? 'none' : '#3b82f6'} stroke={isLocked ? strokeColor : 'none'} />
            <circle cx="16" cy="48" r="2.5" fill={isLocked ? 'none' : '#ffd43b'} stroke={isLocked ? strokeColor : 'none'} />
          </svg>
        );
      case 'javascript':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="jsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#facc15" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d="M12 12 H52 V44 L32 54 L12 44 Z" fill={isLocked ? 'none' : 'url(#jsGrad)'} stroke={isLocked ? strokeColor : '#eab308'} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 24 C22 20, 26 20, 26 20 M26 28 H22 M22 36 C22 40, 26 40, 26 40" stroke={isLocked ? strokeColor : '#facc15'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M42 24 C42 20, 38 20, 38 20 M38 28 H42 M42 36 C42 40, 38 40, 38 40" stroke={isLocked ? strokeColor : '#facc15'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'math':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M16 22 H32 M24 14 V30" stroke={isLocked ? strokeColor : '#10b981'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M40 22 H52" stroke={isLocked ? strokeColor : '#34d399'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 46 H28 M16 50 H28" stroke={isLocked ? strokeColor : '#059669'} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="42" r="2.5" fill={isLocked ? strokeColor : '#10b981'} />
            <path d="M40 50 L52 38" stroke={isLocked ? strokeColor : '#10b981'} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="46" r="2.5" fill={isLocked ? strokeColor : '#10b981'} />
          </svg>
        );
      case 'web_dev':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <rect x="10" y="14" width="44" height="36" rx="4" stroke={isLocked ? strokeColor : '#a855f7'} strokeWidth="2.5" />
            <line x1="10" y1="24" x2="54" y2="24" stroke={isLocked ? strokeColor : '#a855f7'} strokeWidth="2" />
            <circle cx="16" cy="19" r="1.5" fill={isLocked ? strokeColor : '#ef4444'} />
            <circle cx="22" cy="19" r="1.5" fill={isLocked ? strokeColor : '#f59e0b'} />
            <circle cx="28" cy="19" r="1.5" fill={isLocked ? strokeColor : '#10b981'} />
            <path d="M20 32 L15 37 L20 42" stroke={isLocked ? strokeColor : '#c084fc'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M44 32 L49 37 L44 42" stroke={isLocked ? strokeColor : '#c084fc'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="35" y1="31" x2="29" y2="43" stroke={isLocked ? strokeColor : '#c084fc'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'typescript':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M12 12 H52 V44 L32 54 L12 44 Z" stroke={isLocked ? strokeColor : '#2563eb'} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M22 20 H34 M28 20 V40" stroke={isLocked ? strokeColor : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 38 C38 42, 44 42, 44 38 C44 34, 38 35, 38 31 C38 27, 44 27, 44 31" stroke={isLocked ? strokeColor : '#60a5fa'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'lua':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="20" stroke={isLocked ? strokeColor : '#a855f7'} strokeWidth="2.5" />
            <path d="M32 12 A 10 10 0 0 1 32 52 A 15 15 0 0 0 32 12" fill={isLocked ? 'none' : 'rgba(168, 85, 247, 0.25)'} stroke={isLocked ? 'none' : '#d8b4fe'} strokeWidth="1" />
            <circle cx="32" cy="12" r="4.5" fill={isLocked ? strokeColor : '#a855f7'} />
            <circle cx="48" cy="32" r="2.5" fill={isLocked ? strokeColor : '#f59e0b'} />
          </svg>
        );
      case 'c++':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M28 20 C22 20, 16 24, 16 32 C16 40, 22 44, 28 44" stroke={isLocked ? strokeColor : '#f43f5e'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 32 H44 M40 28 V36" stroke={isLocked ? strokeColor : '#fda4af'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M48 32 H56 M52 28 V36" stroke={isLocked ? strokeColor : '#fda4af'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
      case 'c_sharp':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M28 20 C22 20, 16 24, 16 32 C16 40, 22 44, 28 44" stroke={isLocked ? strokeColor : '#f43f5e'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 26 V42 M44 22 V38 M34 30 H48 M34 36 H48" stroke={isLocked ? strokeColor : '#fda4af'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'java':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M16 30 C16 42, 20 46, 36 46 C46 46, 48 42, 48 30 H16 Z" stroke={isLocked ? strokeColor : '#f43f5e'} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M48 34 C54 34, 54 40, 48 40" stroke={isLocked ? strokeColor : '#fda4af'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 14 C24 14, 28 10, 26 22" stroke={isLocked ? strokeColor : '#f43f5e'} strokeWidth="2" strokeLinecap="round" />
            <path d="M32 14 C32 14, 36 10, 34 22" stroke={isLocked ? strokeColor : '#fb7185'} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'go':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M10 26 H44 M10 32 H50 M10 38 H42" stroke={isLocked ? strokeColor : '#06b6d4'} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="44" cy="24" r="3" fill={isLocked ? strokeColor : '#22d3ee'} />
            <circle cx="50" cy="30" r="3" fill={isLocked ? strokeColor : '#22d3ee'} />
          </svg>
        );
      case 'rust':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="14" stroke={isLocked ? strokeColor : '#ea580c'} strokeWidth="2.5" />
            <circle cx="32" cy="32" r="6" stroke={isLocked ? strokeColor : '#ea580c'} strokeWidth="2" />
            <path d="M32 10 V14 M32 50 V54 M10 32 H14 M50 32 H54 M16 16 L20 20 M44 44 L48 48 M16 48 L20 44 M44 16 L48 20" stroke={isLocked ? strokeColor : '#f97316'} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case 'sql':
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <ellipse cx="32" cy="18" rx="18" ry="6" stroke={isLocked ? strokeColor : '#38bdf8'} strokeWidth="2.5" />
            <path d="M14 18 V30 C14 34, 20 36, 32 36 C44 36, 50 34, 50 30 V18" stroke={isLocked ? strokeColor : '#0284c7'} strokeWidth="2.5" />
            <path d="M14 30 V42 C14 46, 20 48, 32 48 C44 48, 50 46, 50 42 V30" stroke={isLocked ? strokeColor : '#0284c7'} strokeWidth="2.5" />
          </svg>
        );
      default:
        return (
          <svg className={customSizeClass} viewBox="0 0 64 64" fill="none">
            <path d="M22 22 L12 32 L22 42" stroke={isLocked ? strokeColor : '#38bdf8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 22 L52 32 L42 42" stroke={isLocked ? strokeColor : '#38bdf8'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="18" x2="28" y2="46" stroke={isLocked ? strokeColor : '#38bdf8'} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t('easy') || 'Easy'}</span>;
      case 'medium':
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t('medium') || 'Medium'}</span>;
      case 'hard':
        return <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{t('hard') || 'Hard'}</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return (
          <span className="flex items-center gap-1 text-slate-400/80 bg-slate-900/50 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Lock className="w-3 h-3" /> {t('locked') || 'Locked'}
          </span>
        );
      case 'in-progress':
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse-subtle">
            <Activity className="w-3 h-3" /> {t('in_progress') || 'Active'}
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Award className="w-3 h-3" /> {t('completed') || 'Mastered'}
          </span>
        );
      default:
        return null;
    }
  };

  // Filtering logic
  const filteredMissions = missions.filter(m => {
    const diffMatch = difficultyFilter === 'all' || m.difficulty === difficultyFilter;
    const statusMatch = statusFilter === 'all' || m.status === statusFilter;
    return diffMatch && statusMatch;
  });

  const completedCount = missions.filter(m => m.status === 'completed').length;
  const totalCount = missions.length;
  const overallProgressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const xpGained = missions.reduce((sum, m) => sum + (m.progress * 2), 0);



  if (loading && missions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-slate-100 bg-[#0f172a] rounded-3xl border border-slate-800">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <Compass className="absolute inset-0 m-auto w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="space-y-1.5 text-center">
          <h3 className="text-lg font-bold tracking-tight text-white">Initializing Orbit Grid</h3>
          <p className="text-xs text-slate-400 animate-pulse font-medium">Calibrating learning telemetry & compiling connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none text-slate-800 dark:text-slate-100 p-1 rounded-3xl">
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2.5s infinite ease-in-out;
        }
        .custom-glass {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .neon-shadow-cyan:hover {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.4);
        }
        .neon-shadow-emerald:hover {
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.4);
        }
        .neon-shadow-purple:hover {
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.15);
          border-color: rgba(168, 85, 247, 0.4);
        }
        .neon-shadow-rose:hover {
          box-shadow: 0 0 25px rgba(244, 63, 94, 0.15);
          border-color: rgba(244, 63, 94, 0.4);
        }
        .animated-bg-radial {
          background: radial-gradient(circle at top left, rgba(6, 182, 212, 0.04) 0%, transparent 50%),
                      radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.04) 0%, transparent 50%);
        }
        .dashed-svg-path {
          stroke-dasharray: 6 4;
          animation: flow 30s linear infinite;
        }
        @keyframes flow {
          to { stroke-dashoffset: -100; }
        }
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Telemetry HUD Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm animated-bg-radial transition-colors">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.003)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.003)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative p-4 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-indigo-950/30 rounded-2xl border border-cyan-500/20 dark:border-cyan-500/30 flex-shrink-0 shadow-sm">
              <Compass className="w-8 h-8 text-cyan-500 dark:text-cyan-400 animate-pulse-subtle" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-white dark:border-[#0f172a] animate-ping" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                MISSION COMPASS <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 tracking-normal uppercase">Quest Terminal</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-md leading-relaxed">
                Interact with the visual path map below to track prerequisites, view concept diagnostic data, and access specialized learning paths.
              </p>
            </div>
          </div>

          {/* HUD Progress & Telemetry Cards */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 md:gap-4">
            {/* Total progress visual gauge */}
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4 min-w-[130px] hover:border-slate-300 dark:hover:border-slate-700/60 transition-all">
              <div className="relative w-12 h-12 flex-shrink-0">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#06b6d4" strokeWidth="3.5" 
                    strokeDasharray="100" 
                    strokeDashoffset={100 - overallProgressPercent} 
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-slate-800 dark:text-white font-mono">{overallProgressPercent}%</span>
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Campaign</span>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200 leading-tight mt-0.5">{completedCount} <span className="text-xs font-medium text-slate-400">/ {totalCount} CLR</span></span>
              </div>
            </div>

            {/* Score XP */}
            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3.5 min-w-[120px] hover:border-slate-300 dark:hover:border-slate-700/60 transition-all">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500 dark:text-amber-400">
                <Flame className="w-5 h-5 fill-amber-500/10 text-amber-500 dark:text-amber-400 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Telemetry XP</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono mt-0.5">{xpGained}</span>
              </div>
            </div>

            {/* Polling toggle */}
            <div className="col-span-2 sm:col-span-1 flex gap-2">
              <button 
                onClick={() => setPollingActive(!pollingActive)}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-2 cursor-pointer transition-all active:scale-95 group flex-grow sm:flex-grow-0"
              >
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pollingActive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${pollingActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  {pollingActive ? 'Syncing' : 'Paused'}
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform ${pollingActive ? 'animate-spin-slow' : 'group-hover:rotate-45'}`} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Grid Dashboard View */}
      <div className="space-y-6">
          {/* Advanced Sorting & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-bold self-start sm:self-center">
              <Filter className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span className="text-slate-800 dark:text-slate-200 uppercase tracking-wider">Filter Matrix:</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* Difficulty selector */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase px-2">Difficulty:</span>
                <div className="flex">
                  {['all', 'easy', 'medium', 'hard'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDifficultyFilter(opt as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${difficultyFilter === opt ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status selector */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase px-2">Status:</span>
                <div className="flex">
                  {['all', 'locked', 'in-progress', 'completed'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setStatusFilter(opt as any)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${statusFilter === opt ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                    >
                      {opt.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filtered Grid Display */}
          {filteredMissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 rounded-3xl gap-4">
              <ShieldAlert className="w-10 h-10 text-slate-450 animate-bounce" />
              <div className="space-y-1 text-center">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">No Missions Match Filter</h4>
                <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">Try clearing your difficulty or status selectors to view options.</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                maxWidth: '100%',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              {filteredMissions.map((mission) => {
                const isLocked = mission.status === 'locked';
                const isCompleted = mission.status === 'completed';
                const cardStyle = getCardStyles(mission.mission_id, mission.status);

                return (
                  <div
                    key={mission.mission_id}
                    onClick={() => {
                      if (!isLocked) {
                        setSelectedMission(mission);
                      }
                    }}
                    className={`relative overflow-hidden group border rounded-3xl p-6 transition-all duration-350 shadow-sm hover:shadow-md ${
                      cardStyle.cardBg
                    } ${
                      isLocked 
                        ? 'cursor-not-allowed' 
                        : 'cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl border transition-all ${cardStyle.iconContainer}`}>
                        {renderConceptArt(mission.skill, mission.status, "w-14 h-14")}
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {getStatusBadge(mission.status)}
                        {getDifficultyBadge(mission.difficulty)}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-6 text-left">
                      <h4 className={`text-lg tracking-tight flex items-center gap-1 ${cardStyle.textTitle}`}>
                        {mission.title}
                        {!isLocked && <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors group-hover:translate-x-0.5" />}
                      </h4>
                      <p className={`text-xs font-semibold leading-relaxed ${cardStyle.textDesc}`}>
                        {isLocked 
                          ? mission.telemetry.prerequisiteText || 'Prerequisite locked.'
                          : `Learn and master ${mission.title} concepts inside active code workspace.`}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold tracking-wide">
                        <span className="text-slate-400 dark:text-slate-500 uppercase">Progress</span>
                        <span className={isCompleted ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' : 'text-cyan-500 dark:text-cyan-400 font-extrabold'}>{mission.progress}%</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden p-[2px] border ${cardStyle.progressBarBg}`}>
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${cardStyle.progressFill}`}
                          style={{ width: `${isLocked ? 0 : mission.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Sealed Lock Overlay for locked grid cards */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center border border-slate-200 dark:border-slate-900">
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full mb-2.5 shadow-sm">
                          <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Locked Node</span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-200 font-bold px-4">
                          {mission.telemetry.prerequisiteText || 'Complete previous requirements.'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Telemetry Diagnostic Details Modal */}
      {selectedMission && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-xl p-6 md:p-8 animate-in zoom-in-95 duration-200 flex flex-col transition-colors">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-indigo-950/30 border border-cyan-500/20 dark:border-cyan-500/30 rounded-2xl text-cyan-600 dark:text-cyan-400 animate-pulse-subtle">
                  {renderConceptArt(selectedMission.skill, selectedMission.status, "w-14 h-14")}
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-mono">MISSION PROFILE</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedMission.title}</h3>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedMission.status)}
                    {getDifficultyBadge(selectedMission.difficulty)}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMission(null)}
                className="p-2 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-400 hover:text-slate-750 dark:hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stats Telemetry Dossier Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-center min-h-[75px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Dossier Attempts</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white font-mono leading-none">{selectedMission.telemetry.attempts}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-center min-h-[75px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Verify Pass / Fail</span>
                <span className="text-lg font-black text-slate-850 dark:text-white font-mono leading-none">
                  <span className="text-emerald-500 dark:text-emerald-400">{selectedMission.telemetry.successes}</span>
                  <span className="text-slate-400 px-1.5">/</span>
                  <span className="text-rose-500 dark:text-rose-450">{selectedMission.telemetry.failures}</span>
                </span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-center min-h-[75px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Proficiency Gauge</span>
                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono leading-none">{selectedMission.progress}%</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col justify-center min-h-[75px] hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-left">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Mastery Trend</span>
                <span className="text-sm font-black text-slate-850 dark:text-slate-200 flex items-center gap-1.5 uppercase font-mono mt-0.5 leading-none">
                  {selectedMission.telemetry.trend === 'improving' ? (
                    <span className="text-emerald-500 dark:text-emerald-400 flex items-center gap-1 font-bold">IMPROVING <TrendingUp className="w-3.5 h-3.5" /></span>
                  ) : selectedMission.telemetry.trend === 'declining' ? (
                    <span className="text-rose-500 dark:text-rose-450 flex items-center gap-1 font-bold">DECLINING 📉</span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-bold">STABLE ➡️</span>
                  )}
                </span>
              </div>
            </div>

            {/* AI Diagnosis Insights Panel */}
            <div className="bg-cyan-500/5 dark:bg-cyan-950/20 border border-cyan-500/25 dark:border-cyan-500/20 rounded-2xl p-4.5 space-y-2 mb-7 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-pulse" />
                <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-300 uppercase tracking-widest font-mono">AI Diagnostics Insight</span>
              </div>
              <p className="text-xs text-slate-650 dark:text-slate-200 leading-relaxed font-semibold">
                {selectedMission.progress >= 90 
                  ? `Exceptional telemetry metrics. You have fully unlocked and mastered ${selectedMission.title}. Start advanced application templates in the compiler screen.` 
                  : selectedMission.progress > 0 
                    ? `We analyzed your compilation errors in ${selectedMission.title}. Ensure your variables are initialized correctly, structure code blocks cleanly, and resolve key loops.` 
                    : `Telemetry empty. Initialize lessons on ${selectedMission.title} by opening the syllabus roadmap. We will generate custom tasks.`}
              </p>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                setSelectedMission(null);
                window.location.href = `/dashboard/learn`;
              }}
              className="w-full py-4.5 bg-slate-900 dark:bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:bg-slate-800 dark:hover:from-cyan-400 dark:hover:to-indigo-500 border border-slate-200 dark:border-cyan-400/20 text-white font-black uppercase text-xs tracking-widest rounded-2xl cursor-pointer shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> START ROADMAP
            </button>
          </div>
        </div>
    </div>
  );
};

export default MissionsScreen;
