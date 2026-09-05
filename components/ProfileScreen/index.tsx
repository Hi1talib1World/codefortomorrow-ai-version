import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types';
import { BADGES_BY_PATH } from '../../constants';
import { useLanguage } from '../../contexts/LanguageContext';
import EditProfileModal from '../EditProfileModal';
import api from '../../services/api';
import { Target, Zap, Brain, Plus, Pencil, Award, BookOpen, Shield, Bot, BarChart3, Github, Linkedin, Globe, MapPin, Camera } from 'lucide-react';
import AnimatedCounter from '../AnimatedCounter';
import { AvatarPreview } from '../StoreScreen';

const LeagueIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
);

const HexagonBadgeIcon = ({ icon, earned, size = "w-14 h-14" }: { icon: React.ReactNode; earned: boolean; size?: string }) => (
  <div className={`relative ${size} flex items-center justify-center flex-shrink-0 transition-all ${!earned ? 'grayscale opacity-30 scale-90' : 'drop-shadow-md hover:scale-105'}`}>
    <svg viewBox="0 0 100 115.47" className="absolute inset-0 w-full h-full transform transition-colors">
      <path d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z" fill={earned ? "#0a66c2" : "#475569"} />
      <path d="M50 5 L95 31.7 L95 83.77 L50 110.47 L5 83.77 L5 31.7 Z" fill={earned ? "#0a66c2" : "#334155"} />
    </svg>
    <div className="relative z-10 text-white flex items-center justify-center">
      {icon}
    </div>
  </div>
);

const DefaultCoverPattern = () => (
  <div className="w-full h-full bg-gradient-to-r from-blue-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
  </div>
);

interface ProfileScreenProps {
  currentUser: User;
  onUpdateUser: (updatedData: Partial<User>) => Promise<void>;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, onUpdateUser }) => {
  const navigate = useNavigate();
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
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          await onUpdateUser({ coverPictureUrl: base64Data });
        } catch (error) {
          console.error('Failed to update cover picture:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          await onUpdateUser({ profilePictureUrl: base64Data });
        } catch (error) {
          console.error('Failed to update profile picture:', error);
        }
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

  const totalLessons = Object.values(userProgress?.completedLessons || {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0
  );
  const quizScores = Object.values(userProgress?.scores || {});
  const avgScore = quizScores.length > 0
    ? Math.round((quizScores as number[]).reduce((a, b) => a + b, 0) / quizScores.length)
    : 0;

  const handleSaveProfile = async (updatedData: Partial<User>) => {
    try {
      await onUpdateUser(updatedData);
    } catch (error) {
      console.error('Failed to save profile updates:', error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  // Runtime Optical Alignment
  useEffect(() => {
    const alignInk = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      document.querySelectorAll('.opt-align').forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.marginLeft = '0px';
        const style = window.getComputedStyle(htmlEl);
        const char = (htmlEl.textContent || '').trim().charAt(0);
        if (!char) return;

        ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        ctx.textAlign = 'left';
        const metrics = ctx.measureText(char);
        const sideBearing = metrics.actualBoundingBoxLeft;

        if (isFinite(sideBearing) && sideBearing > 0) {
          htmlEl.style.marginLeft = `${sideBearing.toFixed(2)}px`;
        }
      });
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(alignInk);
    }
    alignInk();
    window.addEventListener('resize', alignInk);
    return () => window.removeEventListener('resize', alignInk);
  }, []);

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal
          user={currentUser}
          onSave={handleSaveProfile}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="w-full flex flex-col py-6">
        <div className="grid grid-cols-12 w-full gap-6 text-left">

          {/* CARD 1: Intro Card (columns 1 / 13) */}
          <div className="col-span-12 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-xl relative transition-colors text-left">
            
            {/* Cover Picture */}
            <div className="h-44 sm:h-56 relative w-full overflow-hidden group">
              {currentUser.coverPictureUrl ? (
                <img 
                  src={currentUser.coverPictureUrl} 
                  alt="Cover Banner" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <DefaultCoverPattern />
              )}
              <input 
                type="file" 
                ref={coverInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleCoverUpload} 
              />
              <button 
                onClick={() => coverInputRef.current?.click()} 
                title="Change Cover Image"
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all border border-white/20 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar (Overlapping) */}
            <div className="absolute top-24 sm:top-36 left-6 sm:left-8 z-10">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white dark:bg-slate-950 border-4 border-white dark:border-slate-900 flex items-center justify-center relative overflow-hidden shadow-md group shrink-0 aspect-square">
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
                    alt="Profile Picture" 
                    className="w-full h-full object-cover rounded-full" 
                  />
                ) : (
                  <AvatarPreview 
                    equipped={userProgress?.skillGraph?.equippedAvatarItems || []} 
                    className="w-full h-full text-6xl rounded-full border-none shadow-none bg-slate-100 dark:bg-slate-900/50"
                  />
                )}

                <button 
                  onClick={() => profilePicInputRef.current?.click()} 
                  title="Change Profile Picture"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer rounded-full"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Intro Details Spacer */}
            <div className="h-12 sm:h-20" />

            {/* Edit Button top-right of details */}
            <button 
              onClick={() => setIsEditModalOpen(true)} 
              title="Edit Profile"
              className="absolute top-48 sm:top-[235px] right-6 p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              <Pencil className="w-5 h-5" />
            </button>

            {/* Main Details */}
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="max-w-xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight opt-align">
                      {currentUser.name}
                    </h1>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0a66c2]/10 text-[#0a66c2] dark:bg-[#70b5f9]/15 dark:text-[#70b5f9] border border-blue-500/20 select-none">
                      Level {Math.floor((userProgress?.xp || 0) / 100) + 1}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold mt-1.5 leading-normal">
                    {currentUser.professionalTitle || "Student at Code for Tomorrow Academy"}
                  </p>
                  
                  {/* Location & Metadata */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 font-normal text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Ecosystem Member</span>
                    </span>
                    <span>•</span>
                    <span 
                      onClick={() => setIsEditModalOpen(true)} 
                      className="text-[#0a66c2] dark:text-[#70b5f9] font-bold hover:underline cursor-pointer"
                    >
                      Contact Info
                    </span>
                  </div>
                </div>

                {/* Side-Badge: Current Org */}
                <div className="flex items-center gap-2 mt-1 max-w-xs shrink-0 select-none text-left self-start">
                  <div className="w-8 h-8 rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-[#FBBF24] font-black text-xs tracking-tight">
                    CFT
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    Code for Tomorrow Academy
                  </div>
                </div>
              </div>

              {/* Connections/Followers count */}
              <div className="text-xs font-bold text-[#0a66c2] dark:text-[#FBBF24] hover:underline cursor-pointer mt-3.5 inline-block">
                100+ connections
              </div>

              {/* Contact/Social Links line */}
              {(currentUser.githubUrl || currentUser.linkedinUrl || currentUser.websiteUrl) && (
                <div className="flex flex-wrap items-center gap-2.5 mt-3.5 pt-3.5 border-t border-slate-200 dark:border-slate-800">
                  {currentUser.githubUrl && (
                    <a
                      href={currentUser.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {currentUser.githubUrl && (currentUser.linkedinUrl || currentUser.websiteUrl) && (
                    <span className="text-slate-400 dark:text-slate-700">•</span>
                  )}
                  {currentUser.linkedinUrl && (
                    <a
                      href={currentUser.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {currentUser.linkedinUrl && currentUser.websiteUrl && (
                    <span className="text-slate-400 dark:text-slate-700">•</span>
                  )}
                  {currentUser.websiteUrl && (
                    <a
                      href={currentUser.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 mt-5">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm transition-all cursor-pointer shrink-0 border-none"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => navigate('/dashboard/learn')}
                  className="border border-[#0a66c2] hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#0a66c2] dark:text-[#70b5f9] text-sm font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shrink-0 bg-transparent"
                >
                  Resume Academy
                </button>
                {currentUser.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold px-5 py-2 rounded-xl transition-all cursor-pointer shrink-0 bg-transparent"
                  >
                    Admin panel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: Private Analytics & Dashboard (columns 1 / 9) */}
          <div className="col-span-12 lg:col-span-8 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl text-left flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight opt-align">Analytics</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 select-none font-bold">
                <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                <span>Private to you</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2.5 items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      <AnimatedCounter value={userProgress?.streak || 0} /> Days
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Learning streak</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      <AnimatedCounter value={userProgress?.xp || 0} /> XP
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Experience score</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      <AnimatedCounter value={avgScore} suffix="%" />
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-wider">Quiz Mastery</p>
                  </div>
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 select-none">
                  <span>Level {Math.floor((userProgress?.xp || 0) / 100) + 1} Progress</span>
                  <span>{(userProgress?.xp || 0) % 100} / 100 XP</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0a66c2] to-[#0077b5] dark:from-[#38bdf8] dark:to-[#0284c7] transition-all duration-500 rounded-full" 
                    style={{ width: `${(userProgress?.xp || 0) % 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-2.5 select-none leading-none uppercase tracking-wider">
                  Gaining {100 - ((userProgress?.xp || 0) % 100)} more XP will advance you to Level {Math.floor((userProgress?.xp || 0) / 100) + 2}!
                </p>
              </div>
            </div>

            {/* AI Coaching Suggestion Panel */}
            <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative overflow-hidden flex gap-4">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Brain className="w-20 h-20 text-[#0a66c2] dark:text-[#FBBF24]" />
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-[#FBBF24]/10 flex items-center justify-center text-[#0a66c2] dark:text-[#FBBF24] shrink-0 select-none">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-[10px] font-black text-[#0a66c2] dark:text-[#70b5f9] uppercase tracking-wider">AI Coach Advisor</h4>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  "{aiProfile?.recommendation || "Keep driving through the curriculum! Your study patterns are being compiled to serve certified recommendations."}"
                </p>
                {aiProfile?.nextSteps && aiProfile.nextSteps.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {aiProfile.nextSteps.map((step: string, i: number) => (
                      <span key={i} className="text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                        {step}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 3: About (columns 9 / 13) */}
          <div className="col-span-12 lg:col-span-4 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl text-left flex flex-col">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3 opt-align">About</h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-semibold">
              {currentUser.bio || t('no_bio')}
            </p>
          </div>

          {/* CARD 4: Licenses & Certifications (columns 1 / 7) */}
          <div className="col-span-12 lg:col-span-6 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl text-left flex flex-col">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 opt-align">Certifications</h2>
            <div className="space-y-6">
              {currentPath ? (
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xl shrink-0 select-none">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize leading-tight">
                      {currentPath.replace('_', ' ')} Coding Specialization
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">Code for Tomorrow Academy</p>
                    <p className="text-[11px] text-slate-500 mt-1.5 select-none">Issued {new Date(currentUser.createdAt).toLocaleDateString(undefined, {month: 'long', year: 'numeric'})} • No Expiration</p>
                    <div className="flex flex-wrap gap-2 mt-2.5">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        Score: {userProgress?.xp || 0} XP
                      </span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        Lessons: {totalLessons} Completed
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specializations locked in yet. Go to Academy to select a pathway.</p>
              )}
            </div>
          </div>

          {/* CARD 5: Skills (columns 7 / 13) */}
          <div className="col-span-12 lg:col-span-6 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl text-left flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight opt-align">Skills</h2>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-transparent border-none"
                title="Manage Skills"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {currentUser.skills && currentUser.skills.length > 0 ? (
              <div className="space-y-4">
                {currentUser.skills.map((skill, idx) => (
                  <div key={idx} className="pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0 text-left">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{skill}</p>
                    <p className="text-[10px] font-bold text-[#0a66c2] dark:text-[#FBBF24] mt-1.5 flex items-center gap-1.5 select-none">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Endorsed by Code for Tomorrow AI Mentor</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-4">No technical skills displayed.</p>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="border border-[#0a66c2] dark:border-[#FBBF24] hover:bg-blue-50 dark:hover:bg-[#FBBF24]/10 text-[#0a66c2] dark:text-[#FBBF24] text-xs font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer bg-transparent"
                >
                  Add skills
                </button>
              </div>
            )}
          </div>

          {/* CARD 6: Accomplishments (columns 1 / 13) */}
          <div className="col-span-12 pill-card bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-xl text-left flex flex-col">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4 opt-align">Accomplishments</h2>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Honors & Badges ({earnedBadgeIds.length})</h3>
            
            {pathBadges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pathBadges.map(badge => {
                  const isEarned = earnedBadgeIds.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`flex items-center gap-4 p-3 rounded-xl border border-slate-200 dark:border-slate-800 transition-all ${isEarned ? 'bg-slate-50 dark:bg-slate-950/40 opacity-100' : 'opacity-30'}`}
                    >
                      <HexagonBadgeIcon
                        icon={<span className="text-2xl">{badge.icon}</span>}
                        earned={isEarned}
                        size="w-12 h-12"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight leading-normal">{t(badge.titleKey as any)}</h4>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 font-extrabold uppercase mt-1">{isEarned ? 'Earned' : 'Locked'}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No achievements found. Progress through your active learning path to unlock credentials.</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileScreen;
