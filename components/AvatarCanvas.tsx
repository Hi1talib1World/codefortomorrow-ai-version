
import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Avatar from './Avatar';
import { LipSyncData } from '../hooks/useAvatarChat';

// Fix: Removed global JSX augmentation as it shadows standard IntrinsicElements like 'div'.
// Standard tags are now correctly recognized by TypeScript via React's default types.

interface AvatarCanvasProps {
    isSpeaking: boolean;
    lipSyncData: LipSyncData | null;
}

const AvatarCanvas: React.FC<AvatarCanvasProps> = ({ isSpeaking, lipSyncData }) => {
    return (
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
    );
};

export default AvatarCanvas;
