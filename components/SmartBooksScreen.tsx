
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SmartBooksScreenProps {
    onBack: () => void;
}

const SmartBooksScreen: React.FC<SmartBooksScreenProps> = ({ onBack }) => {
    const { t } = useLanguage();

    const bookOptions = [
        {
            id: 'foreign_language',
            titleKey: 'smart_books_foreign_language_title',
            descriptionKey: 'smart_books_foreign_language_desc',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/foreign-language-books.png',
        }
    ];

    return (
        <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">{t('back')}</span>
                </button>
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h1 className="text-3xl font-bold">{t('smart_books')}</h1>
                </div>
            </header>

            <div className="max-w-xs">
                {bookOptions.map((card) => (
                    <div key={card.id} className="rounded-2xl shadow-lg p-6 flex flex-col bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-indigo-900 transition-colors">
                        <div className="mb-4 h-40 bg-white dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center transition-colors">
                            <img src={card.illustrationUrl} alt={t(card.titleKey as any)} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold mb-1 text-indigo-800 dark:text-indigo-300">{t(card.titleKey as any)}</h3>
                        <p className="text-sm flex-grow text-slate-500 dark:text-slate-400">{t(card.descriptionKey as any)}</p>
                        <button
                            className="mt-6 w-full py-3 rounded-xl font-bold transition-colors bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-slate-600 shadow-md">
                            {t('open')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartBooksScreen;
