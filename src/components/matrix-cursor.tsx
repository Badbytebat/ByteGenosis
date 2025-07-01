
"use client";

import React, { useEffect, useRef } from 'react';

const MatrixCursor = () => {
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.className = 'matrix-bit';
      particle.textContent = Math.random() > 0.5 ? '1' : '0';
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
            }, 30); // Throttle to every 30ms
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, []);

  return null; // This component only handles DOM manipulation, it doesn't render anything itself
};

export default MatrixCursor;
