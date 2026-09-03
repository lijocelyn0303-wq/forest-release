import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Points, PointMaterial, Text } from '@react-three/drei';

interface EmotionOrbProps {
  label: string;
  color: string;
  pos: [number, number, number];
  isSelected: boolean;
  onSelect: () => void;
}

export default function EmotionOrb({ label, color, pos, isSelected, onSelect }: EmotionOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);
  
  // Generate random particles for the inside
  const particlePositions = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Scale animation
    const targetScale = isSelected ? 1.5 : 1.0;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    
    // Rotation
    meshRef.current.rotation.y = t * 0.5;
    
    // Internal particles animation
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * (isSelected ? 1.2 : 0.4);
      particlesRef.current.rotation.x = t * (isSelected ? 0.6 : 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={pos}>
      <pointLight intensity={isSelected ? 4 : 2} distance={8} color={color} />

      <Points ref={particlesRef} positions={particlePositions} stride={3}>
        <PointMaterial
          transparent
          color={color}
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={isSelected ? 0.8 : 0.4}
        />
      </Points>

      <mesh 
        ref={meshRef} 
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          transmission={1}
          thickness={0.5}
          roughness={0.05}
          metalness={0}
          ior={1.2}
          clearcoat={1}
          clearcoatRoughness={0}
          transparent={true}
          opacity={isSelected ? 0.9 : 0.7}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          envMapIntensity={1}
        />
      </mesh>

      {/* Label Text */}
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.45}
        color="white"
        fillOpacity={0.5}
        anchorX="center"
        anchorY="middle"
        renderOrder={10}
      >
        {label}
      </Text>
      
      {isSelected && (
        <mesh scale={1.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
        </mesh>
      )}
    </Float>
  );
}
