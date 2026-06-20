import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, Zap, Users, TrendingUp, Search, 
  BookOpen, DollarSign, Bell, Star, 
  Twitter, Github, Mail, Menu, X, ChevronRight, CheckCircle2,
  Globe, Share2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useI18n } from './i18n';

import { User } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'feed';
  const { t, lang, setLang } = useI18n();

  const GENERAL_ITEMS = [
    { id: 'feed', icon: Home, label: t('nav.home') },
    { id: 'gsoc', icon: Users, label: t('nav.hackRepos') },
    { id: 'trending', icon: TrendingUp, label: t('nav.hotNow') },
    { id: 'issues', icon: Search, label: t('nav.goodFirstIssues') },
  ];

  const COMMUNITY_ITEMS = [
    { id: 'community', icon: Share2, label: t('nav.community') },
    { id: 'leaderboard', icon: Users, label: t('nav.topContributors') },
    { id: 'resources', icon: BookOpen, label: t('nav.starterKits') },
    { id: 'bounties', icon: DollarSign, label: t('nav.earnAndCode') },
  ];

  const MY_DASHBOARD_ITEMS = [
    { id: 'admin', icon: Search, label: t('nav.mySaved') },
  ];

  const renderNavSection = (title: string, items: typeof GENERAL_ITEMS) => (
    <div className="mb-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-3">{title}</h3>
      <div className="space-y-1">
        {items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/cftos?tab=${item.id}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold
                    ${isActive 
                      ? 'bg-slate-800/50 text-[#FBBF24]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#FBBF24]' : ''}`} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#FBBF24]" />}
                </button>
              );
        })}
      </div>
    </div>
  );

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-[#FBBF24]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#09090b] z-50 sticky top-0">
        <div className="flex items-center gap-3 w-64 shrink-0">
          <div className="w-6 h-6 rounded-full border-2 border-white"></div>
          <span className="font-black text-xl tracking-wider italic">CFTOS</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-[#FBBF24]/50 bg-slate-900/50 hover:bg-[#FBBF24]/5 transition-all duration-300"
            title={lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
          >
            <Globe className="w-4 h-4 text-slate-400 group-hover:text-[#FBBF24] transition-colors" />
            <div className="relative flex items-center bg-slate-800 rounded-md overflow-hidden">
              <span 
                className={`px-2 py-0.5 text-[11px] font-bold tracking-wide transition-all duration-300 ${
                  lang === 'en' 
                    ? 'bg-[#FBBF24] text-black' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                EN
              </span>
              <span 
                className={`px-2 py-0.5 text-[11px] font-bold tracking-wide transition-all duration-300 ${
                  lang === 'ar' 
                    ? 'bg-[#FBBF24] text-black' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
              >
                عر
              </span>
            </div>
          </button>

          <div className="h-6 w-px bg-slate-800"></div>

          <button className="text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1.5 bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24]/20 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
            <Star className="w-3.5 h-3.5 fill-current" /> {t('header.premium')}
          </button>
          
          <div className="h-6 w-px bg-slate-800 mx-2"></div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-2"></div>

          <button className="text-[10px] font-bold text-slate-300 border border-dashed border-slate-600 px-4 py-2 rounded uppercase tracking-widest hover:border-slate-400 hover:text-white transition-colors">
            {t('header.followOnX')}
          </button>

          <div className="h-6 w-px bg-slate-800 mx-2"></div>

          {currentUser && !currentUser._id.startsWith('guest_') ? (
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full border border-slate-700 object-cover"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight font-mono">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-mono"> {currentUser.progress?.xp || 0} XP</span>
              </div>
              <button 
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/auth');
                }}
                className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-dashed border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded uppercase tracking-widest transition-colors ml-2"
              >
                {t('header.logout')}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                localStorage.setItem('lastVisitedRoute', window.location.pathname + window.location.search);
                navigate('/auth');
              }}
              className="bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-black px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md shadow-[#FBBF24]/10 hover:shadow-[#FBBF24]/20"
            >
              {t('header.signIn')}
            </button>
          )}
        </div>

        {/* Mobile: Language toggle + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/50 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-[10px] font-bold ${lang === 'en' ? 'text-[#FBBF24]' : 'text-slate-500'}`}>EN</span>
            <span className="text-[10px] text-slate-600">/</span>
            <span 
              className={`text-[10px] font-bold ${lang === 'ar' ? 'text-[#FBBF24]' : 'text-slate-500'}`}
              style={{ fontFamily: "'Noto Kufi Arabic', sans-serif" }}
            >
              عر
            </span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-[#09090b] overflow-y-auto py-6 shrink-0">
          {renderNavSection(t('nav.general'), GENERAL_ITEMS)}
          {renderNavSection(t('nav.community'), COMMUNITY_ITEMS)}
          {renderNavSection(t('nav.myDashboard'), MY_DASHBOARD_ITEMS)}
          
          <div className="mt-auto px-4 pt-6">
            <Link to="/" className="text-xs font-bold text-slate-600 hover:text-[#FBBF24] transition-colors flex items-center gap-2">
              {t('nav.backToMainApp')}
            </Link>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="md:hidden fixed inset-y-16 left-0 right-0 bg-[#09090b] border-t border-slate-800 p-4 z-40 overflow-y-auto"
          >
            {renderNavSection(t('nav.general'), GENERAL_ITEMS)}
            {renderNavSection(t('nav.community'), COMMUNITY_ITEMS)}
            {renderNavSection(t('nav.myDashboard'), MY_DASHBOARD_ITEMS)}
            
            <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col gap-4">
              {currentUser && !currentUser._id.startsWith('guest_') ? (
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-850">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-full border border-slate-700 object-cover"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-white leading-tight font-mono">{currentUser.name}</span>
                      <span className="text-xs text-slate-500 font-mono"> {currentUser.progress?.xp || 0} XP</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      navigate('/auth');
                    }}
                    className="text-xs font-bold text-red-400 hover:text-red-300 font-mono px-3 py-2 border border-dashed border-red-500/20 rounded uppercase"
                  >
                    {t('header.logout')}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    localStorage.setItem('lastVisitedRoute', window.location.pathname + window.location.search);
                    navigate('/auth');
                  }}
                  className="bg-[#FBBF24] hover:bg-[#FBBF24]/90 text-black px-4 py-2.5 rounded-lg font-mono text-sm font-bold transition-all w-full text-center"
                >
                  {t('header.signIn')}
                </button>
              )}

              <button className="flex items-center justify-center gap-1.5 bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] hover:bg-[#FBBF24]/20 px-3 py-2 rounded-md text-xs font-bold transition-colors w-full">
                <Star className="w-3.5 h-3.5 fill-current" /> {t('header.premium')}
              </button>
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 py-2">
                {t('nav.backToMainApp')}
              </Link>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] relative">
          <div className="p-6 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

