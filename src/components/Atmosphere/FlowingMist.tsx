import React from 'react';
import { motion } from 'motion/react';

/**
 * 模拟山间流动的雾气/水带层
 */
export default function FlowingMist() {
  const mists = [
    { top: '30%', delay: 0, duration: 45, height: '180px', color: 'bg-emerald-100/15' },
    { top: '50%', delay: -10, duration: 55, height: '240px', color: 'bg-white/10' },
    { top: '70%', delay: -25, duration: 50, height: '200px', color: 'bg-emerald-50/20' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {mists.map((mist, i) => (
        <div
          key={i}
          className={`absolute w-[300%] blur-[120px] rounded-[100%] animate-fog ${mist.color}`}
          style={{
            top: mist.top,
            height: mist.height,
            left: '-100%',
            animationDuration: `${mist.duration}s`,
            animationDelay: `${mist.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
