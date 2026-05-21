import React from 'react';
import { Trophy, DollarSign, Sparkles } from 'lucide-react';

export const BountiesHub: React.FC = () => {
  return (
    <div className="pb-24">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Earn & Code</h1>
          <p className="text-slate-400 text-sm font-medium">A quick guide to open source bounties, hackathon opportunities, and paid issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-[#121212] rounded-3xl border border-slate-800/60 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-[#facc15]" />
            <h2 className="text-2xl font-bold text-white">Top platforms to find paid work</h2>
          </div>
          <div className="space-y-4 text-slate-300 text-sm">
            <p><span className="font-semibold text-white">Gitcoin</span> — discover grants and bounty projects supported by open source sponsors.</p>
            <p><span className="font-semibold text-white">IssueHunt</span> — earn rewards by fixing issues in active repositories.</p>
            <p><span className="font-semibold text-white">Bountysource</span> — browse open source issues that offer cash prizes.</p>
            <p><span className="font-semibold text-white">Hackathons</span> — join competitions that pay for winning or sponsoring contributions.</p>
          </div>
        </div>

        <div className="bg-[#121212] rounded-3xl border border-slate-800/60 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-[#facc15]" />
            <h2 className="text-2xl font-bold text-white">How to maximize your payout</h2>
          </div>
          <div className="space-y-4 text-slate-300 text-sm">
            <p>Focus on repos with active maintainers and clear contribution guidelines.</p>
            <p>Submit small, high-quality PRs first to establish trust before taking larger issues.</p>
            <p>Keep your profile updated and link previous open source work.</p>
            <p>Use issue filters like <span className="text-[#facc15] font-bold">good first issue</span>, <span className="text-[#facc15] font-bold">help wanted</span>, and <span className="text-[#facc15] font-bold">bounty</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
