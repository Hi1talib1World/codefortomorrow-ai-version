
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ImportContentWizardProps {
    onBack: () => void;
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
                            <div className={`w-full h-2 rounded-full ${isCompleted ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                            <p className={`mt-2 text-xs font-bold ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                {t(step.key as any)}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto h-1 mx-2 ${stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const ImportContentWizard: React.FC<ImportContentWizardProps> = ({ onBack }) => {
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(1);
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <SelectCurriculumStep formData={formData} setFormData={setFormData} />;
            case 2: return <SelectStageStep formData={formData} setFormData={setFormData} />;
            case 3: return <UploadSourceStep formData={formData} setFormData={setFormData} />;
            case 4: return <PreferencesStep formData={formData} setFormData={setFormData} />;
            case 5: return <GeneratingPreviewStep />;
            default: return null;
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-full">
            <header className="mb-8 flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h1 className="text-xl md:text-2xl font-bold">
                        <button onClick={onBack} className="text-indigo-600 hover:underline">{t('game_studio')}</button>
                        <span className="mx-2 text-gray-400">&gt;</span>
                        <span>{t('game_studio_import_title')}</span>
                    </h1>
                </div>
            </header>

            <WizardStepper currentStep={currentStep} />
            
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                {renderStepContent()}
                {currentStep < 5 && (
                    <div className={`flex mt-8 ${currentStep > 1 ? 'justify-between' : 'justify-end'}`}>
                        {currentStep > 1 && (
                             <button onClick={prevStep} className="py-3 px-8 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">
                                {t('back')}
                            </button>
                        )}
                        <button onClick={nextStep} disabled={isNextDisabled()} className="py-3 px-8 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-300 disabled:cursor-not-allowed">
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
    const handleSelect = (value: string) => setFormData({ ...formData, curriculum: value });
    return (
        <div>
            <h2 className="text-xl font-bold mb-6">{t('select_curriculum')}</h2>
            <button
                onClick={() => handleSelect('IB')}
                className={`w-full text-left p-4 border-2 rounded-lg flex items-center space-x-3 transition ${formData.curriculum === 'IB' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
            >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.curriculum === 'IB' ? 'border-indigo-600' : 'border-gray-400'}`}>
                    {formData.curriculum === 'IB' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
                <span className="font-bold">{t('curriculum_ib')}</span>
            </button>
        </div>
    );
};

const SelectStageStep = ({ formData, setFormData }: { formData: any, setFormData: any }) => {
    const { t } = useLanguage();
    const stages = [1, 2, 3, 4, 5, 6];
    const handleSelect = (stage: number) => setFormData({ ...formData, stage: `Stage ${stage}` });

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">{t('select_stage')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stages.map(stage => (
                    <button
                        key={stage}
                        onClick={() => handleSelect(stage)}
                        className={`py-6 border-2 rounded-lg font-bold transition ${formData.stage === `Stage ${stage}` ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                    >
                        {t(`stage_${stage}` as any) || `Stage ${stage}`}
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
        if(e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-6">{t('upload_file_or_select_source')}</h2>
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`p-8 border-2 border-dashed rounded-lg text-center transition ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15v4m-3-3l3 3 3-3" />
                </svg>
                <p className="mt-2 text-gray-500">{t('drag_drop_file')}</p>
                <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                    {t('choose_a_file')}
                </button>
                <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                <p className="text-xs text-gray-400 mt-4">{t('supported_file_types')}</p>
            </div>
            {formData.file && (
                <div className="mt-6">
                    <h3 className="font-bold text-sm mb-2">{t('uploaded_files')}</h3>
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700">{formData.file.name}</span>
                        <button onClick={() => setFormData({ ...formData, file: null })} className="text-red-500 hover:text-red-700">&times;</button>
                    </div>
                </div>
            )}
            <p className="text-xs text-gray-400 text-center mt-4">{t('total_file_size')}</p>
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
                <h2 className="text-xl font-bold mb-4">{t('question_count')}</h2>
                <div className="flex space-x-4">
                    {counts.map(count => (
                        <button
                            key={count}
                            onClick={() => setFormData({...formData, questionCount: count})}
                            className={`py-3 px-6 border-2 rounded-lg font-bold transition ${formData.questionCount === count ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                 <h2 className="text-xl font-bold mb-4">{t('content_language')}</h2>
                 <select 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                 >
                    {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                 </select>
            </div>
        </div>
    )
}

const GeneratingPreviewStep = () => {
    const { t } = useLanguage();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(oldProgress => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-800 flex flex-col items-center justify-center z-50 text-white p-4">
            <h2 className="text-4xl font-bold mb-4">Fedul<span className="text-red-500">l</span>l</h2>
            <div className="w-full max-w-md bg-slate-700 rounded-full h-2.5 mb-6">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
            <h3 className="text-2xl font-semibold mb-2">{t('ai_is_creating')}</h3>
            <p className="text-slate-400 text-center max-w-lg">{t('ai_warning')}</p>
        </div>
    )
}

export default ImportContentWizard;
