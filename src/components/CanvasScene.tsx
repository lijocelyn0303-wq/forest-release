import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import FloatingLeaves from '../three/FloatingLeaves';
import HangingDroplets from '../three/HangingDroplets';
import EmotionalGlassSphere from '../three/EmotionalGlassSphere';
import PortalRing from '../three/PortalRing';
import EmotionOrbField from '../three/EmotionOrbField';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';

export default function CanvasScene() {
  const { stage } = useReleaseStore();

  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 2]}
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent',
        pointerEvents: 'auto'
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <Environment preset="park" blur={0.8} />
      
      <Suspense fallback={null}>
        {stage === ReleaseStage.ENTRANCE && (
          <FloatingLeaves opacity={0.4} />
        )}

        {stage === ReleaseStage.EMOTION_SELECTION && (
          <EmotionOrbField />
        )}

        {stage !== ReleaseStage.ENTRANCE && stage !== ReleaseStage.EMOTION_SELECTION && (
          <group>
            <EmotionalGlassSphere />
            <PortalRing />
          </group>
        )}

        <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={20} blur={2.5} far={4.5} />
      </Suspense>
    </Canvas>
  );
}
