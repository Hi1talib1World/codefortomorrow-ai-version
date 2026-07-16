import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Language } from '../../types';
import { 
  Globe, 
  Palette, 
  Sun, 
  Moon, 
  Heart, 
  Volume2, 
  VolumeX, 
  Bell, 
  Brain, 
  Trash2, 
  ShieldAlert, 
  MessageSquare,
  Volume1
} from 'lucide-react';
import { useToast } from '../ToastNotification';

const SettingsScreen: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  // Local storage state keys
  const [soundEffects, setSoundEffects] = useState<boolean>(() => {
    return localStorage.getItem('setting_sound_effects') !== 'false';
  });
  const [mascotVoice, setMascotVoice] = useState<boolean>(() => {
    return localStorage.getItem('setting_mascot_voice') !== 'false';
  });
  const [aiCoach, setAiCoach] = useState<boolean>(() => {
    return localStorage.getItem('setting_ai_coach') !== 'false';
  });
  const [studyReminders, setStudyReminders] = useState<boolean>(() => {
    return localStorage.getItem('setting_study_reminders') !== 'false';
  });

  // Danger Zone confirmation states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    showToast('Language updated successfully! ');
  };

  const toggleSound = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    localStorage.setItem('setting_sound_effects', String(next));
    showToast(next ? 'Sound effects enabled! ' : 'Sound effects muted! ');
  };

  const toggleMascot = () => {
    const next = !mascotVoice;
    setMascotVoice(next);
    localStorage.setItem('setting_mascot_voice', String(next));
    showToast(next ? 'Mascot voiceovers enabled! ' : 'Mascot voiceovers disabled! ');
  };

  const toggleAI = () => {
    const next = !aiCoach;
    setAiCoach(next);
    localStorage.setItem('setting_ai_coach', String(next));
    showToast(next ? 'AI Coach Insights activated! ' : 'AI Coach Insights deactivated! ');
  };

  const toggleReminders = () => {
    const next = !studyReminders;
    setStudyReminders(next);
    localStorage.setItem('setting_study_reminders', String(next));
    showToast(next ? 'Study reminders activated! ' : 'Study reminders deactivated!');
  };

  const handleClearCache = () => {
    const themeVal = localStorage.getItem('theme');
    const langVal = localStorage.getItem('language');
    
    // Clear everything except user session indicators, theme, and language
    localStorage.clear();
    
    if (themeVal) localStorage.setItem('theme', themeVal);
    if (langVal) localStorage.setItem('language', langVal);
    
    showToast('Local application cache cleared! ');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleResetProgress = () => {
    if (confirmText !== 'RESET') {
      showToast('Please type RESET in capital letters to confirm! ️');
      return;
    }

    localStorage.removeItem('lastVisitedRoute');
    localStorage.removeItem('user_progress');

    showToast('Learning progress reset successfully! ');
    setShowResetConfirm(false);
    setConfirmText('');
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
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

  // Custom switch toggle component
  const Switch: React.FC<{ checked: boolean; onChange: () => void; id: string }> = ({ checked, onChange, id }) => (
    <button
      id={id}
      onClick={onChange}
      type="button"
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
        checked ? 'bg-[#111827] dark:bg-[#FBBF24]' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white dark:bg-slate-900 shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full flex flex-col py-6">
      {/* Header */}
      <div className="grid grid-cols-12 w-full mb-12">
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 flex flex-col text-left space-y-2">
          <span className="mono-label opt-align">WORKSPACE CONFIGURATION</span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 opt-align">
            {t('settings')}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-y-8 gap-x-6 w-full">
        {/* 1. Language Section */}
        <div 
          className="col-span-12 lg:col-span-8 lg:col-start-3 pill-card bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 shadow-xl transition-colors text-left flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Globe className="w-8 h-8 text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">{t('language_label')}</h2>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-6 leading-relaxed">
            {t('settings_language_desc')}
          </p>
          <div className="relative w-full sm:w-80">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none bg-slate-950 border border-slate-800 text-white font-black py-4 px-6 rounded-2xl text-base leading-tight focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all cursor-pointer"
              aria-label={t('language_label')}
            >
              <option value={Language.EN}>{t('language_english')}</option>
              <option value={Language.FR}>{t('language_french')}</option>
              <option value={Language.AR}>{t('language_arabic')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
              <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Theme / Appearance Section */}
        <div 
          className="col-span-12 lg:col-span-8 lg:col-start-3 pill-card bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 shadow-xl transition-colors text-left flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Palette className="w-8 h-8 text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">{t('appearance')}</h2>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-8 leading-relaxed">
            {t('appearance_desc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Light Mode Button */}
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all transform active:scale-95 cursor-pointer bg-slate-900/10 ${theme === 'light'
                  ? 'border-[#FBBF24] shadow-md'
                  : 'border-slate-800 grayscale opacity-60'
                }`}
            >
              <div className="w-16 h-16 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Sun className="w-8 h-8 text-[#FBBF24]" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">{t('light_mode')}</span>
              {theme === 'light' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FBBF24] text-slate-950 rounded-full flex items-center justify-center font-black shadow-md text-xs">✓</div>
              )}
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-3xl border-2 transition-all transform active:scale-95 cursor-pointer bg-slate-900/10 ${theme === 'dark'
                  ? 'border-[#FBBF24] shadow-md'
                  : 'border-slate-800 grayscale opacity-60'
                }`}
            >
              <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">{t('dark_mode')}</span>
              {theme === 'dark' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FBBF24] text-slate-950 rounded-full flex items-center justify-center font-black shadow-md text-xs">✓</div>
              )}
            </button>
          </div>
        </div>

        {/* 3. Audio & Feedback Settings */}
        <div 
          className="col-span-12 lg:col-span-8 lg:col-start-3 pill-card bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 shadow-xl transition-colors text-left flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Volume2 className="w-8 h-8 text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Audio & Sounds</h2>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-8 leading-relaxed">
            Adjust the sounds, alerts, and speech feedback settings for interactive lessons.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-amber-400">
                  {soundEffects ? <Volume1 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-slate-500" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Sound Effects</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Play reward, success, and level completion audio cues.</p>
                </div>
              </div>
              <Switch checked={soundEffects} onChange={toggleSound} id="switch-sound-effects" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-amber-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Mascot Voiceover</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Enable the AI learning buddy speech synth voice explanations.</p>
                </div>
              </div>
              <Switch checked={mascotVoice} onChange={toggleMascot} id="switch-mascot-voice" />
            </div>
          </div>
        </div>

        {/* 4. AI & Alerts Preferences */}
        <div 
          className="col-span-12 lg:col-span-8 lg:col-start-3 pill-card bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 shadow-xl transition-colors text-left flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Bell className="w-8 h-8 text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">AI & Notification Preferences</h2>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-8 leading-relaxed">
            Control the frequency of study alerts and personalized AI coaching recommendations.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-amber-400">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">AI Coach Insights</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Receive personalized studying routes generated dynamically by the edge AI.</p>
                </div>
              </div>
              <Switch checked={aiCoach} onChange={toggleAI} id="switch-ai-coach" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/20 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Study Streak Reminders</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Receive daily notifications to protect your streak before it resets.</p>
                </div>
              </div>
              <Switch checked={studyReminders} onChange={toggleReminders} id="switch-study-reminders" />
            </div>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div 
          className="col-span-12 lg:col-span-8 lg:col-start-3 pill-card bg-slate-900/30 border border-red-500/20 rounded-[2rem] p-8 shadow-xl transition-colors text-left flex flex-col"
        >
          <div className="flex items-center space-x-4 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-black text-red-500 uppercase tracking-tight">Danger Zone</h2>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-8 leading-relaxed">
            Take highly sensitive administrative actions on your local workspace cache or progress state.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearCache}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-amber-700 active:border-b-2 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" /> Clear Local Cache
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-500 hover:bg-red-650 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-red-700 active:border-b-2 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" /> Reset Course Progress
            </button>
          </div>
        </div>

        {/* Reset Progress Modal overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative border-b-8 border-red-500 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-red-950/20 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 text-3xl">⚠️</div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Are you absolutely sure?</h3>
                <p className="text-sm text-slate-400 font-bold mt-2 leading-relaxed">
                  This action is irreversible. All completed lessons, streak logs, scores, and XP stars will be permanently erased.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="input-reset-confirm" className="text-xs text-slate-500 font-black uppercase tracking-wider block text-left">
                  Type "RESET" in all capitals to proceed:
                </label>
                <input
                  id="input-reset-confirm"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="RESET"
                  className="w-full text-center px-4 py-3 bg-slate-950 border-4 border-slate-800 text-white placeholder-slate-600 rounded-xl font-black text-lg focus:outline-none focus:border-red-500 focus:ring-0 transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    setConfirmText('');
                  }}
                  className="flex-1 bg-slate-850 hover:bg-slate-800 text-slate-300 font-black py-3.5 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  disabled={confirmText !== 'RESET'}
                  className={`flex-1 font-black py-3.5 px-4 rounded-xl text-xs uppercase cursor-pointer text-white border-b-4 ${
                    confirmText === 'RESET' 
                      ? 'bg-red-500 hover:bg-red-600 border-red-700 active:border-b-2 active:translate-y-0.5' 
                      : 'bg-slate-800 border-slate-950 cursor-not-allowed opacity-50'
                  }`}
                >
                  Yes, Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Version Info (columns 3 / 11) */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center py-8">
          <p className="text-slate-500 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-1.5">
            Code For Tomorrow v1.2.0 • Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
