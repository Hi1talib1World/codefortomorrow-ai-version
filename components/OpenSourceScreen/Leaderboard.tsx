import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, MapPin, Search } from 'lucide-react';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

const COUNTRIES = ['Global', 'Morocco', 'USA', 'India', 'UK', 'Germany', 'France', 'Brazil'];

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('Global');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/opensource/leaderboard?country=${encodeURIComponent(country)}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [country]);

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl" title="Rank 1">🥇</span>;
    if (index === 1) return <span className="text-2xl" title="Rank 2">🥈</span>;
    if (index === 2) return <span className="text-2xl" title="Rank 3">🥉</span>;
    return <span className="text-lg font-mono text-slate-500 w-8 text-center">{index + 1}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-[#00f2ff]" />
            <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">Top Contributors</h1>
          </div>
          <p className="text-slate-400 font-mono text-sm max-w-xl">
            Ranked by followers across the open source ecosystem. Filtering by {country}.
          </p>
        </div>

        <div className="relative z-20">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-40 bg-[#111217]/80 backdrop-blur-sm border border-dashed border-[#00f2ff]/50 px-4 py-2 rounded-lg font-mono text-sm text-[#00f2ff] hover:bg-[#00f2ff]/10 transition-colors"
          >
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {country}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-40 bg-[#050505] border border-dashed border-slate-800 rounded-lg overflow-hidden shadow-xl">
              {COUNTRIES.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCountry(c);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 font-mono text-sm transition-colors
                    ${country === c ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-slate-400 hover:bg-[#111217] hover:text-white'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111217]/50 backdrop-blur-sm border border-dashed border-slate-800 rounded-xl overflow-hidden relative">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 h-16 bg-[#050505]/50 border border-slate-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono">
            No contributors found for this region.
          </div>
        ) : (
          <div className="divide-y divide-dashed divide-slate-800/50">
            {users.map((user, index) => (
              <motion.a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-6 p-4 md:p-6 hover:bg-[#00f2ff]/5 transition-colors group relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f2ff] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center justify-center w-12 shrink-0">
                  {getRankBadge(index)}
                </div>
                
                <img 
                  src={user.avatar_url} 
                  alt={user.login} 
                  className="w-12 h-12 rounded-full border border-slate-700 group-hover:border-[#00f2ff] transition-colors"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white font-mono truncate group-hover:text-[#00f2ff] transition-colors">
                    @{user.login}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Users className="w-3 h-3" /> Contributor
                    </span>
                  </div>
                </div>
                
                <div className="hidden sm:flex shrink-0">
                  <span className="bg-[#050505] text-slate-400 border border-slate-800 rounded px-3 py-1 font-mono text-xs group-hover:bg-[#00f2ff]/10 group-hover:border-[#00f2ff]/30 group-hover:text-[#00f2ff] transition-all">
                    VIEW_PROFILE
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
