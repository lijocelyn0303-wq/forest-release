import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';
import { Wind, ChevronRight, Mic, MoveUp, Scissors, Sparkles, Heart, Camera } from 'lucide-react';
import { useAudioAnalyser } from '../systems/audio/useAudioAnalyser';
import { useHandTracking } from '../systems/vision/useHandTracking';

const STEPS = [
  { 
    title: 'Voice Resonance', 
    desc: '你的声音是解锁压力的钥匙。请发出声音，感受它的震动。',
    icon: Mic,
    buttonText: '下一步',
    message: '让声音化为林间的微风。'
  },
  { 
    title: 'Push', 
    desc: '请伸出手掌，向屏幕前方用力推，推开这份沉重的能量。',
    icon: MoveUp,
    buttonText: '手动推开',
    message: '识别手势：向前推掌'
  },
  { 
    title: 'Tear', 
    desc: '请双手向两侧拉开，像撕开纸张一样撕碎束缚。',
    icon: Scissors,
    buttonText: '手动撕裂',
    message: '识别手势：双手横向撕拉'
  },
  { 
    title: 'Scatter', 
    desc: '像播撒种子一样挥动手臂，将压力归还大地。',
    icon: Sparkles,
    buttonText: '手动挥散',
    message: '识别手势：左右快速挥动'
  },
  { 
    title: 'Hold & Breathe', 
    desc: '双手保持静止，握住最后的光，在呼吸中获得平静。',
    icon: Heart,
    buttonText: '深呼吸...',
    message: '吸气 4 秒... 呼气 4 秒...'
  }
];

export default function CoreRelease() {
  const { releaseMicroStep, setReleaseMicroStep, setStage, setGesture, hasPermission, setHasPermission } = useReleaseStore();
  const { startListening, stopListening, isListening } = useAudioAnalyser();
  const { isHandReady, gestures, startTracking, stopTracking } = useHandTracking();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentStep = STEPS[releaseMicroStep];
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'exhale'>('inhale');

  // 处理媒体流和追踪
  useEffect(() => {
    async function setupCamera() {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 },
          audio: false 
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          if (isHandReady) {
            startTracking(videoRef.current!);
          }
        };
        setHasPermission(true);
      } catch (err) {
        console.error('Camera access denied:', err);
      }
    }

    setupCamera();

    return () => {
      stopTracking();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [isHandReady, startTracking, stopTracking, setHasPermission]);

  // 根据实时手势自动推进步骤 (非核心步骤仍保留手动按钮)
  useEffect(() => {
    if (releaseMicroStep === 1 && gestures.pushGesture) {
      setTimeout(() => setReleaseMicroStep(2), 1000);
    }
    if (releaseMicroStep === 2 && gestures.tearGesture) {
      setTimeout(() => setReleaseMicroStep(3), 1000);
    }
    if (releaseMicroStep === 3 && gestures.scatterGesture) {
      setTimeout(() => setReleaseMicroStep(4), 1000);
    }
    
    // 更新全局状态供 Shader 使用
    if (gestures.pushGesture) setGesture('push');
    else if (gestures.tearGesture) setGesture('tear');
    else if (gestures.scatterGesture) setGesture('scatter');
    else setGesture('none');
    
  }, [gestures, releaseMicroStep, setReleaseMicroStep, setGesture]);

  // 处理第一步的语音
  useEffect(() => {
    if (releaseMicroStep === 0) startListening();
    else stopListening();
  }, [releaseMicroStep, startListening, stopListening]);

  // 呼吸逻辑
  useEffect(() => {
    if (releaseMicroStep === 4) {
      const interval = setInterval(() => {
        setBreathePhase(p => p === 'inhale' ? 'exhale' : 'inhale');
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [releaseMicroStep]);

  const handleNextStep = () => {
    if (releaseMicroStep < STEPS.length - 1) {
      setReleaseMicroStep(releaseMicroStep + 1);
    } else {
      setStage(ReleaseStage.REFLECTION);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col justify-center items-center pointer-events-none">
      {/* 隐藏的视频识别节点 */}
      <video 
        ref={videoRef} 
        className="fixed bottom-4 right-4 w-32 h-24 rounded-xl border-2 border-white/20 opacity-0 pointer-events-none"
        playsInline
        muted
      />
      
      <div className="relative z-10 flex flex-col justify-between items-center h-[85vh] w-full py-12 px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-xl">
          <motion.div
            key={releaseMicroStep}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#173528]">
              {currentStep.title}
            </h2>
            <p className="text-emerald-800/60 text-lg leading-relaxed">
              {currentStep.desc}
            </p>
          </motion.div>
        </div>

        {/* Dynamic Center Message */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={releaseMicroStep + (gestures.pushGesture ? 'active' : 'idle')}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className={`bg-white/40 backdrop-blur-md border px-10 py-6 rounded-[2.5rem] shadow-2xl transition-colors duration-500 text-emerald-900 font-bold text-xl md:text-2xl italic text-center min-w-[300px] ${
                (gestures.pushGesture || gestures.tearGesture || gestures.scatterGesture) 
                ? 'border-emerald-400 bg-emerald-50/60' 
                : 'border-white/40'
              }`}
            >
              {releaseMicroStep === 4 ? (
                <div className="flex flex-col items-center gap-3">
                  <motion.div 
                    animate={{ scale: breathePhase === 'inhale' ? [1, 1.2] : [1.2, 1] }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="text-[#1FC77A] text-3xl"
                  >
                    {breathePhase === 'inhale' ? '吸气 (Inhale)' : '呼气 (Exhale)'}
                  </motion.div>
                  <div className="text-sm opacity-50 not-italic">4秒一循环</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span>{currentStep.message}</span>
                  {releaseMicroStep > 0 && releaseMicroStep < 4 && !isHandReady && (
                    <span className="text-xs font-medium text-emerald-600 animate-pulse">正在启动 AI 手迹识别...</span>
                  )}
                  {isHandReady && releaseMicroStep > 0 && releaseMicroStep < 4 && (
                    <span className="text-xs font-medium text-emerald-600">
                      {gestures.fingerCount > 0 ? `检测到手掌 (${gestures.fingerCount}指)` : '请将手对准摄像头'}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button Section */}
        <div className="pointer-events-auto flex flex-col items-center gap-4">
          <button
            onClick={handleNextStep}
            className={`
              relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all active:scale-95 shadow-[0_20px_50px_rgba(31,199,122,0.2)] group overflow-hidden
              ${releaseMicroStep === STEPS.length - 1 
                ? 'bg-[#1FC77A] text-white' 
                : 'bg-white border-2 border-emerald-100 text-[#1FC77A] shadow-xl'}
            `}
          >
             {releaseMicroStep > 0 && releaseMicroStep < 4 && !hasPermission ? (
               <Camera size={36} className="animate-pulse" />
             ) : (
               <currentStep.icon size={36} className="group-hover:scale-110 transition-transform mb-1" />
             )}
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              {currentStep.buttonText}
            </span>
            
            {releaseMicroStep === 0 && isListening && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-emerald-500/10 origin-bottom"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
              />
            )}
          </button>
          
          <div className="flex gap-2">
            {STEPS.map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === releaseMicroStep ? 'w-8 bg-[#1FC77A]' : 'w-2 bg-emerald-200/50'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

