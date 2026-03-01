
import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RoleSelectionScreenProps {
  onSelect: (role: 'teacher' | 'student') => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelect }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teacher Card */}
        <motion.button
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('teacher')}
          className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-xl border-b-8 border-slate-200 dark:border-slate-950 flex flex-col items-center text-center group transition-all"
        >
          <div className="w-full aspect-square mb-6 bg-blue-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src="https://img.freepik.com/free-vector/teacher-concept-illustration_114360-1638.jpg" 
              alt="Teacher" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            {t('im_a_teacher' as any) || "I'm a teacher"}
          </h2>
        </motion.button>

        {/* Student Card */}
        <motion.button
          whileHover={{ y: -10, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('student')}
          className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-xl border-b-8 border-slate-200 dark:border-slate-950 flex flex-col items-center text-center group transition-all"
        >
          <div className="w-full aspect-square mb-6 bg-green-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center overflow-hidden">
            <img 
              src="https://img.freepik.com/free-vector/students-concept-illustration_114360-1256.jpg" 
              alt="Student" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            {t('im_a_student' as any) || "I'm a student"}
          </h2>
        </motion.button>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
