
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Shield, Globe, CheckCircle2, X } from 'lucide-react';

interface DbSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  isRetrying: boolean;
}

const DbSetupGuide: React.FC<DbSetupGuideProps> = ({ isOpen, onClose, onRetry, isRetrying }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden border-4 border-red-100 dark:border-red-900/30"
          >
            <div className="bg-red-500 p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Database className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Database Connection Error</h2>
              </div>
              <p className="text-red-50 font-bold">Your application is running, but it cannot talk to your MongoDB Atlas database. This is usually due to IP whitelisting.</p>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-800 dark:text-white">
                    <Shield className="w-5 h-5 text-red-500" />
                    <h3 className="font-black uppercase text-sm">Step 1: Network Access</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Log in to your <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-red-500 underline font-bold">MongoDB Atlas Dashboard</a> and go to <strong>Network Access</strong> in the left sidebar.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-800 dark:text-white">
                    <Globe className="w-5 h-5 text-red-500" />
                    <h3 className="font-black uppercase text-sm">Step 2: Add IP Address</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Click <strong>Add IP Address</strong> and select <strong>Allow Access From Anywhere</strong> (0.0.0.0/0) for development.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white uppercase text-xs mb-1">Step 3: Confirm & Retry</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Click <strong>Confirm</strong> and wait about 60 seconds. Then click the <strong>"Retry Connection"</strong> button below.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={onClose}
                  className="text-slate-400 font-black uppercase text-xs hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Close Guide
                </button>
                <button
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="px-8 py-3 bg-red-500 text-white font-black uppercase rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                  {isRetrying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Retrying...
                    </>
                  ) : (
                    'Retry Connection Now'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DbSetupGuide;
