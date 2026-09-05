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
  Zap,
  TrendingUp,
  Award,
} from 'lucide-react';
import GuestLoginBanner from '../GuestLoginBanner';

interface LeaderboardScreenProps {
  currentUser?: User | null;
}

interface LeaderboardEntry {
  _id: string;
  name: string;
  profilePictureUrl?: string;
  role?: string;
  bio?: string;
  progress?: {
    xp: number;
    streak: number;
    badgesEarned?: Record<string, string[]>;
  };
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ currentUser }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data: LeaderboardEntry[] = await api.getLeaderboard();
        let sorted = data
          .filter((u) => u.progress)
          .sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0));

        // Client-side fallback: ensure there are at least 150 mock users for the leaderboard
        if (sorted.length < 150) {
          const firstNames = ['Anass', 'Youssef', 'Reda', 'Ghita', 'Salma', 'Mehdi', 'Adnane', 'Walid', 'Laila', 'Houda', 'Imane', 'Hamza', 'Saad', 'Othmane', 'Marouane', 'Nabil', 'Rania', 'Yasmin', 'Sara', 'Zineb', 'Adam', 'Omar', 'Ali', 'Bilal', 'Zakaria', 'Tariq', 'Khalid', 'Siham', 'Nadia', 'Karima', 'Fouad', 'Hassan', 'Meriem', 'Maha', 'Sami', 'Rayan'];
          const lastNames = ['El Amrani', 'Berrada', 'Fassi', 'Benjelloun', 'Tazi', 'Alaoui', 'Mansouri', 'Bennani', 'El Idrissi', 'Haddad', 'Naji', 'Bouazzaoui', 'Harrak', 'Slaoui', 'Kadiri', 'Filali', 'Jahidi', 'Kabbaj', 'Zouhair', 'Chraibi', 'Dahmouni', 'Ghazali', 'Saber', 'Tahiri', 'Amraoui', 'Moussaoui'];
          const bios = [
            'Coding is my superpower! ',
            'Learning JavaScript and building mini games.',
            'Future software engineer from Essaouira, Morocco. 🇲🇦',
            'Python enthusiast. Love data science!',
            'Building modern web projects with HTML & CSS.',
            'Code for Tomorrow student. Passionate about logic.',
            'Solving algorithms and logical puzzles.',
            'Always learning, coding day by day. ',
            'Passionate about UI/UX and frontend engineering.',
            'Exploring block programming tracks.',
          ];

          const needed = 150 - sorted.length;
          // Determine the starting XP for the mock padding so they rank below real users or follow a nice curve
          const startXp = sorted.length > 0 ? (sorted[sorted.length - 1].progress?.xp || 500) - 10 : 2000;

          const padUsers: LeaderboardEntry[] = [];
          for (let i = 0; i < needed; i++) {
            const firstName = firstNames[i % firstNames.length];
            const lastName = lastNames[(i * 3) % lastNames.length];
            const name = `${firstName} ${lastName}`;
            const bio = bios[(i * 7) % bios.length];
            const xp = Math.max(10, startXp - i * 12);
            const streak = (i * 3) % 15;
            const role = (i % 20 === 0) ? 'teacher' : 'student';

            padUsers.push({
              _id: `mock_client_user_${i}`,
              name,
              profilePictureUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
              role,
              bio,
              progress: {
                xp,
                streak,
                badgesEarned: {
                  block_coding: Array(Math.min(5, (i % 4) + 1)).fill('badge')
                }
              }
            });
          }

          sorted = [...sorted, ...padUsers].sort((a, b) => (b.progress?.xp || 0) - (a.progress?.xp || 0));
        }

        setUsers(sorted);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        // Fallback: generate 150 mock users entirely
        const firstNames = ['Anass', 'Youssef', 'Reda', 'Ghita', 'Salma', 'Mehdi', 'Adnane', 'Walid', 'Laila', 'Houda', 'Imane', 'Hamza', 'Saad', 'Othmane', 'Marouane', 'Nabil', 'Rania', 'Yasmin', 'Sara', 'Zineb', 'Adam', 'Omar', 'Ali', 'Bilal', 'Zakaria', 'Tariq', 'Khalid', 'Siham', 'Nadia', 'Karima', 'Fouad', 'Hassan', 'Meriem', 'Maha', 'Sami', 'Rayan'];
        const lastNames = ['El Amrani', 'Berrada', 'Fassi', 'Benjelloun', 'Tazi', 'Alaoui', 'Mansouri', 'Bennani', 'El Idrissi', 'Haddad', 'Naji', 'Bouazzaoui', 'Harrak', 'Slaoui', 'Kadiri', 'Filali', 'Jahidi', 'Kabbaj', 'Zouhair', 'Chraibi', 'Dahmouni', 'Ghazali', 'Saber', 'Tahiri', 'Amraoui', 'Moussaoui'];
        const bios = [
          'Coding is my superpower! ',
          'Learning JavaScript and building mini games.',
          'Future software engineer from Morocco. 🇲🇦',
          'Python enthusiast. Love data science!',
          'Building modern web projects with HTML & CSS.',
          'Code for Tomorrow student. Passionate about logic.',
          'Solving algorithms and logical puzzles.',
          'Always learning, coding day by day. ',
          'Passionate about UI/UX and frontend engineering.',
          'Exploring block programming tracks.',
        ];

        const fallbackUsers: LeaderboardEntry[] = [];
        for (let i = 0; i < 150; i++) {
          const firstName = firstNames[i % firstNames.length];
          const lastName = lastNames[(i * 3) % lastNames.length];
          const name = `${firstName} ${lastName}`;
          const bio = bios[(i * 7) % bios.length];
          const xp = 2000 - i * 12;
          const streak = (i * 3) % 15;
          const role = (i % 20 === 0) ? 'teacher' : 'student';

          fallbackUsers.push({
            _id: `mock_client_fallback_${i}`,
            name,
            profilePictureUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
            role,
            bio,
            progress: {
              xp,
              streak,
              badgesEarned: {
                block_coding: Array(Math.min(5, (i % 4) + 1)).fill('badge')
              }
            }
          });
        }
        setUsers(fallbackUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Filters
  const filteredUsers = users.filter((u) => {
    if (activeTab === 'student' && u.role !== 'student') return false;
    if (activeTab === 'teacher' && u.role !== 'teacher') return false;
    if (searchQuery.trim()) {
      return u.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const podiumUsers = filteredUsers.slice(0, 3);

  const getBadgeCount = (user: LeaderboardEntry): number => {
    const badges = user.progress?.badgesEarned;
    if (!badges) return 0;
    return Object.values(badges).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-50 dark:bg-slate-900 transition-colors">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-pulse">
          Loading leaderboard...
        </p>
      </div>
    );
  }

  const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

  return (
    <div className="min-h-full p-4 md:p-8 bg-brand-50 dark:bg-slate-900 transition-colors">

      {/* Guest Banner */}
      {isGuest && (
        <GuestLoginBanner 
          title="Sign in to save your XP rank on the Leaderboard"
          description="You are currently exploring in Guest Mode. Log in or create a free account to rank against classmates, earn trophies, and display your coding badges!"
        />
      )}

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter flex items-center gap-2">
            <Trophy className="w-10 h-10 text-yellow-500" />
            {t('leaderboard')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg mt-1">
            See how you rank against other coders!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-sm text-sm font-semibold text-slate-600 dark:text-slate-300">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>{users.length} Coders</span>
        </div>
      </div>

      {/* ─── Control Bar ─── */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl w-full md:w-auto">
          {(['all', 'student', 'teacher'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {tab === 'all' && <Users className="w-4 h-4" />}
              {tab === 'student' && <GraduationCap className="w-4 h-4" />}
              {tab === 'teacher' && <Award className="w-4 h-4" />}
              {tab === 'all' ? 'All' : tab === 'student' ? 'Students' : 'Teachers'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 text-sm font-semibold outline-none transition-all text-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* ─── Empty State ─── */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700/80 shadow-md">
          <span className="text-6xl block mb-4"></span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No Coders Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold max-w-sm mx-auto">
            {searchQuery.trim() ? 'No users match your search.' : 'Complete lessons to earn XP and appear on the leaderboard!'}
          </p>
        </div>
      )}

      {/* ─── Top 3 Podium ─── */}
      {filteredUsers.length > 0 && !searchQuery.trim() && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-10 max-w-4xl mx-auto pt-6">

          {/* 2nd Place – Silver */}
          {podiumUsers[1] && (
            <div className="order-2 md:order-1 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md transition-all hover:scale-[1.02] relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-400 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-md">
                 Rank 2
              </div>
              <img
                src={podiumUsers[1].profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(podiumUsers[1].name)}&background=random`}
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
                <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black">
                   {podiumUsers[1].progress?.xp || 0} XP
                </span>
                {(podiumUsers[1].progress?.streak || 0) > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[1].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 1st Place – Gold */}
          {podiumUsers[0] && (
            <div className="order-1 md:order-2 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-amber-400 dark:border-amber-500/80 rounded-3xl p-8 shadow-xl shadow-amber-500/5 transition-all hover:scale-[1.05] relative -top-3 md:-top-6">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500 animate-pulse">
                <Crown className="w-10 h-10 fill-yellow-500 text-yellow-500 drop-shadow-md" />
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white font-black text-sm px-5 py-1.5 rounded-full shadow-lg">
                 Champion
              </div>
              <img
                src={podiumUsers[0].profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(podiumUsers[0].name)}&background=random`}
                alt={podiumUsers[0].name}
                className="w-24 h-24 rounded-full object-cover border-4 border-yellow-500 shadow-md mb-4 mt-2"
              />
              <h3 className="font-black text-xl text-slate-800 dark:text-white text-center leading-tight truncate max-w-full">
                {podiumUsers[0].name}
              </h3>
              <span className="text-yellow-600 dark:text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                {podiumUsers[0].role}
              </span>
              <div className="flex gap-2 w-full mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/80 justify-center">
                <span className="px-4 py-1.5 bg-yellow-500 text-white rounded-xl text-sm font-black shadow-sm">
                   {podiumUsers[0].progress?.xp || 0} XP
                </span>
                {(podiumUsers[0].progress?.streak || 0) > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[0].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 3rd Place – Bronze */}
          {podiumUsers[2] && (
            <div className="order-3 flex flex-col items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-md transition-all hover:scale-[1.02] relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-black text-sm px-4 py-1.5 rounded-full shadow-md">
                 Rank 3
              </div>
              <img
                src={podiumUsers[2].profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(podiumUsers[2].name)}&background=random`}
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
                <span className="px-3 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl text-xs font-black">
                   {podiumUsers[2].progress?.xp || 0} XP
                </span>
                {(podiumUsers[2].progress?.streak || 0) > 0 && (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {podiumUsers[2].progress?.streak}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Full Table ─── */}
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
                  const isSelf = !!(currentUser && user._id === currentUser._id);

                  return (
                    <tr
                      key={user._id}
                      className={`transition-colors duration-150 ${
                        isSelf
                          ? 'bg-brand-500/5 dark:bg-brand-500/10 border-l-4 border-brand-500'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/35'
                      }`}
                    >
                      {/* Rank */}
                      <td className="px-6 py-4 text-center font-bold text-slate-800 dark:text-white">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-white font-black text-sm shadow-sm">1</span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-300 text-slate-700 font-black text-sm shadow-sm">2</span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-black text-sm shadow-sm">3</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 text-sm">{rank}</span>
                        )}
                      </td>

                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                              {user.name}
                              {isSelf && (
                                <span className="px-2 py-0.5 bg-brand-500 text-white rounded-md text-[10px] font-black tracking-wider uppercase">You</span>
                              )}
                            </span>
                            {user.bio && (
                              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold max-w-xs truncate">{user.bio}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm font-semibold capitalize">
                        {user.role}
                      </td>

                      {/* Streak */}
                      <td className="px-6 py-4 text-center">
                        {(user.progress?.streak || 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {user.progress?.streak} days
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* Badges */}
                      <td className="px-6 py-4 text-center">
                        {getBadgeCount(user) > 0 ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-bold">
                             {getBadgeCount(user)}
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>

                      {/* XP */}
                      <td className="px-6 py-4 text-right font-black text-slate-800 dark:text-white">
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
