import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useReleaseStore } from '../store/useReleaseStore';
import { Share2, RefreshCw, Heart, MessageCircle, BarChart2, Hash, Sparkles } from 'lucide-react';

export default function Report() {
  const { emotion, intensity, transcript, reflection, audioSamples, reset } = useReleaseStore();

  const emotionMap: Record<string, string> = {
    anxiety: '焦虑',
    anger: '愤怒',
    sadness: '悲伤',
    suppression: '压抑',
    exhaustion: '疲惫',
    none: '宁静'
  };

  const colorMap: Record<string, string> = {
    anxiety: '#7C6CFF',
    anger: '#D95050',
    sadness: '#3559A8',
    suppression: '#5F9B78',
    exhaustion: '#B8A99A',
    none: '#1FC77A'
  };

  const feedbackMap: Record<string, string> = {
    anxiety: '焦虑如同林间的薄雾，虽然一度模糊了视线，但随着你释怀的节奏，它们正悄然消散。',
    anger: '愤怒是灼热的火焰，如今已化为森林深处的余烬。让这股能量转为守护内心的温和力量。',
    sadness: '悲伤是滋润土地的雨水。你释放的这些重担，正让干涸的心田重新焕发生机。',
    suppression: '压抑是紧闭的厚土。现在，你已破土而出，在那片曾经紧锁的空间里，正有新的自由在舒展。',
    exhaustion: '疲惫是长途跋涉后的休憩。在这片宁静的草地上，你可以放下行囊，森林会托举你的重量。',
    none: '平静是生命最美的底色。'
  };

  // 生成词云数据
  const keywords = useMemo(() => {
    if (!transcript) return [];
    // 简单的关键词提取：按非中文字符或常见词分割
    const words = transcript.split(/[\s，。！？、…（）]/).filter(w => w.length >= 2);
    const counts: Record<string, number> = {};
    words.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [transcript]);

  // 渲染声纹曲线
  const renderCurve = () => {
    if (!audioSamples || audioSamples.length === 0) return null;
    const width = 300;
    const height = 60;
    const points = audioSamples.map((v, i) => {
      const x = (i / (audioSamples.length - 1)) * width;
      const y = height - (v * height * 0.8) - 5;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <path
          d={`M 0,${height} L ${points} L ${width},${height}`}
          fill="url(#curve-gradient)"
          className="opacity-20"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#1FC77A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1FC77A" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl glass-light rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl border border-white/40 max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <div className="relative z-10">
          <header className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-sm transition-colors duration-1000"
              style={{ backgroundColor: `${colorMap[emotion]}15`, borderColor: `${colorMap[emotion]}30` }}
            >
              <Heart style={{ color: colorMap[emotion] }} size={28} fill="currentColor" fillOpacity={0.2} />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#173528]">释放报告</h2>
            <p className="text-[10px] text-[#315448] opacity-50 uppercase tracking-[0.3em] font-bold mt-1">Forest Healing Log No. 05-17</p>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左侧：基本信息 */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60">
                  <span className="text-[10px] text-[#315448]/60 block font-bold mb-1 uppercase">化解情绪</span>
                  <span className="text-xl font-bold" style={{ color: colorMap[emotion] }}>{emotionMap[emotion]}</span>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60">
                  <span className="text-[10px] text-[#315448]/60 block font-bold mb-1 uppercase">初始强度</span>
                  <span className="text-xl font-bold text-[#173528]">{"●".repeat(intensity)}</span>
                </div>
              </div>

              <div className="bg-emerald-50/20 backdrop-blur-sm p-6 rounded-3xl border border-emerald-100/30">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart2 size={16} className="text-[#1FC77A]" />
                  <span className="text-[10px] text-[#173528]/70 font-bold uppercase tracking-wider">能量释放曲线</span>
                </div>
                <div className="py-2">
                  {renderCurve()}
                </div>
                <p className="text-[10px] text-center text-[#315448]/40 mt-2 font-medium italic">Vocal resonance pattern detected during release phase</p>
              </div>

              <div className="bg-white/40 p-6 rounded-3xl border border-white/60">
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={16} className="text-[#1FC77A]" />
                  <span className="text-[10px] text-[#173528]/70 font-bold uppercase tracking-wider">情绪关键词</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {keywords.length > 0 ? keywords.map(([word, count], i) => (
                    <span 
                      key={word} 
                      className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium border border-emerald-100/50"
                      style={{ 
                        opacity: 0.5 + (count / keywords[0][1]) * 0.5,
                        transform: `scale(${0.9 + (count / keywords[0][1]) * 0.2})`
                      }}
                    >
                      {word}
                    </span>
                  )) : <span className="text-sm text-gray-400 italic">在此刻寻找平静...</span>}
                </div>
              </div>
            </div>

            {/* 右侧：记录 & 赠言 */}
            <div className="space-y-6">
              <div className="bg-white/30 p-6 rounded-3xl border border-white/40 h-full flex flex-col">
                <div className="mb-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle size={14} className="text-gray-400" />
                      <span className="text-[10px] text-[#173528]/70 font-bold uppercase">倾诉回顾</span>
                    </div>
                    <p className="text-sm italic text-[#315448] leading-relaxed line-clamp-3">
                      "{transcript || '记录了一些沉默，也是一种力量。'}"
                    </p>
                  </div>
                  {reflection && (
                    <div className="pt-4 border-t border-emerald-100/30">
                      <span className="text-[10px] text-[#1FC77A] font-bold uppercase block mb-2">最后的觉察</span>
                      <p className="text-sm text-[#315448] leading-relaxed italic">
                        "{reflection}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto bg-[#1FC77A]/10 p-6 rounded-[2rem] border border-[#1FC77A]/10">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles size={14} className="text-[#1FC77A]" />
                  </div>
                  <p className="text-sm md:text-base text-[#173528] leading-relaxed font-bold italic mb-2">
                    {feedbackMap[emotion]}
                  </p>
                  <p className="text-xs text-[#315448]/60 font-medium">
                    记得，你不需要一个人承担所有，大自然永远是你最安静的倾听者。
                  </p>
                </div>
              </div>
            </div>
          </main>

          <footer className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={reset}
              className="flex-[2] py-5 bg-[#173528] text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#1a3a2a] transition-all shadow-lg active:scale-95 text-base tracking-widest"
            >
              <RefreshCw size={20} /> 重新开始
            </button>
            <button className="flex-1 py-5 bg-white border-2 border-emerald-100 text-emerald-800 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-sm">
              <Share2 size={20} /> 分享宁静
            </button>
          </footer>
        </div>
        
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/20 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/20 blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      </motion.div>
    </div>
  );
}
