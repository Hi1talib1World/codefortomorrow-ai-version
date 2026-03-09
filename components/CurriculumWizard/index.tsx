
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { QuizQuestion, Creation } from '../../types';

interface CurriculumWizardProps {
    subjectTitleKey: string;
    onBack: () => void;
    onSave: (creation: Creation) => void;
}

const WizardStepper = ({ currentStep }: { currentStep: number }) => {
    const { t } = useLanguage();
    const steps = [
        { key: 'stepper_curriculum' },
        { key: 'stepper_stage_selection' },
        { key: 'stepper_learning_outcomes' },
        { key: 'stepper_preferences' },
        { key: 'stepper_preview' },
    ];
    const totalSteps = steps.length;

    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="flex justify-between relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-slate-700"></div>
                <div
                    className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-brand-500 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <div key={step.key} className="z-10 text-center">
                            <p className={`text-xs mb-2 font-bold uppercase tracking-tighter ${isActive || isCompleted ? 'text-slate-800 dark:text-white' : 'text-gray-400 dark:text-slate-600'}`}>
                                {t(step.key as any)}
                            </p>
                            <div className={`w-4 h-4 rounded-full mx-auto border-2 ${isCompleted ? 'bg-brand-500 border-brand-500' : isActive ? 'bg-white dark:bg-slate-800 border-brand-500 ring-4 ring-brand-100 dark:ring-brand-900/30' : 'bg-gray-200 dark:bg-slate-700 border-gray-200 dark:border-slate-700'}`}></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SelectCurriculumStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const curriculumOptions = [
        { id: 'MOROCCAN', titleKey: 'curriculum_moroccan' },
        { id: 'IB', titleKey: 'curriculum_ib' },
        { id: 'US_CORE', titleKey: 'curriculum_us_core' },
    ];
    const handleSelect = (value: string) => setFormData({ ...formData, curriculum: value, stage: '', outcomes: [] });
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">{t('select_curriculum')}</h2>
            {curriculumOptions.map(option => (
                <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left p-5 border-2 rounded-2xl flex items-center space-x-4 transition-all ${formData.curriculum === option.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-100 dark:border-slate-700 hover:border-brand-200'}`}
                >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.curriculum === option.id ? 'border-brand-600' : 'border-gray-300'}`}>
                        {formData.curriculum === option.id && <div className="w-3 h-3 bg-brand-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{t(option.titleKey as any)}</span>
                </button>
            ))}
        </div>
    );
};

const SelectStageStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    let stageOptions = formData.curriculum === 'MOROCCAN'
        ? [{ id: 'preschool', key: 'stage_preschool' }, { id: 'primary', key: 'stage_primary' }, { id: 'lower_secondary', key: 'stage_lower_secondary' }, { id: 'upper_secondary', key: 'stage_upper_secondary' }]
        : [{ id: 'stage_1', key: 'stage_1' }, { id: 'stage_2', key: 'stage_2' }, { id: 'stage_3', key: 'stage_3' }, { id: 'stage_4', key: 'stage_4' }, { id: 'stage_5', key: 'stage_5' }, { id: 'stage_6', key: 'stage_6' }];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stageOptions.map(option => (
                <button
                    key={option.id}
                    onClick={() => setFormData({ ...formData, stage: option.id, outcomes: [] })}
                    className={`p-6 border-2 rounded-2xl text-center transition-all font-black uppercase tracking-tighter ${formData.stage === option.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'border-gray-100 dark:border-slate-700 text-gray-500 hover:border-brand-300'}`}
                >
                    {t(option.key as any)}
                </button>
            ))}
        </div>
    );
};

const OutcomesStep = ({ subject, formData, setFormData }: { subject: string, formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const isFrench = subject.toLowerCase().includes('french') || subject.toLowerCase().includes('français');

    const outcomesList = isFrench
        ? ["Grammaire & Syntaxe", "Vocabulaire Thématique", "Conjugaison des Verbes", "Compréhension de l'Écrit", "Orthographe et Dictée"]
        : ["Problem Solving", "Core Concepts", "Advanced Theories", "Practical Application", "History of Subject"];

    const toggleOutcome = (outcome: string) => {
        const newOutcomes = formData.outcomes.includes(outcome)
            ? formData.outcomes.filter((o: string) => o !== outcome)
            : [...formData.outcomes, outcome];
        setFormData({ ...formData, outcomes: newOutcomes });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4 dark:text-white">{t('stepper_learning_outcomes')}</h2>
            {outcomesList.map(o => (
                <button
                    key={o}
                    onClick={() => toggleOutcome(o)}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all flex items-center justify-between ${formData.outcomes.includes(o) ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'border-gray-100 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                >
                    <span className="font-bold">{o}</span>
                    {formData.outcomes.includes(o) && <span>✅</span>}
                </button>
            ))}
        </div>
    );
};

const GeneratingStep = ({ subject, formData, onComplete }: { subject: string, formData: any; onComplete: (qs: QuizQuestion[]) => void }) => {
    const { t } = useLanguage();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const generate = async () => {
            try {
                setProgress(20);
                const prompt = `You are a curriculum expert for the subject: ${subject}.
                Targeting level: ${formData.stage} under ${formData.curriculum} curriculum.
                Focus on these outcomes: ${formData.outcomes.join(', ')}.
                Generate ${formData.questionCount} high-quality educational multiple-choice questions in ${formData.language}.
                
                Format as valid JSON array:
                [{"id": 1, "question": "...", "options": ["A", "B", "C", "D"], "answer": "Exact text of correct option", "explanation": "..."}]`;

                setProgress(50);
                const questions = await api.generateQuizFromAI(prompt);
                setProgress(100);
                onComplete(questions);
            } catch (err) {
                console.error(err);
                alert("Generation failed. Please try again.");
            }
        };
        generate();
    }, []);

    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 border-8 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase italic">{t('consulting_ai')}</h2>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-slate-700 h-2 rounded-full mx-auto mt-6 overflow-hidden">
                <div className="bg-brand-600 h-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

const PreviewStep = ({ questions, subject, onSave, onBack }: { questions: QuizQuestion[], subject: string, onSave: (title: string) => void, onBack: () => void }) => {
    const { t } = useLanguage();
    const [title, setTitle] = useState(`${subject} Mastery Quiz`);
    return (
        <div className="space-y-6">
            <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full p-4 border-b-4 border-brand-500 text-2xl font-black dark:bg-slate-800 dark:text-white focus:outline-none"
            />
            <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                {questions.map((q, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border dark:border-slate-700">
                        <p className="font-bold dark:text-white">{i + 1}. {q.question}</p>
                        <p className="text-xs text-green-600 mt-1 font-bold">{t('correct_answer_label')} {q.answer}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between pt-6">
                <button onClick={onBack} className="px-8 py-3 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold dark:text-white">{t('back')}</button>
                <button onClick={() => onSave(title)} className="px-8 py-3 bg-green-600 text-white rounded-xl font-black shadow-lg hover:bg-green-500">{t('save_creation')}</button>
            </div>
        </div>
    );
};

const CurriculumWizard: React.FC<CurriculumWizardProps> = ({ subjectTitleKey, onBack, onSave }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [formData, setFormData] = useState({
        curriculum: 'MOROCCAN',
        stage: '',
        outcomes: [] as string[],
        questionCount: 10,
        language: 'Français'
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <SelectCurriculumStep formData={formData} setFormData={setFormData} />;
            case 2: return <SelectStageStep formData={formData} setFormData={setFormData} />;
            case 3: return <OutcomesStep subject={t(subjectTitleKey as any)} formData={formData} setFormData={setFormData} />;
            case 4: return (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold dark:text-white">{t('last_details')}</h2>
                    <div className="flex space-x-4">
                        {[5, 10, 15].map(c => (
                            <button key={c} onClick={() => setFormData({ ...formData, questionCount: c })} className={`flex-1 p-4 border-2 rounded-xl font-bold ${formData.questionCount === c ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-100 dark:border-slate-700 dark:text-slate-400'}`}>{c} {t('questions_label')}</button>
                        ))}
                    </div>
                    <select value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} className="w-full p-4 border-2 rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-700">
                        <option>Français</option><option>English</option><option>العربية</option>
                    </select>
                </div>
            );
            case 5: return <GeneratingStep subject={t(subjectTitleKey as any)} formData={formData} onComplete={(qs) => { setQuestions(qs); setCurrentStep(6); }} />;
            case 6: return <PreviewStep questions={questions} subject={t(subjectTitleKey as any)} onSave={(title) => {
                onSave({
                    id: `creation_${Date.now()}`,
                    title,
                    date: new Date().toLocaleDateString(),
                    contentType: 'quiz',
                    stageKey: formData.stage,
                    questionCount: questions.length,
                    language: formData.language,
                    data: questions
                });
            }} onBack={() => setCurrentStep(4)} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-12 flex items-center space-x-4">
                <button onClick={onBack} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
                    {t('game_studio')} <span className="mx-2 text-slate-300">/</span> {t(subjectTitleKey as any)}
                </h1>
            </header>

            {currentStep <= 5 && <WizardStepper currentStep={currentStep} />}

            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl border-b-[12px] border-slate-200 dark:border-slate-950 transition-colors">
                {renderStepContent()}
                {currentStep < 5 && (
                    <div className="flex mt-10 justify-between space-x-4">
                        <button onClick={prevStep} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition">{t('back_button')}</button>
                        <button
                            onClick={nextStep}
                            disabled={(currentStep === 1 && !formData.curriculum) || (currentStep === 2 && !formData.stage) || (currentStep === 3 && formData.outcomes.length === 0)}
                            className="flex-[2] py-4 bg-brand-600 text-white font-black rounded-2xl shadow-lg hover:bg-brand-500 disabled:opacity-50 disabled:grayscale transition"
                        >
                            {currentStep === 4 ? t('generate_magic') : t('continue_button')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurriculumWizard;
