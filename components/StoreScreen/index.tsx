import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { Zap, Tag, Palette, User, Coins } from 'lucide-react';

const TokenIcon = () => <Coins className="w-4 h-4 text-yellow-500 dark:text-yellow-400 inline-block drop-shadow-sm align-middle" />;

interface StoreTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    counts: Record<string, number>;
}

const StoreTabsCount: React.FC<StoreTabsProps> = ({ activeTab, setActiveTab, counts }) => {
    const tabs = [
        { id: 'Boosters', label: 'Boosters', icon: <Zap className="w-5 h-5" /> },
        { id: 'Titles', label: 'Titles', icon: <Tag className="w-5 h-5" /> },
        { id: 'Themes', label: 'Themes', icon: <Palette className="w-5 h-5" /> },
        { id: 'Avatar', label: 'Avatar', icon: <User className="w-5 h-5" /> },
    ];
    return (
        <div className="flex items-center justify-between border-b-4 border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar transition-colors">
            <div className="flex space-x-2 sm:space-x-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 font-black text-sm sm:text-base transition-all relative flex items-center space-x-2 cursor-pointer ${activeTab === tab.id ? 'text-brand-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
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

interface StoreItemProps {
    item: any;
    isUnlocked: boolean;
    isEquipped: boolean;
    onAction: () => void;
}

const StoreItem: React.FC<StoreItemProps> = ({ item, isUnlocked, isEquipped, onAction }) => {
    const renderButton = () => {
        const baseClasses = "text-xs font-black py-3 px-4 rounded-xl transition-all border-b-4 uppercase tracking-tighter active:border-b-0 active:translate-y-1 transform cursor-pointer focus:outline-none";
        
        if (item.type === 'free') {
            return <button onClick={onAction} className={`${baseClasses} bg-green-500 border-green-700 text-white hover:bg-green-400`}>OPEN</button>;
        }

        if (isUnlocked) {
            if (item.category === 'Avatar') {
                return (
                    <button 
                        onClick={onAction} 
                        className={`${baseClasses} ${
                            isEquipped 
                                ? 'bg-rose-500 border-rose-700 text-white hover:bg-rose-405' 
                                : 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400'
                        }`}
                    >
                        {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                    </button>
                );
            }
            return <button disabled className={`${baseClasses} bg-slate-200 dark:bg-slate-700 border-slate-400 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50`}>UNLOCKED</button>;
        }

        return (
            <button onClick={onAction} className={`${baseClasses} bg-brand-600 border-brand-800 text-white hover:bg-brand-500 flex items-center space-x-2`}>
                <span>BUY</span>
                <span className="text-yellow-300 ml-1">{item.cost} <TokenIcon /></span>
            </button>
        );
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
        { icon: '', title: 'Token Boost', amount: '250', price: '49 DH' },
        { icon: '️', title: 'Token Pouch', amount: '1000', price: '129 DH' },
        { icon: '', title: 'Token Vault', amount: '2000', price: '199 DH' },
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
                        <button className="mt-8 w-full bg-brand-600 text-white font-black py-4 px-6 rounded-2xl shadow-lg hover:bg-brand-500 transition-all border-b-4 border-brand-800 active:border-b-0 active:translate-y-1 text-sm tracking-widest uppercase cursor-pointer">
                            {item.price}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const AvatarPreview: React.FC<{ equipped: number[]; className?: string }> = ({ equipped, className }) => {
    const hasHat = equipped.includes(301);
    const hasGlasses = equipped.includes(302);
    const hasWand = equipped.includes(303);
    const hasArm = equipped.includes(304);

    return (
        <div className={`relative bg-slate-950 border-2 border-cyan-500/35 rounded-2xl flex items-center justify-center shadow-md overflow-hidden select-none group ${className || 'w-16 h-16 text-3xl'}`}>
            {/* Cone glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent opacity-60"></div>
            
            <div className="relative group-hover:scale-105 transition-transform duration-300">
                
                
                {hasHat && (
                    <div className="absolute -top-[55%] left-1/2 -translate-x-1/2 text-[0.7em] z-10">
                        
                    </div>
                )}
                {hasGlasses && (
                    <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[0.6em] z-10">
                        
                    </div>
                )}
                {hasWand && (
                    <div className="absolute -right-[30%] bottom-0 text-[0.5em] animate-pulse">
                        
                    </div>
                )}
                {hasArm && (
                    <div className="absolute -left-[30%] bottom-0.5 text-[0.5em] transform -rotate-12">
                        
                    </div>
                )}
            </div>
        </div>
    );
};

interface StoreScreenProps {
    currentUser: UserType;
    onUpdateUser: (updatedData: Partial<UserType>) => void;
}

const StoreScreen: React.FC<StoreScreenProps> = ({ currentUser, onUpdateUser }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Boosters');
    const [searchQuery, setSearchQuery] = useState('');

    const boosterItems = [
        { id: 1, icon: '', title: 'Free Chest', description: 'Open once a day to earn up to 10 tokens for free.', type: 'free', category: 'Boosters' },
        { id: 2, icon: '', title: 'Title Box', description: 'Open to receive a random locked title.', type: 'cost', cost: 50, category: 'Boosters' },
        { id: 3, icon: '', title: 'Avatar Chest', description: 'Open to receive a random locked avatar item.', type: 'cost', cost: 100, category: 'Boosters' },
        { id: 4, icon: '', title: 'Streak Freeze', description: 'Keeps your streak alive even if you take a day off.', type: 'equip', cost: 20, category: 'Boosters' },
        { id: 5, icon: '', title: 'XP Surge', description: 'Double your XP for the next 30 minutes.', type: 'active', cost: 25, category: 'Boosters' },
    ];

    const titleItems = [
        { id: 101, icon: '‍️', title: 'Math Wizard', description: 'Master of the numbers', type: 'cost', cost: 150, category: 'Titles', rarity: 'Epic' },
        { id: 102, icon: '', title: 'Logic Master', description: 'Solving puzzles with ease', type: 'cost', cost: 150, category: 'Titles', rarity: 'Epic' },
        { id: 103, icon: '', title: 'Coding Cadet', description: 'First steps into the matrix', type: 'cost', cost: 50, category: 'Titles' },
        { id: 104, icon: '', title: 'Algorithm Ace', description: 'Efficiency is your second name', type: 'cost', cost: 200, category: 'Titles', rarity: 'Legendary' },
        { id: 105, icon: '', title: 'Python Pro', description: 'Speaking the language of snakes', type: 'cost', cost: 300, category: 'Titles', rarity: 'Legendary' },
    ];

    const themeItems = [
        { id: 201, icon: '', title: 'Cosmic Night', description: 'Deep space learning experience', type: 'cost', cost: 500, category: 'Themes', rarity: 'Legendary' },
        { id: 202, icon: '', title: 'Ocean Deep', description: 'Calm and blue environment', type: 'cost', cost: 250, category: 'Themes', rarity: 'Epic' },
        { id: 203, icon: '', title: 'Desert Sun', description: 'Bright and warm interface', type: 'cost', cost: 100, category: 'Themes' },
        { id: 204, icon: '', title: 'Forest Green', description: 'Nature-inspired focus mode', type: 'cost', cost: 150, category: 'Themes' },
    ];

    const avatarItems = [
        { id: 301, icon: '', title: 'Professor Hat', description: 'Looking smart is half the work', type: 'cost', cost: 200, category: 'Avatar', rarity: 'Epic' },
        { id: 302, icon: '', title: 'Coding Glasses', description: 'See the code clearly', type: 'cost', cost: 75, category: 'Avatar' },
        { id: 303, icon: '', title: 'Magic Wand', description: 'Wave away the bugs', type: 'cost', cost: 400, category: 'Avatar', rarity: 'Legendary' },
        { id: 304, icon: '', title: 'Robot Arm', description: 'Code at lightning speed', type: 'cost', cost: 250, category: 'Avatar', rarity: 'Epic' },
    ];

    const allItems = [...boosterItems, ...titleItems, ...themeItems, ...avatarItems];

    const progress = currentUser.progress;
    const skillGraph = progress.skillGraph || {};
    const unlocked = skillGraph.unlockedAvatarItems || [];
    const equipped = skillGraph.equippedAvatarItems || [];

    const handleAction = async (item: any) => {
        if (!currentUser) return;
        
        const isUnlocked = unlocked.includes(item.id) || item.type === 'free';
        
        let newXp = progress.xp;
        let newUnlocked = [...unlocked];
        let newEquipped = [...equipped];

        if (!isUnlocked) {
            // Purchase flow
            if (progress.xp < item.cost) {
                alert(`Insufficient Stars/XP! You need ${item.cost} XP but you only have ${progress.xp} XP. Keep completing lessons to earn more! `);
                return;
            }
            newXp -= item.cost;
            newUnlocked.push(item.id);
        } else {
            // Equip flow (only for Avatar items)
            if (item.category === 'Avatar') {
                if (equipped.includes(item.id)) {
                    newEquipped = equipped.filter((id: number) => id !== item.id);
                } else {
                    newEquipped.push(item.id);
                }
            }
        }

        const updatedProgress: UserType['progress'] = {
            ...progress,
            xp: newXp,
            skillGraph: {
                ...skillGraph,
                unlockedAvatarItems: newUnlocked,
                equippedAvatarItems: newEquipped,
            }
        };

        try {
            await api.updateUserProgress(updatedProgress);
            onUpdateUser({
                ...currentUser,
                progress: updatedProgress,
            });
        } catch (e) {
            console.error('Failed to purchase/equip item:', e);
        }
    };

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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <h1 className="text-6xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                        {t('store')}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Avatar Customizer HUD */}
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md">
                            <AvatarPreview equipped={equipped} />
                            <div className="text-left max-w-[150px]">
                                <h4 className="text-[10px] font-black text-cyan-500 dark:text-cyan-400 uppercase tracking-widest leading-none">Coding Bot</h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1.5 uppercase leading-tight">Equip custom accessories below!</p>
                            </div>
                        </div>

                        {/* Search and Balance */}
                        <div className="flex items-center gap-4 flex-grow sm:flex-grow-0">
                            <div className="relative w-full sm:w-56">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search items..."
                                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl border-b-4 border-slate-200 dark:border-slate-950 flex items-center space-x-2.5 shadow-md">
                                <span className="text-xl font-black text-slate-800 dark:text-white leading-none">{progress.xp}</span>
                                <TokenIcon />
                            </div>
                        </div>
                    </div>
                </div>

                <StoreTabsCount activeTab={activeTab} setActiveTab={setActiveTab} counts={categoryCounts} />

                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-4 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-700 transition-colors relative">
                    {filteredItems.length > 0 ? (
                        <div className="divide-y-2 divide-slate-50 dark:divide-slate-900/50">
                            {filteredItems.map(item => (
                                <StoreItem 
                                    key={item.id} 
                                    item={item} 
                                    isUnlocked={unlocked.includes(item.id) || item.type === 'free'}
                                    isEquipped={equipped.includes(item.id)}
                                    onAction={() => handleAction(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-pop-in">
                            <span className="text-8xl block mb-6"></span>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No items found</h2>
                            <p className="text-slate-400 font-bold mt-2">Try searching for something else!</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-8 px-8 py-3 bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-brand-400 rounded-xl font-black uppercase tracking-widest hover:bg-brand-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
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
