import React, { useEffect } from 'react';
import { analytics } from '../../src/services/external/firebase';
import { logEvent } from 'firebase/analytics';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Users, Eye, TrendingUp, AlertCircle, Loader2, ExternalLink, Search, CheckCircle2, Clock, Download, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchAnalytics = async () => {
  const res = await fetch('/api/admin/analytics', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
};

// ─── Animated Counter Hook ────────────────────────────────────────────────────
const useAnimatedCounter = (target: number, duration = 800) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      start = Math.round(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
};

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length < 2) return null;
  const width = 120;
  const height = 32;
  const padding = 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const pts = data.map((val, i) => ({
    x: padding + (i * (width - padding * 2)) / (data.length - 1),
    y: height - padding - ((val - min) * (height - padding * 2)) / range,
  }));

  // Build a smooth cubic bezier path
  let pathD = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    pathD += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
  }

  const areaD = pathD + ` L ${pts[pts.length - 1].x},${height} L ${pts[0].x},${height} Z`;

  return (
    <svg className="w-24 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sparkGrad-${color.replace('#', '')})`} />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Glowing end-dot */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} className={`drop-shadow-[0_0_4px_${color}]`} />
    </svg>
  );
};

// ─── Percentage Change Helper ─────────────────────────────────────────────────
const calcChange = (data: number[]): { pct: number; isUp: boolean } | null => {
  if (!data || data.length < 2) return null;
  const recent = data[data.length - 1];
  const prev = data[data.length - 2];
  if (prev === 0) return recent > 0 ? { pct: 100, isUp: true } : null;
  const pct = Math.round(((recent - prev) / prev) * 100);
  return { pct: Math.abs(pct), isUp: pct >= 0 };
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay: number;
  trendData?: number[];
  sparklineColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color, delay, trendData, sparklineColor }) => {
  const numericValue = typeof value === 'number' ? value : 0;
  const isNumeric = typeof value === 'number';
  const animatedValue = useAnimatedCounter(isNumeric ? numericValue : 0, 900);
  const change = trendData ? calcChange(trendData) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="group bg-[#0e0e11] border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/40 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
            change.isUp
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-red-400 bg-red-500/10 border-red-500/20'
          }`}>
            {change.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change.pct}%
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-black text-white mb-0.5 tabular-nums">
            {isNumeric ? animatedValue : value}
          </div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</div>
        </div>
        {trendData && trendData.length > 0 && (
          <div className="shrink-0 mb-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline data={trendData} color={sparklineColor || '#3b82f6'} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface DonutChartProps {
  admin: number;
  teacher: number;
  student: number;
  delay: number;
}

const DonutChart: React.FC<DonutChartProps> = ({ admin, teacher, student, delay }) => {
  const [hoveredRole, setHoveredRole] = React.useState<string | null>(null);
  const total = admin + teacher + student || 0;
  
  const displayAdmin = admin === 0 && teacher === 0 && student === 0 ? 1 : admin;
  const displayTeacher = admin === 0 && teacher === 0 && student === 0 ? 2 : teacher;
  const displayStudent = admin === 0 && teacher === 0 && student === 0 ? 8 : student;
  const displayTotal = displayAdmin + displayTeacher + displayStudent;

  const pctAdmin = displayAdmin / displayTotal;
  const pctTeacher = displayTeacher / displayTotal;
  const pctStudent = displayStudent / displayTotal;

  const r = 38;
  const circumference = 2 * Math.PI * r;

  const lenAdmin = pctAdmin * circumference;
  const lenTeacher = pctTeacher * circumference;
  const lenStudent = pctStudent * circumference;

  const offsetAdmin = 0;
  const offsetTeacher = lenAdmin;
  const offsetStudent = lenAdmin + lenTeacher;

  const getStrokeWidth = (role: string) => {
    return hoveredRole === role ? 12 : 10;
  };
  
  const getOpacity = (role: string) => {
    return hoveredRole === null || hoveredRole === role ? 1.0 : 0.45;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6 flex flex-col justify-between h-full hover:border-slate-700 transition-colors"
    >
      <div>
        <h3 className="font-bold text-white mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#facc15]" /> Role Distribution
        </h3>
        
        <div className="flex items-center justify-center py-4 relative">
          <svg className="w-36 h-36 transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="transparent" stroke="#18181b" strokeWidth="10" />
            
            {lenStudent > 0 && (
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#a855f7"
                strokeWidth={getStrokeWidth('student')}
                strokeDasharray={`${lenStudent} ${circumference - lenStudent}`}
                strokeDashoffset={-offsetStudent}
                strokeLinecap="round"
                opacity={getOpacity('student')}
                className="drop-shadow-[0_0_6px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredRole('student')}
                onMouseLeave={() => setHoveredRole(null)}
              />
            )}

            {lenTeacher > 0 && (
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth={getStrokeWidth('teacher')}
                strokeDasharray={`${lenTeacher} ${circumference - lenTeacher}`}
                strokeDashoffset={-offsetTeacher}
                strokeLinecap="round"
                opacity={getOpacity('teacher')}
                className="drop-shadow-[0_0_6px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredRole('teacher')}
                onMouseLeave={() => setHoveredRole(null)}
              />
            )}

            {lenAdmin > 0 && (
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#facc15"
                strokeWidth={getStrokeWidth('admin')}
                strokeDasharray={`${lenAdmin} ${circumference - lenAdmin}`}
                strokeDashoffset={-offsetAdmin}
                strokeLinecap="round"
                opacity={getOpacity('admin')}
                className="drop-shadow-[0_0_6px_rgba(250,204,21,0.3)] transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredRole('admin')}
                onMouseLeave={() => setHoveredRole(null)}
              />
            )}
          </svg>

          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">TOTAL</span>
            <span className="text-xl font-black text-white leading-none">{total}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-slate-900 text-xs">
        <div 
          className={`flex items-center justify-between p-1.5 rounded-lg transition duration-200 cursor-pointer ${
            hoveredRole === 'admin' ? 'bg-[#facc15]/10 border border-[#facc15]/20' : 'border border-transparent'
          }`}
          onMouseEnter={() => setHoveredRole('admin')}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
            <span className="text-slate-400 font-medium">Admins</span>
          </div>
          <div className="font-mono text-white font-bold">{admin} <span className="text-slate-600 font-normal font-sans">({Math.round(pctAdmin * 100)}%)</span></div>
        </div>
        <div 
          className={`flex items-center justify-between p-1.5 rounded-lg transition duration-200 cursor-pointer ${
            hoveredRole === 'teacher' ? 'bg-blue-500/10 border border-blue-500/20' : 'border border-transparent'
          }`}
          onMouseEnter={() => setHoveredRole('teacher')}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
            <span className="text-slate-400 font-medium">Teachers</span>
          </div>
          <div className="font-mono text-white font-bold">{teacher} <span className="text-slate-600 font-normal font-sans">({Math.round(pctTeacher * 100)}%)</span></div>
        </div>
        <div 
          className={`flex items-center justify-between p-1.5 rounded-lg transition duration-200 cursor-pointer ${
            hoveredRole === 'student' ? 'bg-purple-500/10 border border-purple-500/20' : 'border border-transparent'
          }`}
          onMouseEnter={() => setHoveredRole('student')}
          onMouseLeave={() => setHoveredRole(null)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
            <span className="text-slate-400 font-medium">Students</span>
          </div>
          <div className="font-mono text-white font-bold">{student} <span className="text-slate-600 font-normal font-sans">({Math.round(pctStudent * 100)}%)</span></div>
        </div>
      </div>
    </motion.div>
  );
};

const AnalyticsPanel: React.FC = () => {
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, 'admin_dashboard_view');
    }
  }, []);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('all');
  const [verifiedFilter, setVerifiedFilter] = React.useState('all');
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [line1Visible, setLine1Visible] = React.useState(true);
  const [line2Visible, setLine2Visible] = React.useState(true);
  const [tablePage, setTablePage] = React.useState(0);
  const PAGE_SIZE = 8;

  const currentAccounts = data?.data?.currentAccounts || data?.currentAccounts || [];
  const roleCounts = data?.data?.roleCounts || data?.roleCounts || { admin: 0, teacher: 0, student: 0 };

  const filteredAccounts = React.useMemo(() => {
    return currentAccounts.filter((account: any) => {
      const matchesSearch = 
        (account.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.email || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || account.role === roleFilter;
      
      const matchesVerified = 
        verifiedFilter === 'all' || 
        (verifiedFilter === 'verified' && account.emailVerified) ||
        (verifiedFilter === 'pending' && !account.emailVerified);

      return matchesSearch && matchesRole && matchesVerified;
    });
  }, [currentAccounts, searchTerm, roleFilter, verifiedFilter]);

  const resultData = data?.data?.result || [];
  const pageviewsSeries = resultData[0];
  const visitorsSeries = resultData[1];
  const avgSessionSeries = resultData[2];

  const chartData: number[] = pageviewsSeries?.data || [];
  const visitorsData: number[] = visitorsSeries?.data || [];
  const labels: string[] = pageviewsSeries?.labels || [];

  // Calculate SVG dimensions for the daily trends line chart
  const width = 600;
  const height = 240;
  const paddingX = 50;
  const paddingY = 30;

  const maxValue = Math.max(...chartData, ...visitorsData, 10);

  const getCoordinates = (seriesData: number[]) => {
    return seriesData.map((val, i) => {
      const x = paddingX + (i * (width - paddingX * 2)) / (seriesData.length - 1 || 1);
      const y = height - paddingY - (val * (height - paddingY * 2)) / maxValue;
      return { x, y, value: val };
    });
  };

  const pts1 = getCoordinates(chartData);
  const pts2 = getCoordinates(visitorsData);

  const points1Str = pts1.map(p => `${p.x},${p.y}`).join(' ');
  const points2Str = pts2.map(p => `${p.x},${p.y}`).join(' ');

  const areaPoints1Str = pts1.length ? `${paddingX},${height - paddingY} ${points1Str} ${pts1[pts1.length - 1].x},${height - paddingY}` : '';
  const areaPoints2Str = pts2.length ? `${paddingX},${height - paddingY} ${points2Str} ${pts2[pts2.length - 1].x},${height - paddingY}` : '';

  // Get total values
  const totalPageviews = pageviewsSeries?.count ?? 0;
  const totalVisitors = visitorsSeries?.count ?? 0;
  const avgSessionSec = avgSessionSeries?.count ?? 0;
  const avgSessionMin = avgSessionSec ? Math.round((avgSessionSec / 60) * 10) / 10 : 0;
  const newSignupsCount = data?.data?.newSignups ?? 0;

  // New backend enriched data
  const signupSparkline: number[] = data?.data?.signupSparkline || data?.signupSparkline || [];
  const verificationStats = data?.data?.verificationStats || data?.verificationStats || null;
  const growthTimeline: { _id: string; count: number }[] = data?.data?.growthTimeline || data?.growthTimeline || [];
  const topPages: { path: string; count: number }[] = data?.data?.topPages || [];
  const recentlyActive: number = data?.data?.recentlyActive || data?.recentlyActive || 0;

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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Page Views (7d)"
          value={data?.configured ? totalPageviews : '—'}
          icon={Eye}
          color="bg-blue-500/10 border-blue-500/20 text-blue-400"
          delay={0.05}
          trendData={data?.configured ? chartData : [5, 10, 8, 12, 10, 15, 20]}
          sparklineColor="#3b82f6"
        />
        <StatCard
          label="Unique Visitors"
          value={data?.configured ? totalVisitors : '—'}
          icon={Users}
          color="bg-purple-500/10 border-purple-500/20 text-purple-400"
          delay={0.1}
          trendData={data?.configured ? visitorsData : [2, 5, 4, 8, 6, 10, 14]}
          sparklineColor="#a855f7"
        />
        <StatCard
          label="New Signups (7d)"
          value={data ? newSignupsCount : '—'}
          icon={TrendingUp}
          color="bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          delay={0.15}
          trendData={signupSparkline.length > 0 ? signupSparkline : [0, 1, 0, 2, 1, 2, newSignupsCount]}
          sparklineColor="#10b981"
        />
        <StatCard
          label="Active Today"
          value={data ? recentlyActive : '—'}
          icon={Activity}
          color="bg-[#facc15]/10 border-[#facc15]/20 text-[#facc15]"
          delay={0.2}
          trendData={signupSparkline.length > 0 ? signupSparkline.map(v => v + recentlyActive) : [3, 4, 3, 5, 4, 5, recentlyActive]}
          sparklineColor="#facc15"
        />
      </div>

      {/* Verification Summary Bar */}
      {verificationStats && verificationStats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-[#0e0e11] border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Email Verification
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500">
              {verificationStats.verified}/{verificationStats.total} verified ({verificationStats.verifiedPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${verificationStats.verifiedPct}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ boxShadow: '0 0 8px rgba(16,185,129,0.3)' }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] font-bold">
            <span className="text-emerald-400">{verificationStats.verified} Verified</span>
            <span className="text-amber-400">{verificationStats.pending} Pending</span>
          </div>
        </motion.div>
      )}

      {/* Split details layout: Trends on left, Role distribution donut on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Trends Interactive SVG Chart */}
        <div className="lg:col-span-2">
          {data?.configured && chartData.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6 h-full relative hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/40 transition-all duration-300"
            >
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#facc15]" /> Weekly Trends
              </h3>

              {/* Floating Interactive Tooltip */}
              {hoveredIdx !== null && (
                <div className="absolute top-6 right-6 bg-[#09090b]/90 border border-slate-800 rounded-lg p-3 text-xs font-semibold backdrop-blur text-slate-300 pointer-events-none shadow-xl flex flex-col gap-1 z-10 min-w-[140px]">
                  <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">{labels[hoveredIdx]}</div>
                  {line1Visible && (
                    <div className="flex items-center justify-between gap-4 mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                        <span>Page Views</span>
                      </div>
                      <span className="text-white font-mono font-bold">{chartData[hoveredIdx]}</span>
                    </div>
                  )}
                  {line2Visible && (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                        <span>Visitors</span>
                      </div>
                      <span className="text-white font-mono font-bold">{visitorsData[hoveredIdx]}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="w-full overflow-x-auto">
                <div className="min-w-[500px] h-64 relative">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                      const y = paddingY + ratio * (height - paddingY * 2);
                      const val = Math.round(maxValue * (1 - ratio));
                      return (
                        <g key={index} className="opacity-20 pointer-events-none">
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={width - paddingX}
                            y2={y}
                            stroke="#94a3b8"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={paddingX - 10}
                            y={y + 4}
                            fill="#94a3b8"
                            fontSize="10"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Polyline Areas */}
                    {line1Visible && areaPoints1Str && (
                      <polygon points={areaPoints1Str} fill="url(#chartGrad1)" className="pointer-events-none" />
                    )}
                    {line2Visible && areaPoints2Str && (
                      <polygon points={areaPoints2Str} fill="url(#chartGrad2)" className="pointer-events-none" />
                    )}

                    {/* Polylines */}
                    {line1Visible && points1Str && (
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        points={points1Str}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)] pointer-events-none"
                      />
                    )}
                    {line2Visible && points2Str && (
                      <polyline
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="3"
                        points={points2Str}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_2px_8px_rgba(168,85,247,0.3)] pointer-events-none"
                      />
                    )}

                    {/* Dynamic Tooltip Vertical Handguide Line */}
                    {hoveredIdx !== null && (
                      <line
                        x1={pts1[hoveredIdx].x}
                        y1={paddingY}
                        x2={pts1[hoveredIdx].x}
                        y2={height - paddingY}
                        stroke="#475569"
                        strokeDasharray="3 3"
                        strokeWidth="1.5"
                        pointerEvents="none"
                      />
                    )}

                    {/* Highlight Circles on Hover */}
                    {hoveredIdx !== null && line1Visible && (
                      <circle
                        cx={pts1[hoveredIdx].x}
                        cy={pts1[hoveredIdx].y}
                        r="6"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="2"
                        pointerEvents="none"
                      />
                    )}
                    {hoveredIdx !== null && line2Visible && (
                      <circle
                        cx={pts2[hoveredIdx].x}
                        cy={pts2[hoveredIdx].y}
                        r="6"
                        fill="#a855f7"
                        stroke="#ffffff"
                        strokeWidth="2"
                        pointerEvents="none"
                      />
                    )}

                    {/* Data Points (Circles) */}
                    {line1Visible && pts1.map((pt, i) => (
                      <g key={`p1-${i}`} className="pointer-events-none">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#0e0e11"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}

                    {line2Visible && pts2.map((pt, i) => (
                      <g key={`p2-${i}`} className="pointer-events-none">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#0e0e11"
                          stroke="#a855f7"
                          strokeWidth="2.5"
                        />
                      </g>
                    ))}

                    {/* X Axis Labels */}
                    {labels.map((lbl, i) => {
                      const x = paddingX + (i * (width - paddingX * 2)) / (labels.length - 1 || 1);
                      const shortLabel = lbl.split('-').slice(0, 2).join(' ');
                      return (
                        <text
                          key={i}
                          x={x}
                          y={height - 10}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="opacity-60 pointer-events-none"
                        >
                          {shortLabel}
                        </text>
                      );
                    })}

                    {/* Invisible Hover Rect Zones */}
                    {labels.map((_, i) => {
                      const x = paddingX + (i * (width - paddingX * 2)) / (labels.length - 1 || 1);
                      const colWidth = (width - paddingX * 2) / (labels.length - 1 || 1);
                      return (
                        <rect
                          key={`hover-zone-${i}`}
                          x={x - colWidth / 2}
                          y={paddingY}
                          width={colWidth}
                          height={height - paddingY * 2}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredIdx(i)}
                          onMouseLeave={() => setHoveredIdx(null)}
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Legend with toggles */}
              <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-400 select-none">
                <button
                  onClick={() => setLine1Visible(!line1Visible)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition ${
                    line1Visible
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.1)]'
                      : 'border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${line1Visible ? 'bg-[#3b82f6]' : 'bg-slate-500'}`} />
                  <span>Page Views</span>
                </button>
                <button
                  onClick={() => setLine2Visible(!line2Visible)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border transition ${
                    line2Visible
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.1)]'
                      : 'border-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${line2Visible ? 'bg-[#a855f7]' : 'bg-slate-500'}`} />
                  <span>Unique Visitors</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6 h-64 flex flex-col items-center justify-center text-slate-500 text-sm font-mono">
              <TrendingUp className="w-8 h-8 text-slate-600 mb-2" />
              Trends visualization will load when PostHog data is available.
            </div>
          )}
        </div>

        {/* Role Distribution Donut Chart */}
        <div className="lg:col-span-1">
          <DonutChart
            admin={roleCounts.admin}
            teacher={roleCounts.teacher}
            student={roleCounts.student}
            delay={0.25}
          />
        </div>
      </div>

      {/* Top Pages & Growth Timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        {topPages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" /> Top Pages (7d)
            </h3>
            <div className="space-y-2">
              {topPages.map((page, i) => {
                const maxCount = topPages[0]?.count || 1;
                const barPct = Math.round((page.count / maxCount) * 100);
                return (
                  <div key={i} className="group flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-600 font-bold w-5 text-right shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0 relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded bg-blue-500/8 transition-all duration-500"
                        style={{ width: `${barPct}%` }}
                      />
                      <div className="relative flex items-center justify-between py-1.5 px-2">
                        <span className="text-xs text-slate-300 font-medium truncate">{page.path || '/'}</span>
                        <span className="text-[10px] font-mono font-bold text-blue-400 shrink-0 ml-2">{page.count.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* User Growth Timeline */}
        {growthTimeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
          >
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> User Growth (6 months)
            </h3>
            <div className="space-y-3">
              {(() => {
                const maxGrowth = Math.max(...growthTimeline.map(g => g.count), 1);
                return growthTimeline.map((month, i) => {
                  const barPct = Math.round((month.count / maxGrowth) * 100);
                  const label = new Date(month._id + '-01').toLocaleDateString([], { month: 'short', year: '2-digit' });
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-500 font-bold w-12 text-right shrink-0">{label}</span>
                      <div className="flex-1 h-5 rounded bg-slate-800/60 overflow-hidden relative">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barPct}%` }}
                          transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded bg-gradient-to-r from-emerald-600 to-emerald-400"
                          style={{ boxShadow: '0 0 6px rgba(16,185,129,0.2)' }}
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center text-[10px] font-mono font-bold text-white">
                          {month.count}
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Registered Accounts Section */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0e0e11] border border-slate-800 rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#facc15]" />
              <h3 className="font-bold text-white text-lg">Registered Accounts</h3>
              <span className="px-2 py-0.5 bg-[#facc15]/10 border border-[#facc15]/20 text-[#facc15] text-[10px] font-bold rounded font-mono">
                {currentAccounts.length}
              </span>
              {/* CSV Export */}
              <button
                onClick={() => {
                  const header = 'Name,Email,Role,Verified,Joined';
                  const rows = currentAccounts.map((a: any) => [
                    `"${(a.name || '').replace(/"/g, '""')}"`,
                    a.email,
                    a.role,
                    a.emailVerified ? 'Yes' : 'No',
                    a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
                  ].join(','));
                  const csv = [header, ...rows].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `accounts_${new Date().toISOString().split('T')[0]}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="ml-auto flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-400 border border-slate-800 rounded-lg hover:text-[#facc15] hover:border-[#facc15]/30 transition-colors"
                title="Export accounts as CSV"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#09090b] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#facc15] transition-colors cursor-pointer font-semibold"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>

              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-[#09090b] border border-slate-800 rounded-lg text-slate-300 outline-none focus:border-[#facc15] transition-colors cursor-pointer font-semibold"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Only</option>
                <option value="pending">Pending Only</option>
              </select>

              <div className="relative max-w-xs w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#09090b] border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 outline-none focus:border-[#facc15] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg bg-[#09090b]">
            {filteredAccounts.length === 0 ? (
              <div className="text-center py-10 text-slate-500 font-mono text-xs">
                No accounts found matching your query.
              </div>
            ) : (
              <>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-[#0d0d10]">
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Verified</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <AnimatePresence mode="popLayout">
                      {filteredAccounts.slice(tablePage * PAGE_SIZE, (tablePage + 1) * PAGE_SIZE).map((account: any, idx: number) => {
                        const initials = account.name
                          ? account.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                          : 'U';
                        const dateStr = account.createdAt
                          ? new Date(account.createdAt).toLocaleDateString([], {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—';

                        let roleColor = 'bg-slate-500/10 border-slate-500/20 text-slate-400';
                        if (account.role === 'admin') {
                          roleColor = 'bg-[#facc15]/10 border-[#facc15]/20 text-[#facc15]';
                        } else if (account.role === 'teacher') {
                          roleColor = 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                        }

                        return (
                          <motion.tr
                            key={account._id || account.email || idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15, delay: idx * 0.02 }}
                            className="hover:bg-slate-900/40 transition-colors"
                          >
                            <td className="py-3 px-4 flex items-center gap-3">
                              {account.profilePictureUrl ? (
                                <img
                                  src={account.profilePictureUrl}
                                  alt={account.name}
                                  className="w-7 h-7 rounded-full object-cover border border-slate-800 shrink-0"
                                />
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15] text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                              )}
                              <span className="font-semibold text-white">{account.name}</span>
                            </td>

                            <td className="py-3 px-4 text-slate-400 font-medium">
                              {account.email}
                            </td>

                            <td className="py-3 px-4">
                              {account.emailVerified ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-amber-500/20 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded">
                                  <Clock className="w-3.5 h-3.5" /> Pending
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wider ${roleColor}`}>
                                {account.role}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-slate-500 font-semibold font-mono">
                              {dateStr}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>

                {/* Pagination Footer */}
                {filteredAccounts.length > PAGE_SIZE && (
                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-[#0d0d10]">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">
                      Showing {tablePage * PAGE_SIZE + 1}–{Math.min((tablePage + 1) * PAGE_SIZE, filteredAccounts.length)} of {filteredAccounts.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTablePage(Math.max(0, tablePage - 1))}
                        disabled={tablePage === 0}
                        className="p-1 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      {Array.from({ length: Math.ceil(filteredAccounts.length / PAGE_SIZE) }).map((_, pg) => (
                        <button
                          key={pg}
                          onClick={() => setTablePage(pg)}
                          className={`w-6 h-6 rounded text-[10px] font-bold transition-colors ${
                            pg === tablePage
                              ? 'bg-[#facc15]/10 border border-[#facc15]/30 text-[#facc15]'
                              : 'border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          {pg + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setTablePage(Math.min(Math.ceil(filteredAccounts.length / PAGE_SIZE) - 1, tablePage + 1))}
                        disabled={tablePage >= Math.ceil(filteredAccounts.length / PAGE_SIZE) - 1}
                        className="p-1 rounded border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

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
