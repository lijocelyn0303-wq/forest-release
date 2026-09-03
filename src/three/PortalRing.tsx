import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { useReleaseStore } from '../store/useReleaseStore';

export default function PortalRing() {
  const innerRingRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const { releaseMicroStep } = useReleaseStore();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (innerRingRef.current) innerRingRef.current.rotation.z = t * 0.2;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
      outerRingRef.current.rotation.y = Math.cos(t * 0.5) * 0.1;
    }
  });

  if (releaseMicroStep > 1) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* 内部发光环 - 使用透明度和自发光模拟玻璃发光 */}
        <mesh ref={innerRingRef}>
          <torusGeometry args={[2.5, 0.05, 32, 100]} />
          <meshPhysicalMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
            roughness={0}
            metalness={0.1}
            transmission={1}
            thickness={2}
          />
        </mesh>

        {/* 外部装饰环 - 增加视觉层次感 */}
        <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshStandardMaterial
            color="#1FC77A"
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* 核心光点/光晕增强 */}
        <pointLight color="#ffffff" intensity={2} distance={10} />
      </group>
    </Float>
  );
}
