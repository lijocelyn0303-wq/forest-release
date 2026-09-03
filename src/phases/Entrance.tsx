import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';
import { Play, Camera, Mic, AlertCircle } from 'lucide-react';

/**
 * Entrance - 森林入口页
 * 处理权限请求与阶段跳转
 */
export default function Entrance() {
  const setStage = useReleaseStore((state) => state.setStage);
  const setHasPermission = useReleaseStore((state) => state.setHasPermission);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleStart = async () => {
    setIsRequesting(true);
    setErrorMsg(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NOT_SUPPORTED');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      });

      stream.getTracks().forEach(track => track.stop());
      
      setHasPermission(true);
      setStage(ReleaseStage.EMOTION_SELECTION);
    } catch (err: any) {
      console.error('Permission error:', err);
      if (err.name === 'NotAllowedError' || err.message === 'Permission denied') {
        setErrorMsg('请允许麦克风与摄像头权限，以便记录声音和识别手势。也可以进入演示模式体验。');
      } else {
        setErrorMsg('暂时无法开启权限。您可以点击下方“演示模式”直接体验。');
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    setHasPermission(false);
    setStage(ReleaseStage.EMOTION_SELECTION);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center px-10 py-16 max-w-xl glass-light rounded-[4rem] border-white/40 shadow-2xl shadow-emerald-900/5 mb-14 pointer-events-auto"
      >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#173528] leading-tight">
        Forest Release
      </h1>

      <h2 className="text-xl font-medium text-emerald-800/80 mb-6 italic">
        欢迎来到森林情绪释放室
      </h2>

      <p className="text-emerald-900/70 mb-12 text-lg leading-relaxed font-light px-6">
        在这里，你可以把压力轻轻说出来，看见它，然后让它回到森林里。
      </p>

      {/* 权限提示卡 - 浅色风格 */}
      <div className="mb-12 text-sm text-[#315448] bg-emerald-500/5 py-5 px-8 rounded-3xl border border-emerald-500/10 backdrop-blur-sm">
        <div className="flex justify-center gap-8 mb-3">
          <span className="flex items-center gap-2 font-medium"><Mic size={16} className="text-emerald-600" /> 语音记录</span>
          <span className="flex items-center gap-2 font-medium"><Camera size={16} className="text-emerald-600" /> 手势识别</span>
        </div>
        <p className="opacity-60">为了提供更好的疗愈体验，请允许必要的权限感应。</p>
      </div>

      {/* 错误显示 */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="p-5 bg-white/80 text-emerald-900/80 border border-emerald-200 rounded-3xl text-sm leading-relaxed text-left flex items-start gap-3 shadow-sm">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
              <span>{errorMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 按钮部分 - 亮绿色大按钮 */}
      <div className="space-y-5">
        <button
          onClick={handleStart}
          disabled={isRequesting}
          className={`
            group relative w-full py-6 rounded-[2.5rem] font-bold tracking-[0.2em] text-xl transition-all active:scale-[0.98]
            ${isRequesting 
              ? 'bg-emerald-100 text-emerald-300 cursor-not-allowed' 
              : 'bg-[#1FC77A] hover:bg-[#25e28c] text-white shadow-[0_15px_45px_rgba(31,199,122,0.3)]'}
          `}
        >
          <span className="relative z-10 flex items-center justify-center gap-4">
            {isRequesting ? '启动中...' : 'START RELEASE'}
          </span>
        </button>

        <button 
          onClick={handleSkip}
          className="text-base text-emerald-600 hover:text-emerald-800 transition-colors py-3 block w-full font-medium opacity-60 underline underline-offset-8 decoration-emerald-200"
        >
          演示模式进入
        </button>
      </div>

      <p className="mt-14 text-[11px] text-emerald-900/30 uppercase tracking-[0.4em] font-medium">
        LITTLE NATURE HEALING SPACE
      </p>
      </motion.div>
    </div>
  );
}
