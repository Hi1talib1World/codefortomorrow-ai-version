
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Avatar from '../Avatar';
import { LipSyncData } from '../../hooks/useAvatarChat';

// Fix: Removed global JSX augmentation as it shadows standard IntrinsicElements like 'div'.
// Standard tags are now correctly recognized by TypeScript via React's default types.

interface AvatarCanvasProps {
    isSpeaking: boolean;
    lipSyncData: LipSyncData | null;
}

/**
 * Lightweight fallback shown while AvatarCanvas is loading or when WebGL is unavailable.
 */
const AvatarFallback: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
        <div className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-brand-200 dark:bg-brand-800/50 flex items-center justify-center">
                <svg className="w-10 h-10 text-brand-400 dark:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
            </div>
            <p className="text-xs font-bold text-brand-400 dark:text-brand-500 uppercase tracking-widest">Loading Avatar…</p>
        </div>
    </div>
);

/**
 * Error boundary that catches WebGL / Three.js crashes and shows the static fallback
 * instead of crashing the entire application.
 */
class AvatarErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.warn('[AvatarCanvas] WebGL/Three.js error caught by boundary:', error.message);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl">
                    <div className="flex flex-col items-center gap-3 text-center px-4">
                        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <svg className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">3D avatar unavailable</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">Your device may not support WebGL.</p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

const AvatarCanvas: React.FC<AvatarCanvasProps> = ({ isSpeaking, lipSyncData }) => {
    return (
        <AvatarErrorBoundary>
            <Canvas 
                camera={{ position: [0, 0, 1.2], fov: 35 }}
                shadows
                gl={{ preserveDrawingBuffer: true }}
            >
                {/* @ts-ignore */}
                <ambientLight intensity={0.5} />
                {/* @ts-ignore */}
                <directionalLight position={[3, 3, 5]} intensity={1.5} castShadow />
                <Suspense fallback={null}>
                    <Avatar 
                        url="https://models.readyplayer.me/658055a32b949c5855c3a373.glb" 
                        isSpeaking={isSpeaking}
                        lipSyncData={lipSyncData}
                    />
                    <Environment preset="sunset" />
                </Suspense>
                {/* OrbitControls for debugging - allows camera movement */}
                {/* <OrbitControls /> */}
            </Canvas>
        </AvatarErrorBoundary>
    );
};

/** Re-export the fallback so lazy-loading consumers can use it as their Suspense fallback. */
export { AvatarFallback };
export default AvatarCanvas;
