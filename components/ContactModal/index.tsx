import React, { useState } from 'react';
import { X, CheckCircle2, Mail, Send } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate sending contact form message to h.outaleb6556@uca.ac.ma
      await new Promise((res) => setTimeout(res, 800));
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center z-[140] p-4 overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-[#f0f9ff] dark:bg-[#0f172a] border border-sky-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden relative animate-pop-in flex flex-col md:flex-row min-h-[520px]">
        
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            setSubmitted(false);
          }}
          className="absolute top-4 right-4 z-20 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer border-0 bg-transparent"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Left Hero Side Banner */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-sky-200 via-sky-300 to-cyan-200 dark:from-slate-900 dark:to-slate-950 p-8 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/70 dark:bg-sky-500/10 rounded-full border border-sky-400/30 text-sky-900 dark:text-sky-300 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>{isAr ? 'تواصل مباشر' : 'Direct Support'}</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isAr ? 'نحن هنا لمساعدتك في أي وقت' : 'We would love to hear from you!'}
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isAr ? 'أرسل رسالتك وسيتواصل معك الفريق الأكاديمي مباشرة على البريد الرسمي.' : 'Fill out the form and your message will be routed directly to lead academic support at'} <strong className="text-sky-900 dark:text-cyan-400">h.outaleb6556@uca.ac.ma</strong>
            </p>
          </div>

          {/* Hero Illustration / Mascot Banner */}
          <div className="relative mt-8 md:mt-0 flex justify-center items-end">
            <img 
              src="/assets/code-for-tomorrow-logo.png" 
              alt="Support mascot" 
              className="w-40 h-40 object-contain drop-shadow-2xl animate-bounce-slow"
            />
          </div>
        </div>

        {/* Right Form Side (Matching reference layout) */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 bg-white dark:bg-[#0f172a] flex flex-col justify-center text-slate-900 dark:text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 p-6 rounded-2xl text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'تم الإرسال بنجاح!' : 'Thank you!'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isAr ? (
                  <>تم استلام رسالتك وتوجيهها رسمياً إلى البريد <strong>h.outaleb6556@uca.ac.ma</strong>. وسنجيبك في أقرب وقت.</>
                ) : (
                  <>Your message has been sent to <strong>h.outaleb6556@uca.ac.ma</strong>. We will get back to you shortly.</>
                )}
              </p>
              <button
                onClick={() => {
                  onClose();
                  setSubmitted(false);
                  setForm({ firstName: '', lastName: '', email: '', message: '' });
                }}
                className="w-full py-3 bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Name Fields Row */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 text-xs">
                  {isAr ? 'الاسم' : 'Name'} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      required
                      type="text"
                      placeholder={isAr ? 'الاسم الأول' : ''}
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors text-xs font-medium"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">{isAr ? 'الأول' : 'First'}</span>
                  </div>
                  <div>
                    <input
                      required
                      type="text"
                      placeholder={isAr ? 'اسم العائلة' : ''}
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors text-xs font-medium"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">{isAr ? 'العائلة' : 'Last'}</span>
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 text-xs">
                  {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors text-xs font-medium"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5 text-xs">
                  {isAr ? 'اكتب رسالتك' : 'Leave us a few words'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 transition-colors text-xs font-medium resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button (Coral Red like screenshot) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#ff4d4d] hover:bg-[#ff3333] active:bg-[#e62e2e] text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (isAr ? 'جاري الإرسال...' : 'SUBMITTING...') : (isAr ? 'إرسال' : 'SUBMIT')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactModal;

