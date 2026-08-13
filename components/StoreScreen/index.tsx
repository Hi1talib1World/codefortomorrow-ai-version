import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User as UserType } from '../../types';
import api from '../../services/api';
import { Zap, Tag, Palette, User, Coins, Search, ShoppingBag, Check } from 'lucide-react';
import GuestLoginBanner from '../GuestLoginBanner';

const TokenIcon = () => <Coins className="w-4 h-4 text-[#FBBC04] inline-block drop-shadow-sm align-middle" />;

interface StoreTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    counts: Record<string, number>;
}

const StoreTabsCount: React.FC<StoreTabsProps> = ({ activeTab, setActiveTab, counts }) => {
    const tabs = [
        { id: 'Boosters', label: 'Boosters', icon: <Zap className="w-4 h-4" /> },
        { id: 'Titles', label: 'Titles', icon: <Tag className="w-4 h-4" /> },
        { id: 'Themes', label: 'Themes', icon: <Palette className="w-4 h-4" /> },
        { id: 'Avatar', label: 'Avatar', icon: <User className="w-4 h-4" /> },
    ];
    return (
        <div className="w-full mb-8 border-b border-[#E8EAED] dark:border-[#3C4043]">
            <div className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar pb-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-3 px-3 font-bold text-xs sm:text-sm transition-all relative flex items-center space-x-2 cursor-pointer bg-transparent border-none ${
                          activeTab === tab.id 
                            ? 'text-[#1A73E8] dark:text-[#8AB4F8]' 
                            : 'text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span className="uppercase tracking-wider">{tab.label}</span>
                        <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          activeTab === tab.id
                            ? 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]'
                            : 'bg-[#F1F3F4] text-[#5F6368] dark:bg-[#3C4043] dark:text-[#9AA0A6]'
                        }`}>
                          {counts[tab.id] || 0}
                        </span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#1A73E8] dark:bg-[#8AB4F8] rounded-full"></div>
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
        const baseClasses = "text-xs font-semibold py-2.5 px-4 rounded-full transition-all uppercase tracking-wider cursor-pointer border-none shadow-sm";
        
        if (item.type === 'free') {
            return <button onClick={onAction} className={`${baseClasses} bg-[#34A853] text-white hover:bg-[#2D9247]`}>OPEN</button>;
        }

        if (isUnlocked) {
            if (item.category === 'Avatar') {
                return (
                    <button 
                        onClick={onAction} 
                        className={`${baseClasses} ${
                            isEquipped 
                                ? 'bg-[#EA4335] text-white hover:bg-[#D93025]' 
                                : 'bg-[#1A73E8] text-white hover:bg-[#1557B0]'
                        }`}
                    >
                        {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                    </button>
                );
            }
            return <button disabled className={`${baseClasses} bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] cursor-not-allowed shadow-none`}>UNLOCKED</button>;
        }

        return (
            <button onClick={onAction} className={`${baseClasses} bg-[#1A73E8] text-white hover:bg-[#1557B0] flex items-center space-x-2`}>
                <span>BUY</span>
                <span className="ml-1.5 flex items-center gap-1 font-mono font-bold">{item.cost} <TokenIcon /></span>
            </button>
        );
    };

    return (
        <div className="flex items-center space-x-5 p-5 border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl hover:border-[#1A73E8]/50 bg-[#F8F9FA] dark:bg-[#202124] transition-all duration-300 group">
            <div className="text-3xl flex-shrink-0 w-14 h-14 flex items-center justify-center bg-white dark:bg-[#292A2D] rounded-2xl group-hover:scale-105 transition-transform shadow-sm border border-[#E8EAED] dark:border-[#3C4043]">
              {item.icon}
            </div>
            <div className="flex-grow min-w-0 text-left">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#202124] dark:text-white text-base tracking-tight leading-snug group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">{item.title}</h3>
                    {item.rarity && (
                        <span className={`text-[9px] font-semibold uppercase px-2.5 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${
                            item.rarity === 'Legendary' ? 'bg-[#FEF7E0] text-[#B06000] dark:bg-[#3C4043] dark:text-[#FDD663]' :
                            item.rarity === 'Epic' ? 'bg-[#F3E8FD] text-[#8E24AA] dark:bg-[#3C4043] dark:text-[#C58AF9]' :
                            'bg-[#F1F3F4] text-[#5F6368] dark:bg-[#3C4043] dark:text-[#9AA0A6]'
                        }`}>
                            {item.rarity}
                        </span>
                    )}
                </div>
                <p className="text-[#5F6368] dark:text-[#9AA0A6] font-normal text-xs mt-1 leading-normal">{item.description}</p>
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
        <div className="col-span-12 bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-8 sm:p-10 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden flex flex-col">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202124] dark:text-white tracking-tight text-center mb-8">Token Market</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center relative z-10 w-full">
                {items.map(item => (
                    <div key={item.title} className="group/item cursor-pointer bg-[#F8F9FA] dark:bg-[#202124] p-6 rounded-3xl border border-[#E8EAED] dark:border-[#3C4043] hover:border-[#1A73E8] hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[240px]">
                        <div className="text-5xl mb-3 transform transition-transform group-hover/item:scale-110 drop-shadow-sm">{item.icon}</div>
                        <div>
                            <p className="font-bold text-[#202124] dark:text-white text-lg">{item.title}</p>
                            <p className="text-[#1A73E8] dark:text-[#8AB4F8] font-bold text-xl mt-1 tracking-tight flex items-center justify-center gap-1 font-mono">{item.amount} <TokenIcon /></p>
                        </div>
                        <button className="mt-6 w-full bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold py-2.5 px-4 rounded-full shadow-sm text-xs uppercase tracking-wider cursor-pointer border-none transition-all">
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
        <div className={`relative bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl flex items-center justify-center shadow-sm overflow-hidden select-none group ${className || 'w-14 h-14 text-2xl'}`}>
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

    const isGuest = !currentUser || currentUser._id.startsWith('guest_') || currentUser.email.includes('guest');

    return (
        <div className="w-full flex flex-col py-6 space-y-8">
            {/* Guest Banner */}
            {isGuest && (
                <GuestLoginBanner 
                    title="Sign in to save your XP purchases & avatar items"
                    description="You are currently in Guest Mode. Log in or create a free account to unlock items, customize your avatar, and keep your inventory items across sessions!"
                />
            )}

            {/* Header */}
            <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 text-left">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#1A73E8] dark:text-[#8AB4F8] font-bold">
                            WORKSPACE MARKETPLACE
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                            {t('store')}
                        </h1>
                        <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm font-normal">
                            Unlock boosters, profile titles, and avatar items with your earned XP!
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Avatar Customizer HUD */}
                        <div className="flex items-center gap-3 bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] px-4 py-2.5 rounded-2xl text-left">
                            <AvatarPreview equipped={equipped} />
                            <div className="text-left">
                                <h4 className="text-xs font-bold text-[#1A73E8] dark:text-[#8AB4F8]">Coding Bot</h4>
                                <p className="text-[10px] text-[#5F6368] dark:text-[#9AA0A6] font-normal">Custom accessories</p>
                            </div>
                        </div>

                        {/* Search and Balance */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-40 sm:w-48">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search store..."
                                    className="w-full bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] focus:border-[#1A73E8] rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium transition-all text-[#202124] dark:text-white focus:outline-none"
                                />
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F6368] dark:text-[#9AA0A6]" />
                            </div>
                            <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] px-4 py-2.5 rounded-2xl flex items-center space-x-2 text-[#202124] dark:text-white font-mono font-bold text-sm">
                                <span>{progress.xp}</span>
                                <TokenIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StoreTabsCount activeTab={activeTab} setActiveTab={setActiveTab} counts={categoryCounts} />

            {/* Store items Grid */}
            <div className="bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)]">
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
                    <div className="text-center py-16 space-y-4">
                        <ShoppingBag className="w-12 h-12 text-[#5F6368] dark:text-[#9AA0A6] mx-auto" />
                        <h2 className="text-xl font-bold text-[#202124] dark:text-white">No items found</h2>
                        <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6]">Try searching for something else!</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-5 py-2.5 bg-[#1A73E8] text-white rounded-full font-semibold text-xs cursor-pointer hover:bg-[#1557B0]"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            <TokenPurchaseSection />
        </div>
    );
};

export default StoreScreen;
