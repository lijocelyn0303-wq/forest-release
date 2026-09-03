import React from 'react';
import CanvasScene from '../components/CanvasScene';
import DomOverlay from '../components/DomOverlay';
import BackgroundLayers from '../components/Atmosphere/BackgroundLayers';

/**
 * Forest Release - 森林情绪释放室
 * 沉浸式网页艺术疗愈系统入口
 */
export default function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f3fff7]">
      {/* 0. Background at bottom */}
      <div className="absolute inset-0 z-0">
        <BackgroundLayers />
      </div>

      {/* 1. 3D in middle */}
      <div className="absolute inset-0 z-10 pointer-events-auto">
        <CanvasScene />
      </div>

      {/* 2. UI at top */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <DomOverlay />
      </div>
    </div>
  );
}
