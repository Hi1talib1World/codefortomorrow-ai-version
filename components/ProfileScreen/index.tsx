
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { BADGES_BY_PATH } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import EditProfileModal from '../EditProfileModal';
import api from '../../services/api';
import { Sparkles, Target, Zap, Brain, Plus, Pencil } from 'lucide-react';

// Mock data
const mockFollowing = 12;
const mockFollowers = 8;
const mockLeague = "Bronze";

const LeagueIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
);

const HexagonBadgeIcon = ({ icon, earned }: { icon: React.ReactNode; earned: boolean }) => (
  <div className={`relative w-20 h-20 flex items-center justify-center flex-shrink-0 transition-all ${!earned ? 'grayscale opacity-30 scale-90' : 'drop-shadow-xl'}`}>
    <svg viewBox="0 0 100 115.47" className="absolute inset-0 w-full h-full transform transition-colors">
      <path d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z" fill={earned ? "#38BDF8" : "#cbd5e1"} className="dark:fill-slate-700" />
      <path d="M50 5 L95 31.7 L95 83.77 L50 110.47 L5 83.77 L5 31.7 Z" fill={earned ? "#0EA5E9" : "#94a3b8"} className="dark:fill-slate-600" />
    </svg>
    <div className="relative z-10 text-white text-4xl">
      {icon}
    </div>
  </div>
);

interface ProfileScreenProps {
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, onUpdateUser }) => {
  const { progress: userProgress, currentPath } = currentUser;
  const { t } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [aiProfile, setAiProfile] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(true);

  useEffect(() => {
    const fetchAIProfile = async () => {
      try {
        const data = await api.getAILearningProfile();
        setAiProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchAIProfile();
  }, []);

  const pathBadges = currentPath ? BADGES_BY_PATH[currentPath] || [] : [];
  const earnedBadgeIds = (currentPath && userProgress.badgesEarned[currentPath]) || [];

  const handleSaveProfile = (updatedData: Partial<User>) => {
    onUpdateUser(updatedData);
    setIsEditModalOpen(false);
  };

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal
          user={currentUser}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="bg-brand-50 dark:bg-slate-900 min-h-full text-slate-800 dark:text-white font-sans p-4 sm:p-12 transition-colors">
        <div className="max-w-4xl mx-auto">
          
          <div className="relative mb-20">
            <div className="h-60 bg-gradient-to-r from-brand-600 to-brand-700 rounded-[3rem] relative shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button className="absolute top-6 left-6 w-12 h-12 bg-black/30 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-black/50 transition-all text-white">
                <Plus className="w-8 h-8" />
              </button>
              <button onClick={() => setIsEditModalOpen(true)} className="absolute bottom-6 right-6 w-12 h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/50 transition-all text-white">
                <Pencil className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="w-40 h-40 rounded-full bg-white dark:bg-slate-800 border-[10px] border-slate-100 dark:border-slate-900 flex items-center justify-center relative overflow-hidden shadow-2xl transition-colors">
                <img src={currentUser.profilePictureUrl} alt={currentUser.name} className="w-full h-full object-cover transition-transform duration-500" />
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">{currentUser.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-2">{currentUser.bio || t('no_bio')}</p>
            <div className="mt-6 flex items-center justify-center space-x-6 text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="hover:text-brand-500 transition-colors cursor-pointer">{mockFollowing} {t('following')}</span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="hover:text-brand-500 transition-colors cursor-pointer">{mockFollowers} {t('followers')}</span>
            </div>
          </div>

          {/* AI Learning Profile Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">AI Learning Profile</h2>
              <div className="flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 uppercase italic">Dynamic Analysis</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-gradient-to-br from-brand-600 to-brand-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Brain className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI Recommendation
                  </h3>
                  <p className="text-brand-50 font-medium leading-relaxed italic mb-6">
                    "{aiProfile?.recommendation || "Keep pushing forward! Your progress is being analyzed to provide personalized tips."}"
                  </p>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-200">Next Focus Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {aiProfile?.nextSteps?.map((step: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                          {step}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-b-[12px] border-slate-200 dark:border-slate-950 shadow-xl">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-3 flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiProfile?.profile?.strengths?.map((s: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-[10px] font-black rounded-lg uppercase">
                          {s}
                        </span>
                      )) || <span className="text-xs text-slate-400 font-bold italic">Analyzing...</span>}
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-3 flex items-center gap-2">
                      <Target className="w-3 h-3" /> Growth Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiProfile?.profile?.weaknesses?.map((w: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-[10px] font-black rounded-lg uppercase">
                          {w}
                        </span>
                      )) || <span className="text-xs text-slate-400 font-bold italic">Analyzing...</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-12">
            <div className="bg-white dark:bg-slate-800 border-b-8 border-slate-200 dark:border-slate-950 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-lg transition-all">
              <div className="text-5xl mb-2">🔥</div>
              <p className="font-black text-4xl leading-none">{userProgress.streak}</p>
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{t('streak')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-b-8 border-slate-200 dark:border-slate-950 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-lg transition-all">
              <div className="text-5xl mb-2 text-yellow-400 drop-shadow-sm">⭐</div>
              <p className="font-black text-4xl leading-none">{userProgress.xp}</p>
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{t('xp')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-b-8 border-slate-200 dark:border-slate-950 rounded-[2.5rem] p-6 flex flex-col items-center justify-center shadow-lg transition-all">
              <LeagueIcon className="w-14 h-14 text-green-500 mb-2 drop-shadow-sm"/>
              <p className="font-black text-4xl leading-none uppercase italic tracking-tighter">{mockLeague}</p>
              <p className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">{t('league_label')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">{t('my_badges')}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 border-b-[12px] border-slate-200 dark:border-slate-950 shadow-xl transition-colors">
              {pathBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pathBadges.map(badge => {
                        const isEarned = earnedBadgeIds.includes(badge.id);
                        return (
                            <div key={badge.id} className={`flex items-center space-x-6 p-4 rounded-3xl transition-colors ${isEarned ? 'bg-brand-50 dark:bg-brand-900/10' : 'opacity-60'}`}>
                                <HexagonBadgeIcon 
                                    icon={<span>{badge.icon}</span>}
                                    earned={isEarned}
                                />
                                <div className="min-w-0">
                                    <p className={`font-black text-xl uppercase tracking-tight leading-tight ${isEarned ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                        {t(badge.titleKey as any)}
                                    </p>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">
                                        {isEarned ? t('unlocked_status') : t('locked_status')}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
              ) : (
                <div className="text-center py-12">
                    <p className="text-slate-400 font-bold text-xl">{t('no_content_saved')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileScreen;
