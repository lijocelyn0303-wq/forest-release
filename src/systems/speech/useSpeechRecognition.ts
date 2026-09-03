import { useState, useCallback, useRef, useEffect } from 'react';
import { useReleaseStore } from '../../store/useReleaseStore';

// 扩展 Window 接口以处理 Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * 实时语言识别 Hook
 * 使用原生 Web Speech API
 */
export function useSpeechRecognition() {
  const setTranscript = useReleaseStore((state) => state.setTranscript);
  const setInterimTranscript = useReleaseStore((state) => state.setInterimTranscript);
  const setReflection = useReleaseStore((state) => state.setReflection);
  const setSentences = useReleaseStore((state) => state.setSentences);
  const stage = useReleaseStore((state) => state.stage);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn('请使用 Chrome 浏览器体验语音识别');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalBatch = '';
      let interimBatch = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalBatch += event.results[i][0].transcript;
        } else {
          interimBatch += event.results[i][0].transcript;
        }
      }
      
      setInterimTranscript(interimBatch);
      
      if (finalBatch) {
        if (stage === 'REFLECTION') {
          setReflection((prev) => prev + finalBatch);
        } else {
          setTranscript((prev) => prev + finalBatch);
          setSentences((prev) => [...prev, finalBatch]);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        alert('无法访问麦克风，请检查浏览器权限设置');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [setTranscript]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      alert('请使用 Chrome 浏览器体验语音识别');
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Speech recognition start error:', err);
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { 
    isListening, 
    startListening, 
    stopListening, 
    isSupported 
  };
}
