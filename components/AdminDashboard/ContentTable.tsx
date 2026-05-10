import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Pencil, Trash2, ToggleLeft, ToggleRight,
  PlusCircle, FileText, Loader2, AlertTriangle, ChevronUp, ChevronDown
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ContentItem {
  _id: string;
  title: string;
  slug: string;
  type: 'post' | 'announcement' | 'featured';
  status: 'draft' | 'live';
  tags: string[];
  updatedAt: string;
  author?: { name: string };
}

// ─── API helpers ──────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchContent = async (search: string, status: string): Promise<{ items: ContentItem[]; total: number }> => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status) params.set('status', status);
  const res = await fetch(`/api/admin/content?${params}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch content');
  return res.json();
};

const toggleStatusApi = async (id: string): Promise<ContentItem> => {
  const res = await fetch(`/api/admin/content/${id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to toggle status');
  return res.json();
};

const deleteContentApi = async (id: string): Promise<void> => {
  const res = await fetch(`/api/admin/content/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to delete content');
};

// ─── Component ────────────────────────────────────────────────────────────────
const ContentTable: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-content', debouncedSearch, statusFilter],
    queryFn: () => fetchContent(debouncedSearch, statusFilter),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleStatusApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-content'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      setDeleteTarget(null);
    },
  });

  const typeColor: Record<string, string> = {
    post: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    announcement: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    featured: 'bg-[#facc15]/10 text-[#facc15] border-[#facc15]/20',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FileText className="w-6 h-6 text-[#facc15]" />
            <h1 className="text-2xl font-black text-white tracking-tight">Content</h1>
          </div>
          <p className="text-sm text-slate-500 font-mono">
            {data?.total ?? 0} total items
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/new')}
          className="flex items-center gap-2 bg-[#facc15] hover:bg-yellow-400 text-black font-bold text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="live">Live</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#0e0e11] border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#facc15] animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <p className="text-slate-400 text-sm">Failed to load content. Check your admin credentials.</p>
          </div>
        ) : data?.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <FileText className="w-10 h-10 text-slate-700" />
            <p className="text-slate-500 text-sm">No content yet. Create your first post!</p>
            <button
              onClick={() => navigate('/admin/new')}
              className="text-[#facc15] text-sm font-bold hover:underline"
            >
              + New Post
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Title</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden lg:table-cell">Tags</th>
                  <th className="px-4 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden md:table-cell">Updated</th>
                  <th className="px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {data?.items.map((item) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white truncate max-w-[200px]">{item.title}</div>
                        <div className="text-[11px] text-slate-600 font-mono truncate max-w-[200px]">{item.slug}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-md border text-[11px] font-bold ${typeColor[item.type]}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleMutation.mutate(item._id)}
                          disabled={toggleMutation.isPending}
                          className="flex items-center gap-1.5 group"
                          title="Toggle status"
                        >
                          {item.status === 'live' ? (
                            <ToggleRight className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                          )}
                          <span className={`text-[11px] font-bold ${item.status === 'live' ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {item.status === 'live' ? 'Live' : 'Draft'}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-slate-500 text-[12px] font-mono">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/edit/${item._id}`)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0e0e11] border border-slate-800 rounded-2xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Delete Content</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteTarget)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContentTable;
