
import React, { useState } from 'react';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Language } from '../../types';
import api from '../../services/api';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  skipAuth: () => void;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.222,0-9.655-3.449-11.303-8l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238
	C42.022,35.622,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, skipAuth }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t, language, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }
  
  const handleViewChange = (isLogin: boolean) => {
    setIsLoginView(isLogin);
    clearForm();
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user: User;
      if (isLoginView) { // Handle Login
        user = await api.login(email, password);
      } else { // Handle Sign Up
        user = await api.register(name, email, password);
      }
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    try {
      const user = await api.loginWithGoogle();
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const activeTabClasses = 'bg-white dark:bg-slate-800 text-blue-500 shadow-lg scale-105 z-10';
  const inactiveTabClasses = 'bg-blue-400 text-white hover:bg-blue-300 dark:bg-slate-700 dark:hover:bg-slate-600 opacity-80';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Top Bar with Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <div className="relative">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="appearance-none bg-white dark:bg-slate-800 dark:text-slate-200 rounded-xl p-3 pr-10 font-black border-b-4 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-xl text-sm"
            aria-label="Select language"
          >
            <option value={Language.EN}>🇬🇧 EN</option>
            <option value={Language.FR}>🇫🇷 FR</option>
            <option value={Language.AR}>🇲🇦 AR</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-sm w-full py-6">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 transform hover:scale-110 transition-transform cursor-pointer drop-shadow-2xl">
             <Mascot />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 transition-colors rounded-2xl shadow-2xl p-6 md:p-8 border-b-8 border-slate-200 dark:border-slate-950 kid-card">
          <div className="flex mb-6 rounded-xl bg-blue-500 dark:bg-slate-700 p-1.5 transition-colors shadow-inner">
            <button
              onClick={() => handleViewChange(true)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-lg font-black text-sm transition-all uppercase tracking-tighter bubbly-btn ${isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => handleViewChange(false)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-lg font-black text-sm transition-all uppercase tracking-tighter bubbly-btn ${!isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('signUp')}
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-center text-slate-800 dark:text-white mb-6 italic tracking-tighter uppercase leading-tight">
            {isLoginView ? t('welcome_back') : t('join_the_adventure')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
               {!isLoginView && (
                 <div>
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1 px-2" htmlFor="name">{t('username')}</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-black text-base" required />
                 </div>
               )}
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1 px-2" htmlFor="email">{t('email')}</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-black text-base" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1 px-2" htmlFor="password">{t('password')}</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-black text-base" required />
              </div>
            </div>
            
            {error && <p className="text-red-500 text-[10px] text-center mt-4 font-black animate-shake">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full bg-green-500 text-white font-black py-3 px-6 rounded-xl text-base uppercase border-b-4 border-green-700 hover:bg-green-400 active:border-b-0 active:translate-y-1 transition-all duration-150 transform disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:border-slate-500 disabled:opacity-50 shadow-xl bubbly-btn"
            >
              {isLoading ? '...' : (isLoginView ? t('login') : t('create_account'))}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t-2 border-slate-100 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest">{t('or_continue_with')}</span>
            <div className="flex-grow border-t-2 border-slate-100 dark:border-slate-700"></div>
          </div>

          <button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex justify-center items-center space-x-3 bg-white dark:bg-slate-700 dark:text-white text-slate-700 font-black py-3 px-4 rounded-xl border-2 border-b-4 border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all active:border-b-0 active:translate-y-1 transform disabled:opacity-50 shadow-lg bubbly-btn"
          >
            <GoogleIcon />
            <span className="uppercase tracking-tighter text-sm">{t('continue_with_google')}</span>
          </button>

          <div className="text-center mt-10">
            <button 
              onClick={skipAuth}
              disabled={isLoading}
              className="text-slate-400 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              {t('skip_for_now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
