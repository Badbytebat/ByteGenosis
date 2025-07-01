
"use client";

import React, { useEffect, useRef } from 'react';

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
        if (particle.parentElement) {
          particle.remove();
        }
      });
    };

    const createLightCursor = () => {
        const cursorDiv = document.createElement('div');
        cursorDiv.className = 'light-cursor'; // New class for the dark cursor
        document.body.appendChild(cursorDiv);
        return cursorDiv;
    };
    
    let lightModeCursor: HTMLDivElement | null = null;
    if (!darkMode) {
        lightModeCursor = createLightCursor();
    }


    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      if (darkMode) {
        if (!throttleTimeout.current) {
            createDarkParticle(cursorPos.current.x, cursorPos.current.y);
            throttleTimeout.current = setTimeout(() => {
                throttleTimeout.current = null;
            }, 30); // Shorten throttle for a denser trail
        }
      } else if (lightModeCursor) {
          lightModeCursor.style.left = `${cursorPos.current.x}px`;
          lightModeCursor.style.top = `${cursorPos.current.y}px`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
      // Clean up any remaining particles on unmount
      document.querySelectorAll('.matrix-cursor-particle, .light-cursor').forEach(el => el.remove());
    };
  }, [darkMode]);

  return null; // Both modes use DOM manipulation, so this component renders nothing itself.
};

export default MatrixCursor;
