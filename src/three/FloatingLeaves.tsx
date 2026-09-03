import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';

/**
 * 漂浮的玻璃树叶
 */
export default function FloatingLeaves({ opacity = 0.5 }: { opacity?: number }) {
  const leaves = useMemo(() => {
    return [...Array(5)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      scale: 0.8 + Math.random() * 1.2,
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      speed: 0.5 + Math.random() * 1,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <group>
      {leaves.map((props, i) => (
        <Leaf key={i} {...props} opacity={opacity} />
      ))}
    </group>
  );
}

function Leaf({ position, scale, rotation, speed, offset, opacity }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    meshRef.current.rotation.z = Math.sin(t * 0.2) * 0.5;
    meshRef.current.rotation.y = t * 0.1 * speed;
    meshRef.current.position.y += Math.sin(t * speed) * 0.002;
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1} position={position}>
      <mesh ref={meshRef} rotation={rotation} scale={scale}>
        {/* 使用扁平的椭球模拟叶片 */}
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#BFEBC9"
          transmission={0.8}
          roughness={0.2}
          clearcoat={1}
          thickness={0.5}
          distort={0.4}
          speed={2}
          transparent
          opacity={opacity}
          ior={1.4}
        />
      </mesh>
    </Float>
  );
}
