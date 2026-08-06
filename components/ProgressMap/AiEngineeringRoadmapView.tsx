import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark, ChevronRight, Search,
  Play, Layers, X
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
    id: 'observability',
    number: 15,
    title: 'Observability',
    description: 'Trace LLM requests, track latency, monitor token costs, and capture production logs with OpenTelemetry & OpenInference.',
    categoryGroup: 'Models & Infrastructure',
    subtopics: [
      'Observability',
      'Logging',
      'Tracing',
      'Metrics',
      'Latency Monitoring',
      'Token Usage',
      'Cost Analytics',
      'Error Tracking',
    ],
  },
  {
    id: 'ai_security',
    number: 16,
    title: 'AI Security',
    description: 'Secure AI systems against prompt injection attacks, jailbreaks, PII leaks, and invalid model outputs using guardrails.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Guardrails',
      'Prompt Injection Defense',
      'Jailbreak Detection',
      'Content Moderation',
      'PII Detection',
      'Secret Management',
      'Output Validation',
    ],
  },
  {
    id: 'data_engineering',
    number: 17,
    title: 'Data Engineering',
    description: 'Prepare synthetic training datasets, ETL data pipelines, automated labeling, versioning, and cleaning workflows.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Synthetic Data',
      'Data Pipelines',
      'ETL',
      'Data Labeling',
      'Dataset Versioning',
      'Data Augmentation',
      'Data Cleaning',
    ],
  },
  {
    id: 'knowledge_distillation',
    number: 18,
    title: 'Knowledge Distillation',
    description: 'Compress large teacher LLMs into lightweight, fast student models using pruning and quantization.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Distillation',
      'Teacher-Student Models',
      'Model Compression',
      'Pruning',
      'Quantization',
    ],
  },
  {
    id: 'ai_infrastructure',
    number: 19,
    title: 'AI Infrastructure',
    description: 'Scale AI API gateways, load balancing, multi-provider routing, and GPU scheduling across cloud environments.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'AI Gateways',
      'API Gateway',
      'Load Balancing',
      'Autoscaling',
      'GPU Scheduling',
      'Multi-Provider Routing',
    ],
  },
  {
    id: 'cost_optimization',
    number: 20,
    title: 'Cost Optimization',
    description: 'Reduce LLM operational costs through prompt caching, response caching, token optimization, and dynamic model routing.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Cost Optimization',
      'Prompt Caching',
      'Response Caching',
      'Dynamic Model Routing',
      'Quantization',
      'Token Optimization',
    ],
  },
  {
    id: 'deployment',
    number: 21,
    title: 'Deployment (MLOps / LLMOps)',
    description: 'Deploy AI applications with Docker, Kubernetes, CI/CD pipelines, model registries, and A/B testing flags.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Docker',
      'Kubernetes',
      'CI/CD',
      'Model Registry',
      'A/B Testing',
      'Canary Deployment',
      'Feature Flags',
      'Rollback',
    ],
  },
  {
    id: 'ai_frameworks',
    number: 22,
    title: 'AI Frameworks',
    description: 'Orchestrate applications using modern frameworks like LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, and DSPy.',
    categoryGroup: 'Ops, Security & Frameworks',
    isNew: true,
    subtopics: [
      'LangChain',
      'LangGraph',
      'LlamaIndex',
      'Haystack',
      'CrewAI',
      'AutoGen',
      'Semantic Kernel',
      'DSPy',
      'PydanticAI',
      'OpenAI Agents SDK',
      'SmolAgents',
    ],
  },
  {
    id: 'communication_protocols',
    number: 23,
    title: 'Communication Protocols',
    description: 'Implement agent-to-agent (A2A) protocols, JSON Schema validation, gRPC, and REST communication standards.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'MCP',
      'A2A (Agent-to-Agent)',
      'OpenAPI',
      'JSON Schema',
      'OpenTelemetry',
      'OpenInference',
      'gRPC',
      'REST',
    ],
  },
  {
    id: 'harness_testing',
    number: 24,
    title: 'Harness & Testing',
    description: 'Build robust testing harnesses for prompt regression testing, unit tests, integration tests, and end-to-end agent evaluation.',
    categoryGroup: 'Ops, Security & Frameworks',
    subtopics: [
      'Harness',
      'Unit Testing',
      'Integration Testing',
      'End-to-End Testing',
      'Prompt Testing',
      'Agent Testing',
    ],
  },
];

interface AiEngineeringRoadmapViewProps {
  onStartLesson?: (lesson: Lesson) => void;
}

export const AiEngineeringRoadmapView: React.FC<AiEngineeringRoadmapViewProps> = ({ onStartLesson }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['prompt_engineering', 'agent_engineering', 'rag']);
  const [activeModule, setActiveModule] = useState<AiModule | null>(null);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((b) => b !== id));
      showToast('Removed from saved roadmaps', 'info');
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      showToast('Saved to your bookmarked roadmaps! 📌', 'success');
    }
  };

  const filteredModules = AI_ENGINEERING_MODULES.filter((m) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(term) ||
      m.description.toLowerCase().includes(term) ||
      m.subtopics.some((s) => s.toLowerCase().includes(term))
    );
  });

  const launchLessonForModule = (mod: AiModule) => {
    if (onStartLesson) {
      const mockLesson: Lesson = {
        id: mod.number,
        level: mod.number,
        titleKey: mod.title,
        icon: 'brain',
        xp: 50,
        color: '#f59e0b',
        type: 'lesson',
        nodeType: 'standard',
        challengeDescriptionKey: mod.description,
        starterCode: `// 🤖 AI Engineering Lab: ${mod.title}\n// Goal: ${mod.description}\n\nconsole.log("Executing ${mod.title} Pipeline...");\n`,
        solutionCode: `console.log("Executing ${mod.title} Pipeline...");`,
        expectedOutput: `Executing ${mod.title} Pipeline...`,
      };
      onStartLesson(mockLesson);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 font-sans pb-24 pt-6 px-4 md:px-8 transition-colors">
      {/* Container */}
      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* Top Category Badge & Title */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest">
            AI Engineering Roadmap
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Engineering <span className="text-slate-700 dark:text-slate-300">Mastery Curriculum</span>
          </h1>

          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl font-normal leading-relaxed">
            Step-by-step interactive roadmap for AI Engineers covering Prompting, RAG 2.0, Agentic Workflows, Vector DBs, MCP, Fine-Tuning & LLMOps.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search 24 domains or topics (e.g., RAG, LangGraph, vLLM, LoRA)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all shadow-sm"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 24 Cards Grid Layout (Clean, Breathable Rhythm) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((mod) => {
            const isBookmarked = bookmarkedIds.includes(mod.id);

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                onClick={() => setActiveModule(mod)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 hover:border-amber-500/40 dark:hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-[0_0_25px_rgba(245,158,11,0.08)] cursor-pointer"
              >
                <div>
                  {/* Top Bar inside Card: Softened low-contrast gray & purple tags */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                        #{mod.number}
                      </span>
                      {mod.isNew && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-600/90 dark:text-purple-400/90 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" /> New
                        </span>
                      )}
                    </div>

                    {/* Bookmark button: Amber reserved strictly for saved state */}
                    <button
                      onClick={(e) => toggleBookmark(e, mod.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200/80 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Save Roadmap'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Title: Crisp white / slate typography on hover */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors mb-2.5 leading-snug">
                    {mod.title}
                  </h3>

                  {/* Module Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal mb-6">
                    {mod.description}
                  </p>
                </div>

                {/* Cleaner Card Footer: Streamlined quiet single-line metadata */}
                <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {mod.subtopics.length} concepts explored · View Details
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Module Modal Drawer */}
        <AnimatePresence>
          {activeModule && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-1">
                      Module #{activeModule.number} • {activeModule.categoryGroup}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeModule.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-normal leading-relaxed">{activeModule.description}</p>
                  </div>
                  <button
                    onClick={() => setActiveModule(null)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Topics Overview inside Popup Window */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Curriculum Topics in this Module
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                    {activeModule.subtopics.map((st) => (
                      <div
                        key={st}
                        className="p-3 rounded-xl border text-left flex items-center gap-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/80"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    Module #{activeModule.number} • {activeModule.subtopics.length} Interactive Topics
                  </span>
                  <button
                    onClick={() => {
                      const mod = activeModule;
                      setActiveModule(null);
                      launchLessonForModule(mod);
                    }}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    <Play className="w-4 h-4 fill-current" /> Start
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

export default AiEngineeringRoadmapView;
