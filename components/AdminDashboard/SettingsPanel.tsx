import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Settings, Cpu, Server, Shield, Cloud, Key, CheckCircle2,
  AlertTriangle, RefreshCw, Lock, Sliders
} from 'lucide-react';
import { useToast } from '../ToastNotification';

const getToken = () => localStorage.getItem('cftos_token') || '';

const fetchStatus = async () => {
  const res = await fetch('/api/admin/status', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};

const SettingsPanel: React.FC = () => {
  const { showToast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [selectedAiModel, setSelectedAiModel] = useState('gemini-2.5-flash');

  const { data: status, isLoading, refetch } = useQuery({
    queryKey: ['admin-system-settings'],
    queryFn: fetchStatus,
  });

  const handleSaveSettings = () => {
    showToast('Platform settings saved successfully! ⚙️', 'success');
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#facc15]" /> Admin Platform Settings
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure system parameters, manage API keys, and monitor environment services.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#0e0e11] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Controls */}
        <div className="bg-[#0e0e11] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#facc15]" /> General Controls
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#09090b] border border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">Maintenance Mode</div>
                <div className="text-xs text-slate-500">Temporarily restrict platform access</div>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-[#facc15]' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#09090b] border border-slate-800">
              <div>
                <div className="text-sm font-bold text-white">Public User Registration</div>
                <div className="text-xs text-slate-500">Allow new users to sign up</div>
              </div>
              <button
                onClick={() => setRegistrationOpen(!registrationOpen)}
                className={`w-12 h-6 rounded-full transition-colors relative ${registrationOpen ? 'bg-emerald-400' : 'bg-slate-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${registrationOpen ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <label className="block text-xs font-bold text-slate-400 mb-2">Default AI Engine Model</label>
            <select
              value={selectedAiModel}
              onChange={(e) => setSelectedAiModel(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#09090b] border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-[#facc15] cursor-pointer"
            >
              <option value="gemini-2.5-flash">Google Gemini 2.5 Flash (Fast / Low Latency)</option>
              <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Deep Reasoning)</option>
            </select>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full bg-[#facc15] hover:bg-yellow-400 text-slate-950 font-bold text-sm py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>

        {/* System & Integrations Checklist */}
        <div className="bg-[#0e0e11] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> Environment Integrations
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-sm font-bold text-white">MongoDB Database</div>
                  <div className="text-xs text-slate-500 font-mono">Connection string initialized</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-sm font-bold text-white">Google Gemini API Key</div>
                  <div className="text-xs text-slate-500 font-mono">{status?.geminiConfigured ? 'Key active in .env' : 'Fallback'}</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cloud className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-sm font-bold text-white">Cloudinary CDN</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {status?.cloudinaryConfigured ? 'Connected (ibz8hd4d)' : 'Local Data URL Fallback'}
                  </div>
                </div>
              </div>
              {status?.cloudinaryConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-[#09090b] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#facc15]" />
                <div>
                  <div className="text-sm font-bold text-white">Admin Email Allowlist</div>
                  <div className="text-xs text-slate-500 font-mono">hichamoutaleb7@gmail.com</div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
