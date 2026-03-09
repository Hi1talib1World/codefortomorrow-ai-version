
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User } from '../../types';
import api from '../../services/api';
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
  Menu,
  Trash2,
  Clock,
  CheckCircle,
  Sparkles,
  ListChecks,
  MessageSquare
} from 'lucide-react';

import CreateAssignmentScreen from './CreateAssignmentScreen';
import CreateActivityScreen from './CreateActivityScreen';
import MessagingSystem from '../MessagingSystem';

interface TeacherDashboardProps {
  currentUser: User;
  onLogout: () => void;
}

type TeacherView = 'overview' | 'classes' | 'assignments' | 'activities' | 'students' | 'planner' | 'reports' | 'settings' | 'messages';

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ currentUser, onLogout }) => {
  const [activeView, setActiveView] = useState<TeacherView>('overview');
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (activeView === 'assignments' || activeView === 'overview') {
      fetchQuizzes();
    }
    if (activeView === 'activities' || activeView === 'overview') {
      fetchActivities();
    }
  }, [activeView]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeacherQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTeacherActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.deleteQuiz(id);
        setQuizzes(quizzes.filter(q => q._id !== id));
      } catch (error) {
        alert('Failed to delete quiz');
      }
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity plan?')) {
      try {
        await api.deleteActivity(id);
        setActivities(activities.filter(a => a._id !== id));
      } catch (error) {
        alert('Failed to delete activity');
      }
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'students', icon: Users, label: 'Students' },
    { id: 'classes', icon: BookOpen, label: 'My Classes' },
    { id: 'assignments', icon: ListChecks, label: 'Quizzes' },
    { id: 'activities', icon: Sparkles, label: 'Activities' },
    { id: 'planner', icon: Calendar, label: 'Lesson Planner' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
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
                { label: 'Total Students', value: '124', icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
                { label: 'Active Classes', value: '6', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'Activities', value: activities.length.toString(), icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Quizzes', value: quizzes.length.toString(), icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
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

            {/* Weekly Activity Mini Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 mt-8">
              <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Student Activity This Week</h3>
              <div className="flex items-end gap-3 h-24">
                {[{ d: 'Mon', v: 62 }, { d: 'Tue', v: 88 }, { d: 'Wed', v: 74 }, { d: 'Thu', v: 95 }, { d: 'Fri', v: 51 }, { d: 'Sat', v: 20 }, { d: 'Sun', v: 13 }].map((bar) => (
                  <div key={bar.d} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: `${bar.v}%` }}
                      transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
                      className="w-full bg-brand-400 dark:bg-brand-600 rounded-t-lg min-h-[4px]"
                      style={{ height: `${bar.v}%` }}
                      title={`${bar.v} active students`}
                    />
                    <span className="text-[9px] font-black text-slate-400 uppercase">{bar.d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Active Classes</h2>
                  <button className="text-sm font-bold text-brand-600 hover:underline">View all</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Grade 4 - Python Basics', students: 24, progress: 65, color: 'bg-brand-500' },
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
                <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Quick Actions</h2>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
                  <button
                    onClick={() => setIsCreatingAssignment(true)}
                    className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-brand-500 transition-all flex items-center justify-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Create Quiz</span>
                  </button>
                  <button
                    onClick={() => setIsCreatingActivity(true)}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center space-x-2">
                    <Sparkles className="w-5 h-5" />
                    <span>Prepare Activity</span>
                  </button>
                </div>

                <h2 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Alerts</h2>
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-50 dark:divide-slate-700">
                  {[
                    { user: 'Adam K.', action: 'completed Python Quiz', time: '2m ago', type: 'success' },
                    { user: 'Sara M.', action: 'needs help with Loops', time: '15m ago', type: 'warning' },
                    { user: 'Youssef B.', action: 'earned Logic Master badge', time: '1h ago', type: 'success' },
                    { user: 'Class 4B', action: 'average score dropped', time: '3h ago', type: 'danger' },
                  ].map((alert, i) => (
                    <div key={i} className="p-4 flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${alert.type === 'success' ? 'bg-green-500' :
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
              </div>
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="space-y-8 animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Quizzes & Exercises</h2>
                <p className="text-slate-400 font-bold">Manage your learning materials and assignments</p>
              </div>
              <button
                onClick={() => setIsCreatingAssignment(true)}
                className="px-6 py-3 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-brand-500 transition-all flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Quiz</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-slate-300">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">No quizzes yet</h3>
                  <p className="text-slate-400 font-bold">Create your first quiz to start tracking student progress!</p>
                </div>
                <button
                  onClick={() => setIsCreatingAssignment(true)}
                  className="px-8 py-3 bg-brand-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-brand-500 transition-all">
                  Create Quiz
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6 group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {quiz.assignedClasses[0] || 'Unassigned'}
                          </span>
                          <span className="px-3 py-1 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : 'No deadline'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight leading-tight">{quiz.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm line-clamp-2">{quiz.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 flex items-center justify-center text-[10px] font-black">
                              {i}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">12 Submissions</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-500 font-black text-xs uppercase">
                        <CheckCircle className="w-4 h-4" />
                        {quiz.questions.length} Questions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'activities':
        return (
          <div className="space-y-8 animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Classroom Activities</h2>
                <p className="text-slate-400 font-bold">Prepare and organize your live classroom sessions</p>
              </div>
              <button
                onClick={() => setIsCreatingActivity(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-500 transition-all flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Activity Plan</span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activities.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 p-20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center text-emerald-300">
                  <Sparkles className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">No activities yet</h3>
                  <p className="text-slate-400 font-bold">Plan your first classroom activity to make learning fun!</p>
                </div>
                <button
                  onClick={() => setIsCreatingActivity(true)}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-emerald-500 transition-all">
                  Prepare Activity
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activities.map((activity) => (
                  <div key={activity._id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 space-y-6 group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {activity.targetGrade}
                          </span>
                          <span className="px-3 py-1 bg-slate-50 dark:bg-slate-700 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration} Mins
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight leading-tight">{activity.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(activity._id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 font-bold text-sm line-clamp-2">{activity.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2">
                        {activity.materials.slice(0, 3).map((m: string, i: number) => (
                          <span key={i} className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-lg">
                            {m}
                          </span>
                        ))}
                        {activity.materials.length > 3 && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">+{activity.materials.length - 3} more</span>}
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase">
                        <ListChecks className="w-4 h-4" />
                        {activity.steps.length} Steps
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'students': {
        const MOCK_STUDENTS = [
          { name: 'Adam K.', path: '🐍 Python', xp: 340, progress: 72, status: 'On Track', avatar: 'AK' },
          { name: 'Sara M.', path: '⚡ JavaScript', xp: 210, progress: 45, status: 'Needs Help', avatar: 'SM' },
          { name: 'Youssef B.', path: '🧩 Blocks', xp: 520, progress: 91, status: 'Excelling', avatar: 'YB' },
          { name: 'Fatima Z.', path: '🌐 Web Dev', xp: 180, progress: 38, status: 'Behind', avatar: 'FZ' },
          { name: 'Omar H.', path: '🐍 Python', xp: 410, progress: 83, status: 'On Track', avatar: 'OH' },
          { name: 'Layla R.', path: '⚡ JavaScript', xp: 275, progress: 58, status: 'On Track', avatar: 'LR' },
          { name: 'Karim N.', path: '🌐 Web Dev', xp: 95, progress: 20, status: 'Needs Help', avatar: 'KN' },
          { name: 'Nadia S.', path: '🐍 Python', xp: 490, progress: 88, status: 'Excelling', avatar: 'NS' },
        ];
        const [studentSearch, setStudentSearch] = React.useState('');
        const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.path.toLowerCase().includes(studentSearch.toLowerCase()));
        const statusColor = (s: string) => s === 'Excelling' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : s === 'Needs Help' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' : s === 'Behind' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300';
        return (
          <div className="space-y-6 animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Students</h2>
                <p className="text-slate-400 font-bold">{MOCK_STUDENTS.length} students enrolled across all classes</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." className="pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:outline-none focus:border-brand-400 w-56" />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    {['Student', 'Path', 'XP', 'Progress', 'Status', 'Action'].map(h => (<th key={h} className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {filtered.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[11px] font-black">{s.avatar}</div>
                          <span className="font-black text-slate-800 dark:text-white text-sm">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{s.path}</td>
                      <td className="px-6 py-4">
                        <span className="font-black text-yellow-600">⭐ {s.xp}</span>
                      </td>
                      <td className="px-6 py-4 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${s.progress}%` }} transition={{ delay: i * 0.05 }} className="h-full bg-brand-500 rounded-full" />
                          </div>
                          <span className="text-[10px] font-black text-slate-400 w-8">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusColor(s.status)}`}>{s.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case 'planner': {
        const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM'];
        const LESSONS: Record<string, { title: string, class: string, color: string }> = {
          'Monday-9:00 AM': { title: 'Python Variables', class: 'Grade 4', color: 'bg-brand-500' },
          'Monday-10:00 AM': { title: 'HTML Basics', class: 'Grade 5', color: 'bg-orange-500' },
          'Tuesday-9:00 AM': { title: 'JS Loops', class: 'Intro JS', color: 'bg-yellow-500' },
          'Tuesday-11:00 AM': { title: 'Logic Puzzles', class: 'Logic Masters', color: 'bg-purple-500' },
          'Wednesday-10:00 AM': { title: 'Python Functions', class: 'Grade 4', color: 'bg-brand-500' },
          'Thursday-9:00 AM': { title: 'CSS Styling', class: 'Grade 5', color: 'bg-orange-500' },
          'Thursday-2:00 PM': { title: 'JS Quiz Review', class: 'Intro JS', color: 'bg-yellow-500' },
          'Friday-11:00 AM': { title: 'Final Projects', class: 'All Classes', color: 'bg-rose-500' },
        };
        return (
          <div className="space-y-6 animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Lesson Planner</h2>
                <p className="text-slate-400 font-bold">Week of March 10 – 14, 2026</p>
              </div>
              <button className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-brand-500 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24">Time</th>
                    {DAYS.map(d => (<th key={d} className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</th>))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                  {TIMES.map(time => (
                    <tr key={time}>
                      <td className="px-4 py-3 text-[10px] font-black text-slate-400">{time}</td>
                      {DAYS.map(day => {
                        const key = `${day}-${time}`;
                        const lesson = LESSONS[key];
                        return (
                          <td key={day} className="px-2 py-2">
                            {lesson ? (
                              <div className={`${lesson.color} text-white rounded-xl p-3 cursor-pointer hover:opacity-90 transition-opacity`}>
                                <p className="text-[10px] font-black uppercase tracking-wide opacity-80">{lesson.class}</p>
                                <p className="text-xs font-black leading-tight mt-0.5">{lesson.title}</p>
                              </div>
                            ) : (
                              <div className="h-14 rounded-xl border-2 border-dashed border-slate-100 dark:border-slate-700 hover:border-brand-300 transition-colors cursor-pointer" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
      case 'reports':
        return <AnalyticsView />;
      case 'messages':
        return (
          <div className="h-[calc(100vh-12rem)] animate-pop-in">
            <MessagingSystem currentUser={currentUser} />
          </div>
        );
      default:
        return <div className="flex items-center justify-center h-64 text-slate-400 font-black uppercase italic">Coming Soon</div>;
    }
  };

  const AnalyticsView = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const data = await api.getClassAnalytics();
          setAnalytics(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">AI Performance Analytics</h2>
            <p className="text-slate-400 font-bold">Data-driven insights into student mastery and class trends</p>
          </div>
          <div className="flex items-center space-x-2 bg-brand-50 dark:bg-brand-900/30 px-4 py-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-black text-brand-700 dark:text-brand-300 uppercase italic">AI Powered</span>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-8 rounded-[2.5rem] text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tight">AI Progress Summary</h3>
          </div>
          <p className="text-brand-50 font-medium leading-relaxed italic">
            "{analytics?.summary || "Analyzing class performance data..."}"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Heatmap */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic mb-6">Student Mastery Heatmap</h3>
            <div className="space-y-4">
              {analytics?.heatmap?.map((student: any, i: number) => (
                <div key={i} className="flex items-center space-x-4">
                  <span className="w-24 text-xs font-bold text-slate-500 truncate">{student.name}</span>
                  <div className="flex-1 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex overflow-hidden">
                    {Object.entries(student.mastery).map(([concept, score]: any, j) => (
                      <div
                        key={j}
                        className="flex-1 h-full border-r border-white/10"
                        style={{
                          backgroundColor: score > 80 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444',
                          opacity: score / 100
                        }}
                        title={`${concept}: ${score}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-4 text-[10px] font-black uppercase text-slate-400">
              <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div><span>Struggling</span></div>
              <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div><span>Developing</span></div>
              <div className="flex items-center space-x-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div><span>Mastered</span></div>
            </div>
          </div>

          {/* Struggling Students */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase italic mb-6">Attention Needed</h3>
            <div className="space-y-4">
              {analytics?.strugglingStudents?.slice(0, 5).map((student: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{student.name}</p>
                    <p className="text-[10px] font-bold text-red-600 uppercase">Low Mastery in 3 concepts</p>
                  </div>
                  <button className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-red-600">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {analytics?.strugglingStudents?.length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase">All students are on track!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
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
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">C</div>
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
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-black uppercase tracking-tight text-sm transition-all ${activeView === item.id
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
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
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-2xl border-none focus:ring-2 focus:ring-brand-500 text-sm font-bold"
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
                className="w-10 h-10 rounded-xl object-cover border-2 border-brand-100 dark:border-slate-700"
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
        <CreateAssignmentScreen
          onClose={() => setIsCreatingAssignment(false)}
          onSuccess={fetchQuizzes}
        />
      )}
      {isCreatingActivity && (
        <CreateActivityScreen
          onClose={() => setIsCreatingActivity(false)}
          onSuccess={fetchActivities}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
