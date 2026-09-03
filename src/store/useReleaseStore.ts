import { create } from 'zustand';

/**
 * 情绪释放室的状态机阶段
 */
export enum ReleaseStage {
  ENTRANCE = 'ENTRANCE',                   // 森林入口
  EMOTION_SELECTION = 'EMOTION_SELECTION', // 情绪选择
  VENTING = 'VENTING',                     // 压力倾诉
  CONDENSATION = 'CONDENSATION',         // 压力球生成
  CORE_RELEASE = 'CORE_RELEASE',           // 核心释放阶段
  REFLECTION = 'REFLECTION',               // 语音反思
  REPORT = 'REPORT',                       // 情绪释放报告
}

/**
 * 情绪类型定义
 */
export type EmotionType = 'anxiety' | 'anger' | 'sadness' | 'suppression' | 'exhaustion' | 'none';

interface ReleaseStore {
  // 核心状态
  stage: ReleaseStage;
  emotion: EmotionType;
  intensity: number; // 强度 1-5
  
  // 交互内容
  transcript: string;     // 倾诉文字
  interimTranscript: string; // 实时识别中的文字
  sentences: string[];    // 倾诉的每一句话
  reflection: string;     // 反思文字
  audioSamples: number[]; // 音频波形数据
  
  // 交互控制
  releaseStep: number;    // 释放进度 0-100
  releaseMicroStep: number; // 释放阶段的小步骤 0-4
  gesture: string;        // 当前识别到的手势 (e.g., 'open_palm', 'clenched_fist')
  hasPermission: boolean; // 麦克风/摄像头授权状态

  // 动作方法
  setStage: (stage: ReleaseStage) => void;
  setEmotion: (emotion: EmotionType) => void;
  setIntensity: (intensity: number) => void;
  setTranscript: (text: string | ((prev: string) => string)) => void;
  setInterimTranscript: (text: string) => void;
  setSentences: (updater: string[] | ((prev: string[]) => string[])) => void;
  setReflection: (text: string | ((prev: string) => string)) => void;
  setAudioSamples: (samples: number[]) => void;
  setReleaseStep: (step: number | ((prev: number) => number)) => void;
  setReleaseMicroStep: (step: number) => void;
  setGesture: (gesture: string) => void;
  setHasPermission: (status: boolean) => void;
  
  // 重置
  reset: () => void;
}

export const useReleaseStore = create<ReleaseStore>((set) => ({
  stage: ReleaseStage.ENTRANCE,
  emotion: 'none',
  intensity: 3,
  transcript: '',
  interimTranscript: '',
  sentences: [],
  reflection: '',
  audioSamples: [],
  releaseStep: 0,
  releaseMicroStep: 0,
  gesture: 'none',
  hasPermission: false,

  setStage: (stage) => set({ stage }),
  setEmotion: (emotion) => set({ emotion }),
  setIntensity: (intensity) => set({ intensity }),
  setTranscript: (textOrFn) => set((state) => ({ 
    transcript: typeof textOrFn === 'function' ? textOrFn(state.transcript) : textOrFn 
  })),
  setInterimTranscript: (text) => set({ interimTranscript: text }),
  setSentences: (updater) => set((state) => ({ 
    sentences: typeof updater === 'function' ? updater(state.sentences) : updater 
  })),
  setReflection: (textOrFn) => set((state) => ({ 
    reflection: typeof textOrFn === 'function' ? textOrFn(state.reflection) : textOrFn 
  })),
  setAudioSamples: (samples) => set({ audioSamples: samples }),
  setReleaseStep: (stepOrFn) => set((state) => ({ 
    releaseStep: typeof stepOrFn === 'function' ? stepOrFn(state.releaseStep) : stepOrFn 
  })),
  setReleaseMicroStep: (step) => set({ releaseMicroStep: step }),
  setGesture: (gesture) => set({ gesture }),
  setHasPermission: (status) => set({ hasPermission: status }),

  reset: () => set({
    stage: ReleaseStage.ENTRANCE,
    emotion: 'none',
    intensity: 3,
    transcript: '',
    interimTranscript: '',
    sentences: [],
    reflection: '',
    audioSamples: [],
    releaseStep: 0,
    releaseMicroStep: 0,
    gesture: 'none',
  }),
}));
