
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { createTextToVisemeQueue } from '../utils/lipSync';
import { WizardFormData } from '../components/SpeakingPracticeWizard';

// FIX: Add type definitions for the Web Speech API, which are not included in default TypeScript DOM typings.
// This resolves errors like "Cannot find name 'SpeechRecognition'".
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: Event) => void;
    start(): void;
    stop(): void;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};


export interface Message {
    text: string;
    sender: 'user' | 'ai';
}

export interface LipSyncData {
    viseme: string;
    value: number;
}

// Custom hook to encapsulate all chat logic
export const useAvatarChat = (wizardData: WizardFormData) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);

    // State for avatar animation and audio playback
    const [currentMessage, setCurrentMessage] = useState<SpeechSynthesisUtterance | null>(null);
    const [lipSyncData, setLipSyncData] = useState<LipSyncData | null>(null);
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const visemeQueueRef = useRef<any[]>([]);
    const animationFrameRef = useRef<number | undefined>(undefined);

    // Initialize Gemini AI
    const ai = useRef<any>(null);
    if (!ai.current) {
        ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    }

    // Generate the initial AI prompt from the wizard data
    const generateInitialPrompt = useCallback(() => {
        return `You are a friendly and encouraging language tutor. Start a conversation with a student.
        The student's language level is ${wizardData.level}.
        Their age is ${wizardData.age}.
        The topic of conversation is "${wizardData.topic}".
        Keep your first message very short and ask a simple opening question.`;
    }, [wizardData]);
    
    // Function to process and speak the AI's response
    const speak = useCallback((text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        // Fix: Pass the 'text' argument to createTextToVisemeQueue to generate visemes for the given text, resolving the "Expected 1 arguments, but got 0" error.
        visemeQueueRef.current = createTextToVisemeQueue(text);
        
        utterance.onstart = () => {
            setCurrentMessage(utterance);
            // Start animation loop
            const animate = () => {
                const now = performance.now();
                while (visemeQueueRef.current.length > 0 && visemeQueueRef.current[0].time <= now) {
                    const { viseme, value } = visemeQueueRef.current.shift();
                    setLipSyncData({ viseme, value });
                }
                if (visemeQueueRef.current.length > 0) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    setLipSyncData(null); // Clear lip sync when queue is empty
                }
            };
            animate();
        };

        utterance.onend = () => {
            setCurrentMessage(null);
            setLipSyncData(null);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };

        speechSynthesis.speak(utterance);
    }, []);

    // Effect to start the conversation when the component mounts
    useEffect(() => {
        const startConversation = async () => {
            setIsLoading(true);
            try {
                const response = await ai.current.models.generateContent({
                  model: 'gemini-3-flash-preview',
                  contents: generateInitialPrompt(),
                });
                const text = response.text || "Hello! Let's talk.";
                speak(text);
                setMessages([{ text, sender: 'ai' }]);
            } catch (error) {
                console.error("Failed to start conversation:", error);
                const errorMessage = "I'm having a little trouble starting. Let's try again in a moment!";
                setMessages([{ text: errorMessage, sender: 'ai' }]);
            } finally {
                setIsLoading(false);
            }
        };
        startConversation();
    }, [generateInitialPrompt, speak]);

    // Function to handle sending a message (from text or voice)
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const chatHistory = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            const response = await ai.current.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [...chatHistory, { role: 'user', parts: [{ text: currentInput }] }],
            });

            const aiText = response.text || "I'm not sure what to say.";
            speak(aiText);
            setMessages(prev => [...prev, { text: aiText, sender: 'ai' }]);
        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMsg = "Oops, I got a bit tongue-tied. Could you say that again?";
            speak(errorMsg);
            setMessages(prev => [...prev, { text: errorMsg, sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Voice Input Logic ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if(finalTranscript){
                    setInput(prev => prev + finalTranscript);
                }
            };
        }
        return () => {
            recognitionRef.current?.stop();
        }
    }, []);

    const startRecording = () => {
        if (recognitionRef.current && !isRecording && !isLoading) {
            setInput('');
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
            // Automatically send after a short delay to allow final transcript to process
            setTimeout(() => {
                setInput(prevInput => {
                    if(prevInput.trim()) {
                        handleSend();
                    }
                    return prevInput; // Let handleSend clear it
                })
            }, 200);
        }
    };


    return {
        messages,
        input,
        setInput,
        handleSend,
        isRecording,
        startRecording,
        stopRecording,
        isLoading,
        currentMessage,
        lipSyncData,
    };
};
