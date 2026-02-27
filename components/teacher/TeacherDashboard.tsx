
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  Calendar,
  ChevronRight,
  MoreVertical,
  Menu
} from 'lucide-react';

import CreateAssignmentScreen from './CreateAssignmentScreen';

interface TeacherDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

type TeacherView = 'overview' | 'classes' | 'assignments' | 'students' | 'reports' | 'settings';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, onLogout }) => {
  const [activeView, setActiveView] = useState<TeacherView>('overview');
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'classes', icon: Users, label: 'My Classes' },
    { id: 'assignments', icon: BookOpen, label: 'Assignments' },
    { id: 'reports', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-8 animate-pop-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Students', value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Active Classes', value: '6', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Avg. Progress', value: '78%', icon: BarChart3, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Assignments', value: '12', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                  <div className={`${stat.bg} dark:bg-slate-700 p-4 rounded-2xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color} dark:text-white`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Active Classes</h2>
                  <button className="text-sm font-bold text-blue-600 hover:underline">View all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Grade 4 - Python Basics', students: 24, progress: 65, color: 'bg-blue-500' },
                    { name: 'Grade 5 - Web Dev', students: 18, progress: 42, color: 'bg-purple-500' },
                    { name: 'Logic Masters A', students: 30, progress: 88, color: 'bg-green-500' },
                    { name: 'Intro to JS', students: 22, progress: 15, color: 'bg-orange-500' },
                  ].map((cls, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4 group hover:shadow-md transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div className={`w-12 h-12 ${cls.color} rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg`}>
                          {cls.name[0]}
                        </div>
                        <button className="text-slate-300 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 dark:text-white">{cls.name}</h3>
                        <p className="text-xs font-bold text-slate-400">{cls.students} Students</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-slate-400">Class Progress</span>
                          <span className="text-slate-800 dark:text-white">{cls.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${cls.progress}%` }}
                            className={`h-full ${cls.color}`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications / Alerts */}
              <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Alerts</h2>
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-50 dark:divide-slate-700">
                  {[
                    { user: 'Adam K.', action: 'completed Python Quiz', time: '2m ago', type: 'success' },
                    { user: 'Sara M.', action: 'needs help with Loops', time: '15m ago', type: 'warning' },
                    { user: 'Youssef B.', action: 'earned Logic Master badge', time: '1h ago', type: 'success' },
                    { user: 'Class 4B', action: 'average score dropped', time: '3h ago', type: 'danger' },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                        alert.type === 'success' ? 'bg-green-500' : 
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          <span className="font-black">{alert.user}</span> {alert.action}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{alert.time}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setIsCreatingAssignment(true)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-500 transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="flex items-center justify-center h-64 text-slate-400 font-black uppercase italic">Coming Soon</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
      {/* Sidebar */}
      <aside className={`fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col shrink-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">C</div>
            <span className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter uppercase">C4T Teacher</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as TeacherView);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-black uppercase tracking-tight text-sm transition-all ${
                activeView === item.id 
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-black uppercase tracking-tight text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-64 sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students, classes, assignments..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
            />
            </div>
            </div>
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </button>
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-100 dark:border-slate-700">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 dark:text-white leading-none">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Teacher Account</p>
              </div>
              <img 
                src={currentUser.profilePictureUrl} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover border-2 border-blue-100 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
      {isCreatingAssignment && (
        <CreateAssignmentScreen onClose={() => setIsCreatingAssignment(false)} />
      )}
    </div>
  );
};

export default TeacherDashboard;
