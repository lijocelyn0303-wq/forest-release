import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage, EmotionType } from '../store/useReleaseStore';
import { Plus } from 'lucide-react';

const emotions: { key: EmotionType; label: string; desc: string }[] = [
  { key: 'anxiety', label: '焦虑', desc: '心神不宁，对未来的担忧' },
  { key: 'anger', label: '愤怒', desc: '灼热的火，无法宣泄的不满' },
  { key: 'sadness', label: '悲伤', desc: '沉重的水，孤独的失落感' },
  { key: 'suppression', label: '压抑', desc: '深埋于底，难以言说的重负' },
  { key: 'exhaustion', label: '疲惫', desc: '枯萎的树，已经耗尽的能量' },
];

export default function EmotionSelection() {
  const { setStage, setIntensity, emotion: selectedEmotion, intensity } = useReleaseStore();

  const handleNext = () => {
    if (selectedEmotion !== 'none') {
      setStage(ReleaseStage.VENTING);
    }
  };

  const currentEmotionDesc = emotions.find(e => e.key === selectedEmotion)?.desc;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      
      <div className="relative z-20 w-full max-w-4xl px-8 flex flex-col items-center justify-between h-full py-16">
        <div className="text-center pointer-events-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#173528] tracking-tight">此刻，你的感受是？</h2>
          <p className="text-emerald-800/60 text-lg font-light max-w-md mx-auto">
            {selectedEmotion === 'none' 
              ? '直接触碰空中的情绪球，我们将一同化解它' 
              : currentEmotionDesc}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 w-full mt-auto mb-10 pointer-events-auto">
          <div className="w-full max-w-sm glass-light p-6 rounded-[3rem] text-center border-white/40 shadow-xl shadow-emerald-900/5 backdrop-blur-2xl">
            <p className="text-xs text-[#173528] mb-4 font-bold tracking-[0.2em] uppercase opacity-60">强度感应 (1-5)</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setIntensity(i)}
                  className={`w-12 h-12 rounded-full border flex items-center justify-center text-lg font-bold transition-all relative overflow-hidden ${
                    intensity === i 
                    ? 'bg-[#1FC77A] text-white border-[#1FC77A] shadow-lg shadow-emerald-500/30 scale-110' 
                    : 'bg-white/30 border-white/60 text-emerald-800 hover:bg-white/60 backdrop-blur-md'
                  }`}
                >
                  <span className="relative z-10">{i}</span>
                  {intensity !== i && (
                    <div className="absolute top-[15%] left-[20%] w-[25%] h-[25%] bg-white/40 rounded-full blur-[1px]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedEmotion !== 'none' && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleNext}
                className="px-14 py-5 bg-[#1FC77A] text-white font-bold rounded-[2.5rem] text-xl shadow-2xl shadow-emerald-200 hover:bg-[#25e28c] transition-all active:scale-95 flex items-center gap-3 tracking-[0.2em]"
              >
                继续倾诉 <Plus className="rotate-45" size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
