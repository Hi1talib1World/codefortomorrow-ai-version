import React, { useState } from 'react';
import Mascot from '../Mascot';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Language } from '../../types';
import api from '../../services/api';
import { auth, firebaseService } from '../../services/firebase';
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
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, skipAuth }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { t, language, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Advanced Interactive UI State
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
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
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 100)})`;
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
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - mouseDist / 120)})`;
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user: User;
      if (isLoginView) {
        user = await api.login(email, password);
      } else {
        user = await api.register(name, email, password);
      }
      onAuthSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      let idToken: string;
      console.log('Attempting Google Sign-In with Firebase...');
      idToken = await firebaseService.loginWithGooglePopup();

      const user = await api.loginWithFirebase(idToken);
      onAuthSuccess(user);
    } catch (err) {
      console.error('Google Sign In Error:', err);
      // Handle popup blocked error specifically
      if (err && typeof err === 'object' && 'code' in err && (err as any).code === 'auth/popup-blocked') {
        alert('Please enable pop-ups for this website to sign in with Google.');
      }
      setError(err instanceof Error ? err.message : 'Google Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden auth-screen-root">
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
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.15), inset 0 0 8px rgba(6, 182, 212, 0.05);
          background: rgba(10, 15, 30, 0.85);
        }
      `}</style>

      {/* Interactive Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Dynamic Background Mesh Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] animate-blob-1 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-blob-2 pointer-events-none" />
      
      {/* Subtle Digital Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Bar with Language Selector */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <div className="relative flex items-center">
          <Globe className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="appearance-none bg-slate-900/60 text-slate-300 rounded-full py-2 pl-9 pr-8 font-semibold border border-slate-700/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all text-sm cursor-pointer hover:bg-slate-800/80 backdrop-blur-md"
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
            <div className="absolute inset-[-15px] border border-dashed border-cyan-500/20 rounded-full animate-rotate-cw pointer-events-none" />
            <div className="absolute inset-[-25px] border border-dashed border-indigo-500/10 rounded-full animate-rotate-ccw pointer-events-none" />

            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-md group-hover:scale-110 transition-transform duration-500" />
            <div className="relative w-28 h-28 rounded-full border border-cyan-500/30 bg-slate-950/80 p-2 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-300 z-10">
                <Mascot />
              </div>
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-scan-beam pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden">
          {/* Cyberpunk HUD Corner Brackets */}
          <div className="absolute top-0 left-0 border-t-2 border-l-2 border-cyan-500/40 w-4 h-4 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-0 right-0 border-t-2 border-r-2 border-cyan-500/40 w-4 h-4 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-0 left-0 border-b-2 border-l-2 border-cyan-500/40 w-4 h-4 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-0 right-0 border-b-2 border-r-2 border-cyan-500/40 w-4 h-4 rounded-br-sm pointer-events-none" />

          {/* Decorative tactical dots */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
            <span className="w-1 h-1 rounded-full bg-cyan-500/40 animate-pulse" />
            <span className="w-1 h-1 rounded-full bg-indigo-500/40" />
            <span className="w-1 h-1 rounded-full bg-cyan-500/40" />
          </div>

          {/* Sliding Capsule Tab Selector */}
          <div className="flex mb-8 rounded-2xl bg-slate-950/60 p-1.5 transition-colors border border-slate-800 relative overflow-hidden">
            <div 
              className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 ease-out z-0"
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

          <h2 className="text-2xl font-bold text-center mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 select-none">
            {isLoginView ? t('welcome_back') : t('join_the_adventure')}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {!isLoginView && (
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1" htmlFor="name">{t('username')}</label>
                  <div className="relative flex items-center">
                    <UserIcon className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'name' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
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
                  <Mail className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'email' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
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
                  <Lock className={`absolute left-4 w-5 h-5 transition-all duration-300 pointer-events-none ${focusedField === 'password' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-500'}`} />
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

            {error && (
              <div className="mt-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-[#EA4335] text-sm text-center font-semibold animate-shake flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full py-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 text-white font-bold text-[15px] tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.35)] active:scale-[0.98] transition-all duration-300 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:shadow-none disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
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

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-slate-500 font-semibold text-xs uppercase tracking-wider select-none">{t('or_continue_with')}</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="flex justify-center w-full">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-full border border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/60 text-slate-200 font-bold text-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              <span>{t('continue_with_google')}</span>
            </button>
          </div>

          {/* High-Tech Terminal Diagnostics Logger */}
          <div className="mt-8 p-3 bg-black/40 border border-slate-900/60 rounded-2xl font-mono text-[10px] text-cyan-400/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] select-none pointer-events-none">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 mb-1.5">
              <span className="text-slate-500 font-bold uppercase tracking-wider">DIAGNOSTIC_LOG</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
            </div>
            <div className="space-y-1 min-h-[56px] text-left">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="text-indigo-400">&gt;</span>
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
              className="text-slate-400 hover:text-cyan-400 font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
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
