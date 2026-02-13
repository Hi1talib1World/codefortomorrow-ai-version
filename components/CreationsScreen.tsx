
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import GameStudioScreen from './GameStudioScreen';

const CreationToolCard = ({ tool, onClick }: { tool: any, onClick: () => void }) => {
    const { t } = useLanguage();
    const isComingSoon = tool.status === 'coming_soon';

    const colorClasses: { [key: string]: string } = {
        purple: 'from-purple-500 to-indigo-600',
        green: 'from-green-500 to-emerald-600',
        pink: 'from-pink-500 to-fuchsia-500',
        orange: 'from-orange-400 to-amber-500',
        blue: 'from-cyan-400 to-sky-500',
    };

    const buttonColorClasses: { [key: string]: string } = {
        purple: 'bg-purple-600/80 hover:bg-purple-700/90',
        green: 'bg-green-600/80 hover:bg-green-700/90',
        pink: 'bg-pink-600/80 hover:bg-pink-700/90',
        orange: 'bg-orange-500/80 hover:bg-orange-600/90',
        blue: 'bg-cyan-500/80 hover:bg-cyan-600/90',
    }

    return (
        <div className={`relative rounded-2xl shadow-lg text-white p-6 flex flex-col h-full bg-gradient-to-br overflow-hidden ${colorClasses[tool.color]}`}>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-8 -left-4 w-40 h-40 bg-white/10 rounded-full"></div>
            
            <div className="flex-grow z-10">
                <div className="h-24 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                    {/* Placeholder for illustration */}
                    <span className="text-4xl">{tool.icon}</span>
                </div>
                <h3 className="text-xl font-bold">{t(tool.titleKey as any)}</h3>
                <p className="text-sm opacity-90 mt-1">{t(tool.descriptionKey as any)}</p>
            </div>
            <div className="mt-6 z-10">
                <button 
                    onClick={!isComingSoon ? onClick : undefined}
                    className={`w-full py-3 rounded-xl font-bold transition-colors ${ isComingSoon ? 'bg-gray-600/80 cursor-not-allowed' : buttonColorClasses[tool.color]}`}
                >
                    {t(tool.buttonTextKey as any)}
                </button>
            </div>
        </div>
    )
}

const RecentContentDetails = ({ item }: { item: any }) => {
    const { t } = useLanguage();

    const detailRows = [
        { icon: '📄', label: t('content_type'), value: t(item.contentTypeKey), detail: t(item.contentTypeDetailKey) },
        { icon: '🎓', label: t('stage'), value: t(item.stageKey) },
        { icon: '❓', label: t('question_count'), value: item.questionCount },
        { icon: '🌍', label: t('language_label'), value: item.language },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full">
            <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-black text-green-600">{item.iconNumber}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">x{item.iconMultiplier}</div>
                    <div className="absolute -top-1 -left-1 text-xs bg-blue-500 text-white rounded-full px-1.5 py-0.5">+</div>
                </div>
                <div>
                    <p className="text-sm text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        {item.date}
                    </p>
                    <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                </div>
            </div>

            <div className="space-y-3 my-4">
                {detailRows.map(row => (
                    <div key={row.label} className="flex justify-between items-center text-sm">
                        <div className="flex items-center text-gray-500">
                            <span className="mr-2">{row.icon}</span>
                            <span>{row.label}</span>
                        </div>
                        <div className="font-bold text-gray-800 text-right">
                           {row.value}
                           {row.detail && <span className="block text-xs text-gray-400 font-normal">{row.detail}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full text-center py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg my-4 transition">
                {t('view_learning_outcomes')}
            </button>
            
            <div className="flex-grow"></div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <button className="py-3 bg-indigo-100 text-indigo-600 font-bold rounded-lg hover:bg-indigo-200 transition">{t('assign')}</button>
                <button className="py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">{t('open_content')}</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button className="py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" /></svg>
                    {t('rename')}
                </button>
                <button className="py-2 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200 transition text-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    {t('share')}
                </button>
            </div>
        </div>
    )
}

const CreationsScreen: React.FC = () => {
    const { t } = useLanguage();
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const creationTools = [
        { id: 'game_studio', titleKey: 'game_studio', descriptionKey: 'game_studio_desc', buttonTextKey: 'create', color: 'purple', icon: '🎮', status: 'active' },
        { id: 'question_lab', titleKey: 'question_lab', descriptionKey: 'question_lab_desc', buttonTextKey: 'generate', color: 'green', icon: '🧪', status: 'active' },
        { id: 'smart_books', titleKey: 'smart_books', descriptionKey: 'smart_books_desc', buttonTextKey: 'open', color: 'pink', icon: '📚', status: 'active' },
        { id: 'scientific_inquiry', titleKey: 'scientific_inquiry', descriptionKey: 'scientific_inquiry_desc', buttonTextKey: 'coming_soon', color: 'orange', icon: '🔬', status: 'coming_soon' },
        { id: 'speaking_hub', titleKey: 'speaking_hub', descriptionKey: 'speaking_hub_desc', buttonTextKey: 'start_speaking', color: 'blue', icon: '🎤', status: 'active' },
    ];
    
    const recentContent = [
        {
            id: 1,
            title: '5 - Untitled-1',
            date: '02.13.2026',
            iconNumber: '5',
            iconMultiplier: '19',
            contentTypeKey: 'quiz',
            contentTypeDetailKey: 'multiple_choice',
            stageKey: 'stage_5',
            questionCount: 15,
            language: 'English'
        }
    ];
    // For now, we only show the first item.
    const selectedContent = recentContent[0];

    if (activeTool === 'game_studio') {
        return <GameStudioScreen onBack={() => setActiveTool(null)} />;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {creationTools.map(tool => 
                    <CreationToolCard 
                        key={tool.id} 
                        tool={tool} 
                        onClick={() => setActiveTool(tool.id)}
                    />
                )}
            </div>
            <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{t('recent_contents')}</h2>
                    <button className="text-blue-500 font-bold hover:underline">{t('view_all')}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        {selectedContent && <RecentContentDetails item={selectedContent} />}
                    </div>
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-4 font-semibold">Your recent contents will appear here.</p>
                            <p className="text-sm">Select an item to view its details.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreationsScreen;
