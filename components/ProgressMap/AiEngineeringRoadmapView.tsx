import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark, ChevronRight, Search,
  Play, Layers, X, Bot, Terminal, Shield, Zap, Database, ArrowRight, CheckCircle2
} from 'lucide-react';
import { Lesson } from '../../types';
import { useToast } from '../ToastNotification';

export interface AiModule {
  id: string;
  number: number;
  title: string;
  description: string;
  subtopics: string[];
  isNew?: boolean;
  categoryGroup: 'Foundations & Prompting' | 'Architecture & Memory' | 'Models & Infrastructure' | 'Ops, Security & Frameworks';
}

export const AI_ENGINEERING_MODULES: AiModule[] = [
  {
    id: 'prompt_engineering',
    number: 1,
    title: 'Prompt Engineering',
    description: 'Master zero-shot, few-shot, Chain of Thought (CoT), Tree of Thoughts (ToT), ReAct, and structured JSON mode output generation.',
    categoryGroup: 'Foundations & Prompting',
    subtopics: [
      'Prompt Engineering',
      'Prompt Optimization',
      'Few-shot Prompting',
      'Zero-shot Prompting',
      'Chain of Thought (CoT)',
      'Tree of Thoughts (ToT)',
      'ReAct',
      'Prompt Chaining',
      'Structured Output',
      'JSON Mode',
    ],
  },
  {
    id: 'context_engineering',
    number: 2,
    title: 'Context Engineering',
    description: 'Optimize model context windows using context compression, caching, query rewriting, and session context management.',
    categoryGroup: 'Foundations & Prompting',
    subtopics: [
      'Context Engineering',
      'Context Compression',
      'Context Caching',
      'Context Windows',
      'Query Rewriting',
      'Session Context',
    ],
  },
  {
    id: 'agent_engineering',
    number: 3,
    title: 'Agent Engineering',
    description: 'Build autonomous agentic workflows, multi-agent systems, task decomposition, reflection, self-correction, and human-in-the-loop controls.',
    categoryGroup: 'Foundations & Prompting',
    subtopics: [
      'Agentic AI',
      'Multi-Agent Systems',
      'Workflow Agents',
      'Autonomous Agents',
      'Planning',
      'Reflection',
      'Self-Correction',
      'Task Decomposition',
      'Human-in-the-Loop',
      'Agent Memory',
    ],
  },
  {
    id: 'graph_engineering',
    number: 4,
    title: 'Graph Engineering',
    description: 'Design complex stateful graph workflows, knowledge graphs, and GraphRAG architectures powered by LangGraph.',
    categoryGroup: 'Foundations & Prompting',
    subtopics: [
      'Graph Engineering',
      'LangGraph',
      'Graph Workflows',
      'Knowledge Graphs',
      'GraphRAG',
    ],
  },
  {
    id: 'rag',
    number: 5,
    title: 'RAG (Retrieval-Augmented Generation)',
    description: 'Implement RAG 2.0 with agentic retrieval, hybrid vector/keyword search, reranking, semantic chunking, and document parsing.',
    categoryGroup: 'Architecture & Memory',
    isNew: true,
    subtopics: [
      'RAG 2.0',
      'Agentic RAG',
      'GraphRAG',
      'Hybrid Search',
      'Semantic Search',
      'Keyword Search',
      'Reranking',
      'Query Expansion',
      'Chunking',
      'Metadata Filtering',
      'Document Parsing',
    ],
  },
  {
    id: 'memory_systems',
    number: 6,
    title: 'Memory Systems',
    description: 'Build multi-layered memory architectures combining short-term, long-term, episodic, and semantic memory retrieval.',
    categoryGroup: 'Architecture & Memory',
    subtopics: [
      'Memory Layers',
      'Short-Term Memory',
      'Long-Term Memory',
      'Episodic Memory',
      'Semantic Memory',
      'Memory Retrieval',
    ],
  },
  {
    id: 'mcp_communication',
    number: 7,
    title: 'MCP & Communication',
    description: 'Standardize agent tool discovery and context sharing using Model Context Protocol (MCP) servers and stateful clients.',
    categoryGroup: 'Architecture & Memory',
    isNew: true,
    subtopics: [
      'MCP',
      'Stateless MCP',
      'Stateful MCP',
      'MCP Servers',
      'MCP Clients',
      'MCP Tools',
    ],
  },
  {
    id: 'tool_integration',
    number: 8,
    title: 'Tool Integration',
    description: 'Equip LLMs with tool execution, function calling, OpenAPI specs, web search, and browser automation integrations.',
    categoryGroup: 'Architecture & Memory',
    subtopics: [
      'Tool Use',
      'Function Calling',
      'API Integration',
      'OpenAPI',
      'Plugin Systems',
      'Web Search',
      'Browser Tools',
    ],
  },
  {
    id: 'databases',
    number: 9,
    title: 'Databases',
    description: 'Manage high-performance vector databases, SQL, NoSQL, graph databases, Redis caches, and object storage for AI workloads.',
    categoryGroup: 'Architecture & Memory',
    subtopics: [
      'Vector Databases',
      'SQL Databases',
      'NoSQL Databases',
      'Graph Databases',
      'Redis',
      'Elasticsearch',
      'Object Storage',
    ],
  },
  {
    id: 'embeddings_search',
    number: 10,
    title: 'Embeddings & Search',
    description: 'Implement dense and sparse vector retrieval, Approximate Nearest Neighbor (ANN) search, and hybrid search pipelines.',
    categoryGroup: 'Architecture & Memory',
    subtopics: [
      'Embedding Models',
      'Similarity Search',
      'ANN Search',
      'Dense Retrieval',
      'Sparse Retrieval',
      'Hybrid Retrieval',
    ],
  },
  {
    id: 'ai_models',
    number: 11,
    title: 'AI Models',
    description: 'Navigate LLMs, SLMs, Vision-Language Models (VLMs), multimodal models, speech systems, and reasoning models.',
    categoryGroup: 'Models & Infrastructure',
    subtopics: [
      'Foundation Models',
      'Large Language Models (LLMs)',
      'Small Language Models (SLMs)',
      'Vision Language Models (VLMs)',
      'Multimodal Models',
      'Speech Models',
      'Embedding Models',
      'Reasoning Models',
    ],
  },
  {
    id: 'inference_serving',
    number: 12,
    title: 'Inference & Serving',
    description: 'Accelerate high-throughput model serving using vLLM, TensorRT-LLM, llama.cpp, quantization, and speculative decoding.',
    categoryGroup: 'Models & Infrastructure',
    subtopics: [
      'vLLM',
      'TensorRT-LLM',
      'llama.cpp',
      'ONNX Runtime',
      'Quantization',
      'Speculative Decoding',
      'Continuous Batching',
      'Model Serving',
    ],
  },
  {
    id: 'fine_tuning',
    number: 13,
    title: 'Fine-Tuning',
    description: 'Adapt foundation models using LoRA, QLoRA, Parameter-Efficient Fine-Tuning (PEFT), and instruction tuning.',
    categoryGroup: 'Models & Infrastructure',
    subtopics: [
      'Fine-Tuning',
      'LoRA',
      'QLoRA',
      'PEFT',
      'Continued Pretraining',
      'Instruction Tuning',
    ],
  },
  {
    id: 'evaluation',
    number: 14,
    title: 'Evaluation',
    description: 'Benchmark model performance using automated evaluation frameworks, hallucination detectors, and regression test suites.',
    categoryGroup: 'Models & Infrastructure',
    subtopics: [
      'Evaluation Frameworks',
      'LLM Benchmarks',
      'Hallucination Detection',
      'Human Evaluation',
      'Automatic Evaluation',
      'Regression Testing',
    ],
  },
  {
    id: 'llmops',
    number: 15,
    title: 'LLMOps & Observability',
    description: 'Monitor LLM applications with tracing tools, cost tracking, latency metrics, dataset curation, and continuous deployment.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'LLMOps',
      'Tracing',
      'Observability',
      'Cost Tracking',
      'Latency Optimization',
      'Dataset Curation',
      'Continuous Deployment',
    ],
  },
  {
    id: 'security_safety',
    number: 16,
    title: 'Security & Safety',
    description: 'Protect AI pipelines against prompt injection, jailbreaks, data leakage, and enforce safety guardrails.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'AI Security',
      'Prompt Injection',
      'Jailbreaking',
      'Data Leakage',
      'Guardrails',
      'Output Moderation',
      'Privacy',
    ],
  },
  {
    id: 'agent_frameworks',
    number: 17,
    title: 'Agent Frameworks',
    description: 'Build agent orchestration logic using LangChain, LlamaIndex, CrewAI, AutoGen, and Semantic Kernel.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'LangChain',
      'LlamaIndex',
      'CrewAI',
      'AutoGen',
      'Semantic Kernel',
      'Orchestration',
    ],
  },
  {
    id: 'cloud_platforms',
    number: 18,
    title: 'Cloud Platforms',
    description: 'Deploy AI infrastructure across AWS Bedrock, GCP Vertex AI, Azure OpenAI, Modal, RunPod, and Anyscale.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'AWS Bedrock',
      'GCP Vertex AI',
      'Azure OpenAI',
      'Modal',
      'RunPod',
      'Anyscale',
      'Serverless GPU',
    ],
  },
];

interface AiEngineeringRoadmapViewProps {
  onStartLesson: (lesson: Lesson) => void;
}

export const AiEngineeringRoadmapView: React.FC<AiEngineeringRoadmapViewProps> = ({ onStartLesson }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('c4t_aieng_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [activeModule, setActiveModule] = useState<AiModule | null>(null);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(b => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem('c4t_aieng_bookmarks', JSON.stringify(updated));
    showToast(bookmarkedIds.includes(id) ? 'Removed bookmark' : 'Saved to Agent Bookmarks', 'info');
  };

  const filteredModules = AI_ENGINEERING_MODULES.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.subtopics.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === 'All' || mod.categoryGroup === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Foundations & Prompting', 'Architecture & Memory', 'Models & Infrastructure', 'Ops, Security & Frameworks'];

  const startModuleLesson = (mod: AiModule) => {
    const mockLesson: Lesson = {
      id: mod.number + 8000,
      level: mod.number,
      titleKey: mod.title,
      icon: 'brain',
      xp: 60,
      color: '#1A73E8',
      type: 'lesson',
      nodeType: 'standard',
      challengeDescriptionKey: mod.description,
      starterCode: `// 🤖 Google AI Engineering & Swarm Agent Lab: ${mod.title}\n// Domain: ${mod.categoryGroup}\n\nconsole.log("Initializing ${mod.title} Agentic Pipeline...");\n`,
      solutionCode: `console.log("Initializing ${mod.title} Agentic Pipeline...");`,
      expectedOutput: `Initializing ${mod.title} Agentic Pipeline...`,
    };
    onStartLesson(mockLesson);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              {/* Google Gemini AI Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                <Bot className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span className="font-semibold tracking-wide">Google Agentic Systems</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">Engineering</span>
              </h1>
              
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl font-normal leading-relaxed">
                Step-by-step roadmap for building autonomous AI agents, RAG 2.0 hybrid retrieval, Model Context Protocol (MCP), and production LLMOps.
              </p>
            </div>
          </div>
        </div>

        {/* M3 Filters & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/30 font-semibold'
                    : 'bg-white dark:bg-[#292A2D] hover:bg-[#F1F3F4] dark:hover:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#5F6368] dark:text-[#9AA0A6] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search RAG, LangGraph, vLLM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-[#5F6368] hover:text-[#202124] dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 18 Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const isBookmarked = bookmarkedIds.includes(mod.id);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveModule(mod)}
                className="group relative bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_4px_12px_rgba(60,64,67,0.12)] cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-[#5F6368] dark:text-[#9AA0A6] bg-[#F1F3F4] dark:bg-[#3C4043] px-2.5 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#5F6368]">
                        #{mod.number}
                      </span>
                      {mod.isNew && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] bg-[#E8F0FE] dark:bg-[#3C4043] px-2 py-0.5 rounded-full border border-[#1A73E8]/20">
                          New
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(e, mod.id)}
                      className={`p-1.5 rounded-full border transition-colors ${
                        isBookmarked
                          ? 'bg-[#E8F0FE] dark:bg-[#3C4043] border-[#1A73E8]/40 text-[#1A73E8] dark:text-[#8AB4F8]'
                          : 'border-[#E8EAED] dark:border-[#3C4043] text-[#5F6368] hover:text-[#202124] dark:hover:text-slate-300'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors leading-snug">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed font-normal">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F1F3F4] dark:border-[#3C4043] flex items-center justify-between mt-6">
                  <span className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">
                    {mod.subtopics.length} Concepts
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active Module Detail Modal */}

        {/* Detailed Module Modal Drawer */}
        <AnimatePresence>
          {activeModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl overflow-hidden"
              >
                <div className="flex items-start justify-between border-b border-[#F1F3F4] dark:border-[#3C4043] pb-4">
                  <div>
                    <div className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] font-medium uppercase tracking-wider mb-1">
                      Module #{activeModule.number} • {activeModule.categoryGroup}
                    </div>
                    <h2 className="text-xl font-bold text-[#202124] dark:text-white">{activeModule.title}</h2>
                    <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] mt-1 font-normal leading-relaxed">{activeModule.description}</p>
                  </div>
                  <button
                    onClick={() => setActiveModule(null)}
                    className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider mb-3">Core Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModule.subtopics.map((subtopic) => (
                      <span
                        key={subtopic}
                        className="px-3 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-mono text-xs border border-[#E8EAED] dark:border-[#3C4043] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                        {subtopic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const mod = activeModule;
                      setActiveModule(null);
                      startModuleLesson(mod);
                    }}
                    className="flex-1 py-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs uppercase tracking-wider rounded-full shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Launch Agentic Lab</span>
                  </button>

                  <button
                    onClick={() => setActiveModule(null)}
                    className="py-3 px-6 bg-[#F1F3F4] dark:bg-[#3C4043] hover:bg-[#E8EAED] text-[#202124] dark:text-white font-semibold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
