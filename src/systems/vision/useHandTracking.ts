import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useReleaseStore } from '../../store/useReleaseStore';

/**
 * 手势识别 Hook - 使用 MediaPipe HandLandmarker
 */
export function useHandTracking() {
  const [isHandReady, setIsHandReady] = useState(false);
  const [gestures, setGestures] = useState({
    fingerCount: 0,
    palmsTogether: false,
    pushGesture: false,
    tearGesture: false,
    scatterGesture: false,
    holdSteady: true
  });

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const rafRef = useRef<number | null>(null);

  // 用于手势判断的状态记录
  const lastCoordsRef = useRef<{ x: number; y: number; z: number }[]>([]);
  const lastVelocityRef = useRef<number>(0);

  // 初始化 HandLandmarker
  useEffect(() => {
    async function setupLandmarker() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 2
      });
      landmarkerRef.current = handLandmarker;
      setIsHandReady(true);
    }
    setupLandmarker();

    return () => {
      landmarkerRef.current?.close();
    };
  }, []);

  // 检测循环
  const predictLoop = useCallback(() => {
    if (!videoRef.current || !landmarkerRef.current) return;

    const startTimeMs = performance.now();
    if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = videoRef.current.currentTime;
      
      const result = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

      if (result.landmarks && result.landmarks.length > 0) {
        // --- 1. 手指数量判断 (基于指尖与指根纵向距离，简单算法) ---
        // 指尖索引: 4(拇指), 8(食指), 12(中指), 16(无名指), 20(小指)
        let totalFingers = 0;
        result.landmarks.forEach(hand => {
          // 食指及以后：如果指尖 y 坐标显著小于指根 y (y轴向下)
          [8, 12, 16, 20].forEach(tip => {
            if (hand[tip].y < hand[tip - 2].y) totalFingers++;
          });
          // 拇指：侧向距离 (简化处理)
          if (Math.abs(hand[4].x - hand[2].x) > 0.05) totalFingers++;
        });

        // --- 2. 双手合十 palmsTogether (基于两手食指根部或中心距离) ---
        let palmsTogether = false;
        if (result.landmarks.length >= 2) {
          const hand1 = result.landmarks[0][0]; // 腕部
          const hand2 = result.landmarks[1][0];
          const dist = Math.sqrt(Math.pow(hand1.x - hand2.x, 2) + Math.pow(hand1.y - hand2.y, 2));
          if (dist < 0.15) palmsTogether = true;
        }

        // --- 3. 动态手势辅助数据 (取第一只手的中心) ---
        const currentCenter = result.landmarks[0][0];
        const lastCenter = lastCoordsRef.current[0] || currentCenter;
        
        const dx = currentCenter.x - lastCenter.x;
        const dy = currentCenter.y - lastCenter.y;
        const dz = currentCenter.z - lastCenter.z;
        const velocity = Math.sqrt(dx*dx + dy*dy + dz*dz);

        // --- 4. 具体动作判断 ---
        // Push: Z轴向镜头靠近 (z减小) 且速度较快
        const pushGesture = dz < -0.05 && velocity > 0.03;
        
        // Scatter: X轴水平漂移
        const scatterGesture = Math.abs(dx) > 0.1 && velocity > 0.08;

        // Hold Steady: 速度很低
        const holdSteady = velocity < 0.01;

        // Tear: 左右手 X 距离拉大
        let tearGesture = false;
        if (result.landmarks.length >= 2) {
          const dx_hands = Math.abs(result.landmarks[0][0].x - result.landmarks[1][0].x);
          const last_dx_hands = lastCoordsRef.current.length >= 2 
            ? Math.abs(lastCoordsRef.current[0].x - lastCoordsRef.current[1].x)
            : dx_hands;
          if (dx_hands - last_dx_hands > 0.05) tearGesture = true;
        }

        setGestures({
          fingerCount: Math.min(totalFingers, 10),
          palmsTogether,
          pushGesture,
          tearGesture,
          scatterGesture,
          holdSteady
        });

        // 更新历史记录
        lastCoordsRef.current = result.landmarks.map(h => h[0]);
        lastVelocityRef.current = velocity;
      } else {
        // 未发现手
        setGestures(prev => ({ ...prev, holdSteady: true }));
      }
    }

    rafRef.current = requestAnimationFrame(predictLoop);
  }, []);

  const startTracking = useCallback(async (videoElement: HTMLVideoElement) => {
    videoRef.current = videoElement;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(predictLoop);
  }, [predictLoop]);

  const stopTracking = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    videoRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    isHandReady,
    gestures,
    startTracking,
    stopTracking
  };
}
