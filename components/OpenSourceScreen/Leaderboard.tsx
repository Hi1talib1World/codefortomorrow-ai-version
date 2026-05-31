import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, MapPin, Search } from 'lucide-react';
import { useI18n } from './i18n';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

const ARAB_COUNTRIES = [
  'Algeria', 'Bahrain', 'Comoros', 'Djibouti', 'Egypt', 'Iraq', 'Jordan', 
  'Kuwait', 'Lebanon', 'Libya', 'Mauritania', 'Morocco', 'Oman', 'Palestine', 
  'Qatar', 'Saudi Arabia', 'Somalia', 'Sudan', 'Syria', 'Tunisia', 
  'United Arab Emirates', 'Yemen'
];

const EUROPE_COUNTRIES = [
  'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 
  'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 
  'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 
  'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 
  'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 
  'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 
  'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'
];

const OTHER_COUNTRIES = [
  'USA', 'India', 'Brazil', 'Japan', 'Canada', 'Australia'
];

export const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState('Global');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { t } = useI18n();

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl" title="Rank 1">🥇</span>;
    if (index === 1) return <span className="text-2xl" title="Rank 2">🥈</span>;
    if (index === 2) return <span className="text-2xl" title="Rank 3">🥉</span>;
    return <span className="text-lg font-mono text-slate-500 w-8 text-center">{index + 1}</span>;
  };

  const filteredArab = ARAB_COUNTRIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredEurope = EUROPE_COUNTRIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOther = OTHER_COUNTRIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-[#facc15]" />
            <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">{t('leaderboard.title')}</h1>
          </div>
          <p className="text-slate-400 font-mono text-sm max-w-xl">
            {t('leaderboard.subtitle')} {country}.
          </p>
        </div>

        <div ref={dropdownRef} className="relative z-20">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-48 bg-[#121212]/80 backdrop-blur-sm border border-dashed border-[#facc15]/50 px-4 py-2 rounded-lg font-mono text-sm text-[#facc15] hover:bg-[#facc15]/10 transition-colors"
          >
            <span className="flex items-center gap-2 truncate"><MapPin className="w-4 h-4 shrink-0" /> {country}</span>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#09090b] border border-dashed border-slate-800 rounded-xl overflow-hidden shadow-2xl z-30 p-2">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-dashed border-slate-800 mb-2">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder={t('leaderboard.searchCountry')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white font-mono text-xs focus:outline-none w-full border-none p-0 focus:ring-0"
                />
              </div>

              <div className="max-h-64 overflow-y-auto pr-1 space-y-3 no-scrollbar">
                {('global'.includes(searchQuery.toLowerCase())) && (
                  <button
                    onClick={() => {
                      setCountry('Global');
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-colors
                      ${country === 'Global' ? 'bg-[#facc15]/20 text-[#facc15] font-bold' : 'text-slate-400 hover:bg-[#121212] hover:text-white'}`}
                  >
                    🌍 Global
                  </button>
                )}

                {filteredArab.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-600 font-mono px-3 uppercase tracking-wider mb-1">{t('leaderboard.arabWorld')}</div>
                    {filteredArab.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-colors pl-5
                          ${country === c ? 'bg-[#facc15]/20 text-[#facc15] font-bold' : 'text-slate-400 hover:bg-[#121212] hover:text-white'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {filteredEurope.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-600 font-mono px-3 uppercase tracking-wider mb-1">{t('leaderboard.europe')}</div>
                    {filteredEurope.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-colors pl-5
                          ${country === c ? 'bg-[#facc15]/20 text-[#facc15] font-bold' : 'text-slate-400 hover:bg-[#121212] hover:text-white'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {filteredOther.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-600 font-mono px-3 uppercase tracking-wider mb-1">{t('leaderboard.other')}</div>
                    {filteredOther.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCountry(c);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded font-mono text-xs transition-colors pl-5
                          ${country === c ? 'bg-[#facc15]/20 text-[#facc15] font-bold' : 'text-slate-400 hover:bg-[#121212] hover:text-white'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                {filteredArab.length === 0 && filteredEurope.length === 0 && filteredOther.length === 0 && !('global'.includes(searchQuery.toLowerCase())) && (
                  <div className="text-slate-500 font-mono text-xs text-center py-4">
                    {t('leaderboard.noCountries')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#121212]/50 backdrop-blur-sm border border-dashed border-slate-800 rounded-xl overflow-hidden relative">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center gap-4 h-16 bg-[#09090b]/50 border border-slate-800 rounded-lg animate-pulse"></div>
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
                className="flex items-center gap-6 p-4 md:p-6 hover:bg-[#facc15]/5 transition-colors group relative"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#facc15] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center justify-center w-12 shrink-0">
                  {getRankBadge(index)}
                </div>
                
                <img 
                  src={user.avatar_url} 
                  alt={user.login} 
                  className="w-12 h-12 rounded-full border border-slate-700 group-hover:border-[#facc15] transition-colors"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white font-mono truncate group-hover:text-[#facc15] transition-colors">
                    @{user.login}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Users className="w-3 h-3" /> Contributor
                    </span>
                  </div>
                </div>
                
                <div className="hidden sm:flex shrink-0">
                  <span className="bg-[#09090b] text-slate-400 border border-slate-800 rounded px-3 py-1 font-mono text-xs group-hover:bg-[#facc15]/10 group-hover:border-[#facc15]/30 group-hover:text-[#facc15] transition-all">
                    {t('leaderboard.viewProfile')}
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
