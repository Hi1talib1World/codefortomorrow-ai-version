import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Language } from '../../types';
import api from '../../services/api';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  skipAuth: () => void;
}

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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('');
    setIsLoading(true);
    try {
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      const user = await api.loginWithGoogle(credentialResponse.credential);
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Login was unsuccessful.');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const activeTabClasses = 'bg-[#4285F4] text-white shadow-sm z-10';
  const inactiveTabClasses = 'text-slate-500 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-700/50';

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-slate-900 transition-colors flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Top Bar with Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <div className="relative">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-white dark:bg-slate-800 dark:text-slate-200 rounded-full py-2 pl-4 pr-10 font-bold border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#4285F4] transition-all shadow-sm text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700"
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
          <div className="w-24 h-24 transform hover:scale-105 transition-transform cursor-pointer drop-shadow-md">
            <Mascot />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 transition-colors rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
          <div className="flex mb-8 rounded-2xl bg-slate-100 dark:bg-slate-900 p-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/50">
            <button
              onClick={() => handleViewChange(true)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => handleViewChange(false)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none ${!isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('signUp')}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-8 tracking-tight">
            {isLoginView ? t('welcome_back') : t('join_the_adventure')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {!isLoginView && (
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 px-1" htmlFor="name">{t('username')}</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4285F4]/20 focus:border-[#4285F4] transition-all font-medium text-base hover:border-slate-300 dark:hover:border-slate-600" required />
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 px-1" htmlFor="email">{t('email')}</label>
                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4285F4]/20 focus:border-[#4285F4] transition-all font-medium text-base hover:border-slate-300 dark:hover:border-slate-600" required />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-1.5 px-1" htmlFor="password">{t('password')}</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#4285F4]/20 focus:border-[#4285F4] transition-all font-medium text-base hover:border-slate-300 dark:hover:border-slate-600" required />
              </div>
            </div>

            {error && <p className="text-[#EA4335] text-sm text-center mt-4 font-bold animate-shake">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full py-4 rounded-full bg-[#4285F4] hover:bg-[#1a73e8] text-white font-bold text-[15px] tracking-wide shadow-sm hover:shadow active:scale-[0.98] transition-all disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? '...' : (isLoginView ? t('login') : t('create_account'))}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">{t('or_continue_with')}</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              theme="filled_blue"
              text="continue_with"
              size="large"
              width="100%"
            />
          </div>

          <div className="text-center mt-10">
            <button
              onClick={skipAuth}
              disabled={isLoading}
              className="text-slate-500 hover:text-[#4285F4] dark:text-slate-400 dark:hover:text-[#8ab4f8] font-bold text-sm transition-colors disabled:opacity-50"
            >
              {t('skip_for_now')}
            </button>
          </div>
        </div >
      </div >
    </div >
  );
};

export default AuthScreen;
