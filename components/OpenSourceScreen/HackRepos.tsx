import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle2, Star, GitFork, ExternalLink, Shield, Lock, Bug, Wifi, Terminal, Database, Globe, Cpu } from 'lucide-react';

interface HackRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
  category: string;
  icon: React.ElementType;
  topics: string[];
  owner: {
    avatar_url: string;
  };
}

const HACK_REPOS: HackRepo[] = [
  {
    id: 1,
    name: 'PayloadsAllTheThings',
    full_name: 'swisskyrepo/PayloadsAllTheThings',
    description: 'A list of useful payloads and bypass for Web Application Security and Pentest/CTF. The ultimate security cheat sheet.',
    stargazers_count: 63000,
    forks_count: 14800,
    language: 'Python',
    html_url: 'https://github.com/swisskyrepo/PayloadsAllTheThings',
    category: 'Web Security',
    icon: Globe,
    topics: ['payloads', 'pentesting', 'web-security'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/11music?v=4' }
  },
  {
    id: 2,
    name: 'metasploit-framework',
    full_name: 'rapid7/metasploit-framework',
    description: 'The world\'s most used penetration testing framework. Find vulnerabilities, develop exploits, and verify defenses.',
    stargazers_count: 34500,
    forks_count: 14200,
    language: 'Ruby',
    html_url: 'https://github.com/rapid7/metasploit-framework',
    category: 'Exploitation',
    icon: Bug,
    topics: ['metasploit', 'exploit', 'pentest'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/509878?v=4' }
  },
  {
    id: 3,
    name: 'nmap',
    full_name: 'nmap/nmap',
    description: 'Nmap — the Network Mapper. Free and open source utility for network discovery and security auditing.',
    stargazers_count: 10500,
    forks_count: 2400,
    language: 'C',
    html_url: 'https://github.com/nmap/nmap',
    category: 'Network',
    icon: Wifi,
    topics: ['network-scanner', 'security-audit', 'reconnaissance'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/63385?v=4' }
  },
  {
    id: 4,
    name: 'OWASP-Testing-Guide',
    full_name: 'OWASP/wstg',
    description: 'The Web Security Testing Guide (WSTG) is a comprehensive guide to testing the security of web applications.',
    stargazers_count: 7400,
    forks_count: 1500,
    language: 'Markdown',
    html_url: 'https://github.com/OWASP/wstg',
    category: 'Web Security',
    icon: Shield,
    topics: ['owasp', 'security-testing', 'guide'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/5765908?v=4' }
  },
  {
    id: 5,
    name: 'sqlmap',
    full_name: 'sqlmapproject/sqlmap',
    description: 'Automatic SQL injection and database takeover tool. Detects and exploits SQL injection flaws.',
    stargazers_count: 33000,
    forks_count: 5700,
    language: 'Python',
    html_url: 'https://github.com/sqlmapproject/sqlmap',
    category: 'Database',
    icon: Database,
    topics: ['sql-injection', 'database-security', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/735926?v=4' }
  },
  {
    id: 6,
    name: 'Burp-Suite-Extensions',
    full_name: 'snoopysecurity/awesome-burp-extensions',
    description: 'A curated list of amazing Burp Extensions. Level up your web application security testing toolkit.',
    stargazers_count: 3200,
    forks_count: 680,
    language: 'Markdown',
    html_url: 'https://github.com/snoopysecurity/awesome-burp-extensions',
    category: 'Web Security',
    icon: Globe,
    topics: ['burp-suite', 'extensions', 'web-proxy'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/15834932?v=4' }
  },
  {
    id: 7,
    name: 'John the Ripper',
    full_name: 'openwall/john',
    description: 'John the Ripper password cracker. Advanced offline password cracking supporting hundreds of hash types.',
    stargazers_count: 10800,
    forks_count: 2400,
    language: 'C',
    html_url: 'https://github.com/openwall/john',
    category: 'Cryptography',
    icon: Lock,
    topics: ['password-cracker', 'hash', 'cryptography'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/287092?v=4' }
  },
  {
    id: 8,
    name: 'Ghidra',
    full_name: 'NationalSecurityAgency/ghidra',
    description: 'Ghidra is a software reverse engineering framework developed by NSA. Analyze compiled code on any platform.',
    stargazers_count: 53000,
    forks_count: 5900,
    language: 'Java',
    html_url: 'https://github.com/NationalSecurityAgency/ghidra',
    category: 'Reverse Engineering',
    icon: Cpu,
    topics: ['reverse-engineering', 'decompiler', 'binary-analysis'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/311093?v=4' }
  },
  {
    id: 9,
    name: 'Kali Linux Tools',
    full_name: 'LionSec/katoolin',
    description: 'Install Kali Linux tools automatically on any Debian-based distro. Get 300+ security tools instantly.',
    stargazers_count: 2400,
    forks_count: 510,
    language: 'Python',
    html_url: 'https://github.com/LionSec/katoolin',
    category: 'Toolkit',
    icon: Terminal,
    topics: ['kali-linux', 'security-tools', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/8225154?v=4' }
  },
];

const CATEGORIES = ['All', 'Web Security', 'Exploitation', 'Network', 'Database', 'Cryptography', 'Reverse Engineering', 'Toolkit'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
};

export const HackRepos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = HACK_REPOS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-emerald-400" />
          <h1 className="text-3xl font-black text-white tracking-tight">Hack Repos</h1>
        </div>
        <p className="text-slate-400 text-sm font-medium mb-8">Essential open-source tools for ethical hacking, penetration testing & cybersecurity</p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder="Search security tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 sm:text-sm transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#0e0e11] text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-emerald-300/80 text-xs font-medium leading-relaxed">
          <span className="font-bold text-emerald-400">Ethical Use Only.</span> These tools are for authorized security testing, education, and research. Always obtain proper permission before testing systems you don't own.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800">
          <p className="text-slate-500 font-semibold">No hack repos match your search.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map(repo => {
            const IconComp = repo.icon;
            return (
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                key={repo.id}
                variants={itemVariants}
                className="bg-[#121212] rounded-2xl border border-slate-800/60 hover:border-emerald-500/30 p-6 flex flex-col transition-all group cursor-pointer hover:shadow-lg hover:shadow-emerald-500/5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={repo.owner.avatar_url}
                    alt={repo.name}
                    className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://github.com/github.png'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-bold text-lg text-white truncate group-hover:text-emerald-300 transition-colors">{repo.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 shrink-0 transition-colors" />
                </div>

                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-md">
                    {repo.language}
                  </span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-md flex items-center gap-1">
                    <IconComp className="w-3 h-3" /> {repo.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-6 mt-auto flex-wrap">
                  {repo.topics.map((topic) => (
                    <div key={topic} className="px-3 py-1.5 bg-[#1a1a1f] text-slate-500 text-[10px] font-semibold rounded-md">
                      {topic}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 pt-5 border-t border-slate-800/60 text-sm font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-white">Stars</span>
                    <span className="text-slate-400">{formatNumber(repo.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <GitFork className="w-4 h-4 text-slate-500" />
                    <span className="text-white">Forks</span>
                    <span className="text-slate-400">{formatNumber(repo.forks_count)}</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
