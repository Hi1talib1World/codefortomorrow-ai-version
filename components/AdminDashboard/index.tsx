import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, FileText, BarChart3, Settings, Users,
  PlusCircle, LogOut, ChevronRight, ChevronLeft, Menu, X, Shield, Bot, Globe
} from 'lucide-react';
import AdminOverview from './AdminOverview';
import ContentTable from './ContentTable';
import ContentEditor from './ContentEditor';
import UsersPanel from './UsersPanel';
import SettingsPanel from './SettingsPanel';
import AnalyticsPanel from './AnalyticsPanel';
import { AdminPanel as OpenSourceAdmin } from '../OpenSourceScreen/AdminPanel';
import AgentsPage from '../AgentsPage';

interface AdminDashboardProps {
  currentUser: { name: string; email: string; profilePictureUrl: string } | null;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
  { id: 'content', label: 'Content & Blog', icon: FileText, path: '/admin/content' },
  { id: 'users', label: 'User Accounts', icon: Users, path: '/admin/users' },
  { id: 'opensource', label: 'Open Source', icon: Globe, path: '/admin/opensource' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'agents', label: 'AI Agents', icon: Bot, path: '/admin/agents' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center shadow-inner">
          <Shield className="w-4 h-4 text-[#facc15]" />
        </div>
        <div>
          <div className="text-xs font-black tracking-widest text-[#facc15] uppercase">Admin Hub</div>
          <div className="text-[10px] text-slate-500 font-mono">Code for Tomorrow</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer
                ${active
                  ? 'bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              {active && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </nav>

      {/* New Post CTA */}
      <div className="px-3 pb-4">
        <button
          onClick={() => { navigate('/admin/new'); setIsSidebarOpen(false); }}
          className="w-full flex items-center justify-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-colors shadow-lg shadow-yellow-500/10 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-800 bg-[#09090b]">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={currentUser?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Admin')}&background=random`}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">{currentUser?.name || 'Administrator'}</div>
            <div className="text-[10px] text-[#facc15] font-mono font-bold">Owner & Admin</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors py-1 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800/80 bg-[#0a0a0d] shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="md:hidden fixed inset-y-0 left-0 w-64 bg-[#0a0a0d] border-r border-slate-800 z-50 flex flex-col"
          >
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-800/80 flex items-center justify-between px-6 bg-[#09090b] sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            {location.pathname !== '/admin' && location.pathname !== '/admin/' && (
              <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white mr-2 cursor-pointer">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="text-[#facc15] font-bold">Admin</span>
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-white font-semibold">
                {location.pathname === '/admin' || location.pathname === '/admin/'
                  ? 'Overview'
                  : location.pathname.includes('/content')
                  ? 'Content & Blog'
                  : location.pathname.includes('/users')
                  ? 'User Accounts'
                  : location.pathname.includes('/analytics')
                  ? 'Analytics'
                  : location.pathname.includes('/opensource')
                  ? 'Open Source'
                  : location.pathname.includes('/agents')
                  ? 'AI Agents'
                  : location.pathname.includes('/new')
                  ? 'New Article'
                  : location.pathname.includes('/edit')
                  ? 'Edit Article'
                  : location.pathname.includes('/settings')
                  ? 'Settings'
                  : 'Control Panel'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-[#facc15] font-semibold transition-colors hidden sm:inline-block"
            >
              View Blog ↗
            </a>
            <span className="px-2.5 py-1 bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
              Owner
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
              <Routes>
                <Route path="/" element={<AdminOverview />} />
                <Route path="/content" element={<ContentTable />} />
                <Route path="/users" element={<UsersPanel />} />
                <Route path="/new" element={<ContentEditor />} />
                <Route path="/edit/:id" element={<ContentEditor />} />
                <Route path="/analytics" element={<AnalyticsPanel />} />
                <Route path="/opensource" element={<OpenSourceAdmin />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/settings" element={<SettingsPanel />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
