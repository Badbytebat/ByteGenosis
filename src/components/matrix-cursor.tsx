
"use client";

import React, { useEffect, useRef } from 'react';

const MatrixCursor = () => {
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);
  // Katakana characters for a more authentic Matrix feel
  const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

  useEffect(() => {
    const createParticle = (x: number, y: number) => {
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
        const { clientX, clientY } = e;
        if (!throttleTimeout.current) {
            createParticle(clientX, clientY);
            throttleTimeout.current = setTimeout(() => {
                throttleTimeout.current = null;
            }, 30); // Shorten throttle for a denser trail
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
      // Clean up any remaining particles on unmount
      document.querySelectorAll('.matrix-cursor-particle').forEach(el => el.remove());
    };
  }, []);

  return null; // This component only handles DOM manipulation, it doesn't render anything itself
};

export default MatrixCursor;
