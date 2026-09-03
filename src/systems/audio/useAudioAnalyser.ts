import { useEffect, useRef, useState, useCallback } from 'react';
import { useReleaseStore } from '../../store/useReleaseStore';

/**
 * 音频分析 Hook - 使用 Web Audio API 获取实时麦克风音量和频率数据
 */
export function useAudioAnalyser() {
  const setAudioSamples = useReleaseStore((state) => state.setAudioSamples);
  const [isListening, setIsListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const startListening = useCallback(async () => {
    try {
      // 1. 获取麦克风流
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. 创建 AudioContext
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // 3. 创建 AnalyserNode
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // 产生 32 个频率槽，适合 UI 上的 32 根波形柱
      analyser.smoothingTimeConstant = 0.8;
      
      // 4. 连接节点
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      setIsListening(true);
    } catch (err) {
      console.error('音频分析启动失败:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    setIsListening(false);
    setAudioSamples([]);
    setAmplitude(0);
  }, [setAudioSamples]);

  useEffect(() => {
    if (!isListening || !analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (!isListening) return;

      analyser.getByteFrequencyData(dataArray);

      // 归一化频率数据到 0-1
      const normalizedData = Array.from(dataArray).map(v => v / 255);
      
      // 计算平均振幅 (amplitude)
      const sum = normalizedData.reduce((a, b) => a + b, 0);
      const avg = sum / bufferLength;
      
      setAmplitude(avg);
      setAudioSamples(normalizedData); 

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isListening, setAudioSamples]);

  return { 
    startListening, 
    stopListening,
    isListening,
    amplitude
  };
}
