import { Stars, Environment, ContactShadows } from '@react-three/drei';

/**
 * 森林背景场景组件
 */
export default function ForestScene() {
  return (
    <>
      {/* 基础光照 */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight 
        position={[-10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        castShadow 
      />

      {/* 氛围装饰 */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />

      {/* 预设环境光 */}
      <Environment preset="forest" />

      {/* 地面阴影 */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
      />
    </>
  );
}
