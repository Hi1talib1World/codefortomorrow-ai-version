
import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { LipSyncData } from '../hooks/useAvatarChat';

// Fix: Removed global JSX augmentation which was breaking standard HTML element types throughout the project.

// ARKit blend shape names used by ReadyPlayerMe avatars
const blendshapeMapping: Record<string, string> = {
    A: 'mouthFunnel',
    E: 'mouthSmile',
    I: 'mouthSmile',
    O: 'mouthFunnel',
    U: 'mouthPout',
    B: 'mouthClose',
    M: 'mouthClose',
    P: 'mouthClose',
    F: 'mouthLowerDownLeft',
    V: 'mouthLowerDownRight',
    T: 'tongueOut',
    D: 'tongueOut',
    K: 'jawOpen',
    S: 'mouthShrugUpper',
    R: 'mouthRollUpper',
    default: 'jawOpen'
};

interface AvatarProps {
    url: string;
    isSpeaking: boolean;
    lipSyncData: LipSyncData | null;
}

const Avatar: React.FC<AvatarProps> = ({ url, isSpeaking, lipSyncData }) => {
    const { scene, animations } = useGLTF(url);
    const { ref, actions, names } = useAnimations(animations, scene);
    
    // Store reference to the head mesh for blend shapes
    const headMeshRef = useRef<THREE.SkinnedMesh | null>(null);

    useEffect(() => {
        // Play idle animation
        actions[names[0]]?.reset().fadeIn(0.5).play();

        // Find the mesh that contains the blend shapes (morph targets)
        scene.traverse((object) => {
            if (object instanceof THREE.SkinnedMesh && object.morphTargetDictionary) {
                if (Object.keys(object.morphTargetDictionary).includes('mouthSmile')) {
                     headMeshRef.current = object;
                }
            }
        });

    }, [scene, actions, names]);

    // This hook runs on every rendered frame
    useFrame((state, delta) => {
        if (!headMeshRef.current || !headMeshRef.current.morphTargetInfluences) return;

        // Smoothly reset all blend shapes to 0 when not speaking
        if (!isSpeaking && !lipSyncData) {
            Object.keys(headMeshRef.current.morphTargetDictionary).forEach(key => {
                const index = headMeshRef.current!.morphTargetDictionary![key];
                headMeshRef.current!.morphTargetInfluences![index] = THREE.MathUtils.lerp(
                    headMeshRef.current!.morphTargetInfluences![index],
                    0,
                    delta * 10
                );
            });
        }

        // Apply lip sync blend shapes
        if (lipSyncData) {
            const { viseme, value } = lipSyncData;
            const blendshapeName = blendshapeMapping[viseme] || blendshapeMapping['default'];
            const index = headMeshRef.current.morphTargetDictionary[blendshapeName];

            if (index !== undefined) {
                 headMeshRef.current.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                    headMeshRef.current.morphTargetInfluences[index],
                    value,
                    delta * 20
                );
            }
        }
        
        // Add a subtle blinking animation
        const eyeBlinkLeftIndex = headMeshRef.current.morphTargetDictionary['eyeBlinkLeft'];
        const eyeBlinkRightIndex = headMeshRef.current.morphTargetDictionary['eyeBlinkRight'];
        if (eyeBlinkLeftIndex !== undefined && eyeBlinkRightIndex !== undefined) {
            const blinkValue = (1 + Math.sin(state.clock.elapsedTime * 2)) / 2; // slow blink
            headMeshRef.current.morphTargetInfluences[eyeBlinkLeftIndex] = blinkValue < 0.1 ? 1 : 0;
            headMeshRef.current.morphTargetInfluences[eyeBlinkRightIndex] = blinkValue < 0.1 ? 1 : 0;
        }
    });

    // @ts-ignore - Primitive is a valid React-Three-Fiber intrinsic element.
    return <primitive object={scene} ref={ref} position={[0, -1, 0]} />;
};

export default Avatar;
