import React, { useState } from 'react';
import { X, Calendar, Users, Type, FileText } from 'lucide-react';

interface CreateAssignmentScreenProps {
  onClose: () => void;
}

const CreateAssignmentScreen: React.FC<CreateAssignmentScreenProps> = ({ onClose }) => {
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [selectedClass, setSelectedClass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle assignment creation logic here
    console.log({ assignmentTitle, instructions, dueDate, selectedClass });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl border-2 border-slate-700 transform transition-all animate-in zoom-in-75 duration-300">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white italic uppercase tracking-tight">New Assignment</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="relative">
            <Type className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Assignment Title"
              value={assignmentTitle}
              onChange={(e) => setAssignmentTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12 pr-4 py-3 font-bold"
              required
            />
          </div>
          <div className="relative">
            <FileText className="absolute top-5 left-4 w-5 h-5 text-slate-400" />
            <textarea
              placeholder="Instructions & Details"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12 pr-4 py-3 h-32 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                  <Users className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12 pr-4 py-3 appearance-none font-bold"
                      required
                  >
                      <option value="" disabled>Assign to Class</option>
                      <option value="class1">Grade 5 - Math</option>
                      <option value="class2">Grade 6 - Science</option>
                      <option value="class3">Grade 4 - History</option>
                  </select>
              </div>
              <div className="relative">
                  <Calendar className="absolute top-1/2 -translate-y-1/2 left-4 w-5 h-5 text-slate-400" />
                  <input 
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded-xl border-2 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12 pr-4 py-3 font-bold"
                    required
                  />
              </div>
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-all flex items-center gap-2"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignmentScreen;
