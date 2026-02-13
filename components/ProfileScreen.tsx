
import React from 'react';
import { UserProgress } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { BADGES_BY_PATH, PATHS } from '../constants';
import Mascot from './Mascot';

interface ProfileScreenProps {
  userProgress: UserProgress;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userProgress }) => {
    const { t } = useLanguage();
    
    const allEarnedBadges = PATHS.flatMap(path => {
        const pathBadges = BADGES_BY_PATH[path.id] || [];
        const pathCompletions = userProgress.completedLessons[path.id] || [];
        const earned = pathBadges.filter(badge => pathCompletions.includes(badge.lessonId));
        return earned.map(badge => ({ ...badge, pathId: path.id }));
    });

    return (
        <div className="p-4 md:p-6 max-w-3xl mx-auto">
            <header className="text-center mb-8">
                <div className="w-32 h-32 mx-auto mb-4 bg-blue-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    {/* Placeholder for customizable avatar */}
                    <div className="transform scale-110">
                        <Mascot />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-slate-800">{t('my_profile')}</h1>
                <p className="text-slate-500">Amazing coder in training!</p>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 shadow-md">
                    <span className="text-4xl">⭐</span>
                    <div>
                        <p className="text-2xl font-bold text-yellow-500">{userProgress.xp}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase">{t('xp')}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 shadow-md">
                    <span className="text-4xl">🔥</span>
                    <div>
                        <p className="text-2xl font-bold text-orange-500">{userProgress.streak}</p>
                        <p className="text-sm font-bold text-slate-500 uppercase">{t('streak')}</p>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-700 mb-4">{t('my_badges')}</h2>
                {allEarnedBadges.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {allEarnedBadges.map(badge => (
                            <div key={`${badge.pathId}-${badge.id}`} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-md aspect-square">
                                <span className="text-5xl mb-2">{badge.icon}</span>
                                <p className="text-xs font-bold text-slate-600 leading-tight">{t(badge.titleKey as any)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white rounded-2xl p-8 text-slate-500">
                        <p>Complete your first lesson to earn a badge!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProfileScreen;
