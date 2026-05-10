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
 * - If loading/no user → silent redirect to /
 * - If user is not admin → silent redirect to /
 * - Otherwise → renders children
 */
const AdminGuard: React.FC<AdminGuardProps> = ({ children, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
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
