import React, { useState } from 'react';
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
    showToast('Language updated successfully! 🌍');
  };

  const toggleSound = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    localStorage.setItem('setting_sound_effects', String(next));
    showToast(next ? 'Sound effects enabled! 🔊' : 'Sound effects muted! 🔇');
  };

  const toggleMascot = () => {
    const next = !mascotVoice;
    setMascotVoice(next);
    localStorage.setItem('setting_mascot_voice', String(next));
    showToast(next ? 'Mascot voiceovers enabled! 🦁' : 'Mascot voiceovers disabled! 🔇');
  };

  const toggleAI = () => {
    const next = !aiCoach;
    setAiCoach(next);
    localStorage.setItem('setting_ai_coach', String(next));
    showToast(next ? 'AI Coach Insights activated! 🧠' : 'AI Coach Insights deactivated! 💤');
  };

  const toggleReminders = () => {
    const next = !studyReminders;
    setStudyReminders(next);
    localStorage.setItem('setting_study_reminders', String(next));
    showToast(next ? 'Study reminders activated! ⏰' : 'Study reminders deactivated!');
  };

  const handleClearCache = () => {
    const themeVal = localStorage.getItem('theme');
    const langVal = localStorage.getItem('language');
    
    // Clear everything except user session indicators, theme, and language
    localStorage.clear();
    
    if (themeVal) localStorage.setItem('theme', themeVal);
    if (langVal) localStorage.setItem('language', langVal);
    
    showToast('Local application cache cleared! 🧹');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleResetProgress = () => {
    if (confirmText !== 'RESET') {
      showToast('Please type RESET in capital letters to confirm! ⚠️');
      return;
    }

    // Reset progress in localStorage for guest/current simulation parameters
    localStorage.removeItem('lastVisitedRoute');
    // Clear user progress state trigger
    localStorage.removeItem('user_progress');

    showToast('Learning progress reset successfully! 🔄');
    setShowResetConfirm(false);
    setConfirmText('');
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

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
    <div className="p-4 md:p-12 bg-brand-50 dark:bg-slate-900 min-h-full transition-colors pb-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black text-slate-800 dark:text-white mb-12 tracking-tighter uppercase text-left">
          {t('settings')}
        </h1>

        {/* 1. Language Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-950 transition-colors text-left">
          <div className="flex items-center space-x-4 mb-6">
            <Globe className="w-8 h-8 text-[#111827] dark:text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('language_label')}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-6 leading-tight">
            {t('settings_language_desc')}
          </p>
          <div className="relative w-full sm:w-80">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none bg-slate-50 dark:bg-slate-700/50 border-4 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white font-black py-4 px-6 rounded-2xl text-lg leading-tight focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all cursor-pointer"
              aria-label={t('language_label')}
            >
              <option value={Language.EN}>{t('language_english')}</option>
              <option value={Language.FR}>{t('language_french')}</option>
              <option value={Language.AR}>{t('language_arabic')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Theme / Appearance Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-950 transition-colors text-left">
          <div className="flex items-center space-x-4 mb-6">
            <Palette className="w-8 h-8 text-[#111827] dark:text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('appearance')}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8 leading-tight">
            {t('appearance_desc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Light Mode Button */}
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-3xl border-4 transition-all transform active:scale-95 ${theme === 'light'
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-[#111827] dark:border-[#FBBF24] shadow-md'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 grayscale opacity-60'
                }`}
            >
              <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm animate-pulse">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t('light_mode')}</span>
              {theme === 'light' && (
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#111827] text-white rounded-full flex items-center justify-center font-black shadow-md text-xs">✓</div>
              )}
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-3xl border-4 transition-all transform active:scale-95 ${theme === 'dark'
                  ? 'bg-slate-850 dark:bg-slate-750 border-[#111827] dark:border-[#FBBF24] shadow-md'
                  : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 grayscale opacity-60'
                }`}
            >
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <span className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t('dark_mode')}</span>
              {theme === 'dark' && (
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#FBBF24] text-slate-900 rounded-full flex items-center justify-center font-black shadow-md text-xs">✓</div>
              )}
            </button>
          </div>
        </div>

        {/* 3. Audio & Feedback Settings */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-950 transition-colors text-left">
          <div className="flex items-center space-x-4 mb-6">
            <Volume2 className="w-8 h-8 text-[#111827] dark:text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Audio & Sounds</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8 leading-tight">
            Adjust the sounds, alerts, and speech feedback settings for interactive lessons.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#111827]/5 dark:bg-[#FBBF24]/15 rounded-xl text-slate-700 dark:text-amber-400">
                  {soundEffects ? <Volume1 className="w-6 h-6" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">Sound Effects</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Play reward, success, and level completion audio cues.</p>
                </div>
              </div>
              <Switch checked={soundEffects} onChange={toggleSound} id="switch-sound-effects" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#111827]/5 dark:bg-[#FBBF24]/15 rounded-xl text-slate-700 dark:text-amber-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">Mascot Voiceover</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Enable the AI learning buddy speech synth voice explanations.</p>
                </div>
              </div>
              <Switch checked={mascotVoice} onChange={toggleMascot} id="switch-mascot-voice" />
            </div>
          </div>
        </div>

        {/* 4. AI & Alerts Preferences */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-slate-200 dark:border-slate-950 transition-colors text-left">
          <div className="flex items-center space-x-4 mb-6">
            <Bell className="w-8 h-8 text-[#111827] dark:text-[#FBBF24]" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">AI & Notification Preferences</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8 leading-tight">
            Control the frequency of study alerts and personalized AI coaching recommendations.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#111827]/5 dark:bg-[#FBBF24]/15 rounded-xl text-slate-700 dark:text-amber-400">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">AI Coach Insights</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Receive personalized studying routes generated dynamically by the edge AI.</p>
                </div>
              </div>
              <Switch checked={aiCoach} onChange={toggleAI} id="switch-ai-coach" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#111827]/5 dark:bg-[#FBBF24]/15 rounded-xl text-slate-700 dark:text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-200">Study Streak Reminders</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">Receive daily notifications to protect your streak before it resets.</p>
                </div>
              </div>
              <Switch checked={studyReminders} onChange={toggleReminders} id="switch-study-reminders" />
            </div>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border-b-[10px] border-red-200 dark:border-red-950 transition-colors text-left">
          <div className="flex items-center space-x-4 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight text-red-500">Danger Zone</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8 leading-tight">
            Take highly sensitive administrative actions on your local workspace cache or progress state.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearCache}
              className="bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-6 rounded-2xl text-sm uppercase tracking-wide border-b-4 border-amber-700 active:border-b-2 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" /> Clear Local Cache
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-500 hover:bg-red-650 text-white font-black py-4 px-6 rounded-2xl text-sm uppercase tracking-wide border-b-4 border-red-700 active:border-b-2 active:translate-y-0.5 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5" /> Reset Course Progress
            </button>
          </div>
        </div>

        {/* Reset Progress Modal overlay */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full relative border-b-8 border-red-500 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center text-red-500 text-3xl">⚠️</div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Are you absolutely sure?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-2 leading-relaxed">
                  This action is irreversible. All completed lessons, streak logs, scores, and XP stars will be permanently erased.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="input-reset-confirm" className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block text-left">
                  Type "RESET" in all capitals to proceed:
                </label>
                <input
                  id="input-reset-confirm"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="RESET"
                  className="w-full text-center px-4 py-3 bg-slate-50 dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl font-black text-lg focus:outline-none focus:border-red-500 focus:ring-0 transition-colors"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    setConfirmText('');
                  }}
                  className="flex-1 bg-slate-200 dark:bg-slate-750 text-slate-700 dark:text-slate-200 font-black py-3.5 px-4 rounded-xl text-xs uppercase cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  disabled={confirmText !== 'RESET'}
                  className={`flex-1 font-black py-3.5 px-4 rounded-xl text-xs uppercase cursor-pointer text-white border-b-4 ${
                    confirmText === 'RESET' 
                      ? 'bg-red-500 hover:bg-red-600 border-red-700 active:border-b-2 active:translate-y-0.5' 
                      : 'bg-slate-300 dark:bg-slate-700 border-slate-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  Yes, Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Version Info */}
        <div className="text-center py-8">
          <p className="text-slate-400 dark:text-slate-600 font-black uppercase text-sm tracking-widest flex items-center justify-center gap-1.5">
            Code For Tomorrow v1.2.0 • Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
