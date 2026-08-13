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
  Volume1,
  Sparkles,
  Check
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
    showToast('Language updated successfully!');
  };

  const toggleSound = () => {
    const next = !soundEffects;
    setSoundEffects(next);
    localStorage.setItem('setting_sound_effects', String(next));
    showToast(next ? 'Sound effects enabled!' : 'Sound effects muted!');
  };

  const toggleMascot = () => {
    const next = !mascotVoice;
    setMascotVoice(next);
    localStorage.setItem('setting_mascot_voice', String(next));
    showToast(next ? 'Mascot voiceovers enabled!' : 'Mascot voiceovers disabled!');
  };

  const toggleAI = () => {
    const next = !aiCoach;
    setAiCoach(next);
    localStorage.setItem('setting_ai_coach', String(next));
    showToast(next ? 'AI Coach Insights activated!' : 'AI Coach Insights deactivated!');
  };

  const toggleReminders = () => {
    const next = !studyReminders;
    setStudyReminders(next);
    localStorage.setItem('setting_study_reminders', String(next));
    showToast(next ? 'Study reminders activated!' : 'Study reminders deactivated!');
  };

  const handleClearCache = () => {
    const themeVal = localStorage.getItem('theme');
    const langVal = localStorage.getItem('language');
    
    // Clear everything except user session indicators, theme, and language
    localStorage.clear();
    
    if (themeVal) localStorage.setItem('theme', themeVal);
    if (langVal) localStorage.setItem('language', langVal);
    
    showToast('Local application cache cleared!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleResetProgress = () => {
    if (confirmText !== 'RESET') {
      showToast('Please type RESET in capital letters to confirm!');
      return;
    }

    localStorage.removeItem('lastVisitedRoute');
    localStorage.removeItem('user_progress');

    showToast('Learning progress reset successfully!');
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
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#1A73E8]' : 'bg-[#DADCE0] dark:bg-[#5F6368]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full flex flex-col py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
        <div className="space-y-2 text-left">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
            WORKSPACE CONFIGURATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
            {t('settings')}
          </h1>
          <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm font-normal">
            Customize language, theme, audio feedback, and AI preferences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-y-8 gap-x-6 w-full">
        {/* 1. Language Section */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#202124] dark:text-white">{t('language_label')}</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">{t('settings_language_desc')}</p>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full appearance-none bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] text-[#202124] dark:text-white font-semibold py-3.5 px-5 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-[#1A73E8] transition-all cursor-pointer"
              aria-label={t('language_label')}
            >
              <option value={Language.EN}>{t('language_english')}</option>
              <option value={Language.FR}>{t('language_french')}</option>
              <option value={Language.AR}>{t('language_arabic')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#5F6368] dark:text-[#9AA0A6]">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Theme / Appearance Section */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#202124] dark:text-white">{t('appearance')}</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">{t('appearance_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Light Mode Button */}
            <button
              onClick={() => theme === 'dark' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-2xl border transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-[#1A73E8] bg-[#E8F0FE]/50 text-[#1A73E8] font-bold shadow-sm'
                  : 'border-[#E8EAED] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] text-[#5F6368] dark:text-[#9AA0A6]'
              }`}
            >
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-3">
                <Sun className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">{t('light_mode')}</span>
              {theme === 'light' && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#1A73E8] text-white rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              )}
            </button>

            {/* Dark Mode Button */}
            <button
              onClick={() => theme === 'light' && toggleTheme()}
              className={`relative flex flex-col items-center p-6 rounded-2xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#8AB4F8] bg-[#3C4043] text-white font-bold shadow-sm'
                  : 'border-[#E8EAED] dark:border-[#3C4043] bg-[#F8F9FA] dark:bg-[#202124] text-[#5F6368] dark:text-[#9AA0A6]'
              }`}
            >
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center mb-3">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">{t('dark_mode')}</span>
              {theme === 'dark' && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-[#8AB4F8] text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">✓</div>
              )}
            </button>
          </div>
        </div>

        {/* 3. Audio & Feedback Settings */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#202124] dark:text-white">Audio & Sounds</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">Adjust sound effects and mascot voice audio settings.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F8F9FA] dark:bg-[#202124] rounded-2xl border border-[#E8EAED] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F0FE] dark:bg-[#3C4043] rounded-xl text-[#1A73E8] dark:text-[#8AB4F8]">
                  {soundEffects ? <Volume1 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-[#5F6368]" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#202124] dark:text-white">Sound Effects</h4>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">Play reward, success, and level completion audio cues.</p>
                </div>
              </div>
              <Switch checked={soundEffects} onChange={toggleSound} id="switch-sound-effects" />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F8F9FA] dark:bg-[#202124] rounded-2xl border border-[#E8EAED] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F0FE] dark:bg-[#3C4043] rounded-xl text-[#1A73E8] dark:text-[#8AB4F8]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#202124] dark:text-white">Mascot Voiceover</h4>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">Enable AI learning buddy speech explanations.</p>
                </div>
              </div>
              <Switch checked={mascotVoice} onChange={toggleMascot} id="switch-mascot-voice" />
            </div>
          </div>
        </div>

        {/* 4. AI Preferences */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#202124] dark:text-white">AI & Notifications</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">Control AI coaching recommendations and daily reminders.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F8F9FA] dark:bg-[#202124] rounded-2xl border border-[#E8EAED] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F0FE] dark:bg-[#3C4043] rounded-xl text-[#1A73E8] dark:text-[#8AB4F8]">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#202124] dark:text-white">AI Coach Insights</h4>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">Receive personalized learning routes generated by AI.</p>
                </div>
              </div>
              <Switch checked={aiCoach} onChange={toggleAI} id="switch-ai-coach" />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F8F9FA] dark:bg-[#202124] rounded-2xl border border-[#E8EAED] dark:border-[#3C4043]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#E8F0FE] dark:bg-[#3C4043] rounded-xl text-[#1A73E8] dark:text-[#8AB4F8]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#202124] dark:text-white">Study Streak Reminders</h4>
                  <p className="text-[11px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">Receive daily alerts to protect your streak.</p>
                </div>
              </div>
              <Switch checked={studyReminders} onChange={toggleReminders} id="switch-study-reminders" />
            </div>
          </div>
        </div>

        {/* 5. Danger Zone */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 bg-white dark:bg-[#292A2D] border border-[#EA4335]/30 rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] text-left space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-[#FCE8E6] text-[#EA4335] dark:bg-[#3C4043] dark:text-[#F28B82]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#EA4335] uppercase tracking-wide">Danger Zone</h2>
              <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">Clear workspace cache or reset course progress.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleClearCache}
              className="bg-[#FBBC04] hover:bg-[#F29900] text-slate-900 font-bold py-3 px-5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" /> Clear Local Cache
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="bg-[#EA4335] hover:bg-[#D93025] text-white font-bold py-3 px-5 rounded-2xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" /> Reset Course Progress
            </button>
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-xl">
              <div className="w-14 h-14 mx-auto bg-[#FCE8E6] text-[#EA4335] rounded-full flex items-center justify-center text-2xl font-bold">
                ⚠️
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-[#202124] dark:text-white">Are you absolutely sure?</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal leading-relaxed">
                  This action cannot be undone. All completed lessons and streak logs will be reset.
                </p>
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[11px] font-mono text-[#5F6368] dark:text-[#9AA0A6] block">
                  Type "RESET" to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="RESET"
                  className="w-full text-center px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] text-[#202124] dark:text-white rounded-2xl font-mono text-sm focus:outline-none focus:border-[#EA4335]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    setConfirmText('');
                  }}
                  className="flex-1 bg-[#F1F3F4] dark:bg-[#3C4043] text-[#202124] dark:text-white font-bold py-2.5 rounded-full text-xs cursor-pointer hover:bg-[#E8EAED]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetProgress}
                  disabled={confirmText !== 'RESET'}
                  className={`flex-1 font-bold py-2.5 rounded-full text-xs text-white cursor-pointer transition ${
                    confirmText === 'RESET' 
                      ? 'bg-[#EA4335] hover:bg-[#D93025]' 
                      : 'bg-[#EA4335]/40 cursor-not-allowed'
                  }`}
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="col-span-12 lg:col-span-8 lg:col-start-3 text-center py-6">
          <p className="text-[#5F6368] dark:text-[#9AA0A6] font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 font-mono">
            Code For Tomorrow Morocco v1.2.0 • Made with <Heart className="w-3.5 h-3.5 text-[#EA4335] fill-[#EA4335]" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
