import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Target, ArrowLeft, Gamepad2, Lightbulb, Activity } from 'lucide-react';

export default function BrainTrainingScreen() {
    const navigate = useNavigate();

    const challenges = [
        {
            id: 'memory-match',
            title: 'Memory Match',
            description: 'Improve your short-term recall and visual memory.',
            icon: <Brain className="w-10 h-10 text-pink-400" />,
            color: 'from-pink-500/20 to-rose-500/5',
            borderColor: 'border-pink-500/30',
            shadowColor: 'hover:shadow-pink-500/20'
        },
        {
            id: 'speed-math',
            title: 'Speed Math',
            description: 'Boost your cognitive processing speed with rapid calculations.',
            icon: <Zap className="w-10 h-10 text-yellow-400" />,
            color: 'from-yellow-500/20 to-amber-500/5',
            borderColor: 'border-yellow-500/30',
            shadowColor: 'hover:shadow-yellow-500/20'
        },
        {
            id: 'logic-grid',
            title: 'Logic Grid',
            description: 'Enhance your critical thinking and deductive reasoning.',
            icon: <Target className="w-10 h-10 text-emerald-400" />,
            color: 'from-emerald-500/20 to-teal-500/5',
            borderColor: 'border-emerald-500/30',
            shadowColor: 'hover:shadow-emerald-500/20'
        },
        {
            id: 'pattern-recognition',
            title: 'Pattern Recognition',
            description: 'Train your brain to identify complex sequences quickly.',
            icon: <Activity className="w-10 h-10 text-blue-400" />,
            color: 'from-blue-500/20 to-indigo-500/5',
            borderColor: 'border-blue-500/30',
            shadowColor: 'hover:shadow-blue-500/20'
        },
        {
            id: 'problem-solving',
            title: 'Problem Solving',
            description: 'Tackle multi-step problems to build mental endurance.',
            icon: <Lightbulb className="w-10 h-10 text-purple-400" />,
            color: 'from-purple-500/20 to-fuchsia-500/5',
            borderColor: 'border-purple-500/30',
            shadowColor: 'hover:shadow-purple-500/20'
        },
        {
            id: 'spatial-reasoning',
            title: 'Spatial Reasoning',
            description: 'Navigate and manipulate 3D shapes in your mind.',
            icon: <Gamepad2 className="w-10 h-10 text-cyan-400" />,
            color: 'from-cyan-500/20 to-sky-500/5',
            borderColor: 'border-cyan-500/30',
            shadowColor: 'hover:shadow-cyan-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden font-sans">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="px-6 py-6 flex items-center justify-between relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group px-4 py-2 rounded-xl hover:bg-slate-800/50"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                        <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                        Brain Training
                    </h1>
                </div>
                <div className="w-16" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 px-6 pb-20 max-w-7xl mx-auto w-full">

                {/* Hero Section */}
                <div className="text-center mt-12 mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-slate-800/50 border border-slate-700/50 mb-6 backdrop-blur-sm shadow-xl">
                        <Brain className="w-16 h-16 text-violet-400" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Sharpen Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">Mind</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl">
                        Challenge yourself with neuroscience-backed exercises designed to improve cognitive function, memory, and focus.
                    </p>
                </div>

                {/* Challenges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge) => (
                        <button
                            key={challenge.id}
                            onClick={() => {
                                // Future Implementation: navigate to specific game
                                // navigate(`/brain-training/${challenge.id}`)
                            }}
                            className={`group flex flex-col p-8 rounded-3xl bg-slate-800/40 border ${challenge.borderColor} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-lg ${challenge.shadowColor} text-left relative overflow-hidden`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-6 border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    {challenge.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-slate-100 transition-colors">
                                    {challenge.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed font-medium mt-auto group-hover:text-slate-300 transition-colors">
                                    {challenge.description}
                                </p>

                                <div className="mt-8 flex items-center text-sm font-bold tracking-wider uppercase text-slate-500 group-hover:text-white transition-colors">
                                    <span>Start Challenge</span>
                                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
