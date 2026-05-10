import React from 'react';
import { motion } from 'motion/react';
import { Home, Trophy, BookOpen, Settings, Github, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'feed', icon: Home, label: 'Project Feed' },
  { id: 'leaderboard', icon: Trophy, label: 'Leaderboard' },
  { id: 'resources', icon: BookOpen, label: 'Resources Hub' },
  { id: 'admin', icon: Settings, label: 'Curate Content' },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex font-sans selection:bg-[#00f2ff]/30 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-dashed border-[#111217] bg-[#050505] p-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#00f2ff]/10 rounded border border-[#00f2ff]/30 flex items-center justify-center">
            <Github className="w-6 h-6 text-[#00f2ff]" />
          </div>
          <span className="font-bold tracking-widest text-[#00f2ff] uppercase text-sm font-mono">Deep Tech<br/>Curation</span>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium text-sm tracking-wide
                  ${isActive 
                    ? 'bg-[#111217] text-[#00f2ff] border border-dashed border-[#00f2ff]/50 shadow-[0_0_15px_rgba(0,242,255,0.1)]' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-[#111217]/50 border border-transparent'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#00f2ff]' : ''}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-dashed border-[#111217]">
          <Link to="/" className="text-xs font-mono text-slate-600 hover:text-[#00f2ff] transition-colors flex items-center gap-2">
            ← Back to Main App
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-md border-b border-dashed border-[#111217] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-2">
          <Github className="w-6 h-6 text-[#00f2ff]" />
          <span className="font-bold text-[#00f2ff] font-mono text-sm uppercase">Deep Tech</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#00f2ff] p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden fixed top-16 left-0 right-0 bg-[#050505] border-b border-dashed border-[#111217] p-6 z-40 shadow-2xl"
        >
          <nav className="space-y-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all font-medium text-sm tracking-wide
                    ${isActive 
                      ? 'bg-[#111217] text-[#00f2ff] border border-dashed border-[#00f2ff]/50' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-[#111217]/50 border border-transparent'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-[#00f2ff]' : ''}`} />
                  {item.label}
                </button>
              );
            })}
            <div className="pt-4 mt-4 border-t border-dashed border-[#111217]">
              <Link to="/" className="text-xs font-mono text-slate-600 hover:text-[#00f2ff] transition-colors flex items-center gap-2 px-4 py-2">
                ← Back to Main App
              </Link>
            </div>
          </nav>
        </motion.div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pt-16 md:pt-0 relative">
        {/* Subtle background glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00f2ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00f2ff] rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="flex-1 p-6 md:p-10 lg:p-16 relative z-10 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar - Only visible if not overridden by overlay */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/90 backdrop-blur-md border-t border-dashed border-[#111217] flex items-center justify-around px-2 z-30 pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${isActive ? 'text-[#00f2ff]' : 'text-slate-600 hover:text-slate-400'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-widest">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
