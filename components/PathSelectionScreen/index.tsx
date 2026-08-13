import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ProgrammingPath } from '../../types';
import { PATHS } from '../../constants';
import Mascot from '../Mascot';
import { Star, Users, ArrowRight, Lock, BookOpen, Bot } from 'lucide-react';

interface PathSelectionScreenProps {
  onPathSelected: (pathId: ProgrammingPath['id']) => void;
}

const getEnrolledCount = (pathId: string) => {
  const counts: Record<string, number> = {
    python: 284,
    javascript: 256,
    block_coding: 210,
    web_dev: 195,
    sql: 148,
    typescript: 115,
    java: 98,
    'c++': 85,
    c_sharp: 72,
    rust: 64,
    go: 58,
    swift: 42,
    kotlin: 36,
    lua: 24,
    dart: 18,
  };
  const count = counts[pathId] || (Math.abs(pathId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 80 + 15);
  return count.toLocaleString();
};

const PathSelectionScreen: React.FC<PathSelectionScreenProps> = ({ onPathSelected }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSelect = (pathId: ProgrammingPath['id']) => {
    onPathSelected(pathId);
    navigate(`/dashboard/learn/${pathId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#202124] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all text-center flex flex-col items-center">
          <div className="w-20 h-20 mb-3 drop-shadow-sm hover:scale-105 transition-transform cursor-pointer">
            <Mascot />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-semibold mb-3">
            <Bot className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
            <span>Google Material 3 Learning Academy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight mb-2">
            {t('choose_your_path')}
          </h1>

          <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
            Select a path to begin your coding adventure! Each path offers interactive lessons, fun games, and customized rewards.
          </p>
        </div>

        {/* Path Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {PATHS.map((path, idx) => {
            return (
              <button
                key={path.id}
                onClick={() => handleSelect(path.id)}
                disabled={!path.isAvailable}
                className={`group relative bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8]/50 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_4px_12px_rgba(60,64,67,0.12)] text-left cursor-pointer ${
                  !path.isAvailable ? 'opacity-60 cursor-not-allowed grayscale' : ''
                }`}
              >
                {/* Header: Path Index Tag & Tech Icon */}
                <div className="flex justify-between items-start w-full mb-4">
                  {!path.isAvailable ? (
                    <span className="text-[11px] font-medium px-3 py-0.5 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] border border-[#E8EAED] dark:border-[#5F6368] uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] border border-[#1A73E8]/20">
                      PATH #{idx + 1}
                    </span>
                  )}
                  
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    {path.icon.startsWith('http') || path.icon.startsWith('/') ? (
                      <img 
                        src={path.icon} 
                        alt="" 
                        className="w-7 h-7 object-contain" 
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-2xl select-none">{path.icon}</span>
                    )}
                  </div>
                </div>

                {/* Body: Title & Description */}
                <div className="space-y-2 my-2">
                  <h2 className="text-xl font-bold tracking-tight leading-snug text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                    {t(path.titleKey as any)}
                  </h2>
                  <p className="text-xs font-normal leading-relaxed text-[#5F6368] dark:text-[#9AA0A6] line-clamp-3">
                    {t(path.descriptionKey as any)}
                  </p>
                </div>

                {/* Footer: Enrollment Counter & Action Button */}
                <div className="pt-4 mt-4 border-t border-[#F1F3F4] dark:border-[#3C4043] flex items-center justify-between">
                  {path.isAvailable ? (
                    <>
                      <div className="bg-[#E6F4EA] dark:bg-[#3C4043] border border-[#34A853]/30 px-3 py-1 rounded-full text-[11px] font-medium text-[#137333] dark:text-[#81C995] flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{getEnrolledCount(path.id)} enrolled</span>
                      </div>

                      <div className="w-7 h-7 rounded-full bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8] flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] font-medium text-[#5F6368] dark:text-[#9AA0A6] bg-[#F1F3F4] dark:bg-[#3C4043] px-3 py-1 rounded-full border border-[#E8EAED] dark:border-[#5F6368]">
                      Coming Soon
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default PathSelectionScreen;
