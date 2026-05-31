import React from 'react';
import { Trophy, DollarSign, Sparkles } from 'lucide-react';
import { useI18n } from './i18n';

export const BountiesHub: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">{t('bounties.title')}</h1>
          <p className="text-slate-400 text-sm font-medium">{t('bounties.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#121212] rounded-3xl border border-slate-800/60 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-[#facc15]" />
            <h2 className="text-2xl font-bold text-white">{t('bounties.topPlatforms')}</h2>
          </div>
          <div className="space-y-4 text-slate-300 text-sm">
            <p><span className="font-semibold text-white">Gitcoin</span> — {t('bounties.gitcoin')}</p>
            <p><span className="font-semibold text-white">IssueHunt</span> — {t('bounties.issuehunt')}</p>
            <p><span className="font-semibold text-white">Bountysource</span> — {t('bounties.bountysource')}</p>
            <p><span className="font-semibold text-white">Hackathons</span> — {t('bounties.hackathons')}</p>
          </div>
        </div>

        <div className="bg-[#121212] rounded-3xl border border-slate-800/60 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-[#facc15]" />
            <h2 className="text-2xl font-bold text-white">{t('bounties.maximizePayout')}</h2>
          </div>
          <div className="space-y-4 text-slate-300 text-sm">
            <p>{t('bounties.tip1')}</p>
            <p>{t('bounties.tip2')}</p>
            <p>{t('bounties.tip3')}</p>
            <p>{t('bounties.tip4')} <span className="text-[#facc15] font-bold">good first issue</span>, <span className="text-[#facc15] font-bold">help wanted</span>, and <span className="text-[#facc15] font-bold">bounty</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
