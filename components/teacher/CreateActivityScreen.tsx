import React, { useState } from 'react';
import { X, Type, FileText, Clock, Users, Plus, Trash2, ListChecks, Sparkles } from 'lucide-react';
import api from '../../services/api';

interface CreateActivityScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface ActivityStep {
  title: string;
  description: string;
  duration: string;
}

const CreateActivityScreen: React.FC<CreateActivityScreenProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [materials, setMaterials] = useState<string[]>(['']);
  const [steps, setSteps] = useState<ActivityStep[]>([
    { title: '', description: '', duration: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMaterial = () => setMaterials([...materials, '']);
  const handleRemoveMaterial = (index: number) => setMaterials(materials.filter((_, i) => i !== index));
  const handleMaterialChange = (index: number, value: string) => {
    const newMaterials = [...materials];
    newMaterials[index] = value;
    setMaterials(newMaterials);
  };

  const handleAddStep = () => setSteps([...steps, { title: '', description: '', duration: '' }]);
  const handleRemoveStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));
  const handleStepChange = (index: number, field: keyof ActivityStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const totalDuration = steps.reduce((acc, step) => acc + (parseInt(step.duration) || 0), 0);
      
      await api.createActivity({
        title,
        description,
        targetGrade,
        duration: totalDuration,
        materials: materials.filter(m => m.trim() !== ''),
        steps: steps.map(s => ({ ...s, duration: parseInt(s.duration) || 0 })),
        isPublic: false
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl border-2 border-slate-700 my-8 transform transition-all">
        <div className="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
              <Sparkles className="w-6 h-6 text-brand-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Prepare Classroom Activity</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-2xl font-bold text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Activity Title</label>
                <div className="relative">
                  <Type className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="e.g., Introduction to Python Loops"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 pl-12 pr-4 py-3 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">General Description</label>
                <div className="relative">
                  <FileText className="absolute top-4 left-4 w-5 h-5 text-slate-400" />
                  <textarea
                    placeholder="What is the main goal of this activity?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 pl-12 pr-4 py-3 h-32 resize-none font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Grade / Level</label>
                <div className="relative">
                  <Users className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="e.g., Grade 5, Beginners"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 pl-12 pr-4 py-3 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Materials Needed</label>
                  <button type="button" onClick={handleAddMaterial} className="text-brand-600 hover:text-brand-500 text-[10px] font-black uppercase tracking-widest">+ Add Material</button>
                </div>
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="text"
                        placeholder="e.g., Laptops, Worksheets"
                        value={material}
                        onChange={(e) => handleMaterialChange(index, e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 px-4 py-2 text-sm font-bold"
                      />
                      {materials.length > 1 && (
                        <button type="button" onClick={() => handleRemoveMaterial(index)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-brand-600" />
                Activity Steps
              </h3>
              <button 
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-3xl border-2 border-slate-100 dark:border-slate-700 space-y-4 relative group">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center font-black text-sm">{index + 1}</span>
                    {steps.length > 1 && (
                      <button type="button" onClick={() => handleRemoveStep(index)} className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-5 h-5" /></button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 space-y-2">
                      <input 
                        type="text"
                        placeholder="Step Title (e.g., Live Demo)"
                        value={step.title}
                        onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 p-3 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <Clock className="absolute top-1/2 -translate-y-1/2 left-3 w-4 h-4 text-slate-400" />
                        <input 
                          type="number"
                          placeholder="Mins"
                          value={step.duration}
                          onChange={(e) => handleStepChange(index, 'duration', e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 pl-9 pr-3 py-3 font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <textarea
                    placeholder="Describe what happens in this step..."
                    value={step.description}
                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 p-3 h-24 resize-none font-bold text-sm"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-slate-100 dark:border-slate-700">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-brand-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-brand-500 disabled:bg-slate-400 transition-all flex items-center gap-3"
            >
              {isSubmitting ? 'Saving...' : 'Save Activity Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivityScreen;
