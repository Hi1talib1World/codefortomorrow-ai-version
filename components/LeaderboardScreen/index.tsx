import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { User } from '../../types';
import { 
  Trophy, 
  Flame, 
  Search, 
  Users, 
  GraduationCap, 
  Crown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface LeaderboardScreenProps {
  currentUser?: User | null;
}

// Simulated high-performing coders to merge if database is empty/sparse
const SIMULATED_CODERS = [
  {
    _id: 'sim_1',
    name: 'Sarah Bennani',
    profilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 2450, streak: 12, badgesEarned: { python: ['py_1', 'py_2'], javascript: ['js_1'] } }
  },
  {
    _id: 'sim_2',
    name: 'Youssef El Mansouri',
    profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 2180, streak: 8, badgesEarned: { python: ['py_1'], javascript: ['js_1', 'js_2'] } }
  },
  {
    _id: 'sim_3',
    name: 'Amine Alaoui',
    profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 1890, streak: 5, badgesEarned: { block_coding: ['bc_1', 'bc_2'] } }
  },
  {
    _id: 'sim_4',
    name: 'Sofia Tazi',
    profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 1620, streak: 14, badgesEarned: { python: ['py_1'] } }
  },
  {
    _id: 'sim_5',
    name: 'Karim Jabri',
    profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 1450, streak: 3, badgesEarned: { python: ['py_1'] } }
  },
  {
    _id: 'sim_6',
    name: 'Fatima Zahra',
    profilePictureUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    role: 'student' as const,
    progress: { xp: 1250, streak: 0, badgesEarned: {} }
  }
];

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getLeaderboard();
        
        let mergedList = [...data];

        // 1. If database returned no users (or just offline fallback error), we mark as simulated
        if (mergedList.length === 0) {
          setIsSimulated(true);
          mergedList = [...SIMULATED_CODERS];
        }

        // 2. Ensure current user is in the leaderboard if they exist
        if (currentUser) {
          const userExistsInList = mergedList.some((u: any) => u._id === currentUser._id || u.email === currentUser.email);
          if (!userExistsInList) {
            // Adapt frontend types to database/leaderboard structures
            const formattedCurrentUser = {
              _id: currentUser._id,
              name: currentUser.name,
              profilePictureUrl: currentUser.profilePictureUrl,
              role: currentUser.role,
              progress: {
                xp: currentUser.progress?.xp || 0,
                streak: currentUser.progress?.streak || 0,
                badgesEarned: currentUser.progress?.badgesEarned || {}
              }
            };
            mergedList.push(formattedCurrentUser);
          }
        }

        // 3. If list is small, append simulated users to make it feel alive
        if (mergedList.length < 5) {
          SIMULATED_CODERS.forEach((sim) => {
            const alreadyExists = mergedList.some((u: any) => u.name.toLowerCase() === sim.name.toLowerCase() || u._id === sim._id);
            if (!alreadyExists) {
              mergedList.push(sim);
            }
          });
        }

        // 4. Sort all users by XP descending
        const sorted = mergedList
          .filter((u: any) => u.progress)
          .sort((a: any, b: any) => (b.progress.xp || 0) - (a.progress.xp || 0));

        setUsers(sorted);
      } catch (err: any) {
        console.error('Leaderboard fetch failed, falling back to simulated data:', err);
        setIsSimulated(true);
        
        // Dynamic fallback that still puts the current user in the simulated board
        let fallbackList = [...SIMULATED_CODERS];
        if (currentUser) {
          const formattedCurrentUser = {
            _id: currentUser._id,
            name: currentUser.name,
            profilePictureUrl: currentUser.profilePictureUrl,
            role: currentUser.role,
            progress: {
              xp: currentUser.progress?.xp || 0,
              streak: currentUser.progress?.streak || 0,
              badgesEarned: currentUser.progress?.badgesEarned || {}
            }
          };
          fallbackList.push(formattedCurrentUser);
        }
        
        const sorted = fallbackList.sort((a: any, b: any) => (b.progress.xp || 0) - (a.progress.xp || 0));
        setUsers(sorted);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUser]);

  // Filters logic
  const filteredUsers = users.filter((u) => {
    // 1. Tab role filter
    if (activeTab === 'student' && u.role !== 'student') return false;
    if (activeTab === 'teacher' && u.role !== 'teacher') return false;

    // 2. Search query filter
    if (searchQuery.trim() !== '') {
      return u.name.toLowerCase().includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Extract Podium Users
  const podiumUsers = filteredUsers.slice(0, 3);
  // Remaining Users
  const listUsers = filteredUsers.slice(3);

  // Quick helper to count badges
  const getBadgeCount = (user: any) => {
    const badges = user.progress?.badgesEarned || {};
    if (Array.isArray(badges)) return badges.length;
    return Object.values(badges).reduce((sum: number, arr: any) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-50 dark:bg-slate-900 transition-colors">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-pulse">
          Retrieving global star records...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 md:p-8 bg-brand-50 dark:bg-slate-900 transition-colors">
      
      {/* ─── Header area ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
            {t('leaderboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg mt-1">
            See how you rank against other master coders in the world!
          </p>
        </div>

        {/* Global info pill */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm text-sm font-semibold text-slate-600 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Active Users: {users.length}</span>
        </div>
      </div>

      {/* Simulated mode banner */}
      {isSimulated && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400 flex items-center gap-3 text-sm font-bold">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Offline mode or empty database. Showing a mixture of your profile and simulation partners.</span>
        </div>
      )}

      {/* ─── Control Bar (Tabs, Search) ─── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        
        {/* Role Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            All Users
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'student'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'teacher'
                ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Teachers
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by coder name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 text-sm font-semibold outline-none transition-all text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700/80 shadow-md">
          <span className="text-6xl block mb-4">🔍</span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No Coders Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold max-w-sm mx-auto">
            Try adjusting your search query or tab filters to find master coders.
          </p>
        </div>
      )}

      {/* ─── Top 3 Podium (Only when search is clean or we have enough users) ─── */}
      {filteredUsers.length > 0 && searchQuery.trim() === '' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10 max-w-4xl mx-auto pt-6">
          
          {/* 2nd PLACE (Silver) - Rendered Left */}
          {podiumUsers[1] && (
            <div className="order-2 md:order-1 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md transition-all hover:scale-[1.02] relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-400 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                🥈 Rank 2
              </div>
              <img
                src={podiumUsers[1].profilePictureUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
                alt={podiumUsers[1].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-slate-300 dark:border-slate-500 shadow-md mb-4 mt-2"
              />
              <h3 className="font-black text-lg text-slate-800 dark:text-white text-center leading-tight truncate max-w-full">
                {podiumUsers[1].name}
              </h3>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                {podiumUsers[1].role}
              </span>
              
              <div className="flex gap-2 w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 justify-center">
                <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black flex items-center gap-1">
                  ⭐ {podiumUsers[1].progress?.xp || 0} XP
                </span>
                {podiumUsers[1].progress?.streak > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[1].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 1st PLACE (Gold) - Rendered Center, tallest */}
          {podiumUsers[0] && (
            <div className="order-1 md:order-2 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-500/80 rounded-3xl p-8 shadow-xl shadow-amber-500/5 transition-all hover:scale-[1.05] relative -top-3 md:-top-6">
              
              {/* Crown Badge */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 animate-pulse">
                <Crown className="w-10 h-10 fill-yellow-500 text-yellow-500 drop-shadow-md" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white font-black text-sm px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                🥇 Champion
              </div>

              <img
                src={podiumUsers[0].profilePictureUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
                alt={podiumUsers[0].name}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500 shadow-md mb-4 mt-2"
              />
              <h3 className="font-black text-xl text-slate-800 dark:text-white text-center leading-tight truncate max-w-full">
                {podiumUsers[0].name}
              </h3>
              <span className="text-yellow-600 dark:text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                {podiumUsers[0].role}
              </span>
              
              <div className="flex gap-2 w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 justify-center">
                <span className="px-4 py-1.5 bg-yellow-500 text-white rounded-xl text-sm font-black flex items-center gap-1 shadow-sm">
                  ⭐ {podiumUsers[0].progress?.xp || 0} XP
                </span>
                {podiumUsers[0].progress?.streak > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[0].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 3rd PLACE (Bronze) - Rendered Right */}
          {podiumUsers[2] && (
            <div className="order-3 md:order-3 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md transition-all hover:scale-[1.02] relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                🥉 Rank 3
              </div>
              <img
                src={podiumUsers[2].profilePictureUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
                alt={podiumUsers[2].name}
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-700 dark:border-amber-800 shadow-md mb-4 mt-2"
              />
              <h3 className="font-black text-lg text-slate-800 dark:text-white text-center leading-tight truncate max-w-full">
                {podiumUsers[2].name}
              </h3>
              <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                {podiumUsers[2].role}
              </span>
              
              <div className="flex gap-2 w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 justify-center">
                <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black flex items-center gap-1">
                  ⭐ {podiumUsers[2].progress?.xp || 0} XP
                </span>
                {podiumUsers[2].progress?.streak > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[2].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ─── Leaderboard List ─── */}
      {filteredUsers.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700/80 shadow-lg overflow-hidden max-w-4xl mx-auto">
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-left text-slate-400 dark:text-slate-500 font-bold uppercase text-xs tracking-wider">
                  <th className="px-6 py-5 text-center">Rank</th>
                  <th className="px-6 py-5">Coder</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5 text-center">Streak</th>
                  <th className="px-6 py-5 text-center">Badges</th>
                  <th className="px-6 py-5 text-right">XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                {filteredUsers.map((user, index) => {
                  const rank = index + 1;
                  const isSelf = currentUser && (user._id === currentUser._id || user.email === currentUser.email);
                  
                  return (
                    <tr
                      key={user._id || index}
                      className={`transition-colors duration-150 ${
                        isSelf 
                          ? 'bg-brand-500/5 dark:bg-brand-500/10 border-l-4 border-brand-500' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/35'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="px-6 py-4.5 text-center font-bold text-slate-800 dark:text-white">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-black text-sm shadow-sm">
                            1
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-700 font-black text-sm shadow-sm">
                            2
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm shadow-sm">
                            3
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-sm">
                            {rank}
                          </span>
                        )}
                      </td>

                      {/* User Info Column */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePictureUrl || 'https://ui-avatars.com/api/?name=User&background=random'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              {user.name}
                              {isSelf && (
                                <span className="px-2 py-0.5 bg-brand-500 text-white rounded-md text-[10px] font-black tracking-wider uppercase">
                                  You
                                </span>
                              )}
                            </span>
                            {user.bio && (
                              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold max-w-xs truncate leading-normal">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4.5 text-slate-500 dark:text-slate-400 text-sm font-semibold capitalize">
                        {user.role}
                      </td>

                      {/* Streak Column */}
                      <td className="px-6 py-4.5 text-center">
                        {user.progress?.streak > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {user.progress.streak} days
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* Badges Column */}
                      <td className="px-6 py-4.5 text-center">
                        {getBadgeCount(user) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">
                            🏆 {getBadgeCount(user)}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* XP Column */}
                      <td className="px-6 py-4.5 text-right font-black text-slate-800 dark:text-white">
                        {user.progress?.xp || 0} <span className="text-slate-400 text-xs font-bold ml-0.5">XP</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

export default LeaderboardScreen;
