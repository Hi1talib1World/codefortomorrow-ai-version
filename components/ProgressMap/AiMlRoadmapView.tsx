import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark, ChevronRight, Search, Play, Layers, X,
  Activity, Cpu, Zap, Sliders, CheckCircle2
} from 'lucide-react';
import { Lesson } from '../../types';
import { useToast } from '../ToastNotification';

export interface AiMlModule {
  id: string;
  number: number;
  title: string;
  description: string;
  subtopics: string[];
  categoryGroup: 'Neural Foundations & Math' | 'Computer Vision & Audio' | 'Generative & Multimodal AI' | 'Reinforcement & Theory';
  isNew?: boolean;
  tensorShape?: string;
}

export const AI_ML_MODULES: AiMlModule[] = [
  {
    id: 'pytorch_basics',
    number: 1,
    title: 'PyTorch Tensors & Autograd Engine',
    description: 'Master tensor operations, GPU acceleration, automatic differentiation (autograd), and computational graphs.',
    categoryGroup: 'Neural Foundations & Math',
    tensorShape: 'torch.Tensor([batch, 3, 224, 224])',
    subtopics: ['Tensors', 'Autograd Engine', 'CUDA Acceleration', 'Gradient Vectors', 'Backpropagation', 'Loss Functions'],
  },
  {
    id: 'neural_nets',
    number: 2,
    title: 'Multi-Layer Perceptrons & Backprop',
    description: 'Construct deep neural networks from scratch, backpropagate error gradients, and optimize weights using AdamW.',
    categoryGroup: 'Neural Foundations & Math',
    tensorShape: 'Dense(In: 784, Out: 128) -> ReLU',
    subtopics: ['MLP Architecture', 'Activation Functions', 'Weight Initialization', 'Gradient Descent', 'AdamW Optimizer', 'Overfitting Mitigation'],
  },
  {
    id: 'convnets',
    number: 3,
    title: 'Convolutional Neural Networks (CNNs)',
    description: 'Build spatial feature extractors with convolutions, pooling layers, residual connections (ResNet), and receptive fields.',
    categoryGroup: 'Computer Vision & Audio',
    tensorShape: 'Conv2d(3, 64, kernel_size=3)',
    subtopics: ['Convolutions', 'Pooling', 'ResNet Blocks', 'Feature Maps', 'Batch Normalization', 'Transfer Learning'],
  },
  {
    id: 'transformers',
    number: 4,
    title: 'Transformer Self-Attention & ViT',
    description: 'Implement Scaled Dot-Product Attention, Multi-Head Attention, Positional Encodings, and Vision Transformers.',
    categoryGroup: 'Generative & Multimodal AI',
    isNew: true,
    tensorShape: 'Attention(Q, K, V) = softmax(QK^T / sqrt(dk))V',
    subtopics: ['Self-Attention', 'Multi-Head Attention', 'Positional Encoding', 'Query Key Value', 'Vision Transformer (ViT)', 'Patch Projection'],
  },
  {
    id: 'diffusion',
    number: 5,
    title: 'Diffusion Models & Latent Noise Schedulers',
    description: 'Understand forward noise degradation, reverse UNet denoising steps, DDPM, and Stable Diffusion latent spaces.',
    categoryGroup: 'Generative & Multimodal AI',
    isNew: true,
    tensorShape: 'UNet(Latents: [B, 4, 64, 64], Timestep t)',
    subtopics: ['DDPM Denoising', 'UNet Architecture', 'Latent Space', 'CFG Guidance', 'Noise Schedulers', 'Score-Based Models'],
  },
  {
    id: 'rlhf',
    number: 6,
    title: 'Reinforcement Learning & RLHF/DPO',
    description: 'Align neural network outputs using Policy Gradients (PPO), Reward Modeling, and Direct Preference Optimization (DPO).',
    categoryGroup: 'Reinforcement & Theory',
    isNew: true,
    tensorShape: 'Reward R(x, y) & Log-Ratio Loss',
    subtopics: ['PPO Algorithm', 'Reward Models', 'Direct Preference (DPO)', 'Actor-Critic', 'KL Divergence Penalty', 'Alignment Tax'],
  },
  {
    id: 'mamba_ssm',
    number: 7,
    title: 'State Space Models (Mamba & Selective SSMs)',
    description: 'Sub-quadratic long-sequence modeling using selective state spaces, hardware-aware parallel scans, and recurrent memory.',
    categoryGroup: 'Neural Foundations & Math',
    isNew: true,
    tensorShape: 'h\'(t) = A h(t) + B x(t)',
    subtopics: ['Selective SSMs', 'Linear-Time Attention', 'Hardware-Aware Scans', 'Mamba Blocks', 'Discretization', 'Context Scaling'],
  },
  {
    id: 'gnn',
    number: 8,
    title: 'Graph Neural Networks & Message Passing',
    description: 'Model non-Euclidean graph data using Graph Convolutional Networks (GCN), GraphSAGE, and molecular representations.',
    categoryGroup: 'Computer Vision & Audio',
    tensorShape: 'Nodes V [N, d], Edges E [2, M]',
    subtopics: ['Graph Convolutions', 'Message Passing', 'GraphSAGE', 'Node Classification', 'Edge Embeddings', 'Molecular AI'],
  },
  {
    id: 'yolo_sam',
    number: 9,
    title: 'Object Detection & Segment Anything (SAM)',
    description: 'Real-time bounding box prediction with YOLOv8 and zero-shot promptable segmentation using Meta\'s SAM.',
    categoryGroup: 'Computer Vision & Audio',
    tensorShape: 'BBoxes [N, 4] & Mask Bitmaps',
    subtopics: ['YOLOv8 Engine', 'Segment Anything (SAM)', 'Anchor Boxes', 'IoU Metrics', 'Mask Decoders', 'Zero-Shot Vision'],
  },
  {
    id: 'whisper_audio',
    number: 10,
    title: 'Speech Recognition & Audio Processing (Whisper)',
    description: 'Spectrogram feature extraction, audio tokenization, and sequence-to-sequence speech-to-text with OpenAI Whisper.',
    categoryGroup: 'Computer Vision & Audio',
    tensorShape: 'Mel-Spectrogram [B, 80, 3000]',
    subtopics: ['Mel Spectrograms', 'Audio Tokenization', 'Whisper Model', 'Voice Activity Detection', 'Multilingual ASR', 'CLAP Alignment'],
  },
  {
    id: 'optuna_hyperparams',
    number: 11,
    title: 'Hyperparameter Tuning & Optuna Bayesian Search',
    description: 'Automate neural architecture tuning with Tree-structured Parzen Estimators (TPE), pruning trial search, and Pareto frontiers.',
    categoryGroup: 'Neural Foundations & Math',
    tensorShape: 'Trial(lr=1e-4, batch=64, dropout=0.2)',
    subtopics: ['Optuna Trials', 'Bayesian Optimization', 'TPE Sampler', 'Trial Pruning', 'Hyperband', 'Loss Surfaces'],
  },
  {
    id: 'onnx_edge',
    number: 12,
    title: 'ONNX Export & Edge AI Quantization',
    description: 'Optimize model graphs for edge inference using FP16/INT8 quantization, TensorRT engines, and ONNX Runtime execution.',
    categoryGroup: 'Neural Foundations & Math',
    tensorShape: 'ONNX Graph (INT8 Quantized 4x Speedup)',
    subtopics: ['ONNX Export', 'TensorRT Engine', 'FP16 Precision', 'INT8 Quantization', 'Operator Fusion', 'Edge AI Deployment'],
  },
];

interface AiMlRoadmapViewProps {
  onStartLesson: (lesson: Lesson) => void;
}

export const AiMlRoadmapView: React.FC<AiMlRoadmapViewProps> = ({ onStartLesson }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('c4t_aiml_bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [activeModule, setActiveModule] = useState<AiMlModule | null>(null);

  // Training Simulator State
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<'AdamW' | 'SGD' | 'RMSprop'>('AdamW');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(1);
  const [loss, setLoss] = useState<number>(0.85);
  const [accuracy, setAccuracy] = useState<number>(45.2);

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(() => {
        setEpoch(prev => {
          if (prev >= 50) {
            setIsTraining(false);
            return 50;
          }
          return prev + 1;
        });
        setLoss(prev => Math.max(0.012, +(prev * (0.91 + (optimizer === 'AdamW' ? -0.02 : 0.01))).toFixed(4)));
        setAccuracy(prev => Math.min(99.8, +(prev + (optimizer === 'AdamW' ? 1.4 : 0.8)).toFixed(1)));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isTraining, optimizer]);

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(b => b !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem('c4t_aiml_bookmarks', JSON.stringify(updated));
    showToast(bookmarkedIds.includes(id) ? 'Removed bookmark' : 'Saved to ML Bookmarks', 'info');
  };

  const filteredModules = AI_ML_MODULES.filter(mod => {
    const matchesSearch = mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.subtopics.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'All' || mod.categoryGroup === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Neural Foundations & Math', 'Computer Vision & Audio', 'Generative & Multimodal AI', 'Reinforcement & Theory'];

  const startModuleLesson = (mod: AiMlModule) => {
    const mockLesson: Lesson = {
      id: mod.number + 9000,
      level: mod.number,
      titleKey: mod.title,
      icon: 'brain',
      xp: 60,
      color: '#1A73E8',
      type: 'lesson',
      nodeType: 'standard',
      challengeDescriptionKey: mod.description,
      starterCode: `# 🧠 Google AI & Machine Learning Lab: ${mod.title}\n# Tensor Spec: ${mod.tensorShape || 'torch.Tensor'}\nimport torch\nimport torch.nn as nn\n\nprint("Executing ${mod.title} Pipeline...")\n`,
      solutionCode: `import torch\nprint("Executing ${mod.title} Pipeline...")`,
      expectedOutput: `Executing ${mod.title} Pipeline...`,
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
                <Cpu className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                <span className="font-semibold tracking-wide">Google AI Specialization</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                AI & Machine Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">Curriculum</span>
              </h1>
              
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                Master PyTorch autograd engines, Vision Transformers, Diffusion latent spaces, Mamba state space models, and DPO alignment with Google Material 3 design.
              </p>
            </div>
          </div>
        </div>

        {/* Google Material 3 Interactive Hyperparameter Playground Widget */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 shadow-[0_1px_3px_rgba(60,64,67,0.08)] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8EAED] dark:border-[#3C4043] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8F0FE] dark:bg-[#3C4043] flex items-center justify-center text-[#1A73E8] dark:text-[#8AB4F8]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#202124] dark:text-white tracking-tight">Interactive Hyperparameter & Loss Playground</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal">Tune learning rate and optimizer algorithms to observe real-time gradient descent convergence.</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isTraining) {
                  setIsTraining(false);
                } else {
                  setEpoch(1);
                  setLoss(0.85);
                  setAccuracy(45.2);
                  setIsTraining(true);
                }
              }}
              className={`px-4 py-2 rounded-full font-medium text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isTraining
                  ? 'bg-[#EA4335] text-white hover:bg-[#D93025]'
                  : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white'
              }`}
            >
              <Play className={`w-3.5 h-3.5 ${isTraining ? 'animate-pulse' : ''}`} />
              <span>{isTraining ? 'Pause Simulation' : 'Start Simulation'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#F8F9FA] dark:bg-[#202124] p-3.5 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] space-y-2">
              <label className="text-[#5F6368] dark:text-[#9AA0A6] text-[11px] font-medium block">LEARNING RATE (lr): {learningRate}</label>
              <input
                type="range"
                min="0.0001"
                max="0.01"
                step="0.0005"
                value={learningRate}
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-[#1A73E8] cursor-pointer"
              />
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#202124] p-3.5 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] space-y-2">
              <label className="text-[#5F6368] dark:text-[#9AA0A6] text-[11px] font-medium block">BATCH SIZE: {batchSize}</label>
              <div className="flex gap-2">
                {[16, 32, 64, 128].map(bs => (
                  <button
                    key={bs}
                    onClick={() => setBatchSize(bs)}
                    className={`flex-1 py-1 rounded-full font-medium transition ${
                      batchSize === bs
                        ? 'bg-[#1A73E8] text-white'
                        : 'bg-white dark:bg-[#292A2D] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
                    }`}
                  >
                    {bs}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#F8F9FA] dark:bg-[#202124] p-3.5 rounded-2xl border border-[#E8EAED] dark:border-[#3C4043] space-y-2">
              <label className="text-[#5F6368] dark:text-[#9AA0A6] text-[11px] font-medium block">OPTIMIZER</label>
              <div className="flex gap-2">
                {(['AdamW', 'SGD', 'RMSprop'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setOptimizer(opt)}
                    className={`flex-1 py-1 rounded-full font-medium transition ${
                      optimizer === opt
                        ? 'bg-[#34A853] text-white'
                        : 'bg-white dark:bg-[#292A2D] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#3C4043]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* M3 Filter Chips & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(cat => (
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
              placeholder="Search ML modules..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-full text-xs text-[#202124] dark:text-white placeholder-[#5F6368] focus:outline-none transition-all shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-[#5F6368] hover:text-[#202124] dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 12 ML Module Grid */}
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
                          SOTA
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

                  {mod.tensorShape && (
                    <div className="bg-[#F8F9FA] dark:bg-[#202124] p-2.5 rounded-xl border border-[#E8EAED] dark:border-[#3C4043] font-mono text-[11px] text-[#1A73E8] dark:text-[#8AB4F8] truncate">
                      {mod.tensorShape}
                    </div>
                  )}
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

        {/* Detailed Modal Window */}
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
                    {activeModule.subtopics.map(topic => (
                      <span key={topic} className="px-3 py-1.5 rounded-full bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-mono text-xs border border-[#E8EAED] dark:border-[#3C4043] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
                        {topic}
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
                    <span>Launch Interactive Lab</span>
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
