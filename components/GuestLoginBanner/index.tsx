import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface GuestLoginBannerProps {
  title?: string;
  description?: string;
}

const bannerTranslations = {
  en: {
    defaultTitle: "You are currently browsing as a Guest",
    defaultDesc: "Log in or create a free account to save your learning progress, earn XP rewards, send messages, and climb the leaderboard!",
    btn: "Log In / Create Account",
    msgTitle: "Sign in to chat with classmates & mentors",
    msgDesc: "You are currently in Guest Mode. Log in or create a free account to send direct messages, start group chats, and contact mentors!"
  },
  fr: {
    defaultTitle: "Vous naviguez actuellement en tant qu'Invité",
    defaultDesc: "Connectez-vous ou créez un compte gratuit pour sauvegarder votre progression, gagner des XP et envoyer des messages !",
    btn: "Se Connecter / Créer un Compte",
    msgTitle: "Connectez-vous pour discuter avec vos camarades et mentors",
    msgDesc: "Vous êtes actuellement en Mode Invité. Connectez-vous ou créez un compte gratuit pour envoyer des messages directs !"
  },
  ar: {
    defaultTitle: "أنت تتصفح حالياً كزائر",
    defaultDesc: "سجل الدخول أو أنشئ حساباً مجانياً لحفظ تقدمك التعليمي، كسب نقاط XP، وإرسال الرسائل!",
    btn: "تسجيل الدخول / إنشاء حساب",
    msgTitle: "سجل الدخول للتحدث مع زملائك والمعلمين",
    msgDesc: "أنت حالياً في وضع الزائر. سجل الدخول أو أنشئ حساباً مجانياً لإرسال الرسائل المباشرة وبدء المحادثات التفاعلية!"
  }
};

export const GuestLoginBanner: React.FC<GuestLoginBannerProps> = ({
  title,
  description
}) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const tBanner = bannerTranslations[language] || bannerTranslations.en;

  const displayTitle = title
    ? (title.includes('Sign in to chat') ? tBanner.msgTitle : title)
    : tBanner.defaultTitle;

  const displayDesc = description
    ? (description.includes('Guest Mode') ? tBanner.msgDesc : description)
    : tBanner.defaultDesc;

  return (
    <div className="bg-[#E8F0FE] dark:bg-[#3C4043]/60 border border-[#1A73E8]/30 dark:border-[#8AB4F8]/30 rounded-3xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
      <div className="flex items-start gap-4 text-left rtl:text-right">
        <div className="p-3 bg-[#1A73E8] text-white rounded-2xl shrink-0 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#202124] dark:text-white">
            {displayTitle}
          </h3>
          <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-normal leading-relaxed max-w-xl">
            {displayDesc}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
        <button
          onClick={() => navigate('/auth')}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1557B0] text-white rounded-full text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition"
        >
          <LogIn className="w-4 h-4" />
          <span>{tBanner.btn}</span>
        </button>
      </div>
    </div>
  );
};

export default GuestLoginBanner;
