import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  Users, FileText, Bot, Shield, PlusCircle, BarChart3,
  CheckCircle2, Server, Cloud, Cpu, ArrowUpRight, Clock, ExternalLink
} from 'lucide-react';

const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchSystemStatus = async () => {
  const res = await fetch('/api/admin/status', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const { data: status, isLoading } = useQuery({
    queryKey: ['admin-system-status'],
    queryFn: fetchSystemStatus,
    refetchInterval: 15000,
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" /> Admin Control Center
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">System Overview</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Monitor real-time platform statistics, manage published articles, control user permissions, and verify Cloudinary CDN status.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate('/admin/new')}
              className="flex items-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-slate-950 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Publish Post
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#0e0e11] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{status?.metrics?.totalUsers ?? '—'}</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            Registered accounts on platform
          </div>
        </motion.div>

        {/* Live Articles */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0e0e11] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Content</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">{status?.metrics?.liveContent ?? '—'}</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            Out of {status?.metrics?.totalContent ?? 0} total drafted/published
          </div>
        </motion.div>

        {/* AI Agents */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#0e0e11] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Agents</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">3 Active</div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            Tutor, Code Reviewer & Lesson Assistant
          </div>
        </motion.div>

        {/* Cloudinary CDN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0e0e11] border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloudinary CDN</span>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${status?.cloudinaryConfigured ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
              <Cloud className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {status?.cloudinaryConfigured ? 'Ready' : 'Fallback'}
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            {status?.cloudinaryConfigured ? 'Direct Cloudinary Upload active' : 'Local Data URL fallback enabled'}
          </div>
        </motion.div>
      </div>

      {/* Services Health & System Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0e0e11] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-[#facc15]" /> Platform Services & Integrations
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ● All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="text-sm font-bold text-white">MongoDB Database</div>
                  <div className="text-xs text-slate-500 font-mono">Status: Connected</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${status?.geminiConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <div className="text-sm font-bold text-white">Google Gemini AI</div>
                  <div className="text-xs text-slate-500 font-mono">{status?.geminiConfigured ? 'API Key Active' : 'Fallback Engine'}</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${status?.cloudinaryConfigured ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white">Cloudinary Image CDN</div>
                  <div className="text-xs text-slate-500 font-mono">{status?.cloudinaryConfigured ? 'Account: ibz8hd4d' : 'Not configured'}</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-4 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${status?.posthogConfigured ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white">PostHog Analytics</div>
                  <div className="text-xs text-slate-500 font-mono">{status?.posthogConfigured ? 'Tracking Active' : 'Local Analytics'}</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Node Version: {status?.nodeVersion || 'v22.x'}</span>
            <span>Server Uptime: {status?.uptimeSeconds ? `${Math.floor(status.uptimeSeconds / 60)}m` : 'Active'}</span>
            <span>Environment: {status?.env || 'development'}</span>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-[#0e0e11] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" /> Quick Management
          </h2>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/admin/new')}
              className="w-full p-3 rounded-xl bg-[#09090b] hover:bg-slate-800/60 border border-slate-800 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#facc15]">Create New Article</div>
                <div className="text-xs text-slate-500">Draft or publish a blog post</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#facc15]" />
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="w-full p-3 rounded-xl bg-[#09090b] hover:bg-slate-800/60 border border-slate-800 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#facc15]">User Accounts & Roles</div>
                <div className="text-xs text-slate-500">Promote admins or manage teachers</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#facc15]" />
            </button>

            <button
              onClick={() => navigate('/admin/analytics')}
              className="w-full p-3 rounded-xl bg-[#09090b] hover:bg-slate-800/60 border border-slate-800 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#facc15]">Analytics & Metrics</div>
                <div className="text-xs text-slate-500">View visitor trends and signups</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#facc15]" />
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full p-3 rounded-xl bg-[#09090b] hover:bg-slate-800/60 border border-slate-800 text-left transition-colors flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-sm font-bold text-white group-hover:text-[#facc15]">System Settings</div>
                <div className="text-xs text-slate-500">Platform & AI model parameters</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-[#facc15]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
