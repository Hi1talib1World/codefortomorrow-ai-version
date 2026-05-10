import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { BarChart3, Users, Eye, TrendingUp, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchAnalytics = async () => {
  const res = await fetch('/api/admin/analytics', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="bg-[#0e0e11] border border-slate-800 rounded-xl p-5"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="text-2xl font-black text-white mb-1">{value}</div>
    <div className="text-sm text-slate-500 font-semibold">{label}</div>
  </motion.div>
);

const AnalyticsPanel: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-7 h-7 text-[#facc15]" />
        <div>
          <h1 className="text-2xl font-black text-white">Analytics</h1>
          <p className="text-sm text-slate-500 font-mono">Powered by PostHog</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-[#facc15] animate-spin" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-[#0e0e11] border border-red-500/20 rounded-xl">
          <AlertCircle className="w-10 h-10 text-red-400" />
          <p className="text-slate-400 text-sm text-center max-w-sm">
            Failed to load analytics. Ensure <code className="text-[#facc15]">POSTHOG_PERSONAL_API_KEY</code> and{' '}
            <code className="text-[#facc15]">POSTHOG_PROJECT_ID</code> are set in your <code>.env</code> file.
          </p>
        </div>
      )}

      {data && !data.configured && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#facc15]/5 border border-[#facc15]/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-[#facc15]" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">PostHog Not Configured</h3>
              <p className="text-sm text-slate-400 mb-4">
                Add your PostHog credentials to <code className="text-[#facc15] bg-[#facc15]/10 px-1 rounded">.env</code> to enable real analytics.
              </p>
              <div className="bg-[#09090b] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-400 space-y-1">
                <div><span className="text-emerald-400">POSTHOG_PERSONAL_API_KEY</span>=phx_your_personal_key_here</div>
                <div><span className="text-emerald-400">POSTHOG_PROJECT_ID</span>=your_project_id_here</div>
              </div>
              <a
                href="https://app.posthog.com/settings/user-api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-[#facc15] hover:underline font-semibold"
              >
                Get your PostHog API key <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stat Cards — shown as mock if not configured */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views (7d)"
          value={data?.configured ? (data?.data?.result?.[0]?.count ?? '—') : '—'}
          icon={Eye}
          color="bg-blue-500/10 border-blue-500/20 text-blue-400"
          delay={0.05}
        />
        <StatCard
          label="Unique Visitors"
          value="—"
          icon={Users}
          color="bg-purple-500/10 border-purple-500/20 text-purple-400"
          delay={0.1}
        />
        <StatCard
          label="New Signups"
          value="—"
          icon={TrendingUp}
          color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          delay={0.15}
        />
        <StatCard
          label="Avg Session (min)"
          value="—"
          icon={BarChart3}
          color="bg-[#facc15]/10 border-[#facc15]/20 text-[#facc15]"
          delay={0.2}
        />
      </div>

      {/* Setup Guide */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6"
      >
        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#facc15]" /> How to Enable Full Analytics
        </h3>
        <ol className="space-y-3 text-sm text-slate-400">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-xs font-bold flex items-center justify-center shrink-0">1</span>
            Go to <a href="https://posthog.com" target="_blank" rel="noopener noreferrer" className="text-[#facc15] hover:underline ml-1">posthog.com</a> and create a free account.
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-xs font-bold flex items-center justify-center shrink-0">2</span>
            Get your Personal API Key from Settings → User API Keys.
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-xs font-bold flex items-center justify-center shrink-0">3</span>
            Add <code className="text-[#facc15] bg-[#facc15]/10 px-1 rounded">POSTHOG_PERSONAL_API_KEY</code> and <code className="text-[#facc15] bg-[#facc15]/10 px-1 rounded">POSTHOG_PROJECT_ID</code> to your <code>.env</code> file.
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-xs font-bold flex items-center justify-center shrink-0">4</span>
            Restart the dev server and refresh this page.
          </li>
        </ol>
      </motion.div>
    </div>
  );
};

export default AnalyticsPanel;
