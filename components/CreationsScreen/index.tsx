
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
        purple: 'from-purple-500 to-indigo-600',
        green: 'from-green-500 to-emerald-600',
        pink: 'from-pink-500 to-fuchsia-500',
        orange: 'from-orange-400 to-amber-500',
        blue: 'from-brand-300 to-brand-500',
    };

    const buttonColorClasses: { [key: string]: string } = {
        purple: 'bg-purple-600/80 hover:bg-purple-700/90',
        green: 'bg-green-600/80 hover:bg-green-700/90',
        pink: 'bg-pink-600/80 hover:bg-pink-700/90',
        orange: 'bg-orange-500/80 hover:bg-orange-600/90',
        blue: 'bg-brand-500/80 hover:bg-brand-600/90',
    }

    return (
        <div className={`relative rounded-[1.5rem] shadow-lg text-white p-6 flex flex-col h-full bg-gradient-to-br overflow-hidden transition-transform hover:-translate-y-1 ${colorClasses[tool.color]}`}>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-white/10 rounded-full"></div>
            
            <div className="flex-grow z-10">
                <div className="h-24 bg-white/20 rounded-xl mb-4 flex items-center justify-center shadow-inner">
                    <span className="text-4xl">{tool.icon}</span>
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter">{t(tool.titleKey as any)}</h3>
                <p className="text-xs opacity-90 mt-1 font-bold leading-tight">{t(tool.descriptionKey as any)}</p>
            </div>
            <div className="mt-6 z-10">
                <button 
                    onClick={!isComingSoon ? onClick : undefined}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 ${ isComingSoon ? 'bg-slate-600/80 cursor-not-allowed' : buttonColorClasses[tool.color]}`}
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
        { icon: '📄', label: t('content_type'), value: t(item.contentType as any), detail: t('multiple_choice') },
        { icon: '🎓', label: t('stage'), value: t(item.stageKey as any) },
        { icon: '❓', label: t('question_count'), value: item.questionCount },
        { icon: '🌍', label: t('language_label'), value: item.language },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 transition-colors rounded-[2rem] shadow-xl p-8 flex flex-col h-full border-b-[10px] border-slate-200 dark:border-slate-950">
            <div className="flex items-center space-x-5 mb-6">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center border-b-4 border-brand-200 dark:border-brand-800 shadow-inner">
                        <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{item.questionCount}</span>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center mb-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {item.date}
                    </p>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white truncate italic uppercase tracking-tighter leading-none">{item.title}</h3>
                </div>
            </div>

            <div className="space-y-4 my-4">
                {detailRows.map(row => (
                    <div key={row.label} className="flex justify-between items-center border-b-2 border-slate-50 dark:border-slate-700/30 pb-2.5 last:border-0">
                        <div className="flex items-center text-slate-500 dark:text-slate-400 font-black uppercase text-[9px] tracking-widest">
                            <span className="mr-2 text-lg">{row.icon}</span>
                            <span>{row.label}</span>
                        </div>
                        <div className="font-black text-slate-800 dark:text-white text-right uppercase italic text-base">
                           {row.value}
                           {row.detail && <span className="block text-[8px] text-slate-400 dark:text-slate-500 font-bold tracking-widest not-italic leading-none mt-0.5">{row.detail}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full text-center py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-500 bg-slate-50 dark:bg-slate-700/50 hover:bg-brand-50 rounded-xl my-4 transition-all active:scale-95 shadow-sm">
                {t('view_learning_outcomes')}
            </button>
            
            <div className="flex-grow"></div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition text-xs">
                    {t('assign')}
                </button>
                <button 
                    onClick={onOpen} 
                    className="py-4 bg-brand-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-brand-500 border-b-4 border-brand-800 active:border-b-0 active:translate-y-1 transition text-xs"
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
        { id: 'game_studio', titleKey: 'game_studio', descriptionKey: 'game_studio_desc', buttonTextKey: 'create', color: 'purple', icon: '🎮', status: 'active' },
        { id: 'question_lab', titleKey: 'question_lab', descriptionKey: 'question_lab_desc', buttonTextKey: 'generate', color: 'green', icon: '🧪', status: 'active' },
        { id: 'smart_books', titleKey: 'smart_books', descriptionKey: 'smart_books_desc', buttonTextKey: 'open', color: 'pink', icon: '📚', status: 'active' },
        { id: 'scientific_inquiry', titleKey: 'scientific_inquiry', descriptionKey: 'scientific_inquiry_desc', buttonTextKey: 'coming_soon', color: 'orange', icon: '🔬', status: 'coming_soon' },
        { id: 'speaking_hub', titleKey: 'speaking_hub', descriptionKey: 'speaking_hub_desc', buttonTextKey: 'start_speaking', color: 'blue', icon: '🎤', status: 'active' },
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
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tighter leading-none">{t('recent_contents')}</h2>
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
                            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg p-12 border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors h-full min-h-[350px]">
                                <span className="text-6xl mb-6 opacity-20 filter grayscale">📂</span>
                                <p className="text-slate-400 dark:text-slate-500 font-black italic uppercase tracking-tight text-lg">{t('no_content_saved')}</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 transition-colors rounded-[2rem] shadow-xl p-6 border-b-[10px] border-slate-100 dark:border-slate-950 overflow-y-auto max-h-[600px] no-scrollbar">
                        {creations.length > 0 ? (
                            <div className="space-y-4">
                                {creations.map(c => (
                                    <div 
                                        key={c.id} 
                                        className={`group relative w-full flex items-center p-6 rounded-[1.5rem] border-4 transition-all transform active:scale-[0.98] ${selectedCreationId === c.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 shadow-md' : 'border-slate-50 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-500'}`}
                                    >
                                        <button 
                                            onClick={() => setSelectedCreationId(c.id)}
                                            className="flex-grow text-left flex items-center space-x-5"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                                                {c.contentType === 'quiz' ? '🧪' : '📚'}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black text-slate-800 dark:text-white uppercase italic tracking-tighter text-lg truncate leading-none mb-0.5">{c.title}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mt-1.5">{c.date} • {t(c.stageKey as any)} • {c.questionCount} {t('quiz')}</p>
                                            </div>
                                        </button>
                                        
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setViewingCreation(c); }}
                                            className="ml-4 bg-brand-600 hover:bg-brand-500 text-white w-10 h-10 rounded-xl shadow-lg border-b-4 border-brand-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center group/btn shrink-0"
                                            title={t('open_content')}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover/btn:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
