"use client";

import React, { useEffect, useRef } from 'react';

type MatrixCursorProps = {
  darkMode: boolean;
};

const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode }) => {
  const animationFrameId = useRef<number>();
  const lastTimestamp = useRef(0);
  const cursorPos = useRef({ x: 0, y: 0 });


  useEffect(() => {
    // Logic for Dark Mode (Matrix Trail)
    if (darkMode) {
      const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン" +
      "あいうえおかきくけこさしすせそたちつてとなにぬねの" +
      "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ" +
      "أبتثجحخدذرزسشصضطظعغفقكلمنهوي" +
      "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह" +
      "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
      const throttleInterval = 80; // ~12.5fps, a good balance between effect and performance

       // Colors from the miui-glow-text gradient
      const colors = [
        'hsl(260, 60%, 65%)', // accent
        '#ff6b6b',
        '#feca57',
        'hsl(228, 64%, 33%)', // primary
        '#48dbfb',
      ];
      let colorIndex = 0;

      const createDarkParticle = (x: number, y: number) => {
        if (x === 0 && y === 0) return; // Don't draw particle at initial position
        const particle = document.createElement('span');
        particle.className = 'matrix-cursor-particle';
        particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        
        // Cycle through colors and apply them
        const color = colors[colorIndex];
        particle.style.color = color;
        // Also apply the color to the text-shadow for a glow effect
        particle.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        colorIndex = (colorIndex + 1) % colors.length;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
      };

      const handleMouseMove = (e: MouseEvent) => {
        cursorPos.current = { x: e.clientX, y: e.clientY };
      };

      const updateAnimation = (timestamp: number) => {
        if (timestamp - lastTimestamp.current > throttleInterval) {
          lastTimestamp.current = timestamp;
          createDarkParticle(cursorPos.current.x, cursorPos.current.y);
        }
        animationFrameId.current = requestAnimationFrame(updateAnimation);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      // Start the animation loop
      animationFrameId.current = requestAnimationFrame(updateAnimation);

      // Cleanup function specifically for dark mode
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
        document.querySelectorAll('.matrix-cursor-particle').forEach(el => el.remove());
      };

    } 
    // Logic for Light Mode (Inverted Orb)
    else {
      const lightModeCursor = document.createElement('div');
      lightModeCursor.className = 'light-cursor';
      document.body.appendChild(lightModeCursor);
      
      const handleMouseMove = (e: MouseEvent) => {
        lightModeCursor.style.left = `${e.clientX}px`;
        lightModeCursor.style.top = `${e.clientY}px`;
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      // Cleanup function specifically for light mode
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.querySelectorAll('.light-cursor').forEach(el => el.remove());
      };
    }
  }, [darkMode]); // This effect re-runs when `darkMode` changes, cleaning up the old mode and setting up the new one.

  return null; // This component directly manipulates the DOM and renders nothing itself.
};

export default MatrixCursor;
