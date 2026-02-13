
import React, { useState } from 'react';
import Mascot from './Mascot';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t } = useLanguage();

  // Mock login/register functionality
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you'd have validation and an API call here.
    onLoginSuccess();
  };

  const activeTabClasses = 'bg-white text-blue-500 shadow-lg';
  const inactiveTabClasses = 'bg-blue-400 text-white hover:bg-blue-300';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24">
             <Mascot />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6 rounded-xl bg-blue-500 p-1">
            <button
              onClick={() => setIsLoginView(true)}
              className={`w-1/2 p-3 rounded-lg font-bold text-lg transition-all ${isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('login')}
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`w-1/2 p-3 rounded-lg font-bold text-lg transition-all ${!isLoginView ? activeTabClasses : inactiveTabClasses}`}
            >
              {t('signUp')}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">
            {isLoginView ? t('welcome_back') : t('join_the_adventure')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1" htmlFor="username">{t('username')}</label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-500 block mb-1" htmlFor="password">{t('password')}</label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 w-full bg-green-500 text-white font-bold py-4 px-6 rounded-2xl text-xl uppercase border-b-8 border-green-700 hover:bg-green-400 active:border-b-4 transition-all duration-150 transform active:translate-y-1"
            >
              {isLoginView ? t('login') : t('create_account')}
            </button>
          </form>
          <div className="text-center mt-6">
            <button 
              onClick={onLoginSuccess}
              className="text-slate-500 hover:text-blue-500 font-bold text-sm transition-colors"
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
