import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle2, Star, GitFork, ExternalLink, Sparkles, Brain, Bot, Eye, MessageSquare, Image, Code2 } from 'lucide-react';

interface AIRepo {
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

const AI_REPOS: AIRepo[] = [
  {
    id: 1,
    name: 'transformers',
    full_name: 'huggingface/transformers',
    description: 'State-of-the-art ML for PyTorch, TensorFlow, and JAX. Thousands of pretrained models for NLP, vision, audio, and more.',
    stargazers_count: 138000,
    forks_count: 27700,
    language: 'Python',
    html_url: 'https://github.com/huggingface/transformers',
    category: 'NLP & Models',
    icon: Brain,
    topics: ['nlp', 'deep-learning', 'transformers'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/25720743?v=4' }
  },
  {
    id: 2,
    name: 'langchain',
    full_name: 'langchain-ai/langchain',
    description: 'Build context-aware reasoning applications. The framework for developing apps powered by language models.',
    stargazers_count: 98000,
    forks_count: 15800,
    language: 'Python',
    html_url: 'https://github.com/langchain-ai/langchain',
    category: 'LLM Framework',
    icon: MessageSquare,
    topics: ['llm', 'agents', 'rag'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/126733545?v=4' }
  },
  {
    id: 3,
    name: 'ollama',
    full_name: 'ollama/ollama',
    description: 'Get up and running with Llama 3, Mistral, Gemma, and other large language models locally.',
    stargazers_count: 105000,
    forks_count: 8200,
    language: 'Go',
    html_url: 'https://github.com/ollama/ollama',
    category: 'Local LLMs',
    icon: Bot,
    topics: ['llm', 'local-ai', 'inference'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/151674099?v=4' }
  },
  {
    id: 4,
    name: 'stable-diffusion-webui',
    full_name: 'AUTOMATIC1111/stable-diffusion-webui',
    description: 'Stable Diffusion web UI — a browser interface for generating AI art with powerful models.',
    stargazers_count: 145000,
    forks_count: 27000,
    language: 'Python',
    html_url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
    category: 'Image Generation',
    icon: Image,
    topics: ['stable-diffusion', 'ai-art', 'generative-ai'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/33378412?v=4' }
  },
  {
    id: 5,
    name: 'open-interpreter',
    full_name: 'OpenInterpreter/open-interpreter',
    description: 'A natural language interface for computers. Run code locally with an LLM — like ChatGPT\'s Code Interpreter but open source.',
    stargazers_count: 57000,
    forks_count: 4900,
    language: 'Python',
    html_url: 'https://github.com/OpenInterpreter/open-interpreter',
    category: 'AI Agents',
    icon: Code2,
    topics: ['code-interpreter', 'agent', 'automation'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/146641368?v=4' }
  },
  {
    id: 6,
    name: 'ComfyUI',
    full_name: 'comfyanonymous/ComfyUI',
    description: 'The most powerful and modular diffusion model GUI and backend. Design complex AI image workflows visually.',
    stargazers_count: 67000,
    forks_count: 7100,
    language: 'Python',
    html_url: 'https://github.com/comfyanonymous/ComfyUI',
    category: 'Image Generation',
    icon: Image,
    topics: ['comfyui', 'workflow', 'diffusion'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/121283862?v=4' }
  },
  {
    id: 7,
    name: 'whisper',
    full_name: 'openai/whisper',
    description: 'Robust speech recognition via large-scale weak supervision. Transcribe audio in 99 languages.',
    stargazers_count: 74000,
    forks_count: 8700,
    language: 'Python',
    html_url: 'https://github.com/openai/whisper',
    category: 'Speech & Audio',
    icon: Eye,
    topics: ['speech-recognition', 'transcription', 'audio'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/14957082?v=4' }
  },
  {
    id: 8,
    name: 'AutoGPT',
    full_name: 'Significant-Gravitas/AutoGPT',
    description: 'AutoGPT is the vision of accessible AI for everyone, to use and to build on. Build, test, and delegate AI agents.',
    stargazers_count: 170000,
    forks_count: 44000,
    language: 'Python',
    html_url: 'https://github.com/Significant-Gravitas/AutoGPT',
    category: 'AI Agents',
    icon: Sparkles,
    topics: ['autogpt', 'autonomous-agents', 'gpt-4'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/130738209?v=4' }
  },
  {
    id: 9,
    name: 'llama.cpp',
    full_name: 'ggerganov/llama.cpp',
    description: 'LLM inference in C/C++. Run large language models on consumer hardware with incredible performance.',
    stargazers_count: 72000,
    forks_count: 10400,
    language: 'C++',
    html_url: 'https://github.com/ggerganov/llama.cpp',
    category: 'Local LLMs',
    icon: Bot,
    topics: ['llama', 'inference', 'cpp'],
    owner: { avatar_url: 'https://avatars.githubusercontent.com/u/1991296?v=4' }
  },
];

const CATEGORIES = ['All', 'NLP & Models', 'LLM Framework', 'Local LLMs', 'Image Generation', 'AI Agents', 'Speech & Audio'];

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

export const AIRepos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = AI_REPOS.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-black text-white tracking-tight">AI Repos</h1>
        </div>
        <p className="text-slate-400 text-sm font-medium mb-8">Curated collection of the most impactful open-source AI & ML projects</p>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder="Search AI projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-800 rounded-lg bg-[#0e0e11] text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 sm:text-sm transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeCategory === cat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-[#0e0e11] text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-2xl border border-slate-800">
          <p className="text-slate-500 font-semibold">No AI repos match your search.</p>
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
                className="bg-[#121212] rounded-2xl border border-slate-800/60 hover:border-purple-500/30 p-6 flex flex-col transition-all group cursor-pointer hover:shadow-lg hover:shadow-purple-500/5"
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
                      <h3 className="font-bold text-lg text-white truncate group-hover:text-purple-300 transition-colors">{repo.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-purple-400 shrink-0 transition-colors" />
                </div>

                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold rounded-md">
                    {repo.language}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-bold rounded-md flex items-center gap-1">
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
