import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, Zap, Users, TrendingUp, Search, 
  BookOpen, DollarSign, Bell, Star, 
  Twitter, Github, Mail, Menu, X, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { User } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser?: User | null;
  onLogout?: () => void;
}

const GENERAL_ITEMS = [
  { id: 'feed', icon: Home, label: 'Home' },
  { id: 'yc-oss', icon: Zap, label: 'AI Repos' },
  { id: 'gsoc', icon: Users, label: 'Hack Repos' },
  { id: 'trending', icon: TrendingUp, label: 'Hot Now' },
  { id: 'issues', icon: Search, label: 'Good First Issues' },
];

const COMMUNITY_ITEMS = [
  { id: 'leaderboard', icon: Users, label: 'Top Contributors' },
  { id: 'resources', icon: BookOpen, label: 'Starter Kits' },
  { id: 'bounties', icon: DollarSign, label: 'Earn & Code' },
];

const MY_DASHBOARD_ITEMS = [
  { id: 'admin', icon: Search, label: 'My Saved' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, currentUser, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'feed';

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
                    navigate(`/open-source?tab=${item.id}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-sm font-semibold
                    ${isActive 
                      ? 'bg-slate-800/50 text-[#facc15]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-[#facc15]' : ''}`} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#facc15]" />}
                </button>
              );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans selection:bg-[#facc15]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#09090b] z-50 sticky top-0">
        <div className="flex items-center gap-3 w-64 shrink-0">
          <div className="w-6 h-6 rounded-full border-2 border-white"></div>
          <span className="font-black text-xl tracking-wider italic">CFTOS</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 px-3 py-1.5 rounded-md text-xs font-bold transition-colors">
            <Star className="w-3.5 h-3.5 fill-current" /> Premium
          </button>
          
          <div className="h-6 w-px bg-slate-800 mx-2"></div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-2"></div>

          <button className="text-[10px] font-bold text-slate-300 border border-dashed border-slate-600 px-4 py-2 rounded uppercase tracking-widest hover:border-slate-400 hover:text-white transition-colors">
            Follow on X
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
                <span className="text-[10px] text-slate-500 font-mono">⭐ {currentUser.progress?.xp || 0} XP</span>
              </div>
              <button 
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/auth');
                }}
                className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-dashed border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded uppercase tracking-widest transition-colors ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                localStorage.setItem('lastVisitedRoute', window.location.pathname + window.location.search);
                navigate('/auth');
              }}
              className="bg-[#facc15] hover:bg-[#facc15]/90 text-black px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all shadow-md shadow-[#facc15]/10 hover:shadow-[#facc15]/20"
            >
              Sign In
            </button>
          )}
        </div>

        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-white p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-[#09090b] overflow-y-auto py-6 shrink-0">
          {renderNavSection('General', GENERAL_ITEMS)}
          {renderNavSection('Community', COMMUNITY_ITEMS)}
          {renderNavSection('My Dashboard', MY_DASHBOARD_ITEMS)}
          
          <div className="mt-auto px-4 pt-6">
            <Link to="/" className="text-xs font-bold text-slate-600 hover:text-[#facc15] transition-colors flex items-center gap-2">
              ← Back to Main App
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
            {renderNavSection('General', GENERAL_ITEMS)}
            {renderNavSection('Community', COMMUNITY_ITEMS)}
            {renderNavSection('My Dashboard', MY_DASHBOARD_ITEMS)}
            
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
                      <span className="text-xs text-slate-500 font-mono">⭐ {currentUser.progress?.xp || 0} XP</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (onLogout) onLogout();
                      navigate('/auth');
                    }}
                    className="text-xs font-bold text-red-400 hover:text-red-300 font-mono px-3 py-2 border border-dashed border-red-500/20 rounded uppercase"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    localStorage.setItem('lastVisitedRoute', window.location.pathname + window.location.search);
                    navigate('/auth');
                  }}
                  className="bg-[#facc15] hover:bg-[#facc15]/90 text-black px-4 py-2.5 rounded-lg font-mono text-sm font-bold transition-all w-full text-center"
                >
                  Sign In
                </button>
              )}

              <button className="flex items-center justify-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 px-3 py-2 rounded-md text-xs font-bold transition-colors w-full">
                <Star className="w-3.5 h-3.5 fill-current" /> Premium
              </button>
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-2 py-2">
                ← Back to Main App
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
