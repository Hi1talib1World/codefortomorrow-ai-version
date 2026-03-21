
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ImportContentWizard from '../ImportContentWizard';
import CurriculumWizard from '../CurriculumWizard';
import { Creation } from '../../types';

interface QuestionLabScreenProps {
    onBack: () => void;
    onSave: (creation: Creation) => void;
}

const FrenchIllustration = () => (
    <div className="w-full h-40 bg-gradient-to-br from-blue-500 via-white to-red-500 p-1 flex items-center justify-center rounded-lg transition-colors overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 opacity-10 bg-white dark:bg-slate-900"></div>
        <span className="text-6xl drop-shadow-lg relative z-10">🗼</span>
    </div>
);

interface QuestionLabCardProps {
    card: any;
    isPrimary: boolean;
    onClick: () => void;
}

const QuestionLabCard: React.FC<QuestionLabCardProps> = ({ card, isPrimary, onClick }) => {
    const { t } = useLanguage();
    return (
        <div className={`rounded-[2rem] shadow-lg p-6 flex flex-col transition-all transform hover:-translate-y-1 ${isPrimary ? 'bg-indigo-600 text-white border-b-8 border-indigo-800' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-b-8 border-slate-200 dark:border-slate-950'}`}>
            <div className="mb-4 rounded-2xl overflow-hidden shadow-inner">
                {card.illustrationUrl ? (
                    <div className="h-40 bg-white dark:bg-slate-700 flex items-center justify-center">
                        <img src={card.illustrationUrl} alt={t(card.titleKey as any)} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                ) : (
                    card.illustration
                )}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{t(card.titleKey as any)}</h3>
            <p className={`text-sm font-bold flex-grow leading-tight ${isPrimary ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'}`}>{t(card.descriptionKey as any)}</p>
            <button
                onClick={onClick}
                className={`mt-6 w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all border-b-4 active:border-b-0 active:translate-y-1 ${isPrimary ? 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50' : 'bg-indigo-600 text-white border-indigo-800 hover:bg-indigo-500'}`}>
                {t('create')}
            </button>
        </div>
    );
};


const QuestionLabScreen: React.FC<QuestionLabScreenProps> = ({ onBack, onSave }) => {
    const { t } = useLanguage();
    const [activeFlow, setActiveFlow] = useState<string | null>(null);
    const [activeFlowTitleKey, setActiveFlowTitleKey] = useState<string>('');

    const creationCards = [
        {
            id: 'import',
            titleKey: 'game_studio_import_title',
            descriptionKey: 'question_lab_import_desc',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/import-illustration.png',
            primary: true,
        },
        {
            id: 'math',
            titleKey: 'game_studio_math_title',
            descriptionKey: 'question_lab_math_desc',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/math-illustration.png',
            primary: false,
        },
        {
            id: 'science',
            titleKey: 'game_studio_science_title',
            descriptionKey: 'question_lab_science_desc',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/science-illustration.png',
            primary: false,
        },
        {
            id: 'french',
            titleKey: 'game_studio_french_title',
            descriptionKey: 'question_lab_french_desc',
            illustration: <FrenchIllustration />,
            primary: false,
        },
    ];

    const handleCardClick = (cardId: string, titleKey: string) => {
        setActiveFlow(cardId);
        setActiveFlowTitleKey(titleKey);
    };

    if (activeFlow === 'import') {
        return <ImportContentWizard onBack={() => setActiveFlow(null)} onSave={onSave} />
    }

    if (activeFlow === 'math' || activeFlow === 'science' || activeFlow === 'french') {
        return <CurriculumWizard
            subjectTitleKey={activeFlowTitleKey}
            onBack={() => setActiveFlow(null)}
            onSave={onSave}
        />
    }

    return (
        <div className="p-4 md:p-8 bg-brand-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-10 flex items-center space-x-4">
                <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-colors text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t('question_lab')}</h1>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {creationCards.map((card) => (
                    <QuestionLabCard
                        key={card.id}
                        card={card}
                        isPrimary={card.primary}
                        onClick={() => handleCardClick(card.id, card.titleKey)}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuestionLabScreen;
