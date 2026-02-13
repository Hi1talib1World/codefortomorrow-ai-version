
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import ImportContentWizard from './ImportContentWizard';

interface GameStudioScreenProps {
    onBack: () => void;
}

const ImportIllustration = () => (
    <div className="w-full h-40 bg-white/20 flex items-center justify-center rounded-lg">
        <span className="text-5xl">📚</span>
    </div>
);
const MathIllustration = () => (
     <div className="w-full h-40 bg-white flex items-center justify-center rounded-lg">
        <span className="text-5xl font-bold text-slate-700">14+4</span>
    </div>
);
const ScienceIllustration = () => (
     <div className="w-full h-40 bg-white flex items-center justify-center rounded-lg">
        <span className="text-5xl">🔭</span>
    </div>
);


const GameStudioCard = ({ card, isPrimary, onClick }: { card: any, isPrimary: boolean, onClick: () => void }) => {
    const { t } = useLanguage();
    return (
        <div className={`rounded-2xl shadow-lg p-6 flex flex-col ${isPrimary ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-slate-800'}`}>
            <div className="mb-4">
                {card.illustration}
            </div>
            <h3 className="text-xl font-bold mb-1">{t(card.titleKey as any)}</h3>
            <p className={`text-sm flex-grow ${isPrimary ? 'text-indigo-200' : 'text-slate-500'}`}>{t(card.descriptionKey as any)}</p>
            <button 
                onClick={onClick}
                className={`mt-6 w-full py-3 rounded-xl font-bold transition-colors ${isPrimary ? 'bg-white text-indigo-600 hover:bg-indigo-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                {t('create')}
            </button>
        </div>
    );
};


const GameStudioScreen: React.FC<GameStudioScreenProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [activeFlow, setActiveFlow] = useState<string | null>(null);

    const creationCards = [
        {
            id: 'import',
            titleKey: 'game_studio_import_title',
            descriptionKey: 'game_studio_import_desc',
            illustration: <ImportIllustration />,
            primary: true,
        },
        {
            id: 'math',
            titleKey: 'game_studio_math_title',
            descriptionKey: 'game_studio_math_desc',
            illustration: <MathIllustration />,
            primary: false,
        },
        {
            id: 'science',
            titleKey: 'game_studio_science_title',
            descriptionKey: 'game_studio_science_desc',
            illustration: <ScienceIllustration />,
            primary: false,
        },
    ];

    if (activeFlow === 'import') {
        return <ImportContentWizard onBack={() => setActiveFlow(null)} />
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">{t('back')}</span>
                </button>
                <div className="flex items-center space-x-2 text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h1 className="text-3xl font-bold">{t('game_studio')}</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creationCards.map((card) => (
                    <GameStudioCard 
                        key={card.id} 
                        card={card} 
                        isPrimary={card.primary} 
                        onClick={() => setActiveFlow(card.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameStudioScreen;
