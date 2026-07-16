import React from 'react';
import { Heart, Play, X, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

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
        imageUrl: '/assets/images/buddies/buddy_pina.png'
    },
    {
        id: 'rio',
        name: 'Rio',
        imageUrl: '/assets/images/buddies/buddy_rio.png'
    },
    {
        id: 'lumo',
        name: 'Lumo',
        imageUrl: '/assets/images/buddies/buddy_lumo.png'
    },
    {
        id: 'lina',
        name: 'Lina',
        imageUrl: '/assets/images/buddies/buddy_lina.png'
    },
    {
        id: 'kai',
        name: 'Kai',
        imageUrl: '/assets/images/buddies/buddy_kai.png'
    }
];

export const BUDDY_INFOS: Record<string, { title: Record<string, string>; desc: Record<string, string>; color: string; label: Record<string, string> }> = {
    pina: {
        title: { en: 'Pina', fr: 'Pina', ar: 'بينا' },
        label: { en: 'The Wise Owl', fr: 'La chouette sage', ar: 'البومة الحكيمة' },
        desc: {
            en: 'Teaches in a friendly, gentle way with clear step-by-step guides.',
            fr: 'Enseigne de manière amicale et douce avec des guides clairs étape par étape.',
            ar: 'تعلم بطريقة ودية ولطيفة مع إرشادات واضحة خطوة بخطوة.'
        },
        color: 'border-indigo-400/40 text-indigo-400 bg-indigo-500/10'
    },
    rio: {
        title: { en: 'Rio', fr: 'Rio', ar: 'ريو' },
        label: { en: 'The Playful Monkey', fr: 'Le singe joueur', ar: 'القرد المرح' },
        desc: {
            en: 'High-energy coding analogies that make logical problems feel like games!',
            fr: 'Des analogies de code dynamiques pour transformer la logique en jeu !',
            ar: 'أمثلة برمجية عالية الطاقة تجعل المشكلات المنطقية تبدو كألعاب!'
        },
        color: 'border-amber-400/40 text-amber-400 bg-amber-500/10'
    },
    lumo: {
        title: { en: 'Lumo', fr: 'Lumo', ar: 'لومو' },
        label: { en: 'The Shiny Robot', fr: 'Le robot brillant', ar: 'الروبوت اللامع' },
        desc: {
            en: 'Provides structured, precise code explanations and bulleted checklists.',
            fr: 'Fournit des explications de code précises et des listes de contrôle structurées.',
            ar: 'يوفر شروحات برمجية دقيقة وقوائم مراجعة منظمة.'
        },
        color: 'border-cyan-400/40 text-cyan-400 bg-cyan-500/10'
    },
    lina: {
        title: { en: 'Lina', fr: 'Lina', ar: 'لينا' },
        label: { en: 'The Clever Fox', fr: 'La renarde rusée', ar: 'الثعلبة الذكية' },
        desc: {
            en: 'Guides you through mini-riddles and clever puzzle-solving questions.',
            fr: 'Vous guide à travers des mini-énigmes et des questions de réflexion rusées.',
            ar: 'توجهك من خلال ألغاز صغيرة وأسئلة ذكية لحل المشكلات.'
        },
        color: 'border-red-400/40 text-red-400 bg-red-500/10'
    },
    kai: {
        title: { en: 'Kai', fr: 'Kai', ar: 'كاي' },
        label: { en: 'The Peaceful Turtle', fr: 'La tortue paisible', ar: 'السلحفاة الهادئة' },
        desc: {
            en: 'Takes explanations slowly and builds confidence step by step.',
            fr: 'Prend le temps d’expliquer calmement et renforce votre confiance.',
            ar: 'يأخذ الشرح ببطء ويبني الثقة خطوة بخطوة.'
        },
        color: 'border-emerald-400/40 text-emerald-400 bg-emerald-500/10'
    }
};

const ChooseBuddyScreen: React.FC<ChooseBuddyScreenProps> = ({ onClose, onSelectBuddy }) => {
    const { language } = useLanguage();
    const isRtl = language === 'ar';
    const activeLang = (language === 'ar' || language === 'fr') ? language : 'en';

    const headerText = {
        en: 'Choose Your AI Learning Buddy',
        fr: 'Choisissez votre compagnon d\'apprentissage IA',
        ar: 'اختر رفيق التعلم الذكي الخاص بك'
    }[activeLang];

    const selectText = {
        en: 'Choose',
        fr: 'Choisir',
        ar: 'اختر'
    }[activeLang];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0a1a]/85 backdrop-blur-md p-4 animate-fade-in" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="bg-slate-900 text-white border border-slate-800 rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col animate-pop-in">

                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b border-slate-800 flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="flex items-center text-2xl font-black">
                        <span className="text-white">Code for Tomorrow</span>
                        <span className="text-indigo-400 relative mx-2">
                            Buddy AI
                            <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                            </div>
                        </span>
                    </div>

                    <div className={`flex items-center space-x-4 ${isRtl ? 'space-x-reverse' : ''}`}>
                        <div className="flex items-center space-x-2 text-slate-300 font-bold">
                            <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span>{headerText}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700 cursor-pointer"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Buddies Grid */}
                <div className="p-8 pt-6 flex flex-wrap gap-6 justify-center overflow-y-auto max-h-[75vh]">
                    {BUDDIES.map((buddy) => {
                        const info = BUDDY_INFOS[buddy.id];
                        const title = info.title[activeLang];
                        const label = info.label[activeLang];
                        const desc = info.desc[activeLang];
                        return (
                            <div
                                key={buddy.id}
                                className="bg-slate-800/30 rounded-[2rem] p-4 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-800/70 shadow-lg flex flex-col justify-between w-64 hover:scale-105 transition-all duration-300 relative group"
                            >
                                <div>
                                    {/* Image Container */}
                                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 mb-4 shadow-inner">
                                        <img
                                            src={buddy.imageUrl}
                                            alt={title}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>

                                    {/* Identity */}
                                    <div className={`mb-3 px-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                                            <h3 className="text-lg font-black text-white">{title}</h3>
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-700 bg-slate-900/60 text-slate-400">
                                                {buddy.id.toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mt-1">
                                            {label}
                                        </span>
                                        <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-2">
                                            {desc}
                                        </p>
                                    </div>
                                </div>

                                {/* Choose Button */}
                                <button
                                    onClick={() => onSelectBuddy(buddy)}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm tracking-wide active:scale-[0.97] cursor-pointer"
                                >
                                    {selectText} {title}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChooseBuddyScreen;
