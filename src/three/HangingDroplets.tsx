import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshPhysicalMaterial } from 'three';

/**
 * 悬挂/漂浮的玻璃水滴
 */
export default function HangingDroplets({ opacity = 0.8 }: { opacity?: number }) {
  const droplets = useMemo(() => {
    return [...Array(4)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() * 4) - 2,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      scale: 0.4 + Math.random() * 0.6,
      speed: 0.8 + Math.random() * 1.5,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  return (
    <group>
      {droplets.map((props, i) => (
        <Droplet key={i} {...props} opacity={opacity} />
      ))}
    </group>
  );
}

function Droplet({ position, scale, speed, offset, opacity }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + offset;
    meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.2;
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <mesh ref={meshRef} position={position} scale={[scale * 0.6, scale, scale * 0.6]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        roughness={0.05}
        ior={1.33}
        thickness={1}
        transparent
        opacity={opacity}
        clearcoat={1}
      />
    </mesh>
  );
}
