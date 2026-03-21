
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const TokenIcon = () => <span className="text-yellow-400 drop-shadow-sm">♦️</span>;

const StoreTabsCount = ({ activeTab, setActiveTab, counts }: { activeTab: string, setActiveTab: (tab: string) => void, counts: Record<string, number> }) => {
    const tabs = [
        { id: 'Boosters', label: 'Boosters', icon: '⚡' },
        { id: 'Titles', label: 'Titles', icon: '🏷️' },
        { id: 'Themes', label: 'Themes', icon: '🎨' },
        { id: 'Avatar', label: 'Avatar', icon: '👤' },
    ];
    return (
        <div className="flex items-center justify-between border-b-4 border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar transition-colors">
            <div className="flex space-x-2 sm:space-x-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 font-black text-sm sm:text-base transition-all relative flex items-center space-x-2 ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label.toUpperCase()}</span>
                        <span className="ml-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] opacity-70">{counts[tab.id] || 0}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-[-4px] left-0 right-0 h-1 bg-brand-500 rounded-full"></div>
                        )}
                    </button>
                ))}
            </div>
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
        <div className="flex items-center space-x-6 py-5 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors px-4 rounded-2xl group animate-pop-in">
            <div className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center bg-white dark:bg-slate-900 rounded-[1.25rem] group-hover:scale-110 transition-transform shadow-md border-b-2 border-slate-100 dark:border-slate-950">{item.icon}</div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-800 dark:text-white text-lg tracking-tight leading-snug">{item.title}</h3>
                    {item.rarity && (
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${item.rarity === 'Legendary' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                            item.rarity === 'Epic' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                            {item.rarity}
                        </span>
                    )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 sm:line-clamp-none font-bold uppercase tracking-widest text-[10px] opacity-70">{item.description}</p>
            </div>
            <div className="flex-shrink-0">{renderButton()}</div>
        </div>
    );
};

const TokenPurchaseSection = () => {
    const items = [
        { icon: '💰', title: 'Token Boost', amount: '250', price: '49 DH' },
        { icon: '🛍️', title: 'Token Pouch', amount: '1000', price: '129 DH' },
        { icon: '🏦', title: 'Token Vault', amount: '2000', price: '199 DH' },
    ];
    return (
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 mt-16 border-2 border-slate-100 dark:border-slate-700 shadow-xl transition-colors relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter text-center mb-10 relative z-10">Magic Bank</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center relative z-10">
                {items.map(item => (
                    <div key={item.title} className="group/item cursor-pointer bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] border-b-4 border-slate-200 dark:border-slate-950 hover:-translate-y-2 transition-all">
                        <div className="text-6xl mb-4 transform transition-transform group-hover/item:scale-125 group-hover/item:rotate-6 drop-shadow-xl">{item.icon}</div>
                        <p className="font-black text-slate-800 dark:text-white text-xl uppercase tracking-tight">{item.title}</p>
                        <p className="text-yellow-500 font-black text-2xl mt-1 tracking-tighter">{item.amount} <TokenIcon /></p>
                        <button className="mt-8 w-full bg-brand-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:bg-brand-500 transition-all border-b-4 border-brand-800 active:border-b-0 active:translate-y-1 text-sm tracking-widest uppercase">
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
    const [searchQuery, setSearchQuery] = useState('');

    const boosterItems = [
        { id: 1, icon: '🎁', title: 'Free Chest', description: 'Open once a day to earn up to 10 tokens for free.', type: 'free', category: 'Boosters' },
        { id: 2, icon: '📜', title: 'Title Box', description: 'Open to receive a random locked title.', type: 'cost', cost: 50, category: 'Boosters' },
        { id: 3, icon: '📦', title: 'Avatar Chest', description: 'Open to receive a random locked avatar item.', type: 'cost', cost: 100, category: 'Boosters' },
        { id: 4, icon: '💧', title: 'Streak Freeze', description: 'Keeps your streak alive even if you take a day off.', type: 'equip', cost: 20, category: 'Boosters' },
        { id: 5, icon: '✨', title: 'XP Surge', description: 'Double your XP for the next 30 minutes.', type: 'active', cost: 25, category: 'Boosters' },
    ];

    const titleItems = [
        { id: 101, icon: '🧙‍♂️', title: 'Math Wizard', description: 'Master of the numbers', type: 'cost', cost: 150, category: 'Titles', rarity: 'Epic' },
        { id: 102, icon: '🧠', title: 'Logic Master', description: 'Solving puzzles with ease', type: 'cost', cost: 150, category: 'Titles', rarity: 'Epic' },
        { id: 103, icon: '💻', title: 'Coding Cadet', description: 'First steps into the matrix', type: 'cost', cost: 50, category: 'Titles' },
        { id: 104, icon: '🔢', title: 'Algorithm Ace', description: 'Efficiency is your second name', type: 'cost', cost: 200, category: 'Titles', rarity: 'Legendary' },
        { id: 105, icon: '🐍', title: 'Python Pro', description: 'Speaking the language of snakes', type: 'cost', cost: 300, category: 'Titles', rarity: 'Legendary' },
    ];

    const themeItems = [
        { id: 201, icon: '🌌', title: 'Cosmic Night', description: 'Deep space learning experience', type: 'cost', cost: 500, category: 'Themes', rarity: 'Legendary' },
        { id: 202, icon: '🌊', title: 'Ocean Deep', description: 'Calm and blue environment', type: 'cost', cost: 250, category: 'Themes', rarity: 'Epic' },
        { id: 203, icon: '🌵', title: 'Desert Sun', description: 'Bright and warm interface', type: 'cost', cost: 100, category: 'Themes' },
        { id: 204, icon: '🌲', title: 'Forest Green', description: 'Nature-inspired focus mode', type: 'cost', cost: 150, category: 'Themes' },
    ];

    const avatarItems = [
        { id: 301, icon: '🎓', title: 'Professor Hat', description: 'Looking smart is half the work', type: 'cost', cost: 200, category: 'Avatar', rarity: 'Epic' },
        { id: 302, icon: '👓', title: 'Coding Glasses', description: 'See the code clearly', type: 'cost', cost: 75, category: 'Avatar' },
        { id: 303, icon: '✨', title: 'Magic Wand', description: 'Wave away the bugs', type: 'cost', cost: 400, category: 'Avatar', rarity: 'Legendary' },
        { id: 304, icon: '🦾', title: 'Robot Arm', description: 'Code at lightning speed', type: 'cost', cost: 250, category: 'Avatar', rarity: 'Epic' },
    ];

    const allItems = [...boosterItems, ...titleItems, ...themeItems, ...avatarItems];

    const filteredItems = allItems.filter(item => {
        const matchesTab = item.category === activeTab;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const categoryCounts = allItems.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="bg-brand-50 dark:bg-slate-900 min-h-full transition-colors p-4 sm:p-12 font-sans relative overflow-x-hidden">
            <div className="max-w-5xl mx-auto pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <h1 className="text-6xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                        {t('store')}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-grow md:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search items..."
                                className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl border-b-4 border-slate-200 dark:border-slate-950 flex items-center space-x-3 shadow-xl">
                            <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">450</span>
                            <TokenIcon />
                        </div>
                    </div>
                </div>

                <StoreTabsCount activeTab={activeTab} setActiveTab={setActiveTab} counts={categoryCounts} />

                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-4 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors relative">
                    {filteredItems.length > 0 ? (
                        <div className="divide-y-2 divide-slate-50 dark:divide-slate-900/50">
                            {filteredItems.map(item => <StoreItem key={item.id} item={item} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-pop-in">
                            <span className="text-8xl block mb-6">🔍</span>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No items found</h2>
                            <p className="text-slate-400 font-bold mt-2">Try searching for something else!</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-8 px-8 py-3 bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-brand-400 rounded-xl font-black uppercase tracking-widest hover:bg-brand-100 dark:hover:bg-slate-600 transition-colors"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>

                <TokenPurchaseSection />
            </div>
        </div>
    );
};

export default StoreScreen;
