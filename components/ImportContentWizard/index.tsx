
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import { QuizQuestion, Creation } from '../../types';

interface ImportContentWizardProps {
    onBack: () => void;
    onSave: (creation: Creation) => void;
}

const WizardStepper = ({ currentStep }: { currentStep: number }) => {
    const { t } = useLanguage();
    const steps = [
        { key: 'stepper_curriculum' },
        { key: 'stepper_stage_selection' },
        { key: 'stepper_source' },
        { key: 'stepper_preferences' },
        { key: 'stepper_preview' },
    ];

    return (
        <div className="flex items-center w-full max-w-4xl mx-auto mb-12">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center">
                            <div className={`w-full h-2 rounded-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-brand-500' : 'bg-gray-300 dark:bg-slate-700'}`}></div>
                            <p className={`mt-2 text-xs font-bold ${isActive || isCompleted ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-slate-600'}`}>
                                {t(step.key as any)}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto h-1 mx-2 ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300 dark:bg-slate-700'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const ImportContentWizard: React.FC<ImportContentWizardProps> = ({ onBack, onSave }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [formData, setFormData] = useState({
        curriculum: '',
        stage: '',
        file: null as File | null,
        questionCount: 5,
        language: 'English'
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const isNextDisabled = () => {
        switch (currentStep) {
            case 1: return !formData.curriculum;
            case 2: return !formData.stage;
            case 3: return !formData.file;
            case 4: return !formData.questionCount || !formData.language;
            default: return false;
        }
    }

    const handleSaveInternal = (title: string) => {
        const creation: Creation = {
            id: `creation_${Date.now()}`,
            title,
            date: new Date().toLocaleDateString(),
            contentType: 'quiz',
            stageKey: formData.stage,
            questionCount: questions.length,
            language: formData.language,
            data: questions
        };
        onSave(creation);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <SelectCurriculumStep formData={formData} setFormData={setFormData} />;
            case 2: return <SelectStageStep formData={formData} setFormData={setFormData} />;
            case 3: return <UploadSourceStep formData={formData} setFormData={setFormData} />;
            case 4: return <PreferencesStep formData={formData} setFormData={setFormData} />;
            case 5: return <GeneratingPreviewStep formData={formData} onComplete={(qs) => { setQuestions(qs); setCurrentStep(6); }} />;
            case 6: return <PreviewStep questions={questions} onBack={() => setCurrentStep(4)} onSave={handleSaveInternal} />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-slate-900 transition-colors min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h1 className="text-xl md:text-2xl font-bold">
                        <button onClick={onBack} className="text-brand-600 dark:text-brand-400 hover:underline">{t('game_studio')}</button>
                        <span className="mx-2 text-gray-400">&gt;</span>
                        <span>{t('game_studio_import_title')}</span>
                    </h1>
                </div>
            </header>

            {currentStep <= 5 && <WizardStepper currentStep={currentStep} />}

            <div className={`mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg transition-colors ${currentStep === 6 ? 'max-w-4xl' : 'max-w-2xl'}`}>
                {renderStepContent()}
                {currentStep < 5 && (
                    <div className={`flex mt-8 ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
                        {currentStep > 1 && (
                            <button onClick={prevStep} className="py-3 px-8 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition">
                                {t('back')}
                            </button>
                        )}
                        <button onClick={nextStep} disabled={isNextDisabled()} className="py-3 px-8 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition disabled:bg-brand-300 disabled:cursor-not-allowed">
                            {t('next')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SelectCurriculumStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const curriculumOptions = [
        { id: 'MOROCCAN', titleKey: 'curriculum_moroccan' },
        { id: 'TUNISIAN', titleKey: 'curriculum_tunisian' },
        { id: 'ALGERIAN', titleKey: 'curriculum_algerian' },
        { id: 'EGYPTIAN', titleKey: 'curriculum_egyptian' },
        { id: 'LEBANESE', titleKey: 'curriculum_lebanese' },
        { id: 'IB', titleKey: 'curriculum_ib' },
        { id: 'US_CORE', titleKey: 'curriculum_us_core' },
    ];
    const handleSelect = (value: string) => setFormData({ ...formData, curriculum: value, stage: '' });
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6 dark:text-white">{t('select_curriculum')}</h2>
            {curriculumOptions.map(option => (
                <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left p-4 border-2 rounded-lg flex items-center space-x-3 transition ${formData.curriculum === option.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-200 dark:border-slate-700 hover:border-brand-300'}`}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.curriculum === option.id ? 'border-brand-600' : 'border-gray-400'}`}>
                        {formData.curriculum === option.id && <div className="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>}
                    </div>
                    <span className="font-bold dark:text-white">{t(option.titleKey as any)}</span>
                </button>
            ))}
        </div>
    );
};

const SelectStageStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();

    let stageOptions: { id: string; titleKey: string }[] = [];

    const isNationalCurriculum = ['MOROCCAN', 'TUNISIAN', 'ALGERIAN', 'EGYPTIAN', 'LEBANESE'].includes(formData.curriculum);

    if (isNationalCurriculum) {
        stageOptions = [
            { id: 'preschool', titleKey: 'stage_preschool' },
            { id: 'primary', titleKey: 'stage_primary' },
            { id: 'lower_secondary', titleKey: 'stage_lower_secondary' },
            { id: 'upper_secondary', titleKey: 'stage_upper_secondary' },
        ];
    } else {
        stageOptions = [
            { id: 'stage_1', titleKey: 'stage_1' },
            { id: 'stage_2', titleKey: 'stage_2' },
            { id: 'stage_3', titleKey: 'stage_3' },
            { id: 'stage_4', titleKey: 'stage_4' },
            { id: 'stage_5', titleKey: 'stage_5' },
            { id: 'stage_6', titleKey: 'stage_6' },
        ];
    }

    const handleSelect = (stageId: string) => setFormData({ ...formData, stage: stageId });

    return (
        <div>
            <h2 className="text-xl font-bold mb-6 dark:text-white">{t('select_stage')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stageOptions.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className={`py-4 border-2 rounded-lg font-bold transition ${formData.stage === option.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-brand-300'}`}
                    >
                        {t(option.titleKey as any)}
                    </button>
                ))}
            </div>
        </div>
    );
};

const UploadSourceStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setFormData({ ...formData, file: file });
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-6 dark:text-white">{t('upload_file_or_select_source')}</h2>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`p-8 border-2 border-dashed rounded-lg text-center transition ${isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-300 dark:border-slate-700'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v4m-3-3l3 3 3-3" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-slate-400">{t('drag_drop_file')}</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition">
                    {t('choose_a_file')}
                </button>
                <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-4">{t('supported_file_types')}</p>
            </div>
            {formData.file && (
                <div className="mt-6">
                    <h3 className="font-bold text-sm mb-2 dark:text-slate-400">{t('uploaded_files')}</h3>
                    <div className="flex justify-between items-center bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700 dark:text-white">{formData.file.name}</span>
                        <button onClick={() => setFormData({ ...formData, file: null })} className="text-red-500 hover:text-red-700">&times;</button>
                    </div>
                </div>
            )}
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-4">{t('total_file_size')}</p>
        </div>
    )
}

const PreferencesStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const counts = [5, 10, 15, 20];
    const languages = ['English', 'Français', 'العربية'];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 dark:text-white">{t('question_count')}</h2>
                <div className="flex space-x-4">
                    {counts.map(count => (
                        <button
                            key={count}
                            onClick={() => setFormData({ ...formData, questionCount: count })}
                            className={`py-3 px-6 border-2 rounded-lg font-bold transition ${formData.questionCount === count ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 hover:border-brand-300'}`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4 dark:text-white">{t('content_language')}</h2>
                <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full p-3 border-2 border-gray-200 dark:border-slate-700 bg-transparent dark:text-white rounded-lg focus:outline-none focus:border-brand-500"
                >
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
            </div>
        </div>
    )
}

const GeneratingPreviewStep = ({ formData, onComplete }: { formData: any; onComplete: (questions: QuizQuestion[]) => void }) => {
    const { t } = useLanguage();
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateContent = async () => {
            if (!formData.file) return;

            try {
                // Initial progress bump
                setProgress(10);

                // Convert file to base64
                const reader = new FileReader();
                const fileContentPromise = new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
                    reader.readAsDataURL(formData.file!);
                });

                const base64Data = await fileContentPromise;
                setProgress(30);

                const prompt = `You are an expert educator. Your task is to analyze the attached document and generate a high-quality multiple-choice quiz.
                
                **Instructions:**
                1. Base all questions strictly on the content of the uploaded file.
                2. Generate ${formData.questionCount} questions.
                3. Each question must have exactly 4 options.
                4. Ensure only one answer is correct and the distractors (wrong answers) are plausible.
                5. Provide a brief explanation for why the correct answer is right.
                6. The language of the quiz should be ${formData.language}.

                **Output Format:**
                Return the quiz ONLY as a valid JSON array of objects. Do not include any markdown formatting like \`\`\`json ... \`\`\`. 
                Follow this schema:
                [
                  {
                    "id": 1,
                    "question": "The question text here",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "answer": "The exact text of the correct option",
                    "explanation": "Brief explanation of the answer"
                  }
                ]`;

                setProgress(60);

                const questions = await api.generateQuizFromAI(prompt, { data: base64Data, mimeType: formData.file.type });

                setProgress(100);

                setTimeout(() => onComplete(questions), 500);
            } catch (err) {
                console.error("AI Generation Error:", err);
                setError(err instanceof Error ? err.message : "Failed to generate content.");
            }
        };

        generateContent();
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Oops! Something went wrong.</h3>
                <p className="text-gray-500 dark:text-slate-400 mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-brand-600 text-white font-bold py-2 px-6 rounded-lg"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-slate-800 flex flex-col items-center justify-center z-50 text-white p-4">
            <h2 className="text-4xl font-bold mb-4">code for tomorrow</h2>
            <div className="w-full max-w-md bg-slate-700 rounded-full h-2.5 mb-6 overflow-hidden">
                <div className="bg-red-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">{t('ai_creating_quiz' as any)}</h3>
            <p className="text-slate-400 text-center max-w-lg">{t('ai_warning' as any)}</p>
        </div>
    )
}

const PreviewStep = ({ questions, onBack, onSave }: { questions: QuizQuestion[]; onBack: () => void; onSave: (title: string) => void }) => {
    const { t } = useLanguage();
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [title, setTitle] = useState('My Awesome Quiz');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('stepper_preview')}</h2>
                <span className="bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full text-sm font-bold">
                    {questions.length} Questions
                </span>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-600 dark:text-slate-400 mb-2">Quiz Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 dark:border-slate-700 bg-transparent rounded-lg focus:outline-none focus:border-brand-500 font-bold text-gray-700 dark:text-white transition-colors"
                    placeholder="Enter a title for your creation..."
                />
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {questions.map((q, idx) => (
                    <div key={q.id || idx} className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-colors">
                        <button
                            onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </span>
                                <h3 className="font-bold text-gray-700 dark:text-white line-clamp-1">{q.question}</h3>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform ${expandedId === q.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {expandedId === q.id && (
                            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-colors">
                                <p className="font-bold text-gray-800 dark:text-white mb-4">{q.question}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {q.options.map((opt, i) => {
                                        const isCorrect = opt === q.answer;
                                        return (
                                            <div key={i} className={`p-3 rounded-lg border-2 text-sm transition-colors ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300'}`}>
                                                {opt}
                                                {isCorrect && <span className="ml-2">✅</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-lg transition-colors">
                                    <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase mb-1">Explanation</p>
                                    <p className="text-sm text-amber-700 dark:text-amber-300">{q.explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 transition-colors">
                <button onClick={onBack} className="py-3 px-8 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition">
                    {t('back')}
                </button>
                <button onClick={() => onSave(title)} className="py-3 px-8 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg transition">
                    Save to My Creations
                </button>
            </div>
        </div>
    );
};

export default ImportContentWizard;
