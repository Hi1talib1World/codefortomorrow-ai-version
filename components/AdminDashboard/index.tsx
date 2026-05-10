import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, FileText, BarChart3, Settings,
  PlusCircle, LogOut, ChevronRight, Menu, X, Shield
} from 'lucide-react';
import ContentTable from './ContentTable';
import ContentEditor from './ContentEditor';
import AnalyticsPanel from './AnalyticsPanel';

interface AdminDashboardProps {
  currentUser: { name: string; email: string; profilePictureUrl: string } | null;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'content', label: 'Content', icon: FileText, path: '/admin' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
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
        <div className="w-8 h-8 rounded-lg bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-[#facc15]" />
        </div>
        <div>
          <div className="text-xs font-black tracking-widest text-[#facc15] uppercase">Admin</div>
          <div className="text-[10px] text-slate-500 font-mono">Control Panel</div>
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
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${active
                  ? 'bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/20'
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
          className="w-full flex items-center justify-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-black font-bold text-sm py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={currentUser?.profilePictureUrl}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full border border-slate-700 object-cover"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{currentUser?.name}</div>
            <div className="text-[10px] text-[#facc15] font-mono">Admin</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors py-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-[#0a0a0d] shrink-0 sticky top-0 h-screen">
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
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#09090b] sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span className="text-[#facc15]">CFTOS</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">
                {location.pathname === '/admin' || location.pathname === '/admin/'
                  ? 'Content'
                  : location.pathname.includes('/analytics')
                  ? 'Analytics'
                  : location.pathname.includes('/new')
                  ? 'New Post'
                  : location.pathname.includes('/edit')
                  ? 'Edit Post'
                  : 'Admin'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-[10px] font-bold rounded-md uppercase tracking-widest">
              Owner
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="p-6 md:p-8 max-w-7xl mx-auto w-full"
            >
              <Routes>
                <Route path="/" element={<ContentTable />} />
                <Route path="/new" element={<ContentEditor />} />
                <Route path="/edit/:id" element={<ContentEditor />} />
                <Route path="/analytics" element={<AnalyticsPanel />} />
                <Route path="/settings" element={
                  <div className="text-slate-400 font-mono text-sm p-8 text-center">
                    Settings panel coming soon.
                  </div>
                } />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
