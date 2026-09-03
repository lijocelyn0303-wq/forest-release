import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';
import { useSpeechRecognition } from '../systems/speech/useSpeechRecognition';
import { MessageSquare, Forward } from 'lucide-react';

export default function Reflection() {
  const { reflection, interimTranscript, setStage } = useReleaseStore();
  const { isListening, startListening: startSpeech, stopListening: stopSpeech } = useSpeechRecognition();

  const toggleListening = () => {
    if (isListening) stopSpeech();
    else startSpeech();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
      <div className="relative z-10 flex flex-col items-center max-w-xl w-full px-8">
        <h2 className="text-3xl font-bold mb-5 text-center text-[#173528]">此刻的宁静</h2>
      <p className="text-emerald-800/70 mb-14 text-center text-lg leading-relaxed">
        压力已经消散。在这片安静的森林里，<br/>
        对自己说几句鼓励的话吧。
      </p>

      <button
        onClick={toggleListening}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all mb-14 shadow-2xl relative ${
          isListening 
          ? 'bg-sky-500 shadow-sky-200' 
          : 'bg-white hover:bg-sky-50 border-2 border-sky-100'
        }`}
      >
        <MessageSquare size={42} className={isListening ? 'text-white' : 'text-sky-500'} />
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-sky-500/30 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {(reflection || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="p-10 glass-light rounded-[3rem] mb-12 italic text-xl text-[#173528] leading-[1.8] text-center border-white/40 shadow-xl shadow-emerald-900/5">
              "{reflection}{interimTranscript && <span className="text-emerald-500/50">{interimTranscript}</span>}"
              {interimTranscript && <span className="inline-block w-0.5 h-5 bg-emerald-400 ml-1 animate-pulse" />}
            </div>
            {reflection && !interimTranscript && (
              <button
                onClick={() => setStage(ReleaseStage.REPORT)}
                className="w-full py-6 bg-[#1FC77A] text-white font-bold rounded-[2rem] flex items-center justify-center gap-4 hover:bg-[#25e28c] transition-all tracking-[0.2em] shadow-lg shadow-emerald-100 text-lg"
              >
                生成情绪报告 <Forward size={24} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
