import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

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
        },
        {
            id: 'audiobooks',
            titleKey: 'smart_books_audiobooks_title',
            descriptionKey: 'smart_books_audiobooks_desc',
            illustrationUrl: '/images/smart_books_audiobooks.png',
        },
        {
            id: 'create_book',
            titleKey: 'smart_books_create_title',
            descriptionKey: 'smart_books_create_desc',
            illustrationUrl: '/images/smart_books_create.png',
        }
    ];

    return (
        <div className="p-4 md:p-8 bg-brand-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">{t('back')}</span>
                </button>
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h1 className="text-3xl font-black italic tracking-tight uppercase text-brand-900 dark:text-brand-100">{t('smart_books')}</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookOptions.map((card) => (
                    <div key={card.id} className="rounded-[2rem] shadow-xl p-6 flex flex-col bg-white dark:bg-slate-800 transition-transform transform hover:-translate-y-2 border-2 border-slate-100 dark:border-slate-700">
                        <div className="mb-6 h-48 bg-brand-50 dark:bg-slate-700 rounded-[1.5rem] overflow-hidden flex items-center justify-center transition-colors">
                            <img src={card.illustrationUrl} alt={t(card.titleKey as any)} className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-brand-800 dark:text-brand-300">{t(card.titleKey as any)}</h3>
                        <p className="text-sm font-bold flex-grow text-slate-500 dark:text-slate-400 mb-6 leading-relaxed bg-brand-50/50 dark:bg-slate-800/50 p-4 rounded-xl">{t(card.descriptionKey as any)}</p>
                        <button
                            className="mt-auto w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 hover:bg-brand-600 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white shadow-sm hover:shadow-lg border-2 border-brand-100 dark:border-brand-800 hover:border-transparent">
                            {t('open')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SmartBooksScreen;
