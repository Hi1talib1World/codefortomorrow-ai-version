import React, { useState } from 'react';
import { X, Calendar, Users, Type, FileText, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

interface CreateAssignmentScreenProps {
  onClose: () => void;
  onSuccess?: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const CreateAssignmentScreen: React.FC<CreateAssignmentScreenProps> = ({ onClose, onSuccess }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions];
    if (field === 'options') {
        // value is { optionIndex: number, text: string }
        newQuestions[index].options[value.optionIndex] = value.text;
    } else {
        (newQuestions[index] as any)[field] = value;
    }
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate questions
      const isValid = questions.every(q => 
        q.question.trim() !== '' && 
        q.options.every(opt => opt.trim() !== '') && 
        q.correctAnswer !== ''
      );

      if (!isValid) {
        throw new Error('Please fill in all questions, options, and select correct answers.');
      }

      await api.createQuiz({
        title: assignmentTitle,
        description: instructions,
        questions,
        assignedClasses: selectedClass ? [selectedClass] : [],
        dueDate: dueDate ? new Date(dueDate) : undefined,
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
          <h2 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Create New Quiz</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-2xl font-bold text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative">
                <Type className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Quiz Title"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all pl-12 pr-4 py-3 font-bold"
                  required
                />
              </div>
              <div className="relative">
                <FileText className="absolute top-5 left-4 w-5 h-5 text-slate-400" />
                <textarea
                  placeholder="Description & Instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all pl-12 pr-4 py-3 h-32 resize-none font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                  <Users className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all pl-12 pr-4 py-3 appearance-none font-bold"
                  >
                      <option value="">Assign to Class (Optional)</option>
                      <option value="Grade 4">Grade 4</option>
                      <option value="Grade 5">Grade 5</option>
                      <option value="Grade 6">Grade 6</option>
                  </select>
              </div>
              <div className="relative">
                  <Calendar className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all pl-12 pr-4 py-3 font-bold"
                  />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">Questions</h3>
              <button 
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            <div className="space-y-8">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-3xl border-2 border-slate-100 dark:border-slate-700 space-y-4 relative">
                  {questions.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Question {qIndex + 1}</label>
                    <input 
                      type="text"
                      placeholder="Enter your question here..."
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 p-3 font-bold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => handleQuestionChange(qIndex, 'correctAnswer', opt)}
                          className={`p-2 rounded-lg transition-all ${
                            q.correctAnswer === opt && opt !== ''
                              ? 'bg-green-500 text-white shadow-lg' 
                              : 'bg-slate-200 dark:bg-slate-600 text-slate-400'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <input 
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={opt}
                          onChange={(e) => handleQuestionChange(qIndex, 'options', { optionIndex: optIndex, text: e.target.value })}
                          className="flex-1 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 p-3 font-bold text-sm"
                          required
                        />
                      </div>
                    ))}
                  </div>
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
              {isSubmitting ? 'Creating...' : 'Launch Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentScreen;
