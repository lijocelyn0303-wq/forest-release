import { useEffect } from 'react';
import { useReleaseStore } from '../../store/useReleaseStore';

/**
 * 模拟手势识别 Hook
 * 实际上目前用快捷键或模拟状态触发
 */
export function useHandGestureMock() {
  const setGesture = useReleaseStore((state) => state.setGesture);

  useEffect(() => {
    // 监听键盘按键来模拟手势
    // O -> Open Palm (打开手掌)
    // C -> Clenched Fist (握拳)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'o') setGesture('open_palm');
      if (e.key.toLowerCase() === 'c') setGesture('clenched_fist');
      if (e.key.toLowerCase() === 'n') setGesture('none');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setGesture]);

  return null;
}
