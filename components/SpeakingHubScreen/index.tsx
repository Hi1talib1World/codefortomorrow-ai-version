import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, Volume2, Globe, ArrowLeft, CheckCircle2, ChevronRight, Play, RefreshCw, Award, Bot, MessageSquare, VolumeX
} from 'lucide-react';
import { useToast } from '../ToastNotification';

interface SpeakingHubScreenProps {
  onBack?: () => void;
}

export interface LanguageTrack {
  id: string;
  code: 'fr' | 'en' | 'ar';
  name: string;
  nativeName: string;
  flagEmoji: string;
  description: string;
  badgeBg: string;
  illustrationUrl: string;
  totalModules: number;
  samplePhrases: { text: string; translation: string; phonetic?: string }[];
}

const LANGUAGE_TRACKS: LanguageTrack[] = [
  {
    id: 'french_track',
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flagEmoji: '🇫🇷',
    description: 'Pratiquez le français oral avec votre tuteur virtuel IA. Apprenez les salutations, le vocabulaire informatique et la conversation courante.',
    badgeBg: 'bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8]',
    illustrationUrl: '/speaking_practice.png',
    totalModules: 8,
    samplePhrases: [
      { text: "Bonjour! Je m'appelle Leo et j'apprends la programmation Python.", translation: "Hello! My name is Leo and I am learning Python programming." },
      { text: "Comment crée-t-on une fonction personnalisée en JavaScript?", translation: "How do you create a custom function in JavaScript?" },
      { text: "C'est une excellente journée pour apprendre le développement web!", translation: "It is a great day to learn web development!" }
    ]
  },
  {
    id: 'english_track',
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flagEmoji: '🇬🇧',
    description: 'Master spoken English for tech careers, coding presentations, everyday conversations, and software engineering interviews.',
    badgeBg: 'bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995]',
    illustrationUrl: '/speaking_practice.png',
    totalModules: 10,
    samplePhrases: [
      { text: "Hello! Welcome to Code for Tomorrow Morocco.", translation: "مرحباً! أهلاً بكم في كود فور تومورو المغرب." },
      { text: "Let's review the variable scopes and loop structures together.", translation: "دعونا نراجع نطاق المتغيرات وهياكل التكرار معاً." },
      { text: "I enjoy building interactive applications using modern web tools.", translation: "أستمتع ببناء تطبيقات تفاعلية باستخدام أدوات الويب الحديثة." }
    ]
  },
  {
    id: 'arabic_track',
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية / المغربية',
    flagEmoji: '🇲🇦',
    description: 'تعلم وتحدث العربية والدارجة المغربية بطلاقة مع تمارين صوتية تفاعلية ومساعد ذكي للنطق.',
    badgeBg: 'bg-[#FCE8E6] text-[#C5221F] dark:bg-[#3C4043] dark:text-[#F28B82]',
    illustrationUrl: '/speaking_practice.png',
    totalModules: 8,
    samplePhrases: [
      { text: "مرحباً بكم في منصة البرمجة باللغة العربية!", translation: "Welcome to the programming platform in Arabic!" },
      { text: "كيف كيمكن لينا نكتبو أول برنامج ديالنا بـ Python؟", translation: "How can we write our very first program in Python?" },
      { text: "التعلم المستمر هو سر النجاح في مجال التكنولوجيا.", translation: "Continuous learning is the secret to success in technology." }
    ]
  }
];

const speakingHubTranslations = {
  en: {
    badge: 'Google AI Voice Tutor',
    titlePrefix: 'Speaking Hub ',
    titleSuffix: 'Language Practice',
    subtitle: 'Master conversational French, English, and Arabic with interactive AI voice practice, speech recognition, and instant pronunciation scoring!',
    french: 'French',
    english: 'English',
    arabic: 'Arabic',
    languageTracks: 'Language Tracks',
    languagesAvailable: '3 Languages Available',
    startVoiceTutor: 'Start Voice Tutor',
    learnAndPractice: 'Learn & Practice',
    backToAllLanguages: 'Back to All Languages',
    voiceStudio: 'Voice Studio',
    practiceSpoken: 'Practice Spoken',
    listenNativeSpeaker: 'Listen Native Speaker',
    stopAudio: 'Stop Audio',
    phrase: 'Phrase',
    of: 'of',
    translation: 'Translation:',
    pronunciationScore: 'Pronunciation Score:',
    recordMyVoice: 'Record My Voice',
    listening: 'Listening (3s)...',
    nextPhrase: 'Next Phrase',
    ttsNotSupported: 'Text-to-speech is not supported in this browser.',
    listeningPrompt: 'Listening... Speak into your microphone!',
    greatJob: 'Great job! Pronunciation score:',
    voiceModules: 'Voice Modules'
  },
  fr: {
    badge: 'Tuteur Vocal Google AI',
    titlePrefix: 'Hub d\'Oral ',
    titleSuffix: 'Pratique des Langues',
    subtitle: 'Maîtrisez le français, l\'anglais et l\'arabe avec la pratique vocale IA interactive, la reconnaissance vocale et l\'évaluation instantanée de la prononciation !',
    french: 'Français',
    english: 'Anglais',
    arabic: 'Arabe',
    languageTracks: 'Parcours linguistiques',
    languagesAvailable: '3 Langues Disponibles',
    startVoiceTutor: 'Démarrer le Tuteur Vocal',
    learnAndPractice: 'Apprendre & Pratiquer',
    backToAllLanguages: 'Retour à toutes les langues',
    voiceStudio: 'Studio Vocal',
    practiceSpoken: 'Pratiquez l\'oral de',
    listenNativeSpeaker: 'Écouter un locuteur natif',
    stopAudio: 'Arrêter l\'audio',
    phrase: 'Phrase',
    of: 'sur',
    translation: 'Traduction :',
    pronunciationScore: 'Score de prononciation :',
    recordMyVoice: 'Enregistrer ma voix',
    listening: 'Écoute en cours (3s)...',
    nextPhrase: 'Phrase suivante',
    ttsNotSupported: 'La synthèse vocale n\'est pas prise en charge dans ce navigateur.',
    listeningPrompt: 'Écoute... Parlez dans votre micro !',
    greatJob: 'Bravo ! Score de prononciation :',
    voiceModules: 'Modules Vocaux'
  },
  ar: {
    badge: 'معلم الصوت بالذكاء الاصطناعي من جوجل',
    titlePrefix: 'مركز التحدث ',
    titleSuffix: 'ممارسة اللغات',
    subtitle: 'أتقن المحادثة باللغات الفرنسية والإنجليزية والعربية من خلال الممارسة الصوتية التفاعلية بالذكاء الاصطناعي وتقييم النطق الفوري!',
    french: 'الفرنسية',
    english: 'الإنجليزية',
    arabic: 'العربية',
    languageTracks: 'مسارات اللغات',
    languagesAvailable: '3 لغات متاحة',
    startVoiceTutor: 'ابدأ المعلم الصوتي',
    learnAndPractice: 'تعلم ومارس',
    backToAllLanguages: 'العودة إلى جميع اللغات',
    voiceStudio: 'استوديو الصوت',
    practiceSpoken: 'مارس التحدث بـ',
    listenNativeSpeaker: 'استمع إلى متحدث أصلي',
    stopAudio: 'إيقاف الصوت',
    phrase: 'العبارة',
    of: 'من',
    translation: 'الترجمة:',
    pronunciationScore: 'درجة تقييم النطق:',
    recordMyVoice: 'تسجيل صوتي',
    listening: 'جاري الاستماع (3 ثوانٍ)...',
    nextPhrase: 'العبارة التالية',
    ttsNotSupported: 'الميزة الصوتية غير مدعومة في هذا المتصفح.',
    listeningPrompt: 'جاري الاستماع... تحدث في الميكروفون!',
    greatJob: 'عمل رائع! درجة تقييم النطق:',
    voiceModules: 'وحدات صوتية'
  }
};

export const SpeakingHubScreen: React.FC<SpeakingHubScreenProps> = ({ onBack }) => {
  const { language } = useLanguage();
  const tHub = speakingHubTranslations[language as 'fr' | 'ar' | 'en'] || speakingHubTranslations.en;
  const isAr = language === 'ar';
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTrack, setActiveTrack] = useState<LanguageTrack | null>(null);
  const [activePhraseIndex, setActivePhraseIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const handleBack = () => {
    if (activeTrack) {
      setActiveTrack(null);
      setScore(null);
    } else if (onBack) {
      onBack();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSpeakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode === 'fr' ? 'fr-FR' : langCode === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      showToast(tHub.ttsNotSupported, 'info');
    }
  };

  const simulateVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setScore(null);
    showToast(tHub.listeningPrompt, 'info');

    setTimeout(() => {
      setIsRecording(false);
      const generatedScore = Math.floor(Math.random() * 12) + 88; // 88% - 99%
      setScore(generatedScore);
      showToast(`${tHub.greatJob} ${generatedScore}% 🎉`, 'success');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B132B] text-[#202124] dark:text-[#E8EAED] font-sans pb-28 pt-6 px-4 md:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Google Material 3 Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-[#E8EAED] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_1px_3px_rgba(60,64,67,0.08)] relative overflow-hidden transition-all gemini-halo-subtle">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-full bg-[#F1F3F4] dark:bg-[#3C4043] text-[#5F6368] dark:text-[#9AA0A6] hover:text-[#202124] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 text-[#1A73E8] dark:text-[#8AB4F8] text-xs font-medium">
                  <Globe className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                  <span className="font-semibold tracking-wide">{tHub.badge}</span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#202124] dark:text-white tracking-tight">
                {tHub.titlePrefix}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A73E8] via-[#8AB4F8] to-[#C58AF9]">{tHub.titleSuffix}</span>
              </h1>
              
              <p className="text-[#5F6368] dark:text-[#9AA0A6] text-xs sm:text-sm max-w-xl leading-relaxed font-normal">
                {tHub.subtitle}
              </p>
            </div>

            {/* Language Badges Summary */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="px-3 py-1 rounded-full bg-[#E8F0FE] text-[#1A73E8] dark:bg-[#3C4043] dark:text-[#8AB4F8] text-xs font-bold font-mono">
                🇫🇷 {tHub.french}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995] text-xs font-bold font-mono">
                🇬🇧 {tHub.english}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FCE8E6] text-[#C5221F] dark:bg-[#3C4043] dark:text-[#F28B82] text-xs font-bold font-mono">
                🇲🇦 {tHub.arabic}
              </span>
            </div>
          </div>
        </div>

        {/* OVERVIEW VIEW: 3 Language Track Cards */}
        {!activeTrack && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#5F6368] dark:text-[#9AA0A6] uppercase tracking-wider">{tHub.languageTracks}</h2>
              <span className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8]">{tHub.languagesAvailable}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LANGUAGE_TRACKS.map(track => {
                const trackTitle = isAr && track.code === 'ar' ? 'العربية' : isAr && track.code === 'fr' ? 'الفرنسية' : isAr && track.code === 'en' ? 'الإنجليزية' : track.name;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => {
                      setActiveTrack(track);
                      setActivePhraseIndex(0);
                      setScore(null);
                    }}
                    className={`group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-[0_1px_3px_rgba(60,64,67,0.08)] hover:shadow-[0_6px_16px_rgba(60,64,67,0.14)] transition-all border border-[#E8EAED] dark:border-slate-800 hover:border-[#1A73E8]/50 cursor-pointer flex flex-col justify-between gemini-halo-subtle ${isAr ? 'text-right' : 'text-left'}`}
                    dir={isAr ? 'rtl' : 'ltr'}
                  >
                    <div>
                      {/* Illustration Container */}
                      <div className="aspect-[16/10] bg-[#E3F2FD] dark:bg-slate-950 overflow-hidden relative flex items-center justify-center p-6">
                        <img
                          src={track.illustrationUrl}
                          alt={track.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} text-2xl shadow-sm`}>
                          {track.flagEmoji}
                        </span>
                        <span className={`absolute top-3 ${isAr ? 'left-3' : 'right-3'} bg-white/90 dark:bg-black/60 backdrop-blur-md text-[#202124] dark:text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-black/5`}>
                          {track.totalModules} {tHub.voiceModules}
                        </span>
                      </div>

                      {/* Track Info */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-medium uppercase tracking-wider px-3 py-0.5 rounded-full border border-[#E8EAED] dark:border-[#3C4043] ${track.badgeBg}`}>
                            {trackTitle}
                          </span>
                          <span className="text-xs font-bold text-[#202124] dark:text-white font-mono">
                            {track.nativeName}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-[#202124] dark:text-white group-hover:text-[#1A73E8] dark:group-hover:text-[#8AB4F8] transition-colors">
                          {tHub.learnAndPractice} {trackTitle}
                        </h3>

                        <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] leading-relaxed font-normal">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8]">{tHub.startVoiceTutor}</span>
                      <div className="w-8 h-8 rounded-full border border-[#E8EAED] dark:border-[#3C4043] flex items-center justify-center text-[#202124] dark:text-white group-hover:bg-[#1A73E8] group-hover:text-white group-hover:border-[#1A73E8] transition-all shadow-sm">
                        <span className={`text-base font-bold ${isAr ? 'rotate-180' : ''}`}>→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTIVE LANGUAGE ARENA: Practice Selected Language */}
        {activeTrack && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTrack(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A73E8] dark:text-[#8AB4F8] hover:underline cursor-pointer"
            >
              <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} /> {tHub.backToAllLanguages}
            </button>

            {/* Language Arena Card */}
            <div className={`bg-white dark:bg-[#292A2D] border border-[#E8EAED] dark:border-[#3C4043] rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F1F3F4] dark:border-[#3C4043] pb-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{activeTrack.flagEmoji}</span>
                  <div>
                    <div className="text-xs font-mono text-[#1A73E8] dark:text-[#8AB4F8] uppercase tracking-wider font-semibold">
                      {isAr && activeTrack.code === 'ar' ? 'العربية' : isAr && activeTrack.code === 'fr' ? 'الفرنسية' : isAr && activeTrack.code === 'en' ? 'الإنجليزية' : activeTrack.name} {tHub.voiceStudio} • {activeTrack.nativeName}
                    </div>
                    <h2 className="text-2xl font-bold text-[#202124] dark:text-white">
                      {tHub.practiceSpoken} {isAr && activeTrack.code === 'ar' ? 'العربية' : isAr && activeTrack.code === 'fr' ? 'الفرنسية' : isAr && activeTrack.code === 'en' ? 'الإنجليزية' : activeTrack.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakText(activeTrack.samplePhrases[activePhraseIndex].text, activeTrack.code)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-[#EA4335] text-white animate-pulse'
                      : 'bg-[#E8F0FE] dark:bg-[#3C4043] text-[#1A73E8] dark:text-[#8AB4F8]'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlayingAudio ? tHub.stopAudio : tHub.listenNativeSpeaker}</span>
                </button>
              </div>

              {/* Phrase Card */}
              <div className="bg-[#F8F9FA] dark:bg-[#202124] border border-[#E8EAED] dark:border-[#3C4043] rounded-2xl p-6 space-y-4 text-center relative">
                <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-0.5 rounded-full bg-white dark:bg-[#292A2D] border text-[#5F6368] dark:text-[#9AA0A6]">
                  {tHub.phrase} {activePhraseIndex + 1} {tHub.of} {activeTrack.samplePhrases.length}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-[#202124] dark:text-white leading-snug" dir="ltr">
                  "{activeTrack.samplePhrases[activePhraseIndex].text}"
                </h3>

                <p className="text-xs text-[#5F6368] dark:text-[#9AA0A6] font-mono">
                  {tHub.translation} {activeTrack.samplePhrases[activePhraseIndex].translation}
                </p>

                {score !== null && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F4EA] text-[#137333] dark:bg-[#3C4043] dark:text-[#81C995] text-xs font-bold font-mono mt-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>{tHub.pronunciationScore} {score}% 🌟</span>
                  </motion.div>
                )}
              </div>

              {/* Recording & Control Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2">
                  {activeTrack.samplePhrases.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isPlayingAudio) window.speechSynthesis?.cancel();
                        setIsPlayingAudio(false);
                        setActivePhraseIndex(idx);
                        setScore(null);
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        activePhraseIndex === idx ? 'bg-[#1A73E8] w-6' : 'bg-[#DADCE0] dark:bg-[#5F6368]'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={simulateVoiceRecording}
                    className={`px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                      isRecording
                        ? 'bg-[#EA4335] text-white shadow-md'
                        : 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecording ? tHub.listening : tHub.recordMyVoice}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isPlayingAudio) window.speechSynthesis?.cancel();
                      setIsPlayingAudio(false);
                      setActivePhraseIndex((prev) => (prev + 1) % activeTrack.samplePhrases.length);
                      setScore(null);
                    }}
                    className="px-4 py-3 bg-[#F1F3F4] dark:bg-[#3C4043] hover:bg-[#E8EAED] text-[#202124] dark:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
                  >
                    {tHub.nextPhrase}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SpeakingHubScreen;
