
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import GameStudioScreen from '../GameStudioScreen';
import QuestionLabScreen from '../QuestionLabScreen';
import SmartBooksScreen from '../SmartBooksScreen';
import SpeakingHubScreen from '../SpeakingHubScreen';
import QuizPlayScreen from '../QuizPlayScreen';
import { Creation } from '../../types';

interface CreationToolCardProps {
    tool: any;
    onClick: () => void;
}

const CreationToolCard: React.FC<CreationToolCardProps> = ({ tool, onClick }) => {
    const { t } = useLanguage();
    const isComingSoon = tool.status === 'coming_soon';

    const colorClasses: { [key: string]: string } = {
        purple: 'bg-[#EA4335]', // Red
        green: 'bg-[#34A853]',  // Green
        pink: 'bg-[#FBBC05]',   // Yellow
        orange: 'bg-[#EA4335]', // Red
        blue: 'bg-[#2E2FCE]',   // Blue
    };

    const buttonColorClasses: { [key: string]: string } = {
        purple: 'bg-white text-[#EA4335] hover:bg-slate-50',
        green: 'bg-white text-[#34A853] hover:bg-slate-50',
        pink: 'bg-white text-[#F29900] hover:bg-slate-50',
        orange: 'bg-white text-[#EA4335] hover:bg-slate-50',
        blue: 'bg-white text-[#2E2FCE] hover:bg-slate-50',
    }

    return (
        <div className={`relative rounded-3xl shadow-sm text-white p-6 flex flex-col h-full overflow-hidden transition-transform hover:-translate-y-1 ${colorClasses[tool.color]}`}>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-110"></div>
            <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-110"></div>

            <div className="flex-grow z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl mb-4 flex items-center justify-center shadow-sm backdrop-blur-sm border border-white/20 relative">
                    <span className="text-3xl relative z-10">{tool.icon}</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">{t(tool.titleKey as any)}</h3>
                <p className="text-sm opacity-90 mt-2 font-medium leading-snug text-white/90">{t(tool.descriptionKey as any)}</p>
            </div>
            <div className="mt-8 z-10">
                <button
                    onClick={!isComingSoon ? onClick : undefined}
                    className={`w-full py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${isComingSoon ? 'bg-black/20 text-white/70 cursor-not-allowed' : buttonColorClasses[tool.color]}`}
                >
                    {t(tool.buttonTextKey as any)}
                </button>
            </div>
        </div>
    )
}

const RecentContentDetails = ({ item, onOpen }: { item: Creation, onOpen: () => void }) => {
    const { t } = useLanguage();

    const detailRows = [
        { icon: '', label: t('content_type'), value: t(item.contentType as any), detail: t('multiple_choice') },
        { icon: '', label: t('stage'), value: t(item.stageKey as any) },
        { icon: '', label: t('question_count'), value: item.questionCount },
        { icon: '', label: t('language_label'), value: item.language },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 transition-colors rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 flex flex-col h-full">
            <div className="flex items-center space-x-5 mb-8">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 bg-[#2E2FCE]/10 dark:bg-slate-900 rounded-2xl flex items-center justify-center border border-[#2E2FCE]/20 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#2E2FCE]/5 pointer-events-none"></div>
                        <span className="text-2xl font-bold text-[#2E2FCE] dark:text-[#a3aaeb] relative z-10">{item.questionCount}</span>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {item.date}
                    </p>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate tracking-tight">{item.title}</h3>
                </div>
            </div>

            <div className="space-y-4 my-6">
                {detailRows.map(row => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50 pb-3 last:border-0">
                        <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium text-sm">
                            <span className="mr-3 text-lg opacity-80">{row.icon}</span>
                            <span>{row.label}</span>
                        </div>
                        <div className="font-bold text-slate-800 dark:text-white text-right text-sm">
                            {row.value}
                            {row.detail && <span className="block text-xs text-slate-500 font-medium mt-1">{row.detail}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full text-center py-3 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-[#2E2FCE] bg-slate-50 dark:bg-slate-700/30 hover:bg-[#2E2FCE]/5 rounded-xl transition-all shadow-sm">
                {t('view_learning_outcomes')}
            </button>

            <div className="flex-grow"></div>

            <div className="grid grid-cols-2 gap-4 mb-4 mt-6">
                <button className="py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm">
                    {t('assign')}
                </button>
                <button
                    onClick={onOpen}
                    className="py-3 bg-[#2E2FCE] text-white font-bold rounded-full hover:bg-[#2E2FCE] active:scale-95 transition text-sm shadow-md"
                >
                    {t('open_content')}
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button className="py-2.5 bg-transparent text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest rounded-xl hover:text-brand-500 transition text-[9px] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                    {t('rename')}
                </button>
                <button className="py-2.5 bg-transparent text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest rounded-xl hover:text-brand-500 transition text-[9px] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {t('share')}
                </button>
            </div>
        </div>
    )
}

const CreationsScreen: React.FC = () => {
    const { t } = useLanguage();
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [creations, setCreations] = useState<Creation[]>([]);
    const [selectedCreationId, setSelectedCreationId] = useState<string | null>(null);
    const [viewingCreation, setViewingCreation] = useState<Creation | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('user_creations');
        if (stored) {
            const parsed = JSON.parse(stored);
            setCreations(parsed);
            if (parsed.length > 0) setSelectedCreationId(parsed[0].id);
        }
    }, []);

    const handleSaveCreation = (newCreation: Creation) => {
        const updated = [newCreation, ...creations];
        setCreations(updated);
        localStorage.setItem('user_creations', JSON.stringify(updated));
        setSelectedCreationId(newCreation.id);
        setActiveTool(null);
    };

    const creationTools = [
        { id: 'game_studio', titleKey: 'game_studio', descriptionKey: 'game_studio_desc', buttonTextKey: 'create', color: 'purple', icon: '', status: 'active' },
        { id: 'question_lab', titleKey: 'question_lab', descriptionKey: 'question_lab_desc', buttonTextKey: 'generate', color: 'green', icon: '', status: 'active' },
        { id: 'smart_books', titleKey: 'smart_books', descriptionKey: 'smart_books_desc', buttonTextKey: 'open', color: 'pink', icon: '', status: 'active' },
        { id: 'scientific_inquiry', titleKey: 'scientific_inquiry', descriptionKey: 'scientific_inquiry_desc', buttonTextKey: 'coming_soon', color: 'orange', icon: '', status: 'coming_soon' },
        { id: 'speaking_hub', titleKey: 'speaking_hub', descriptionKey: 'speaking_hub_desc', buttonTextKey: 'start_speaking', color: 'blue', icon: '', status: 'active' },
    ];

    const selectedCreation = creations.find(c => c.id === selectedCreationId) || creations[0];

    if (viewingCreation) {
        return <QuizPlayScreen creation={viewingCreation} onClose={() => setViewingCreation(null)} />;
    }

    if (activeTool === 'game_studio') {
        return <GameStudioScreen onBack={() => setActiveTool(null)} onSave={handleSaveCreation} />;
    }

    if (activeTool === 'question_lab') {
        return <QuestionLabScreen onBack={() => setActiveTool(null)} onSave={handleSaveCreation} />;
    }

    if (activeTool === 'smart_books') {
        return <SmartBooksScreen onBack={() => setActiveTool(null)} />;
    }

    if (activeTool === 'speaking_hub') {
        return <SpeakingHubScreen onBack={() => setActiveTool(null)} />;
    }

    return (
        <div className="bg-brand-50 dark:bg-slate-900 min-h-full pb-10 p-4 md:p-8 transition-colors">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {creationTools.map(tool =>
                    <CreationToolCard
                        key={tool.id}
                        tool={tool}
                        onClick={() => setActiveTool(tool.id)}
                    />
                )}
            </div>
            <div className="mt-16">
                <div className="flex justify-between items-end mb-6 px-2">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">{t('recent_contents')}</h2>
                        <p className="text-slate-400 font-bold mt-1.5 uppercase tracking-widest text-[9px]">Manage your magic creations</p>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:underline mb-0.5">{t('view_all')}</button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        {selectedCreation ? (
                            <RecentContentDetails
                                item={selectedCreation}
                                onOpen={() => setViewingCreation(selectedCreation)}
                            />
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm p-12 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors h-full min-h-[350px]">
                                <span className="text-5xl mb-6 opacity-40 filter grayscale"></span>
                                <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight text-lg">{t('no_content_saved')}</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 transition-colors rounded-3xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 overflow-y-auto max-h-[600px] no-scrollbar">
                        {creations.length > 0 ? (
                            <div className="space-y-4">
                                {creations.map(c => (
                                    <div
                                        key={c.id}
                                        className={`group relative w-full flex items-center p-5 rounded-2xl border transition-all cursor-pointer ${selectedCreationId === c.id ? 'border-[#2E2FCE]/30 bg-[#2E2FCE]/5 shadow-sm' : 'border-slate-200 dark:border-slate-700 hover:border-[#2E2FCE]/20 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                    >
                                        <button
                                            onClick={() => setSelectedCreationId(c.id)}
                                            className="flex-grow text-left flex items-center space-x-5"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm">
                                                {c.contentType === 'quiz' ? '' : ''}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-slate-800 dark:text-white tracking-tight text-lg truncate leading-tight mb-1">{c.title}</h4>
                                                <p className="text-xs font-medium text-slate-500 leading-none">{c.date} • {t(c.stageKey as any)} • {c.questionCount} {t('quiz')}</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setViewingCreation(c); }}
                                            className="ml-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-[#2E2FCE] dark:text-[#a3aaeb] w-10 h-10 rounded-full shadow-sm active:scale-95 transition-all flex items-center justify-center group/btn shrink-0"
                                            title={t('open_content')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-slate-300 dark:text-slate-600 py-32">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-6 font-black uppercase tracking-widest text-lg">{t('vault_empty')}</p>
                                <p className="text-xs font-bold mt-1">{t('start_creating_now')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationsScreen;
