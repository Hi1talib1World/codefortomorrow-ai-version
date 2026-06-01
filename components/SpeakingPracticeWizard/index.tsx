import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';

export interface WizardFormData {
    level: string;
    age: string;
    topic: string;
    duration: number;
}
interface SpeakingPracticeWizardProps {
    languageTitleKey: string;
    onBack: () => void;
    onComplete: (data: WizardFormData) => void;
}

const SpeakingPracticeWizard: React.FC<SpeakingPracticeWizardProps> = ({ languageTitleKey, onBack, onComplete }) => {
    const { t } = useLanguage();

    // Default values matching the mockup
    const [formData, setFormData] = useState<WizardFormData>({
        level: 'B1',
        age: '8-10',
        topic: 'Animals',
        duration: 3,
    });

    const isNextDisabled = () => {
        return !formData.level || !formData.age || !formData.topic || !formData.duration;
    };

    const handleStart = () => {
        onComplete(formData);
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-full">
            <header className="mb-8 flex items-center space-x-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                <button onClick={onBack} className="hover:text-[#2E2FCE] transition-colors">{t('speaking_hub')}</button>
                <span className="text-slate-300 dark:text-slate-600">&gt;</span>
                <span className="text-slate-800 dark:text-slate-200">{t(languageTitleKey as any)}</span>
            </header>

            <div className="w-full max-w-5xl mx-auto mt-12 bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {/* Level Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-slate-500 font-bold uppercase tracking-wider text-sm">Level</label>
                        <div className="relative">
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl py-4 pl-4 pr-10 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="B1">B1</option>
                                <option value="B2">B2</option>
                                <option value="C1">C1</option>
                                <option value="C2">C2</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Age Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-slate-500 font-bold uppercase tracking-wider text-sm">Age</label>
                        <div className="relative">
                            <select
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl py-4 pl-4 pr-10 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="4-6">4-6</option>
                                <option value="6-8">6-8</option>
                                <option value="8-10">8-10</option>
                                <option value="10-13">10-13</option>
                                <option value="13+">13+</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Subject Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-slate-500 font-bold uppercase tracking-wider text-sm">Subject</label>
                        <div className="relative">
                            <select
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl py-4 pl-4 pr-10 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="Adventure">Adventure</option>
                                <option value="Animals">Animals</option>
                                <option value="Family">Family</option>
                                <option value="Science">Science</option>
                                <option value="Sports">Sports</option>
                                <option value="Nature">Nature</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Duration Dropdown */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-slate-500 font-bold uppercase tracking-wider text-sm">Duration</label>
                        <div className="relative">
                            <select
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white rounded-xl py-4 pl-4 pr-10 font-bold focus:outline-none focus:ring-2 focus:ring-[#2E2FCE] focus:border-transparent transition-shadow"
                            >
                                <option value={1}>1 min</option>
                                <option value={2}>2 min</option>
                                <option value={3}>3 min</option>
                                <option value={5}>5 min</option>
                                <option value={10}>10 min</option>
                                <option value={15}>15 min</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        onClick={handleStart}
                        disabled={isNextDisabled()}
                        className="py-4 px-12 bg-[#2E2FCE] text-white text-base font-bold tracking-wide rounded-full hover:bg-[#2E2FCE] transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow active:scale-95 transform"
                    >
                        {t('start_speaking')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeakingPracticeWizard;

