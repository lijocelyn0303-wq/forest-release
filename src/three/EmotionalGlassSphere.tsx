import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { MeshDistortMaterial, Sphere, Float, Stars } from '@react-three/drei';
import { useReleaseStore, EmotionType } from '../store/useReleaseStore';

export default function EmotionalGlassSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const splitRef1 = useRef<THREE.Mesh>(null!);
  const splitRef2 = useRef<THREE.Mesh>(null!);
  const breathRef = useRef<THREE.Mesh>(null!);
  
  const { emotion, intensity, releaseMicroStep, audioSamples } = useReleaseStore();

  const emotionColors: Record<EmotionType, string> = {
    anxiety: '#7C6CFF',
    anger: '#D95050',
    sadness: '#3559A8',
    suppression: '#5F9B78',
    exhaustion: '#B8A99A',
    none: '#ffffff'
  };

  const baseColor = emotionColors[emotion] || '#44aa88';
  
  // 模拟音量值 (0-1)
  const volume = audioSamples.length > 0 ? audioSamples.reduce((a, b) => a + b, 0) / audioSamples.length : 0;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const step = releaseMicroStep;

    // --- Step 0 & 1: 基础球体控制 ---
    if (meshRef.current) {
      // Step 0: 随声音震动
      if (step === 0) {
        const targetDistort = 0.3 + intensity * 0.1 + volume * 2.0;
        const targetScale = 1.8 + intensity * 0.2 + volume * 0.5;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        meshRef.current.position.set(0, Math.sin(t) * 0.1, 0);
      }
      
      // Step 1: 远离并缩小
      if (step === 1) {
        meshRef.current.scale.lerp(new THREE.Vector3(0.8, 0.8, 0.8), 0.05);
        meshRef.current.position.lerp(new THREE.Vector3(0, 1, -10), 0.05);
      }

      // Step 2 及以后隐藏主球
      meshRef.current.visible = step <= 1;
    }

    // --- Step 2: 分裂逻辑 ---
    if (step === 2) {
      if (splitRef1.current && splitRef2.current) {
        splitRef1.current.position.lerp(new THREE.Vector3(-3, 2, -15), 0.02);
        splitRef2.current.position.lerp(new THREE.Vector3(3, 0, -15), 0.02);
        splitRef1.current.scale.lerp(new THREE.Vector3(0.4, 0.4, 0.4), 0.02);
        splitRef2.current.scale.lerp(new THREE.Vector3(0.5, 0.5, 0.5), 0.02);
      }
    }

    // --- Step 3: 粒子飘散由 Stars 或父级控制，这里隐藏分裂球 ---
    if (step >= 3) {
      if (splitRef1.current) splitRef1.current.visible = false;
      if (splitRef2.current) splitRef2.current.visible = false;
    }

    // --- Step 4: 呼吸光点 ---
    if (step === 4 && breathRef.current) {
      const breathScale = 0.5 + Math.sin(t * (Math.PI / 4)) * 0.2; // 8秒一周期
      breathRef.current.scale.set(breathScale, breathScale, breathScale);
      breathRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* 主球体 */}
      <Sphere ref={meshRef} args={[1, 64, 64]} visible={releaseMicroStep <= 1}>
        <MeshDistortMaterial
          color={baseColor}
          speed={intensity * 1.5}
          distort={0.4}
          transmission={0.8}
          thickness={0.5}
          roughness={0.1}
        />
      </Sphere>

      {/* Step 2: 分裂球体 */}
      {releaseMicroStep === 2 && (
        <group>
          <Sphere ref={splitRef1} args={[1, 32, 32]} position={[0, 1, -10]} scale={0.6}>
            <MeshDistortMaterial color={baseColor} transmission={0.9} distort={0.6} speed={2} />
          </Sphere>
          <Sphere ref={splitRef2} args={[1, 32, 32]} position={[0.2, 0.8, -10.2]} scale={0.7}>
            <MeshDistortMaterial color={baseColor} transmission={0.9} distort={0.5} speed={3} />
          </Sphere>
        </group>
      )}

      {/* Step 3: 散开效果 */}
      {releaseMicroStep === 3 && (
        <group>
          <Stars radius={50} depth={20} count={5000} factor={4} saturation={0} fade speed={1} />
          <Stars radius={10} depth={50} count={1000} factor={2} saturation={1} fade speed={2} />
        </group>
      )}

      {/* Step 4: 呼吸之光 */}
      {releaseMicroStep === 4 && (
        <group>
          <Sphere ref={breathRef} args={[1, 32, 32]} scale={0.5}>
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#1FC77A" 
              emissiveIntensity={2} 
              transparent 
              opacity={0.8} 
            />
          </Sphere>
          <pointLight color="#1FC77A" intensity={5} distance={10} />
        </group>
      )}
    </group>
  );
}
