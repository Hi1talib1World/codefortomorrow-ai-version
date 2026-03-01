
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

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

const WizardStepper = ({ currentStep }: { currentStep: number }) => {
    const { t } = useLanguage();
    const steps = [
        { key: 'speaking_wizard_level' },
        { key: 'speaking_wizard_age' },
        { key: 'speaking_wizard_subject' },
        { key: 'speaking_wizard_duration' },
    ];
    const totalSteps = steps.length;

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex justify-between items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;
                    return (
                        <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center">
                                <p className={`text-sm font-bold ${isCompleted ? 'text-green-600' : isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {t(step.key as any)}
                                </p>
                            </div>
                            {index < totalSteps - 1 && (
                                 <div className={`flex-auto h-1 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
             <div className="flex mt-1">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;
                    return (
                         <div key={step.key} className="w-1/4">
                             <div className={`h-1.5 rounded-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                         </div>
                    );
                })}
             </div>
        </div>
    );
};

const LevelStep = ({ value, onSelect }: { value: string; onSelect: (level: string) => void }) => {
    const { t } = useLanguage();
    const levels = [
        { id: 'pre_a1', titleKey: 'speaking_wizard_level_pre_a1', subtitleKey: 'speaking_wizard_level_pre_a1_subtitle', descKey: 'speaking_wizard_level_pre_a1_desc' },
        { id: 'a1', titleKey: 'speaking_wizard_level_a1', subtitleKey: 'speaking_wizard_level_a1_subtitle', descKey: 'speaking_wizard_level_a1_desc' },
        { id: 'a2', titleKey: 'speaking_wizard_level_a2', subtitleKey: 'speaking_wizard_level_a2_subtitle', descKey: 'speaking_wizard_level_a2_desc' },
        { id: 'b1', titleKey: 'speaking_wizard_level_b1', subtitleKey: 'speaking_wizard_level_b1_subtitle', descKey: 'speaking_wizard_level_b1_desc' },
        { id: 'b2', titleKey: 'speaking_wizard_level_b2', subtitleKey: 'speaking_wizard_level_b2_subtitle', descKey: 'speaking_wizard_level_b2_desc' },
        { id: 'c1', titleKey: 'speaking_wizard_level_c1', subtitleKey: 'speaking_wizard_level_c1_subtitle', descKey: 'speaking_wizard_level_c1_desc' },
        { id: 'c2', titleKey: 'speaking_wizard_level_c2', subtitleKey: 'speaking_wizard_level_c2_subtitle', descKey: 'speaking_wizard_level_c2_desc' },
    ];
    return (
        <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('speaking_wizard_level')}</h2>
            <div className="grid grid-cols-2 gap-4">
                {levels.map(level => {
                    const isSelected = value === level.id;
                    return (
                        <button key={level.id} onClick={() => onSelect(level.id)} className={`p-4 border-2 rounded-lg text-left transition ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 hover:border-indigo-400'}`}>
                            <p className="font-bold">{t(level.titleKey as any)} <span className={`${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>{t(level.subtitleKey as any)}</span></p>
                            <p className={`text-sm ${isSelected ? 'text-indigo-100' : 'text-gray-600'}`}>{t(level.descKey as any)}</p>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

const AgeStep = ({ value, onSelect }: { value: string; onSelect: (age: string) => void }) => {
    const { t } = useLanguage();
    const ages = [
        { id: '4-6', titleKey: 'speaking_wizard_age_range_1' },
        { id: '6-8', titleKey: 'speaking_wizard_age_range_2' },
        { id: '8-10', titleKey: 'speaking_wizard_age_range_3' },
        { id: '10-13', titleKey: 'speaking_wizard_age_range_4' },
        { id: '13+', titleKey: 'speaking_wizard_age_range_5' },
    ];
    return (
        <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('speaking_wizard_age')}</h2>
            <div className="flex flex-wrap gap-4">
                {ages.map(age => {
                     const isSelected = value === age.id;
                    return (
                        <button key={age.id} onClick={() => onSelect(age.id)} className={`px-6 py-3 border-2 rounded-lg font-bold transition ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 hover:border-indigo-400'}`}>
                            {t(age.titleKey as any)}
                        </button>
                    )
                })}
            </div>
        </div>
    );
}

const TopicStep = ({ value, onSelect }: { value: string; onSelect: (topic: string) => void }) => {
    const { t } = useLanguage();
    const topics = [
        { id: 'adventure', titleKey: 'speaking_wizard_topic_adventure' }, { id: 'animals', titleKey: 'speaking_wizard_topic_animals' },
        { id: 'arts', titleKey: 'speaking_wizard_topic_arts' }, { id: 'civics', titleKey: 'speaking_wizard_topic_civics' },
        { id: 'family', titleKey: 'speaking_wizard_topic_family' }, { id: 'famous_people', titleKey: 'speaking_wizard_topic_famous_people' },
        { id: 'fantasy', titleKey: 'speaking_wizard_topic_fantasy' }, { id: 'health', titleKey: 'speaking_wizard_topic_health' },
        { id: 'history', titleKey: 'speaking_wizard_topic_history' }, { id: 'math', titleKey: 'speaking_wizard_topic_math' },
        { id: 'people', titleKey: 'speaking_wizard_topic_people' }, { id: 'sports', titleKey: 'speaking_wizard_topic_sports' },
        { id: 'sustainable_living', titleKey: 'speaking_wizard_topic_sustainable_living' }, { id: 'nature', titleKey: 'speaking_wizard_topic_nature' },
        { id: 'philosophy', titleKey: 'speaking_wizard_topic_philosophy' }, { id: 'our_world', titleKey: 'speaking_wizard_topic_our_world' },
        { id: 'science', titleKey: 'speaking_wizard_topic_science' }, { id: 'folktales', titleKey: 'speaking_wizard_topic_folktales' },
    ];
    const topicTabs = [
        { id: 'subjects', titleKey: 'speaking_wizard_topic_tab_1' }, { id: 'pyp', titleKey: 'speaking_wizard_topic_tab_2' },
        { id: 'learning_dispositions', titleKey: 'speaking_wizard_topic_tab_3' }, { id: 'values_education', titleKey: 'speaking_wizard_topic_tab_4' },
        { id: 'sustainable_goals', titleKey: 'speaking_wizard_topic_tab_5' }, { id: 'custom', titleKey: 'speaking_wizard_topic_tab_6' },
    ]
    const [activeTab, setActiveTab] = useState('subjects');

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">{t('speaking_wizard_topic_title')}</h2>
            <div className="flex flex-wrap gap-2 mb-6 border-b">
                {topicTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                        {t(tab.titleKey as any)}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {topics.map(topic => {
                    const isSelected = value === topic.id;
                    return (
                        <label key={topic.id} className="flex items-center space-x-3 cursor-pointer">
                            <input type="radio" name="topic" value={topic.id} checked={isSelected} onChange={() => onSelect(topic.id)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-gray-700'}`}>{t(topic.titleKey as any)}</span>
                        </label>
                    )
                })}
            </div>
        </div>
    )
};

const DurationStep = ({ value, onSelect }: { value: number; onSelect: (duration: number) => void }) => {
    const { t } = useLanguage();
    const increment = () => onSelect(Math.min(value + 1, 60));
    const decrement = () => onSelect(Math.max(value - 1, 1));
    return (
         <div>
            <h2 className="text-xl font-bold mb-6 text-gray-800">{t('speaking_wizard_duration_title')}</h2>
            <div className="flex items-center justify-center space-x-4">
                <button onClick={decrement} className="px-6 py-4 rounded-lg bg-gray-200 text-2xl font-bold hover:bg-gray-300">-</button>
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-800">{value}</p>
                    <p className="text-gray-500">{t('speaking_wizard_duration_mins')}</p>
                </div>
                 <button onClick={increment} className="px-6 py-4 rounded-lg bg-gray-200 text-2xl font-bold hover:bg-gray-300">+</button>
            </div>
        </div>
    )
};

const SpeakingPracticeWizard: React.FC<SpeakingPracticeWizardProps> = ({ languageTitleKey, onBack, onComplete }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WizardFormData>({
        level: 'b2',
        age: '8-10',
        topic: 'family',
        duration: 3,
    });

    const handleNext = () => {
        if (currentStep === 4) {
            onComplete(formData);
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: return !formData.level;
            case 2: return !formData.age;
            case 3: return !formData.topic;
            case 4: return !formData.duration;
            default: return true;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <LevelStep value={formData.level} onSelect={(level) => setFormData({...formData, level})} />;
            case 2: return <AgeStep value={formData.age} onSelect={(age) => setFormData({...formData, age})} />;
            case 3: return <TopicStep value={formData.topic} onSelect={(topic) => setFormData({...formData, topic})} />;
            case 4: return <DurationStep value={formData.duration} onSelect={(duration) => setFormData({...formData, duration})} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-full">
            <header className="mb-8 flex items-center space-x-4 text-sm font-bold text-indigo-600">
                <button onClick={onBack} className="hover:underline">{t('speaking_hub')}</button>
                <span className="text-gray-400">&gt;</span>
                <span className="text-gray-700">{t(languageTitleKey as any)}</span>
            </header>
            
            <WizardStepper currentStep={currentStep} />
            
            <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                 {renderStepContent()}
                 <div className="flex justify-between mt-8 border-t pt-6">
                    <button onClick={prevStep} disabled={currentStep === 1} className="py-3 px-8 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {t('back')}
                    </button>
                    <button onClick={handleNext} disabled={isNextDisabled()} className="py-3 px-8 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {currentStep === 4 ? t('start_speaking') : t('next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeakingPracticeWizard;
