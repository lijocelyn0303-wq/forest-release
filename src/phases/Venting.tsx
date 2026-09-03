import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';
import { useSpeechRecognition } from '../systems/speech/useSpeechRecognition';
import { useAudioAnalyser } from '../systems/audio/useAudioAnalyser';
import { Mic } from 'lucide-react';

export default function Venting() {
  const { transcript, interimTranscript, sentences, setStage, audioSamples } = useReleaseStore();
  const { isListening, startListening: startSpeech, stopListening: stopSpeech } = useSpeechRecognition();
  const { startListening: startAnalyser, stopListening: stopAnalyser } = useAudioAnalyser();

  const toggleListening = () => {
    if (isListening) stopSpeech();
    else startSpeech();
  };

  useEffect(() => {
    if (isListening) startAnalyser();
    else stopAnalyser();
    return () => stopAnalyser();
  }, [isListening, startAnalyser, stopAnalyser]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-12 pointer-events-auto">
      {/* 顶部标题 */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#173528] tracking-tight">向森林倾诉</h2>
        <p className="text-emerald-800/60 text-lg font-light max-w-md mx-auto">
          让你的声音化作轻柔的卡片，<br/>
          在这片宁静中重归自然。
        </p>
      </motion.div>

      {/* 中间区域：句子卡片区域 */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
        <AnimatePresence>
          {sentences.map((sentence, idx) => (
            <motion.div
              key={`final-${idx}`}
              initial={{ 
                opacity: 0, 
                scale: 0.5,
                x: (Math.random() - 0.5) * 100,
                y: 200,
                rotate: (Math.random() - 0.5) * 45
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: (Math.random() - 0.5) * 300 - 120, 
                x: (Math.random() - 0.5) * 600,
                rotate: (Math.random() - 0.5) * 10
              }}
              transition={{ 
                duration: 2, 
                ease: [0.23, 1, 0.32, 1],
                opacity: { duration: 0.5 }
              }}
              className="absolute z-10"
            >
              <div 
                className="relative bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl p-8 text-[#173528] font-medium text-center italic w-56 flex items-center justify-center leading-relaxed rounded-3xl"
                style={{
                  boxShadow: '0 10px 40px -10px rgba(6, 78, 59, 0.2)'
                }}
              >
                <div className="z-10 relative text-sm md:text-base px-2">
                  {sentence}
                </div>
              </div>
            </motion.div>
          ))}

          {interimTranscript && (
            <motion.div
              key="interim"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1.1, y: -180 }}
              exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.2 } }}
              className="absolute z-20 flex items-center justify-center"
            >
              <div 
                className="bg-emerald-50/90 backdrop-blur-lg border-2 border-emerald-200/50 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] p-10 text-[#173528] font-bold text-center italic w-72 flex items-center justify-center leading-relaxed rounded-[3rem]"
              >
                <div className="z-10 relative text-lg md:text-xl px-2">
                  {interimTranscript}
                  <span className="inline-block w-1 h-6 bg-emerald-500 ml-1 animate-pulse" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 实时录音波形和当前识别文本 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex gap-2 h-16 items-center">
                {audioSamples.map((v, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: Math.max(4, v * 120), opacity: Math.max(0.2, v) }}
                    className="w-1.5 bg-emerald-400/60 rounded-full"
                  />
                ))}
              </div>
              <p className="text-emerald-900/40 text-sm tracking-[0.3em] font-medium uppercase animate-pulse">正在聆听中...</p>
            </motion.div>
          )}

          {!isListening && transcript === '' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-800/30 text-xl font-light tracking-widest text-center"
            >
              等待你的声音...
            </motion.div>
          )}
        </div>
      </div>

      {/* 底部控制栏 */}
      <div className="relative z-20 flex flex-col items-center gap-8 w-full max-w-sm px-8">
        <AnimatePresence mode="wait">
          {!isListening && transcript === '' ? (
            <motion.button
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={startSpeech}
              className="w-full py-6 bg-white border-2 border-emerald-100 text-[#173528] font-bold rounded-[3rem] shadow-2xl shadow-emerald-900/5 hover:bg-emerald-50 transition-all active:scale-95 flex items-center justify-center gap-3 tracking-[0.2em]"
            >
              <Mic size={24} className="text-emerald-500" />
              开始倾诉
            </motion.button>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <button
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl relative ${
                  isListening 
                  ? 'bg-rose-500 shadow-rose-200' 
                  : 'bg-white border-2 border-emerald-100'
                }`}
              >
                <Mic size={32} className={isListening ? 'text-white' : 'text-emerald-500'} />
                {isListening && (
                  <div className="absolute inset-0 rounded-full border-4 border-rose-500/30 animate-pulse" />
                )}
              </button>

              {transcript && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setStage(ReleaseStage.CONDENSATION)}
                  className="w-full py-5 bg-[#1FC77A] text-white font-bold rounded-[2.5rem] text-lg shadow-2xl shadow-emerald-200 hover:bg-[#25e28c] transition-all tracking-[0.1em] flex items-center justify-center gap-2"
                >
                  我说完了，把它揉成压力球
                </motion.button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
