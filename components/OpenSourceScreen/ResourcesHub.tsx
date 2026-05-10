import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Monitor, Server, Palette, Terminal, Database, Shield } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'frontend',
    name: 'Frontend Ecosystem',
    icon: Monitor,
    resources: [
      { name: 'React', url: 'https://react.dev/', desc: 'The library for web and native user interfaces' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', desc: 'Rapidly build modern websites without ever leaving your HTML' },
      { name: 'Framer Motion', url: 'https://www.framer.com/motion/', desc: 'A production-ready motion library for React' },
      { name: 'Vite', url: 'https://vitejs.dev/', desc: 'Next Generation Frontend Tooling' },
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Infrastructure',
    icon: Server,
    resources: [
      { name: 'Node.js', url: 'https://nodejs.org/', desc: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine' },
      { name: 'Express', url: 'https://expressjs.com/', desc: 'Fast, unopinionated, minimalist web framework for Node.js' },
      { name: 'Docker', url: 'https://www.docker.com/', desc: 'Empowering App Development for Developers' },
      { name: 'MongoDB', url: 'https://www.mongodb.com/', desc: 'The developer data platform' },
    ]
  },
  {
    id: 'design',
    name: 'Design & UI/UX',
    icon: Palette,
    resources: [
      { name: 'Figma', url: 'https://www.figma.com/', desc: 'The collaborative interface design tool' },
      { name: 'Lucide', url: 'https://lucide.dev/', desc: 'Beautiful & consistent icon toolkit' },
      { name: 'Radix UI', url: 'https://www.radix-ui.com/', desc: 'Unstyled, accessible components for building high-quality design systems' },
    ]
  },
  {
    id: 'security',
    name: 'Security & DevOps',
    icon: Shield,
    resources: [
      { name: 'OWASP', url: 'https://owasp.org/', desc: 'Open Worldwide Application Security Project' },
      { name: 'GitHub Actions', url: 'https://github.com/features/actions', desc: 'Automate your workflow from idea to production' },
    ]
  }
];

export const ResourcesHub: React.FC = () => {
  return (
    <div className="pb-24 md:pb-0">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-[#00f2ff]" />
          <h1 className="text-3xl font-bold font-mono uppercase tracking-widest text-white">Resources Hub</h1>
        </div>
        <p className="text-slate-400 font-mono text-sm max-w-xl">
          A curated collection of essential tools, libraries, and frameworks powering the modern deep tech stack.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111217]/50 backdrop-blur-sm border border-dashed border-slate-800 rounded-xl p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center">
                <category.icon className="w-5 h-5 text-[#00f2ff]" />
              </div>
              <h2 className="text-xl font-bold text-white font-mono">{category.name}</h2>
            </div>
            
            <div className="space-y-4">
              {category.resources.map(res => (
                <a
                  key={res.name}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group p-4 bg-[#050505] rounded-lg border border-slate-800 hover:border-[#00f2ff]/50 transition-all hover:translate-x-1"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white font-mono text-sm group-hover:text-[#00f2ff] transition-colors">{res.name}</h3>
                    <Terminal className="w-3 h-3 text-slate-600 group-hover:text-[#00f2ff] transition-colors" />
                  </div>
                  <p className="text-xs text-slate-500 font-mono line-clamp-2">{res.desc}</p>
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
