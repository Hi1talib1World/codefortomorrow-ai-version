
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SpeakingPracticeWizard, { WizardFormData } from '../SpeakingPracticeWizard';
import SpeakingAvatarScreen from '../SpeakingAvatarScreen';

interface SpeakingHubScreenProps {
    onBack: () => void;
}

const SpeakingHubScreen: React.FC<SpeakingHubScreenProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [selectedLanguage, setSelectedLanguage] = useState<any | null>(null);
    const [wizardData, setWizardData] = useState<WizardFormData | null>(null);
    const [showAvatar, setShowAvatar] = useState(false);

    const languageOptions = [
        {
            id: 'en-us',
            titleKey: 'speaking_hub_english_american',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/speaking-english-us.png',
        },
        {
            id: 'en-gb',
            titleKey: 'speaking_hub_english_british',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/speaking-english-uk.png',
        },
        {
            id: 'fr-fr',
            titleKey: 'speaking_hub_french',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/speaking-french.png',
        },
        {
            id: 'ar-ma',
            titleKey: 'speaking_hub_arabic',
            illustrationUrl: 'https://storage.googleapis.com/gen-ai-samples/images/code-cubs/speaking-arabic.png',
        },
    ];

    const handleWizardComplete = (data: WizardFormData) => {
        setWizardData(data);
        setSelectedLanguage(null); // Close the wizard
        setShowAvatar(true); // Open the avatar screen
    };

    const handleAvatarBack = () => {
        setShowAvatar(false);
        setWizardData(null);
    };

    if (showAvatar && wizardData) {
        return <SpeakingAvatarScreen onBack={handleAvatarBack} wizardData={wizardData} />;
    }

    if (selectedLanguage) {
        return (
            <SpeakingPracticeWizard 
                languageTitleKey={selectedLanguage.titleKey}
                onBack={() => setSelectedLanguage(null)}
                onComplete={handleWizardComplete}
            />
        );
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <button onClick={onBack} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="sr-only">{t('back')}</span>
                </button>
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h1 className="text-3xl font-bold">{t('speaking_hub')}</h1>
                </div>
            </header>

            <div className="flex flex-wrap gap-6">
                {languageOptions.map((option) => (
                    <button 
                        key={option.id} 
                        onClick={() => setSelectedLanguage(option)}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center w-48 h-48 transition-all transform hover:-translate-y-1 hover:shadow-xl"
                    >
                         <div className="w-24 h-24 mb-4">
                            <img src={option.illustrationUrl} alt={t(option.titleKey as any)} className="w-full h-full object-contain" />
                        </div>
                        <p className="font-bold text-indigo-700 dark:text-indigo-300 text-center">{t(option.titleKey as any)}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SpeakingHubScreen;
