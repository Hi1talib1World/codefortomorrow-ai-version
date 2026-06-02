import React, { useState } from 'react';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Language } from '../../types';
import api from '../../services/api';
import { auth, firebaseService, handleGoogleRedirectResult } from '../../services/firebase';
import { Mail, Lock, User as UserIcon, Globe } from 'lucide-react';

const generateMockFirebaseToken = (emailAddress: string, displayName: string): string => {
  const header = 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0';
  const payload = {
    email: emailAddress || 'developer@codefortomorrow.org',
    name: displayName || 'Developer User',
    picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'Developer')}&background=0D8ABC&color=fff`,
    sub: 'mock-firebase-uid-' + Math.random().toString(36).substring(2, 11),
    iss: 'https://securetoken.google.com/dummy-project',
    aud: 'dummy-project',
    auth_time: Math.floor(Date.now() / 1000),
    user_id: 'mock-firebase-uid-' + Math.random().toString(36).substring(2, 11),
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const base64Payload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return `${header}.${base64Payload}.dummySignature`;
};

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  skipAuth: () => void;
  role?: 'teacher' | 'student';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, skipAuth, role }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t, language, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Advanced Interactive UI State
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setAcceptedTerms(false);
  };

  const handleViewChange = (isLogin: boolean) => {
    setIsLoginView(isLogin);
    clearForm();
  };

  // Simulated Boot sequence terminal logs
  React.useEffect(() => {
    const logEntries = isLoginView
      ? [
          'SEC_SYS: Initializing workspace handshake...',
          'MASCOT: Loading interface telemetry...',
          'GATEWAY: Google Auth API initialized.',
          'STATUS: Secure login pathway ready.'
        ]
      : [
          'SEC_SYS: Registering new profile entry...',
          'NEURAL: Assigning skill graphs...',
          'GATEWAY: Initializing user progression...',
          'STATUS: Registration gateway ready.'
        ];

    setTerminalLogs([]);
    let timerIds: number[] = [];

    logEntries.forEach((log, index) => {
      const id = window.setTimeout(() => {
        setTerminalLogs(prev => [...prev, log]);
      }, 200 + index * 350 + Math.random() * 150);
      timerIds.push(id);
    });

    return () => {
      timerIds.forEach(id => clearTimeout(id));
    };
  }, [isLoginView]);

  // Cursor-reactive Canvas Particle Network
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        if (mouse.x !== -1000) {
          const mouseDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (mouseDist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.15 * (1 - mouseDist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle Google sign‑in redirect result on component mount
  React.useEffect(() => {
    const processRedirect = async () => {
      const idToken = await handleGoogleRedirectResult();
      console.log('Google redirect result token:', idToken);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isDummyConfig = !auth.app.options.apiKey || auth.app.options.apiKey === 'dummy-api-key';
      let user: User;

      if (isDummyConfig) {
        console.warn('⚠️ Firebase has a dummy configuration. Simulating backend login/registration.');
        if (isLoginView) {
          user = await api.login(email, password);
        } else {
          user = await api.register(name, email, password, role || 'student');
        }
      } else {
        let token: string;
        if (isLoginView) {
          console.log('Logging in via Firebase Auth...');
          token = await firebaseService.loginWithEmail(email, password);
        } else {
          console.log('Registering via Firebase Auth...');
          token = await firebaseService.registerWithEmail(email, password);
          if (auth.currentUser) {
            try {
              const { updateProfile } = await import('firebase/auth');
              await updateProfile(auth.currentUser, { displayName: name });
            } catch (profileErr) {
              console.error('Failed to update display name in Firebase:', profileErr);
            }
          }
        }
        console.log('Firebase token acquired, syncing session with backend database...');
        user = await api.loginWithFirebase(token);
      }
      onAuthSuccess(user);
    } catch (err) {
      console.error('Auth Submit Error:', err);
      const errMsg = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errMsg.includes('auth/operation-not-allowed')) {
        setError('Error: Email/Password provider is disabled in Firebase Console. Please enable it under Authentication > Sign-in method.');
      } else {
        setError(errMsg);
      }
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
        console.warn('⚠️ Firebase has a dummy configuration. Using mock Google token.');
        const mockToken = generateMockFirebaseToken('wizard@codefortomorrow.org', 'Developer Wizard 🪄');
        const user = await api.loginWithFirebase(mockToken);
        onAuthSuccess(user);
      } else {
        console.log('Initiating Firebase Google Sign-In Popup...');
        const token = await firebaseService.loginWithGooglePopup();
        console.log('Google login token retrieved, verifying with backend...');
        const user = await api.loginWithFirebase(token);
        onAuthSuccess(user);
      }
    } catch (err) {
      console.error('Google Sign In Error:', err);
      setError(err instanceof Error ? err.message : 'Google login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden auth-screen-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .auth-screen-root {
          font-family: 'Outfit', sans-serif;
        }
        
        @keyframes blob-float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.15);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes scan-beam {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }

        @keyframes rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rotate-counter {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        
        .animate-blob-1 {
          animation: blob-float 18s infinite ease-in-out;
        }
        
        .animate-blob-2 {
          animation: blob-float 22s infinite ease-in-out reverse;
        }
        
        .animate-scan-beam {
          animation: scan-beam 3s infinite linear;
        }

        .animate-rotate-cw {
          animation: rotate-clockwise 15s infinite linear;
        }

        .animate-rotate-ccw {
          animation: rotate-counter 20s infinite linear;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.07);
        }

        .glass-input {
          background: rgba(10, 15, 30, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-input:focus {
          border-color: rgba(251, 191, 36, 0.5);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.15), inset 0 0 8px rgba(251, 191, 36, 0.05);
          background: rgba(10, 15, 30, 0.85);
        }
      `}</style>

      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Dynamic Background Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FBBF24]/10 blur-[120px] animate-blob-1 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-800/10 blur-[120px] animate-blob-2 pointer-events-none" />
      
      {/* Subtle Digital Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Bar with Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <div className="relative flex items-center">
          <Globe className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-slate-900/60 text-slate-300 rounded-full py-2 pl-9 pr-8 font-semibold border border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-[#FBBF24]/40 transition-all text-sm cursor-pointer hover:bg-slate-800/80 backdrop-blur-md"
            aria-label="Select language"
          >
            <option value={Language.EN} className="bg-slate-900 text-slate-300">🇬🇧 EN</option>
            <option value={Language.FR} className="bg-slate-900 text-slate-300">🇫🇷 FR</option>
            <option value={Language.AR} className="bg-slate-900 text-slate-300">🇲🇦 AR</option>
          </select>
        </div>
      </div>

      <div className="max-w-sm w-full py-6 relative z-10">
        {/* Glowing Pedestal for Mascot with Targeting Rings */}
        <div className="flex justify-center mb-6">
          <div className="relative group cursor-pointer">
            {/* Concentric rotating targeting rings */}
            <div className="absolute inset-[-15px] border border-dashed border-[#FBBF24]/20 rounded-full animate-rotate-cw pointer-events-none" />
            <div className="absolute inset-[-25px] border border-dashed border-slate-800/10 rounded-full animate-rotate-ccw pointer-events-none" />

            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FBBF24]/20 to-slate-800/20 blur-md group-hover:scale-110 transition-transform duration-500" />
            <div className="relative w-28 h-28 rounded-full border border-[#FBBF24]/30 bg-slate-950/80 p-2 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300 z-10">
                <Mascot />
              </div>
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FBBF24] to-transparent opacity-80 animate-scan-beam pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
          {/* Cyberpunk HUD Corner Brackets */}
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-[#FBBF24]/40 w-4 h-4 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-[#FBBF24]/40 w-4 h-4 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#FBBF24]/40 w-4 h-4 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#FBBF24]/40 w-4 h-4 rounded-br-sm pointer-events-none" />

          {/* Decorative tactical dots */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-[#FBBF24]/40 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-slate-800/40" />
            <span className="w-1 h-1 rounded-full bg-[#FBBF24]/40" />
          </div>

          {/* Sliding Capsule Tab Selector */}
          <div className="flex mb-8 rounded-2xl bg-slate-950/60 p-1.5 transition-colors border border-slate-800 relative overflow-hidden">
            <div 
              className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-[#FBBF24] to-[#f59e0b] shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out z-0"
              style={{
                width: 'calc(50% - 6px)',
                left: isLoginView ? '6px' : 'calc(50%)',
              }}
            />
            <button
              type="button"
              onClick={() => handleViewChange(true)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none cursor-pointer relative z-10 ${isLoginView ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('login')}
            </button>
            <button
              type="button"
              onClick={() => handleViewChange(false)}
              disabled={isLoading}
              className={`w-1/2 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none cursor-pointer relative z-10 ${!isLoginView ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t('signUp')}
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 tracking-tight text-white select-none">
            {isLoginView ? t('welcome_back') : t('join_the_adventure')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {!isLoginView && (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1" htmlFor="name">{t('username')}</label>
                  <div className="relative flex items-center">
                    <UserIcon className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'name' ? 'text-[#FBBF24] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-white focus:outline-none transition-all font-medium text-base glass-input"
                      required
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1" htmlFor="email">{t('email')}</label>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'email' ? 'text-[#FBBF24] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-white focus:outline-none transition-all font-medium text-base glass-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1" htmlFor="password">{t('password')}</label>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'password' ? 'text-[#FBBF24] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-white focus:outline-none transition-all font-medium text-base glass-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms of Use Checkbox — Sign Up only */}
            {!isLoginView && (
              <label className="flex items-start gap-3 mt-5 cursor-pointer group select-none">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-md border border-slate-600 bg-slate-900/60 peer-checked:bg-[#FBBF24] peer-checked:border-[#FBBF24] transition-all flex items-center justify-center">
                    {acceptedTerms && (
                      <svg className="w-3 h-3 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <a href="/dashboard/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] hover:underline font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/dashboard/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#FBBF24] hover:underline font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </label>
            )}

            {error && (
              <div className="mt-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#EA4335] text-sm text-center font-semibold animate-shake flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isLoginView && !acceptedTerms)}
              className="mt-8 w-full py-4 rounded-full bg-[#FBBF24] hover:bg-[#f59e0b] text-[#111827] font-bold text-[15px] tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-[0.98] transition-all duration-300 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:shadow-none disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? '...' : (isLoginView ? t('login') : t('create_account'))}
            </button>
          </form>

          {/* High-Tech Terminal Diagnostics Logger */}
          <div className="mt-8 p-3 bg-black/40 border border-slate-900/60 rounded-2xl font-mono text-[10px] text-[#FBBF24]/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] select-none pointer-events-none">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1.5">
              <span className="text-slate-500 font-bold uppercase tracking-wider">DIAGNOSTIC_LOG</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
            </div>
            <div className="space-y-1 min-h-[56px] text-left">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-slate-300">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {terminalLogs.length < 4 && (
                <div className="animate-pulse text-slate-600">_</div>
              )}
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={skipAuth}
              disabled={isLoading}
              className="text-slate-400 hover:text-[#FBBF24] font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {t('skip_for_now')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
