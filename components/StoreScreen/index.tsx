import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { Zap, Tag, Palette, User, Coins } from 'lucide-react';

const TokenIcon = () => <Coins className="w-4 h-4 text-[#FBBF24] inline-block drop-shadow-sm align-middle" />;

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
        <div className="grid grid-cols-12 w-full mb-8 border-b border-slate-850">
            <div className="col-span-12 flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 font-black text-sm sm:text-base transition-all relative flex items-center space-x-2 cursor-pointer bg-transparent border-none ${activeTab === tab.id ? 'text-[#FBBF24]' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <span>{tab.icon}</span>
                        <span className="tracking-wider">{tab.label.toUpperCase()}</span>
                        <span className="ml-1.5 px-2 py-0.5 bg-slate-800 rounded-lg text-[10px] text-slate-300 opacity-70">{counts[tab.id] || 0}</span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FBBF24] rounded-full"></div>
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
        const baseClasses = "text-xs font-black py-3 px-5 rounded-xl transition-all uppercase tracking-wider active:scale-95 transform cursor-pointer border-none";
        
        if (item.type === 'free') {
            return <button onClick={onAction} className={`${baseClasses} bg-green-500 text-white hover:bg-green-400`}>OPEN</button>;
        }

        if (isUnlocked) {
            if (item.category === 'Avatar') {
                return (
                    <button 
                        onClick={onAction} 
                        className={`${baseClasses} ${
                            isEquipped 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-[#FBBF24] text-slate-950 hover:bg-[#f59e0b]'
                        }`}
                    >
                        {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                    </button>
                );
            }
            return <button disabled className={`${baseClasses} bg-slate-800 text-slate-500 cursor-not-allowed`}>UNLOCKED</button>;
        }

        return (
            <button onClick={onAction} className={`${baseClasses} bg-[#FBBF24] text-slate-950 hover:bg-[#f59e0b] flex items-center space-x-2`}>
                <span>BUY</span>
                <span className="text-slate-950 ml-1.5 flex items-center gap-0.5">{item.cost} <TokenIcon /></span>
            </button>
        );
    };

    return (
        <div className="flex items-center space-x-6 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#FBBF24] bg-slate-950/20 transition-all duration-300 group animate-pop-in">
            <div className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center bg-slate-950 rounded-[1.25rem] group-hover:scale-110 transition-transform shadow-md border border-slate-850">{item.icon}</div>
            <div className="flex-grow min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-white text-lg tracking-tight leading-snug group-hover:text-[#FBBF24] transition-colors">{item.title}</h3>
                    {item.rarity && (
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            item.rarity === 'Legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                            item.rarity === 'Epic' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                            'bg-slate-800 text-slate-400 border-slate-700/50'
                        }`}>
                            {item.rarity}
                        </span>
                    )}
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1.5 leading-normal">{item.description}</p>
            </div>
            <div className="flex-shrink-0">{renderButton()}</div>
        </div>
    );
};

const TokenPurchaseSection = () => {
    const items = [
        { icon: '🪙', title: 'Token Boost', amount: '250', price: '49 DH' },
        { icon: '💰', title: 'Token Pouch', amount: '1000', price: '129 DH' },
        { icon: '🔮', title: 'Token Vault', amount: '2000', price: '199 DH' },
    ];
    return (
        <div className="col-span-12 bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 md:p-10 mt-16 shadow-xl relative overflow-hidden group flex flex-col">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-center mb-10 relative z-10">Magic Bank</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center relative z-10 w-full">
                {items.map(item => (
                    <div key={item.title} className="group/item cursor-pointer bg-slate-950/40 p-6 rounded-[2rem] border border-slate-850 hover:border-[#FBBF24] hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[260px]">
                        <div className="text-6xl mb-4 transform transition-transform group-hover/item:scale-115 group-hover/item:rotate-6 drop-shadow-xl">{item.icon}</div>
                        <div>
                            <p className="font-black text-white text-xl uppercase tracking-tight">{item.title}</p>
                            <p className="text-[#FBBF24] font-black text-2xl mt-1 tracking-tighter flex items-center justify-center gap-1">{item.amount} <TokenIcon /></p>
                        </div>
                        <button className="mt-8 w-full bg-[#FBBF24] hover:bg-[#f59e0b] text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-md text-xs tracking-widest uppercase cursor-pointer border-none active:scale-95 transition-all">
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
        <div className={`relative bg-slate-950 border border-slate-850 rounded-2xl flex items-center justify-center shadow-md overflow-hidden select-none group ${className || 'w-16 h-16 text-3xl'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FBBF24]/5 via-transparent to-transparent opacity-60"></div>
            
            <div className="relative group-hover:scale-105 transition-transform duration-300">
                {hasHat && (
                    <div className="absolute -top-[55%] left-1/2 -translate-x-1/2 text-[0.7em] z-10">
                        🎩
                    </div>
                )}
                {hasGlasses && (
                    <div className="absolute top-[5%] left-[2%] text-[0.45em] z-10">
                        👓
                    </div>
                )}
                🤖
                {hasWand && (
                    <div className="absolute -bottom-[20%] -right-[30%] text-[0.65em] rotate-12 z-10">
                        🪄
                    </div>
                )}
                {hasArm && (
                    <div className="absolute -bottom-[25%] -left-[30%] text-[0.65em] -rotate-12 z-10">
                        🛡️
                    </div>
                )}
            </div>
        </div>
    );
};

const StoreScreen: React.FC<{ currentUser: UserType; onUpdateUser: (updatedData: Partial<UserType>) => Promise<void> }> = ({ currentUser, onUpdateUser }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('Boosters');
    const [searchQuery, setSearchQuery] = useState('');

    const progress = currentUser.progress || { 
        xp: 0, 
        streak: 0,
        completedLessons: {},
        scores: {},
        badgesEarned: {},
        lastLessonCompletedDate: '',
        skillGraph: { unlockedAvatarItems: [], equippedAvatarItems: [] } 
    };
    const skillGraph = progress.skillGraph || { unlockedAvatarItems: [], equippedAvatarItems: [] };
    const unlocked = skillGraph.unlockedAvatarItems || [];
    const equipped = skillGraph.equippedAvatarItems || [];

    const allItems = [
        { id: 101, title: 'XP Potion', description: 'Double all XP gains for next 2 levels.', cost: 50, category: 'Boosters', icon: '🧪', rarity: 'Common' },
        { id: 102, title: 'Time Freeze', description: 'Extend quiz timers by 30 seconds.', cost: 100, category: 'Boosters', icon: '❄️', rarity: 'Epic' },
        { id: 103, title: 'Revive Heart', description: 'Restore 1 heart during challenge games.', cost: 150, category: 'Boosters', icon: '❤️', rarity: 'Legendary' },
        { id: 201, title: 'Code Warrior', description: 'Equip the title "Code Warrior" on your profile.', cost: 100, category: 'Titles', icon: '⚔️', rarity: 'Epic' },
        { id: 202, title: 'Byte Master', description: 'Equip the title "Byte Master" on your profile.', cost: 200, category: 'Titles', icon: '💾', rarity: 'Legendary' },
        { id: 301, title: 'Wizard Hat', description: 'Add a cool wizard hat to your avatar.', cost: 300, category: 'Avatar', icon: '🎩', rarity: 'Legendary' },
        { id: 302, title: 'Tech Glasses', description: 'Add coding glasses to your avatar.', cost: 150, category: 'Avatar', icon: '👓', rarity: 'Epic' },
        { id: 303, title: 'Magic Wand', description: 'Add a sparkling wand to your avatar.', cost: 250, category: 'Avatar', icon: '🪄', rarity: 'Legendary' },
        { id: 304, title: 'Defense Shield', description: 'Add a protector shield to your avatar.', cost: 180, category: 'Avatar', icon: '🛡️', rarity: 'Epic' },
    ];

    const handleAction = async (item: any) => {
        const isUnlocked = unlocked.includes(item.id) || item.type === 'free';
        const isEquipped = equipped.includes(item.id);

        let newUnlocked = [...unlocked];
        let newEquipped = [...equipped];
        let newXp = progress.xp;

        if (isUnlocked) {
            if (item.category === 'Avatar') {
                if (isEquipped) {
                    newEquipped = newEquipped.filter(id => id !== item.id);
                } else {
                    newEquipped.push(item.id);
                }
            }
        } else {
            if (newXp >= item.cost) {
                newXp -= item.cost;
                newUnlocked.push(item.id);
            } else {
                return;
            }
        }

        const updatedProgress = {
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

    // Runtime Optical Alignment
    useEffect(() => {
        const alignInk = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            document.querySelectorAll('.opt-align').forEach((el) => {
                const htmlEl = el as HTMLElement;
                htmlEl.style.marginLeft = '0px';
                const style = window.getComputedStyle(htmlEl);
                const char = (htmlEl.textContent || '').trim().charAt(0);
                if (!char) return;

                ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
                ctx.textAlign = 'left';
                const metrics = ctx.measureText(char);
                const sideBearing = metrics.actualBoundingBoxLeft;

                if (isFinite(sideBearing) && sideBearing > 0) {
                    htmlEl.style.marginLeft = `${sideBearing.toFixed(2)}px`;
                }
            });
        };

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(alignInk);
        }
        alignInk();
        window.addEventListener('resize', alignInk);
        return () => window.removeEventListener('resize', alignInk);
    }, []);

    return (
        <div className="w-full flex flex-col py-6">
            {/* Header (columns 1 / 13) */}
            <div className="grid grid-cols-12 w-full gap-6 mb-12 border-b border-slate-850 pb-6 items-center">
                <div className="col-span-12 lg:col-span-6 flex flex-col text-left space-y-2">
                    <span className="mono-label opt-align font-mono text-xs uppercase tracking-wider text-[#FBBF24]">WORKSPACE MARKETPLACE</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-2 opt-align">
                        {t('store')}
                    </h1>
                </div>
                
                <div className="col-span-12 lg:col-span-6 flex flex-wrap items-center justify-start lg:justify-end gap-4">
                    {/* Avatar Customizer HUD */}
                    <div className="flex items-center gap-3 bg-slate-900/30 border border-slate-800 px-4 py-3 rounded-2xl shadow-md text-left">
                        <AvatarPreview equipped={equipped} />
                        <div className="text-left max-w-[150px]">
                            <h4 className="text-[10px] font-black text-[#FBBF24] uppercase tracking-widest leading-none">Coding Bot</h4>
                            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase leading-tight">Equip custom accessories!</p>
                        </div>
                    </div>

                    {/* Search and Balance */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-44 sm:w-52">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search items..."
                                className="w-full bg-slate-950 border border-slate-800 focus:border-[#FBBF24] rounded-2xl py-3 pl-11 pr-4 text-xs font-bold transition-all shadow-sm text-white focus:outline-none"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div className="bg-slate-900/30 border border-slate-800 px-5 py-3 rounded-2xl flex items-center space-x-2.5 shadow-md text-white">
                            <span className="text-xl font-black text-white leading-none">{progress.xp}</span>
                            <TokenIcon />
                        </div>
                    </div>
                </div>
            </div>

            <StoreTabsCount activeTab={activeTab} setActiveTab={setActiveTab} counts={categoryCounts} />

            {/* Store items Grid */}
            <div className="grid grid-cols-12 w-full mb-12">
                <div className="col-span-12 bg-slate-900/30 border border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-xl relative flex flex-col">
                    {filteredItems.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 w-full">
                            {filteredItems.map(item => (
                                <StoreItem 
                                    key={item.id} 
                                    item={item} 
                                    isUnlocked={unlocked.includes(item.id) || (item as any).type === 'free'}
                                    isEquipped={equipped.includes(item.id)}
                                    onAction={() => handleAction(item)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 animate-pop-in">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">No items found</h2>
                            <p className="text-slate-400 font-bold mt-2">Try searching for something else!</p>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-8 px-8 py-3 bg-slate-800 text-slate-350 rounded-xl font-black uppercase tracking-wider hover:bg-slate-700 transition-colors cursor-pointer border-none active:scale-95"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TokenPurchaseSection />
        </div>
    );
};

export default StoreScreen;
