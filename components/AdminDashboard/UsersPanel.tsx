import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users, Search, Shield, GraduationCap, School, CheckCircle2,
  XCircle, Filter, Loader2, ArrowUpDown, Calendar, Award
} from 'lucide-react';
import { useToast } from '../ToastNotification';

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  profilePictureUrl?: string;
  emailVerified?: boolean;
  progress?: {
    xp?: number;
    streak?: number;
  };
  createdAt?: string;
}

const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchUsersApi = async (search: string, roleFilter: string, page: number) => {
  const query = new URLSearchParams({
    search,
    role: roleFilter,
    page: page.toString(),
    limit: '25',
  });
  const res = await fetch(`/api/admin/users?${query}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
};

const updateUserRoleApi = async ({ userId, role }: { userId: string; role: string }) => {
  const res = await fetch(`/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update role');
  return res.json();
};

const UsersPanel: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter, page],
    queryFn: () => fetchUsersApi(searchTerm, roleFilter, page),
  });

  const roleMutation = useMutation({
    mutationFn: updateUserRoleApi,
    onSuccess: (updatedUser) => {
      showToast(`User ${updatedUser.name} role updated to ${updatedUser.role.toUpperCase()} ✨`, 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-system-status'] });
    },
    onError: (err: Error) => {
      showToast(err.message || 'Failed to update user role', 'error');
    },
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#facc15]/10 text-[#facc15] border border-[#facc15]/30">
            <Shield className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <School className="w-3.5 h-3.5" /> Teacher
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#facc15]" /> User Management
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage user accounts, assign roles, and inspect platform progress.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-[#0e0e11] px-3 py-1.5 rounded-lg border border-slate-800">
          Total Users: <span className="text-[#facc15] font-bold">{data?.total ?? 0}</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-xl text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 bg-[#0e0e11] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#facc15]/40 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0e0e11] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#facc15]" />
            <span>Loading user accounts...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-400 text-sm">
            Failed to load users. Please refresh or check server logs.
          </div>
        ) : data?.users?.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No users match the selected search filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#09090b] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">XP & Stats</th>
                  <th className="px-6 py-3.5">Joined</th>
                  <th className="px-6 py-3.5 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.users.map((user: UserRecord) => (
                  <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-900"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate text-sm flex items-center gap-1.5">
                            {user.name || 'Anonymous User'}
                            {user.emailVerified && (
                              <span title="Verified Email">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 font-mono truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>

                    {/* XP & Progress */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Award className="w-3.5 h-3.5 text-[#facc15]" />
                        <span className="font-bold text-white">{user.progress?.xp ?? 0}</span> XP
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Role Selector */}
                    <td className="px-6 py-4 text-right">
                      <select
                        value={user.role}
                        disabled={roleMutation.isPending}
                        onChange={(e) =>
                          roleMutation.mutate({ userId: user._id, role: e.target.value })
                        }
                        className="px-2.5 py-1.5 bg-[#09090b] border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-[#facc15] cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.total > 25 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing page {page} of {Math.ceil(data.total / 25)}</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-[#09090b] border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800"
              >
                Previous
              </button>
              <button
                disabled={page * 25 >= data.total}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 bg-[#09090b] border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPanel;
