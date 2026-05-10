import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ 
  isOpen, 
  onClose,
  title = "Join Code for Tomorrow",
  message = "Create an account to save your favorite repositories, posts, and track your progress!"
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={onClose}
                  className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-16 h-16 bg-brand-500/20 text-brand-500 rounded-2xl flex items-center justify-center mb-6">
                  <UserPlus className="w-8 h-8" />
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
                  {title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                  {message}
                </p>

                <div className="w-full flex flex-col gap-3">
                  <button
                    onClick={() => {
                      localStorage.setItem('lastVisitedRoute', window.location.pathname);
                      navigate('/auth');
                    }}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-5 h-5" />
                    Create Account
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('lastVisitedRoute', window.location.pathname);
                      navigate('/auth');
                    }}
                    className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    Log In
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
