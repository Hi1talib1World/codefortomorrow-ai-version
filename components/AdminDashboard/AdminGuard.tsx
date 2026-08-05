import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';

interface AdminGuardProps {
  children: React.ReactNode;
  currentUser: {
    role?: string | null;
    email?: string;
  } | null;
}

/**
 * Frontend guard for the /admin route.
 * - If not logged in → redirect to /auth
 * - If user is not admin → show access required screen with current account email
 * - Otherwise → renders children
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center text-white p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h1 className="text-3xl font-black mb-2 text-white">Admin Access Required</h1>
        <p className="text-slate-400 mb-2 max-w-md">
          You are currently signed in as <span className="text-[#facc15] font-mono">{currentUser.email || 'Guest'}</span>, which does not have admin privileges.
        </p>
        <p className="text-slate-500 text-sm mb-6">
          Please sign in with your admin account (e.g., <code className="text-slate-300">hichamoutaleb7@gmail.com</code>).
        </p>
        <div className="flex gap-4">
          <a href="/auth" className="bg-[#facc15] text-slate-950 font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-400 text-sm no-underline">
            Switch Account
          </a>
          <a href="/" className="bg-slate-800 text-slate-300 font-bold px-6 py-2.5 rounded-lg hover:bg-slate-700 text-sm no-underline">
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default AdminGuard;
