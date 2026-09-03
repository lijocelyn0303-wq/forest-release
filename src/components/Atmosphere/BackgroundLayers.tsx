import React from 'react';
import { motion } from 'motion/react';
import { useReleaseStore } from '../../store/useReleaseStore';

export default function BackgroundLayers() {
  const { releaseMicroStep } = useReleaseStore();
  const isMorning = releaseMicroStep === 4;

  // 动态色调
  const baseGradient = isMorning 
    ? 'linear-gradient(180deg, #fff9e6 0%, #fff1cc 40%, #ffffff 100%)' // 晨光
    : 'linear-gradient(180deg, #f3fff7 0%, #e2f7ea 40%, #ffffff 100%)'; // 默认森林

  const mountainColor1 = isMorning ? '#b3d4a6' : '#76a161';
  const mountainColor2 = isMorning ? '#92c281' : '#5a8b4e';

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none overflow-hidden transition-colors duration-[3000ms]"
      style={{ backgroundColor: isMorning ? '#fffdf7' : '#f3fff7' }}
    >
      {/* 1. Base Gradient Atmosphere */}
      <motion.div 
        className="absolute inset-0 z-0 transition-all duration-[3000ms]"
        style={{ background: baseGradient }}
      />

      {/* 2. Far Mountain Layer */}
      <div className="absolute inset-0 z-[1] opacity-50">
        <Mountain range="far" color={mountainColor1} delay={0} />
      </div>

      {/* 3. Mid Mountain & Mist */}
      <div className="absolute inset-0 z-[2]">
        <Mountain range="mid" color={mountainColor2} delay={4} />
        
        {/* 云雾 */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`mountain-mist-${i}`}
            className={`absolute h-[80px] w-[200%] blur-[40px] rounded-full ${isMorning ? 'bg-orange-100/30' : 'bg-white/40'}`}
            animate={{ 
              x: ['-10%', '10%', '-10%'],
              y: [0, -15, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: '-50%',
            }}
          />
        ))}
      </div>

      {/* 4. Water Reflections & Mist Interface: 水面与山体的交界雾气 */}
      <div className="absolute bottom-[25%] left-0 w-full h-[15%] z-[3] opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-transparent blur-[20px]" />
        <motion.div 
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-white/20 blur-[30px]"
        />
      </div>

      {/* 5. Water Surface: 核心湖泊水面 */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] z-[4]">
        <WaterSurface />
      </div>

      {/* 6. Mid-Mist: 山间流动的云雾 */}
      <div className="absolute inset-0 z-[5] opacity-60">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`mist-mid-${i}`}
            className="absolute h-[120px] w-[180%] blur-[50px] rounded-[100%] bg-white/50"
            animate={{ 
              x: ['-20%', '15%', '-20%'],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 18 + i * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              top: `${25 + i * 12}%`,
              left: '-30%',
            }}
          />
        ))}
      </div>

      {/* 7. Floating Elements: 生动的落叶、水滴、远鸟 */}
      <div className="absolute inset-0 z-[6]">
        <Leaf position={{ top: '15%', left: '10%' }} delay={0} scale={1.3} />
        <Leaf position={{ top: '55%', left: '80%' }} delay={3} scale={1.1} />
        <Leaf position={{ top: '35%', left: '70%' }} delay={6} scale={1.4} />
        <Droplet position={{ top: '20%', left: '35%' }} delay={1} scale={1.3} />
        <Droplet position={{ top: '65%', left: '20%' }} delay={4} scale={1.0} />
        
        {/* 远方飞鸟 */}
        <Bird position={{ top: '12%', right: '15%' }} delay={0} />
        <Bird position={{ top: '16%', right: '10%' }} delay={2} />
      </div>

      {/* 8. Atmosphere: 顶部光晕 */}
      <div 
        className="absolute inset-0 z-[7]"
        style={{
          background: 'radial-gradient(circle at 50% 12%, rgba(255,255,255,0.6) 0%, transparent 55%)'
        }}
      />
    </motion.div>
  );
}

/**
 * 山脉组件
 */
function Mountain({ range, color, delay }: { range: 'far' | 'mid' | 'near', color: string, delay: number }) {
  const path = range === 'far' 
    ? "M0 100 Q150 20 300 80 T600 40 T900 90 T1200 60 T1500 100 L1500 500 L0 500 Z"
    : range === 'mid'
    ? "M0 120 Q250 30 500 110 T1000 70 T1500 120 L1500 500 L0 500 Z"
    : "M0 150 Q300 60 600 140 T1200 100 T1800 150 L1800 600 L0 600 Z";

  const opacity = range === 'far' ? 0.35 : range === 'mid' ? 0.5 : 0.65;
  const blur = range === 'far' ? '6px' : range === 'mid' ? '4px' : '2px';

  return (
    <motion.div
      className="absolute w-[130%] h-full top-[5%] -left-[15%]"
      animate={{ y: [0, range === 'far' ? 15 : 25, 0] }}
      transition={{ duration: 18 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 1500 500" className="w-full h-full" preserveAspectRatio="none">
        <path d={path} fill={color} fillOpacity={opacity} style={{ filter: `blur(${blur})` }} />
        <path d={path} fill="none" stroke={color} strokeWidth="3" strokeOpacity="0.2" style={{ filter: 'blur(1px)' }} />
      </svg>
    </motion.div>
  );
}

/**
 * 水面组件 (Lake)
 */
function WaterSurface() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 水面基础层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#cce7e1]/50 to-[#b8dbd2]/70" />
      
      {/* 流动的水波纹 - 更加明显 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute h-[2px] w-[150%] bg-white/50"
          animate={{ 
            x: ['-25%', '15%', '-25%'],
            opacity: [0.2, 0.6, 0.2],
            scaleY: [1, 1.5, 1]
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4
          }}
          style={{
            top: `${10 + i * 18}%`,
            left: '-25%',
            filter: 'blur(1px)',
            boxShadow: '0 0 10px rgba(255,255,255,0.4)'
          }}
        />
      ))}

      {/* 水面反光闪烁 */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent"
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/**
 * 树叶组件
 */
function Leaf({ position, delay, scale = 1 }: any) {
  return (
    <motion.div
      className="absolute"
      style={position}
      initial={{ y: 0, rotate: 0, opacity: 0 }}
      animate={{ 
        y: [0, -30, 10, 0], 
        x: [0, 15, -15, 0],
        rotate: [0, 25, -25, 0],
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <svg width={95 * scale} height={45 * scale} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'blur(0.8px)' }}>
        <path 
          d="M0 20C0 20 20 0 40 0C60 0 80 20 80 20C80 20 60 40 40 40C20 40 0 20 0 20Z" 
          fill="url(#leaf_grad_accent)" 
          fillOpacity="0.7"
        />
        <defs>
          <linearGradient id="leaf_grad_accent" x1="0" y1="20" x2="80" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6b9e5d" />
            <stop offset="1" stopColor="#a8d49f" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

/**
 * 水滴组件
 */
function Droplet({ position, delay, scale = 1 }: any) {
  return (
    <motion.div
      className="absolute"
      style={position}
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [0, 15, 0],
        opacity: [0.4, 0.6, 0.4]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut"
      }}
    >
      <div 
        className="rounded-full bg-gradient-to-b from-white/60 to-emerald-100/30 border border-white/40 shadow-inner blur-[0.5px]"
        style={{
          width: 14 * scale,
          height: 24 * scale,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
      />
      <div 
        className="absolute top-[20%] left-[25%] w-[30%] h-[30%] bg-white/80 rounded-full blur-[1px]"
      />
    </motion.div>
  );
}

/**
 * 飞鸟组件
 */
function Bird({ position, delay }: any) {
  return (
    <motion.div
      className="absolute"
      style={position}
      initial={{ x: 0, opacity: 0 }}
      animate={{ 
        x: [0, 200], 
        y: [0, -15, 0],
        opacity: [0, 0.4, 0]
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
    >
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-30">
        <path d="M2 7C6 2 11 7 12 8C13 7 18 2 22 7" stroke="#173528" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}


