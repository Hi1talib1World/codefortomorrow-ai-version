import React, { useRef } from 'react';
import { Award, Download, Printer, X, CheckCircle, Share2, ShieldCheck, QrCode } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  completionDate?: string;
  certificateId?: string;
  xpEarned?: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  completionDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
  certificateId = `CFT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
  xpEarned = 1500
}) => {
  const { language } = useLanguage();
  const certRef = useRef<HTMLDivElement>(null);
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Code for Tomorrow Certificate - ${studentName}`,
        text: `I just earned my official ${courseTitle} Certificate on Code for Tomorrow! 🎓`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[130] p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative space-y-6 animate-pop-in print:border-none print:shadow-none print:bg-white print:w-full print:max-w-none print:p-0">
        
        {/* Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Official Certificate of Mastery</h3>
              <p className="text-xs text-slate-400 font-semibold">Share your achievement with schools, parents & LinkedIn</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div 
          ref={certRef}
          dir={isAr ? 'rtl' : 'ltr'}
          className="relative bg-gradient-to-br from-slate-950 via-[#0d1527] to-slate-950 border-4 border-amber-500/40 rounded-2xl p-8 sm:p-12 text-center overflow-hidden shadow-2xl print:border-8 print:border-amber-600 print:text-black print:bg-white"
        >
          {/* Background Decorative Seals & Watermark */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="border border-amber-500/20 p-6 sm:p-10 rounded-xl space-y-6 relative print:border-amber-700">
            
            {/* Header Brand */}
            <div className="flex items-center justify-center gap-3">
              <img 
                src="/assets/code-for-tomorrow-logo.png" 
                alt="Code for Tomorrow" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-extrabold text-white tracking-tight print:text-black">
                Code for Tomorrow
              </span>
            </div>

            {/* Certificate Title */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 block mb-1">
                {isAr ? 'شهادة إتمام وتفوق معتمدة' : 'CERTIFICATE OF SCHOLASTIC ACHIEVEMENT'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight print:text-slate-950">
                {isAr ? 'شهادة إنجاز برمجية' : 'Certificate of Completion'}
              </h2>
            </div>

            <p className="text-xs text-slate-400 font-medium print:text-slate-600">
              {isAr ? 'تُمنح هذه الشهادة رسمياً إلى' : 'This official document is proudly awarded to'}
            </p>

            {/* Student Name */}
            <div className="py-2 border-b-2 border-amber-500/40 max-w-md mx-auto print:border-amber-600">
              <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide print:text-amber-800">
                {studentName || 'Student Learner'}
              </h1>
            </div>

            {/* Course & Achievement Text */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto font-medium print:text-slate-800">
              {isAr ? (
                <>لإتمامه بنجاح كافة التحديات البرمجية والمشاريع التطبيقية واجتياز اختبار التقييم في مسار <strong className="text-white print:text-black">{courseTitle}</strong> بنسبة تفوق بمجموع <strong>{xpEarned} XP</strong>.</>
              ) : (
                <>for successfully demonstrating technical mastery, solving algorithmic challenges, and completing the hands-on project portfolio in <strong className="text-white print:text-black">{courseTitle}</strong> with a total of <strong>{xpEarned} XP</strong>.</>
              )}
            </p>

            {/* Footer Signatures & QR Code Verification */}
            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-left print:border-slate-300" dir="ltr">
              
              {/* Issue Details & QR Code */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow shrink-0">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase block print:text-slate-600">Verifiable Credential</span>
                  <span className="text-[10px] font-mono font-bold text-amber-400 block print:text-amber-700">{certificateId}</span>
                  <span className="text-[9px] text-slate-500 block print:text-slate-600">Issued: {completionDate}</span>
                </div>
              </div>

              {/* Official Seal Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/30 text-amber-300 text-xs font-bold print:bg-amber-100 print:text-amber-900">
                <ShieldCheck className="w-4 h-4" />
                <span>CFT Verified Academic Seal</span>
              </div>

              {/* Signature Block */}
              <div className="text-center sm:text-right">
                <div className="font-serif italic text-base text-slate-200 font-bold border-b border-slate-700 pb-1 mb-1 print:text-black print:border-black">
                  Mohamed Fassi
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block print:text-slate-600">Lead Academic Director</span>
                <span className="text-[9px] text-slate-500 block print:text-slate-600">Code for Tomorrow Initiative</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
