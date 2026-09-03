import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useReleaseStore, ReleaseStage } from '../store/useReleaseStore';
import Entrance from '../phases/Entrance';
import EmotionSelection from '../phases/EmotionSelection';
import Venting from '../phases/Venting';
import Condensation from '../phases/Condensation';
import CoreRelease from '../phases/CoreRelease';
import Reflection from '../phases/Reflection';
import Report from '../phases/Report';

export default function DomOverlay() {
  const stage = useReleaseStore((state) => state.stage);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <AnimatePresence mode="wait">
        <div key={stage} className="flex flex-col items-center justify-center w-full h-full pointer-events-none">
          {stage === ReleaseStage.ENTRANCE && <Entrance />}
          {stage === ReleaseStage.EMOTION_SELECTION && <EmotionSelection />}
          {stage === ReleaseStage.VENTING && <Venting />}
          {stage === ReleaseStage.CONDENSATION && <Condensation />}
          {stage === ReleaseStage.CORE_RELEASE && <CoreRelease />}
          {stage === ReleaseStage.REFLECTION && <Reflection />}
          {stage === ReleaseStage.REPORT && <Report />}
        </div>
      </AnimatePresence>

      {/* 全局装饰 */}
      <div className="absolute top-8 left-8 pointer-events-none opacity-40 hidden md:block">
        <div className="text-[10px] tracking-widest text-emerald-900/50">
          FOREST RELEASE / HEALING SPACE
        </div>
      </div>
    </div>
  );
}
