
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const TokenIcon = () => <span className="text-yellow-400 drop-shadow-sm">♦️</span>;

const StoreTabs = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
    const tabs = ['Boosters', 'Titles', 'Themes', 'Avatar'];
    return (
        <div className="flex items-center justify-between border-b-4 border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar transition-colors">
            <div className="flex space-x-2 sm:space-x-8">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-4 px-2 font-black text-sm sm:text-base transition-all relative ${activeTab === tab ? 'text-brand-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                        {tab.toUpperCase()}
                        {activeTab === tab && (
                            <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-brand-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>
            <button className="p-2 text-slate-400 hover:text-brand-500 transition-colors hidden sm:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            </button>
        </div>
    );
};

const StoreItem: React.FC<{ item: any }> = ({ item }) => {
    const renderButton = () => {
        const baseClasses = "text-xs font-black py-3 px-4 rounded-xl transition-all border-b-4 uppercase tracking-tighter active:border-b-0 active:translate-y-1 transform";
        switch (item.type) {
            case 'free':
                return <button className={`${baseClasses} bg-green-500 border-green-700 text-white hover:bg-green-400`}>OPEN</button>;
            case 'cost':
            case 'equip':
            case 'active':
                return (
                    <button className={`${baseClasses} bg-brand-600 border-brand-800 text-white hover:bg-brand-500 flex items-center space-x-2`}>
                        <span>{item.type === 'cost' ? 'OPEN' : item.type === 'equip' ? 'EQUIP' : 'ACTIVATE'}</span>
                        <span className="text-yellow-300 ml-1">{item.cost} <TokenIcon /></span>
                    </button>
                );
            case 'full':
                return <button disabled className={`${baseClasses} bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50`}>FULL</button>;
            case 'pro':
                return <button className={`${baseClasses} bg-gradient-to-r from-purple-500 to-brand-600 border-brand-800 text-white hover:brightness-110`}>GO PRO</button>;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-center space-x-6 py-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-4 rounded-xl group">
            <div className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:scale-110 transition-transform shadow-sm">{item.icon}</div>
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-white text-lg tracking-tight leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none font-medium">{item.description}</p>
            </div>
            <div className="flex-shrink-0">{renderButton()}</div>
        </div>
    );
};

const TokenPurchaseSection = () => {
    const items = [
        { icon: '💰', title: 'Token Boost', amount: '250', price: '$4.99' },
        { icon: '🛍️', title: 'Token Pouch', amount: '1000', price: '$12.99' },
        { icon: '🏦', title: 'Token Vault', amount: '2000', price: '$19.99' },
    ];
    return (
        <div className="bg-[#f8f9fa] dark:bg-slate-800 rounded-3xl p-8 mt-12 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide text-center mb-8">Need more magic power?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                {items.map(item => (
                    <div key={item.title} className="group cursor-pointer">
                        <div className="text-6xl mb-4 transform transition-transform group-hover:scale-110 group-hover:rotate-3 drop-shadow-sm">{item.icon}</div>
                        <p className="font-bold text-slate-800 dark:text-white text-lg">{item.title}</p>
                        <p className="text-[#FBBC05] font-bold text-xl mt-1">{item.amount} <TokenIcon /></p>
                        <button className="mt-6 w-full bg-[#EA4335] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#d93025] transition-all transform hover:-translate-y-1 active:scale-95 text-base">
                            {item.price}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

const StoreScreen: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Boosters');

    const boosterItems = [
        { id: 1, icon: '🎁', title: 'Free Chest', description: 'Open once a day to earn up to 10 tokens for free.', type: 'free' },
        { id: 2, icon: '📜', title: 'Title Box', description: 'Open to receive a random locked title.', type: 'cost', cost: 50 },
        { id: 3, icon: '📦', title: 'Avatar Chest', description: 'Open to receive a random locked avatar item.', type: 'cost', cost: 100 },
        { id: 4, icon: '💧', title: 'Streak Freeze', description: 'Keeps your streak alive even if you take a day off.', type: 'equip', cost: 20 },
        { id: 5, icon: '🕊️', title: 'Double or Nothing', description: 'Wager 30 tokens to win 60 in a 7-day streak.', type: 'equip', cost: 30 },
        { id: 6, icon: '✨', title: 'XP Surge', description: 'Double your XP for the next 30 minutes.', type: 'active', cost: 25 },
        { id: 7, icon: '⚡️', title: 'Refill Energy', description: 'Get full energy and get back to learning instantly.', type: 'full' },
        { id: 8, icon: '∞', title: 'Unlimited Energy', description: 'Never run out of energy with PRO!', type: 'pro' },
    ];

    return (
        <div className="bg-brand-50 dark:bg-slate-900 min-h-full transition-colors p-4 sm:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                        {t('store')}
                    </h1>
                    <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border-b-4 border-slate-200 dark:border-slate-950 flex items-center space-x-3 shadow-md">
                        <span className="text-2xl font-black text-slate-800 dark:text-white">450</span>
                        <TokenIcon />
                    </div>
                </div>

                <StoreTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === 'Boosters' && (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors overflow-hidden">
                        {boosterItems.map(item => <StoreItem key={item.id} item={item} />)}
                    </div>
                )}

                {activeTab !== 'Boosters' && (
                    <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <span className="text-8xl block mb-6 animate-pulse">⚒️</span>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">Updating the stock!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">New {activeTab} coming in the next update!</p>
                    </div>
                )}

                <TokenPurchaseSection />
            </div>
        </div>
    );
};

export default StoreScreen;
