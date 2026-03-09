import React from 'react';
import { Heart, Play, X, Sparkles } from 'lucide-react';

export interface Buddy {
    id: string;
    name: string;
    imageUrl: string;
}

interface ChooseBuddyScreenProps {
    onClose: () => void;
    onSelectBuddy: (buddy: Buddy) => void;
}

export const BUDDIES: Buddy[] = [
    {
        id: 'pina',
        name: 'Pina',
        imageUrl: '/images/buddies/buddy_pina.png'
    },
    {
        id: 'rio',
        name: 'Rio',
        imageUrl: '/images/buddies/buddy_rio.png'
    },
    {
        id: 'lumo',
        name: 'Lumo',
        imageUrl: '/images/buddies/buddy_lumo.png'
    },
    {
        id: 'lina',
        name: 'Lina',
        imageUrl: '/images/buddies/buddy_lina.png'
    },
    {
        id: 'kai',
        name: 'Kai',
        imageUrl: '/images/buddies/buddy_kai.png'
    }
];

const ChooseBuddyScreen: React.FC<ChooseBuddyScreenProps> = ({ onClose, onSelectBuddy }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0A1A]/90 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#B0B0B0] rounded-[2rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col animate-pop-in">

                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-1 text-2xl font-black">
                        <span className="text-[#322A5C]">Fedu</span>
                        <span className="text-brand-500 relative">
                            AI
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                </span>
                            </div>
                        </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-[#4A4A4A] font-bold">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span>Choose Your Buddy</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-[#9B9B9B] hover:bg-[#8A8A8A] rounded-full transition-colors border-2 border-[#8A8A8A]"
                        >
                            <X className="w-5 h-5 text-[#322A5C]" />
                        </button>
                    </div>
                </div>

                {/* Buddies Grid */}
                <div className="p-8 pt-4 flex flex-wrap gap-4 lg:gap-6 justify-center">
                    {BUDDIES.map((buddy) => (
                        <div
                            key={buddy.id}
                            className="bg-[#D1D1D1] rounded-[1.5rem] p-3 shadow-lg flex flex-col bg-opacity-60 backdrop-blur-md w-64 hover:scale-105 transition-transform duration-300 relative group"
                        >
                            {/* Heart Icon */}
                            <button className="absolute top-5 right-5 z-10 p-1 bg-white/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-pink-500">
                                <Heart className="w-4 h-4" />
                            </button>

                            {/* Image Container */}
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white mb-3 shadow-sm border border-white/20">
                                <img
                                    src={buddy.imageUrl}
                                    alt={buddy.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Play Button Overlay */}
                                <button className="absolute bottom-3 right-3 p-1.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors text-indigo-500">
                                    <Play className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>

                            {/* Choose Button */}
                            <button
                                onClick={() => onSelectBuddy(buddy)}
                                className="w-full bg-[#463D8C] hover:bg-[#342D69] text-white font-bold py-3 rounded-xl transition-colors shadow-md text-sm tracking-wide"
                            >
                                Choose {buddy.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChooseBuddyScreen;
