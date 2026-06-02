
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../../types';
import { BADGES_BY_PATH } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import EditProfileModal from '../EditProfileModal';
import api from '../../services/api';
import { Sparkles, Target, Zap, Brain, Plus, Pencil, Award, BookOpen } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { AvatarPreview } from '../StoreScreen';

// Mock data
const mockLeague = "Bronze";

const LeagueIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
);

const HexagonBadgeIcon = ({ icon, earned }: { icon: React.ReactNode; earned: boolean }) => (
  <div className={`relative w-20 h-20 flex items-center justify-center flex-shrink-0 transition-all ${!earned ? 'grayscale opacity-30 scale-90' : 'drop-shadow-xl'}`}>
    <svg viewBox="0 0 100 115.47" className="absolute inset-0 w-full h-full transform transition-colors">
      <path d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z" fill={earned ? "#2E2FCE" : "#cbd5e1"} className="dark:fill-slate-700" />
      <path d="M50 5 L95 31.7 L95 83.77 L50 110.47 L5 83.77 L5 31.7 Z" fill={earned ? "#2E2FCE" : "#94a3b8"} className="dark:fill-slate-600" />
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

  const coverInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        onUpdateUser({ coverPictureUrl: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        onUpdateUser({ profilePictureUrl: base64Data });
      };
      reader.readAsDataURL(file);
    }
  };

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
  const earnedBadgeIds = (currentPath && userProgress?.badgesEarned?.[currentPath]) || [];

  // Compute additional stats
  const totalLessons = Object.values(userProgress?.completedLessons || {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
  );
  const quizScores = Object.values(userProgress?.scores || {});
  const avgScore = quizScores.length > 0
    ? Math.round((quizScores as number[]).reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

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
            <div 
              className="h-60 rounded-3xl relative shadow-md overflow-hidden group border border-[#2E2FCE] bg-[#2E2FCE]"
              style={currentUser.coverPictureUrl ? { backgroundImage: `url(${currentUser.coverPictureUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <input 
                type="file" 
                ref={coverInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleCoverUpload} 
              />
              
              <button 
                onClick={() => coverInputRef.current?.click()} 
                title="Upload Cover Image"
                className="absolute top-6 left-6 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center transition-all text-white border border-white/20 cursor-pointer"
              >
                <Plus className="w-8 h-8" />
              </button>
              <button 
                onClick={() => setIsEditModalOpen(true)} 
                title="Edit Profile Info"
                className="absolute bottom-6 right-6 w-12 h-12 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center transition-all text-white border border-white/20 cursor-pointer"
              >
                <Pencil className="w-6 h-6" />
              </button>
            </div>
            
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
              <div className="w-40 h-40 rounded-full bg-white dark:bg-slate-800 border-8 border-white dark:border-slate-900 flex items-center justify-center relative overflow-hidden shadow-lg transition-colors group shrink-0 aspect-square">
                
                <input 
                  type="file" 
                  ref={profilePicInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePicUpload} 
                />

                {currentUser.profilePictureUrl ? (
                  <img 
                    src={currentUser.profilePictureUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <AvatarPreview 
                    equipped={userProgress?.skillGraph?.equippedAvatarItems || []} 
                    className="w-full h-full text-7xl rounded-full border-none shadow-none"
                  />
                )}

                <button 
                  onClick={() => profilePicInputRef.current?.click()} 
                  title="Change Profile Picture"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer rounded-full"
                >
                  <Pencil className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tighter uppercase">{currentUser.name}</h1>
            <div className="flex flex-col items-center justify-center mt-2.5 gap-1.5 font-bold text-slate-400 dark:text-slate-500 text-sm">
              <span className="flex items-center gap-1.5">
                ✉️ {currentUser.email}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-black bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500/80 dark:text-slate-400/80 mt-1 flex items-center gap-1 border border-slate-200/50 dark:border-slate-700/50">
                👤 {currentUser.role === 'teacher' ? 'Instructor' : 'Student'}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xl mt-4 max-w-xl mx-auto">{currentUser.bio || t('no_bio')}</p>
            <div className="mt-6 flex items-center justify-center space-x-6 text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <span className="hover:text-brand-500 transition-colors cursor-pointer">0 {t('following')}</span>
              <span className="text-slate-200 dark:text-slate-800">|</span>
              <span className="hover:text-brand-500 transition-colors cursor-pointer">0 {t('followers')}</span>
            </div>
          </div>

          {/* AI Learning Profile Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">AI Learning Profile</h2>
              <div className="flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span className="text-[10px] font-black text-brand-700 dark:text-brand-300 uppercase">Dynamic Analysis</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900 border border-slate-700 p-8 rounded-3xl text-white shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Brain className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AI Recommendation
                  </h3>
                  <p className="text-brand-50 font-medium leading-relaxed mb-6">
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

              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
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
                      )) || <span className="text-xs text-slate-400 font-bold">Analyzing...</span>}
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
                      )) || <span className="text-xs text-slate-400 font-bold">Analyzing...</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center mb-12">
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="text-4xl mb-2">🔥</div>
              <p className="font-black text-3xl leading-none"><AnimatedCounter value={userProgress?.streak || 0} /></p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-2">{t('streak')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="text-4xl mb-2 text-[#FBBC05] drop-shadow-sm">⭐</div>
              <p className="font-black text-3xl leading-none"><AnimatedCounter value={userProgress?.xp || 0} /></p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-2">{t('xp')}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <BookOpen className="w-10 h-10 text-[#2E2FCE] mb-2" />
              <p className="font-black text-3xl leading-none"><AnimatedCounter value={totalLessons} /></p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-2">Lessons</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <Award className="w-10 h-10 text-[#34A853] mb-2" />
              <p className="font-black text-3xl leading-none"><AnimatedCounter value={avgScore} suffix="%" /></p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-2">Avg Score</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <LeagueIcon className="w-10 h-10 text-[#34A853] mb-2 drop-shadow-sm" />
              <p className="font-black text-2xl leading-none uppercase tracking-tight">{mockLeague}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-2">{t('league_label')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t('my_badges')}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
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
