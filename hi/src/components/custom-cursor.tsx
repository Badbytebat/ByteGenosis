"use client";

import React, { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div
      className="fixed w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white opacity-70"
      style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px`, transform: 'translate(-50%, -50%)' }}
    ></div>
  );
};

export default CustomCursor;
