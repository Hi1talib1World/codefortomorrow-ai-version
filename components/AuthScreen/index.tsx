import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Language } from '../../types';
import api from '../../services/api';
import { auth, firebaseService, handleGoogleRedirectResult, isFirebaseConfigured } from '../../src/services/external/firebase';
import { Mail, Lock, User as UserIcon, Globe, Eye, EyeOff, ArrowRight, ChevronDown, Check, CheckCircle2 } from 'lucide-react';
import { sendEmailVerification, signOut } from 'firebase/auth';

const regSuccessTranslations = {
  en: {
    success_registered: '🎉 Account registered successfully! Welcome to Code for Tomorrow.',
    success_verification_needed: '✅ Account registered successfully! A verification link has been sent to your email address. (Please check your spam or junk folder if you don\'t see it).',
  },
  fr: {
    success_registered: '🎉 Compte créé avec succès ! Bienvenue sur Code for Tomorrow.',
    success_verification_needed: '✅ Compte créé avec succès ! Un e-mail de vérification a été envoyé à votre adresse. (Vérifiez également votre dossier spam ou courrier indésirable).',
  },
  ar: {
    success_registered: '🎉 تم إنشاء الحساب بنجاح! مرحباً بك في كود فور تمورو.',
    success_verification_needed: '✅ تم إنشاء الحساب بنجاح! تم إرسال رابط التحقق إلى عنوان بريدك الإلكتروني. (يرجى التحقق من مجلد الرسائل غير المرغوب فيها/السبام إذا لم تجده).',
  }
};

const verifTranslations = {
  en: {
    verify_email: 'Verify Your Email',
    verification_sent: "We've sent a verification link to your email address:",
    check_inbox: 'Please check your inbox (including your spam or junk folder) and click the verification link to activate your account.',
    btn_check: 'I have verified my email',
    btn_resend: 'Resend Verification Email',
    btn_cancel: 'Back to Login',
    err_not_verified: 'Email is not verified yet. Please check your inbox or spam folder.',
    success_resent: 'Verification email resent successfully. Please check your inbox or spam folder.',
  },
  fr: {
    verify_email: 'Vérifiez votre e-mail',
    verification_sent: 'Nous avons envoyé un lien de vérification à votre adresse e-mail :',
    check_inbox: 'Veuillez vérifier votre boîte de réception (ainsi que votre dossier spam/courrier indésirable) et cliquer sur le lien de vérification pour activer votre compte.',
    btn_check: "J'ai vérifié mon e-mail",
    btn_resend: "Renvoyer l'e-mail de vérification",
    btn_cancel: 'Retour à la connexion',
    err_not_verified: "L'e-mail n'est pas encore vérifié. Veuillez vérifier votre boîte de réception ou dossier spam.",
    success_resent: "L'e-mail de vérification a été renvoyé avec succès. Veuillez vérifier votre boîte de réception ou dossier spam.",
  },
  ar: {
    verify_email: 'التحقق من بريدك الإلكتروني',
    verification_sent: 'لقد أرسلنا رابط تحقق إلى عنوان بريدك الإلكتروني:',
    check_inbox: 'يرجى التحقق من صندوق الوارد (ومجلد الرسائل غير المرغوب فيها/السبام) والنقر على رابط التحقق لتفعيل حسابك.',
    btn_check: 'لقد قمت بالتحقق من بريدي الإلكتروني',
    btn_resend: 'إعادة إرسال بريد التحقق',
    btn_cancel: 'العودة لتسجيل الدخول',
    err_not_verified: 'البريد الإلكتروني لم يتم التحقق منه بعد. يرجى التحقق من صندوق الوارد أو مجلد السبام.',
    success_resent: 'تم إعادة إرسال بريد التحقق بنجاح. يرجى التحقق من صندوق الوارد أو مجلد السبام.',
  }
};

interface AuthScreenProps {
  onAuthSuccess: (user: User, selectedRole?: 'teacher' | 'student') => void;
  skipAuth: (selectedRole?: 'teacher' | 'student') => void;
  role?: 'teacher' | 'student';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, skipAuth, role }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t, language, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [signupRole, setSignupRole] = useState<'student' | 'teacher'>('student');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
    setAcceptedTerms(false);
  };

  const handleViewChange = (isLogin: boolean) => {
    setIsLoginView(isLogin);
    clearForm();
  };

  // Handle Google sign-in redirect result on component mount
  React.useEffect(() => {
    const processRedirect = async () => {
      const idToken = await handleGoogleRedirectResult();
      if (idToken) {
        try {
          const user = await api.loginWithFirebase(idToken);
          onAuthSuccess(user);
        } catch (e) {
          console.error('Redirect login failed:', e);
        }
      }
    };
    processRedirect();
  }, []);

  const handleCheckVerification = async () => {
    if (auth.currentUser) {
      setIsLoading(true);
      setError('');
      try {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          const token = await auth.currentUser.getIdToken(true);
          const user = await api.loginWithFirebase(token);
          onAuthSuccess(user, signupRole);
        } else {
          const currentLang = language as keyof typeof verifTranslations;
          const dict = verifTranslations[currentLang] || verifTranslations.en;
          setError(dict.err_not_verified);
        }
      } catch (err: any) {
        console.error('Verification check error:', err);
        setError(err instanceof Error ? err.message : 'Verification check failed.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      setIsLoading(true);
      setError('');
      try {
        await sendEmailVerification(auth.currentUser);
        const currentLang = language as keyof typeof verifTranslations;
        const dict = verifTranslations[currentLang] || verifTranslations.en;
        setSuccessMessage(dict.success_resent);
      } catch (err: any) {
        console.error('Resend verification error:', err);
        setError(err instanceof Error ? err.message : 'Failed to resend verification email.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelVerification = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setNeedsVerification(false);
      clearForm();
    } catch (err: any) {
      console.error('Cancel verification error:', err);
      setError(err instanceof Error ? err.message : 'Error signing out.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      let user: User;
      const currentDict = regSuccessTranslations[language as keyof typeof regSuccessTranslations] || regSuccessTranslations.en;

      if (isFirebaseConfigured) {
        try {
          let token: string;
          if (isLoginView) {
            token = await firebaseService.loginWithEmail(email, password);
          } else {
            token = await firebaseService.registerWithEmail(email, password);
            if (auth.currentUser) {
              try {
                const { updateProfile } = await import('firebase/auth');
                await updateProfile(auth.currentUser, { displayName: name });
              } catch (profileErr) {
                console.error('Failed to update display name in Firebase:', profileErr);
              }

              try {
                await sendEmailVerification(auth.currentUser);
              } catch (verifErr) {
                console.error('Failed to send verification email on register:', verifErr);
              }
              setSuccessMessage(currentDict.success_verification_needed);
              setNeedsVerification(true);
              setIsLoading(false);
              return;
            }
          }
          user = await api.loginWithFirebase(token);
        } catch (fbErr: any) {
          console.warn('Firebase authentication failed, falling back to local database auth:', fbErr);
          const errMsg = fbErr instanceof Error ? fbErr.message : String(fbErr);
          
          if (errMsg.includes('verify your email')) {
            if (auth.currentUser) {
              try {
                await sendEmailVerification(auth.currentUser);
              } catch (verifErr) {
                console.error('Failed to send verification email:', verifErr);
              }
            }
            setNeedsVerification(true);
            setIsLoading(false);
            return;
          }

          if (isLoginView) {
            user = await api.login(email, password);
          } else {
            user = await api.register(name, email, password, signupRole);
          }
        }
      } else {
        if (isLoginView) {
          user = await api.login(email, password);
        } else {
          user = await api.register(name, email, password, signupRole);
        }
      }

      if (!isLoginView) {
        setSuccessMessage(currentDict.success_registered);
        setTimeout(() => {
          onAuthSuccess(user, signupRole);
        }, 1200);
      } else {
        onAuthSuccess(user, undefined);
      }
    } catch (err: any) {
      console.error('Auth Submit Error:', err);
      const errMsg = err instanceof Error ? err.message : 'An unknown authentication error occurred.';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const isDummyConfig = !auth.app.options.apiKey || auth.app.options.apiKey === 'dummy-api-key';
      if (isDummyConfig) {
        throw new Error('Firebase is not configured. Google sign-in cannot proceed until valid Firebase settings are provided.');
      }

      const token = await firebaseService.loginWithGooglePopup();
      const user = await api.loginWithFirebase(token);
      onAuthSuccess(user);
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setError(err instanceof Error ? err.message : 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const token = await firebaseService.loginAnonymously();
      const user = await api.loginWithFirebase(token);
      onAuthSuccess(user, isLoginView ? 'student' : signupRole);
    } catch (err) {
      console.error('Anonymous login error, falling back to local guest session:', err);
      try {
        skipAuth(isLoginView ? 'student' : signupRole);
      } catch (skipErr) {
        setError(err instanceof Error ? err.message : 'Anonymous login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = language === Language.AR;

  return (
    <div className={`min-h-screen w-full flex flex-col md:flex-row bg-[#008be3] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* LEFT COLUMN: Hero Photo Banner */}
      <div className="relative w-full md:w-[55%] lg:w-[60%] min-h-[340px] md:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Photo Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/login_classroom_banner.jpg')` }}
        />
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />

        {/* Top Left: Logo & Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <svg className="w-8 h-8 text-white fill-current drop-shadow-md" viewBox="0 0 100 100">
            <path d="M50 10 C27.9 10 10 27.9 10 50 C10 72.1 27.9 90 50 90 C72.1 90 90 72.1 90 50 C90 36.2 83 23.9 72.3 16.5 C69.4 14.5 65.6 17.5 67.2 20.6 C75.5 27 80 38 80 50 C80 66.6 66.6 80 50 80 C33.4 80 20 66.6 20 50 C20 33.4 33.4 20 50 20 C58.2 20 65.6 23.3 71 28.7 C73.1 30.8 76.7 29.3 76.5 26.3 C75.8 19.5 70.5 13.8 63.8 11.2 C59.5 9.5 54.8 9.9 50 10 Z" />
          </svg>
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
            Code for Tomorrow
          </span>
        </div>

        {/* Bottom Left: Headline & Slogan */}
        <div className="relative z-10 max-w-2xl mt-auto pt-16">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold tracking-widest text-white/90 uppercase mb-2 drop-shadow">
            {language === Language.FR ? 'BIENVENUE SUR' : language === Language.AR ? 'أهلاً بكم في' : 'WELCOME TO'}
          </h3>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase drop-shadow-lg">
            {language === Language.FR ? 'LA VRAIE JOIE DE L\'APPRENTISSAGE INTELLIGENT' : 
             language === Language.AR ? 'المتعة الحقيقية للتعلم الذكي' : 
             'THE TRUE JOY OF SMART LEARNING'}
          </h1>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Login / Register Form */}
      <div className="w-full md:w-[45%] lg:w-[40%] min-h-screen bg-slate-50 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10 shadow-2xl overflow-y-auto">
        {/* Top Header: Language Selector */}
        <div className="flex justify-end relative z-20 mb-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language.toUpperCase()}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                {[
                  { code: Language.EN, label: 'English' },
                  { code: Language.FR, label: 'Français' },
                  { code: Language.AR, label: 'العربية' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-slate-100 ${language === item.code ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700'}`}
                  >
                    <span>{item.label}</span>
                    {language === item.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center High-Contrast Elevated Auth Card */}
        <div className="my-auto max-w-md w-full mx-auto bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 space-y-6">
          {/* Main Action Header */}
          <div className="text-left space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {needsVerification
                  ? (verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).verify_email
                  : (isLoginView 
                      ? (language === Language.FR ? 'Connexion' : language === Language.AR ? 'تسجيل الدخول' : 'Welcome back')
                      : (language === Language.FR ? 'Inscription' : language === Language.AR ? 'إنشاء حساب' : 'Create an account')
                    )
                }
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {isLoginView 
                  ? (language === Language.FR ? 'Entrez vos identifiants pour continuer' : language === Language.AR ? 'أدخل بياناتك للمتابعة' : 'Enter your credentials to access your account')
                  : (language === Language.FR ? 'Rejoignez la communauté Code for Tomorrow' : language === Language.AR ? 'انضم إلى مجتمع كود فور تمورو' : 'Join the Code for Tomorrow learning platform')
                }
              </p>
            </div>

            {/* Segmented Control Tab Switcher */}
            {!needsVerification && (
              <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleViewChange(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLoginView ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => handleViewChange(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${!isLoginView ? 'bg-white text-blue-600 shadow-sm border border-slate-200/60' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('signUp')}
                </button>
              </div>
            )}
          </div>

          {/* Form / Verification View */}
          {needsVerification ? (
            <div className="space-y-5 bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-xs text-slate-700 leading-relaxed space-y-3 text-center">
                <p>{(verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).verification_sent}</p>
                <p className="font-bold text-slate-900 text-sm bg-white py-2 px-4 rounded-xl border border-slate-300 break-all shadow-xs">
                  {email}
                </p>
                <p className="text-slate-500 text-xs">{(verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).check_inbox}</p>
              </div>

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 text-left shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckVerification}
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  {isLoading ? '...' : (verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).btn_check}
                </button>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase transition-all cursor-pointer"
                >
                  {(verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).btn_resend}
                </button>
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleCancelVerification}
                    className="text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {(verifTranslations[language as keyof typeof verifTranslations] || verifTranslations.en).btn_cancel}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginView && (
                <>
                  {/* Full Name input for registration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">
                      {language === Language.FR ? "Nom complet" : language === Language.AR ? "الاسم الكامل" : "Full Name"}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Role Selector Tabs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">
                      {t('role_selection_question' as any) || "Account Type"}
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSignupRole('student')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${signupRole === 'student' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {t('im_a_student' as any) || "Student"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupRole('teacher')}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${signupRole === 'teacher' ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {t('im_a_teacher' as any) || "Teacher"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block px-0.5">
                  {language === Language.FR ? "E-mail ou nom d'utilisateur" : language === Language.AR ? "البريد الإلكتروني أو اسم المستخدم" : "Email or Username"}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Input with eye toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-0.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    {language === Language.FR ? "Mot de passe" : language === Language.AR ? "كلمة المرور" : "Password"}
                  </label>
                  {isLoginView && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset functionality is available via your registered email or admin.")}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {language === Language.FR ? "Oublié ?" : language === Language.AR ? "نسيت؟" : "Forgot?"}
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full py-3 pl-4 pr-11 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-sm font-medium focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox for Sign Up view */}
              {!isLoginView && (
                <label className="flex items-start gap-2.5 px-0.5 cursor-pointer group select-none pt-1">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 group-hover:text-slate-900 leading-tight font-medium">
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
              )}

              {/* Success Message banner */}
              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Error Message banner */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              {/* DOMINANT PRIMARY CTA BUTTON */}
              <button
                type="submit"
                disabled={isLoading || (!isLoginView && !acceptedTerms)}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm uppercase tracking-wider shadow-md shadow-blue-600/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? '...' : (isLoginView ? t('login') : t('create_account'))}</span>
              </button>

              {/* OR CONTINUE WITH Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {language === Language.FR ? 'Ou continuer avec' : language === Language.AR ? 'أو المتابعة باستخدام' : 'Or continue with'}
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* SECONDARY MUTED SOCIAL BUTTONS */}
              <div className="grid grid-cols-2 gap-3">
                {/* Microsoft Button */}
                <button
                  type="button"
                  onClick={() => alert("Microsoft Sign-In integration ready. Connect your Azure AD Client ID in settings.")}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  <span>Microsoft</span>
                </button>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Guest Option */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleAnonymousLogin}
                  disabled={isLoading}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200/80"
                >
                  {isLoading ? '...' : (language === Language.FR ? 'Continuer en tant qu\'invité' : language === Language.AR ? 'المتابعة كزائر' : 'Continue as Guest')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-medium py-2">
          © {new Date().getFullYear()} Code for Tomorrow • Inclusive EdTech Platform
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
