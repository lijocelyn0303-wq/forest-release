import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';

export default function Condensation() {
  const setStage = useReleaseStore((state) => state.setStage);

  useEffect(() => {
    // 模拟自动过渡
    const timer = setTimeout(() => {
      setStage(ReleaseStage.CORE_RELEASE);
    }, 4000);
    return () => clearTimeout(timer);
  }, [setStage]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 text-center"
      >
        <h2 className="text-3xl font-bold mb-4 text-[#173528]">正在具象化...</h2>
        <p className="text-[#173528]/60 max-w-xs mx-auto">
          森林正在将你的压力凝结成一个实体。当你准备好时，我们将彻底击碎它。
        </p>
        
        <div className="mt-12 flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-32 h-32 rounded-full border-2 border-emerald-200 blur-xl bg-emerald-500/10"
          />
        </div>
      </motion.div>
    </div>
  );
}
