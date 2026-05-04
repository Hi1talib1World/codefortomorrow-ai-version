
import React, { Suspense } from 'react';
import ChatInterface from '../ChatInterface';
import { useAvatarChat } from '../../hooks/useAvatarChat';
import { WizardFormData } from '../SpeakingPracticeWizard';
import { AvatarFallback } from '../AvatarCanvas';

const LazyAvatarCanvas = React.lazy(() => import('../AvatarCanvas'));

interface SpeakingAvatarScreenProps {
    onBack: () => void;
    wizardData: WizardFormData;
}

const SpeakingAvatarScreen: React.FC<SpeakingAvatarScreenProps> = ({ onBack, wizardData }) => {
    const {
        messages,
        input,
        setInput,
        handleSend,
        isRecording,
        startRecording,
        stopRecording,
        isLoading,
        currentMessage,
        lipSyncData
    } = useAvatarChat(wizardData);

    return (
        <div className="w-full h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex flex-col relative">
            <button onClick={onBack} className="absolute top-4 left-4 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="flex-grow relative">
                <Suspense fallback={<AvatarFallback />}>
                    <LazyAvatarCanvas isSpeaking={!!currentMessage} lipSyncData={lipSyncData} />
                </Suspense>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                <ChatInterface
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    isRecording={isRecording}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};

export default SpeakingAvatarScreen;
