
import React, { useRef, useEffect } from 'react';
import { Message } from '../../hooks/useAvatarChat';

interface ChatInterfaceProps {
    messages: Message[];
    input: string;
    setInput: (input: string) => void;
    handleSend: () => void;
    isRecording: boolean;
    startRecording: () => void;
    stopRecording: () => void;
    isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    input,
    setInput,
    handleSend,
    isRecording,
    startRecording,
    stopRecording,
    isLoading
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSend();
        }
    };

    return (
        <div className="max-w-2xl mx-auto w-full">
            <div className="bg-white/30 backdrop-blur-md rounded-xl shadow-lg p-4 h-64 overflow-y-auto mb-4">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-500 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="px-4 py-2 rounded-2xl bg-white text-slate-800 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-lg p-2 flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type or talk..."
                    className="flex-grow bg-transparent focus:outline-none px-4 text-slate-800 placeholder-slate-500"
                    disabled={isLoading || isRecording}
                />
                <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`p-3 rounded-full transition-colors text-white ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-brand-500 hover:bg-brand-600'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-14 0m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                 <button onClick={handleSend} disabled={isLoading || !input} className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors disabled:bg-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
