
"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type MatrixCursorProps = {
  darkMode: boolean;
};

const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode }) => {
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  const cursorPos = useRef({ x: 0, y: 0 });

  // Katakana characters for a more authentic Matrix feel
  const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

  useEffect(() => {
    const createDarkParticle = (x: number, y: number) => {
      const particle = document.createElement('span'); // Use span for text
      particle.className = 'matrix-cursor-particle';
      particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      document.body.appendChild(particle);

      particle.addEventListener('animationend', () => {
        particle.remove();
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      if (darkMode) {
        if (!throttleTimeout.current) {
            createDarkParticle(cursorPos.current.x, cursorPos.current.y);
            throttleTimeout.current = setTimeout(() => {
                throttleTimeout.current = null;
            }, 30); // Shorten throttle for a denser trail
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
      // Clean up any remaining particles on unmount
      document.querySelectorAll('.matrix-cursor-particle, .cursor-glow').forEach(el => el.remove());
    };
  }, [darkMode]);

  if (darkMode) {
    return null; // Dark mode uses DOM manipulation for the trail
  }

  // Light mode uses a simple div for the glow
  return <div className="cursor-glow" style={{ left: `${cursorPos.current.x}px`, top: `${cursorPos.current.y}px` }} />;
};

export default MatrixCursor;
