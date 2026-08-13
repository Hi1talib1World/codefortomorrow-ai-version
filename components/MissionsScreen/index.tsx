import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import { motion } from 'motion/react';
import { 
  Target, 
  Trophy, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Gift, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Mic, 
  Award,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useToast } from '../ToastNotification';
import GuestLoginBanner from '../GuestLoginBanner';

interface MissionsScreenProps {
  currentUser: User;
}

export interface QuestItem {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'pathway';
  rewardXp: number;
  progress: number; // 0 to 100
  targetCount: number;
  currentCount: number;
  unit: string;
  isCompleted: boolean;
  icon: string;
}

const INITIAL_QUESTS: QuestItem[] = [
  // Daily Quests
  {
    id: 'daily_lesson',
    title: 'Complete 1 Coding Lesson',
    description: 'Finish any interactive lesson in your active programming track today.',
    category: 'daily',
    rewardXp: 50,
    progress: 100,
    targetCount: 1,
    currentCount: 1,
    unit: 'Lesson',
    isCompleted: true,
    icon: '🎯'
  },
  {
    id: 'daily_xp',
    title: 'Earn 100 XP',
    description: 'Gain 100 XP through quizzes, coding challenges, or speaking practice.',
    category: 'daily',
    rewardXp: 30,
    progress: 75,
    targetCount: 100,
    currentCount: 75,
    unit: 'XP',
    isCompleted: false,
    icon: '⚡'
  },
  {
    id: 'daily_speaking',
    title: 'Speaking Hub Practice',
    description: 'Practice at least 2 audio phrases in French, English, or Arabic.',
    category: 'daily',
    rewardXp: 40,
    progress: 50,
    targetCount: 2,
    currentCount: 1,
    unit: 'Phrases',
    isCompleted: false,
    icon: '🗣️'
  },

  // Weekly Quests
  {
    id: 'weekly_streak',
    title: '5-Day Learning Streak',
    description: 'Keep your coding streak active for 5 consecutive days this week.',
    category: 'weekly',
    rewardXp: 150,
    progress: 80,
    targetCount: 5,
    currentCount: 4,
    unit: 'Days',
    isCompleted: false,
    icon: '🔥'
  },
  {
    id: 'weekly_book',
    title: 'Read a Smart Book Chapter',
    description: 'Explore any handbook chapter in the Books library.',
    category: 'weekly',
    rewardXp: 80,
    progress: 100,
    targetCount: 1,
    currentCount: 1,
    unit: 'Chapter',
    isCompleted: true,
    icon: '📚'
  },
  {
    id: 'weekly_feed',
    title: 'Share in Community Feed',
    description: 'Post a project update or answer a question in the student feed.',
    category: 'weekly',
    rewardXp: 60,
    progress: 0,
    targetCount: 1,
    currentCount: 0,
    unit: 'Post',
    isCompleted: false,
    icon: '💬'
  },

  // Pathway Achievements
  {
    id: 'path_python',
    title: 'Python Core Milestone',
    description: 'Complete all Python basics modules including loops and functions.',
    category: 'pathway',
    rewardXp: 250,
    progress: 85,
    targetCount: 10,
    currentCount: 8,
    unit: 'Modules',
    isCompleted: false,
    icon: '🐍'
  },
  {
    id: 'path_web',
    title: 'Web Developer Explorer',
    description: 'Master HTML5 semantic layout and CSS Flexbox styling.',
    category: 'pathway',
    rewardXp: 300,
    progress: 60,
    targetCount: 8,
    currentCount: 5,
    unit: 'Lessons',
    isCompleted: false,
    icon: '🌐'
  }
];

const MissionsScreen: React.FC<MissionsScreenProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'all' | 'daily' | 'weekly' | 'pathway'>('all');
  const [quests, setQuests] = useState<QuestItem[]>(INITIAL_QUESTS);

  const userXp = currentUser.progress?.xp || 0;
  const userStreak = currentUser.progress?.streak || 0;

  const handleClaimReward = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        showToast(`Claimed +${q.rewardXp} XP Reward! 🎉`, 'success');
        return { ...q, isCompleted: true, progress: 100 };
      }
      return q;
    }));
  };

  const filteredQuests = quests.filter(q => {
    if (activeCategory === 'all') return true;
    return q.category === activeCategory;
  });

  const completedCount = quests.filter(q => q.isCompleted).length;
  const totalCount = quests.length;

  const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Guest Banner */}
        {isGuest && (
          <GuestLoginBanner 
            title="Unlock Daily Coding Missions & XP Rewards"
            description="You are currently exploring in Guest Mode. Log in or create a free account to claim your XP rewards, track your daily quests, and level up!"
          />
        )}

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8] text-xs font-semibold">
                <Target className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span>Coding Goals & Achievements</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                Missions & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">Quests Hub</span>
              </h1>
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl font-normal">
                Complete daily coding challenges, maintain your streak, and earn XP rewards!
              </p>
            </div>

            {/* Overall Progress Widget */}
            <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-4 min-w-[200px] text-center space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6]">
                <span>Progress</span>
                <span className="font-mono font-bold text-[#1A73E8] dark:text-[#8AB4F8]">{completedCount}/{totalCount} Completed</span>
              </div>
              <div className="w-full bg-[#E8EAED] dark:bg-[#3C4043] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1A73E8] dark:bg-[#8AB4F8] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All Quests' },
            { id: 'daily', label: 'Daily Quests ⚡' },
            { id: 'weekly', label: 'Weekly Goals 🔥' },
            { id: 'pathway', label: 'Pathway Milestones 🎯' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-bold'
                  : 'bg-white dark:bg-[#292A2D] text-[#5F6368] dark:text-[#9AA0A6] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] border border-[#E8EAED] dark:border-[#3C4043]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quests Stream */}
        <div className="space-y-4">
          {filteredQuests.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-[#292A2D] border rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
                quest.isCompleted
                  ? 'border-[#34A853]/40 bg-[#E6F4EA]/20 dark:bg-[#3C4043]/30'
                  : 'border-[#E8EAED] dark:border-[#3C4043]'
              }`}
            >
              <div className="flex items-start gap-4 text-left flex-1">
                <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] flex items-center justify-center text-2xl shrink-0">
                  {quest.icon}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#202124] dark:text-white">
                      {quest.title}
                    </h3>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
                      +{quest.rewardXp} XP
                    </span>
                  </div>

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal leading-relaxed">
                    {quest.description}
                  </p>

                  {/* Quest Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6]">
                      <span>Progress</span>
                      <span>{quest.currentCount} / {quest.targetCount} {quest.unit}</span>
                    </div>
                    <div className="w-full bg-[#F1F3F4] dark:bg-[#202124] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded-full ${
                          quest.isCompleted ? 'bg-[#34A853]' : 'bg-[#1A73E8] dark:bg-[#8AB4F8]'
                        }`}
                        style={{ width: `${Math.min(100, quest.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0 flex justify-end">
                {quest.isCompleted ? (
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995] text-xs font-bold font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                ) : quest.progress >= 100 ? (
                  <button
                    onClick={() => handleClaimReward(quest.id)}
                    className="px-5 py-2.5 bg-[#34A853] hover:bg-[#2D9247] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-sm"
                  >
                    Claim Reward
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] text-xs font-semibold">
                    <span>In Progress</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MissionsScreen;
