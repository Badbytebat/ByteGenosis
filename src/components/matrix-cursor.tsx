
"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { CursorStyle } from '@/app/page';
import { cn } from '@/lib/utils';

type MatrixCursorProps = {
  darkMode: boolean;
  cursorText: string;
  color: string;
  style: CursorStyle;
};

const isInteractiveElement = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  const clickableTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
  const isClickable = clickableTags.includes(element.tagName) || (element.onclick !== null) || (element.style.cursor === 'pointer');
  return isClickable || isInteractiveElement(element.parentElement);
};


const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode, cursorText, color, style }) => {
  const animationFrameId = useRef<number>();
  const lastTimestamp = useRef(0);
  const cursorPos = useRef({ x: 0, y: 0 });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    let cleanup = () => {};

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      setIsInteractive(isInteractiveElement(e.target as HTMLElement));
    };
    
    // Set initial state
    setIsInteractive(isInteractiveElement(document.elementFromPoint(cursorPos.current.x, cursorPos.current.y) as HTMLElement));


    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Activate custom cursor if not in edit mode and a style is selected
    if (style !== 'none') {
        document.documentElement.classList.add('custom-cursor-active');
    } else {
        document.documentElement.classList.remove('custom-cursor-active');
        return;
    }

    const animate = (timestamp: number) => {
      // General cursor position update
      const mainCursorEl = document.getElementById('main-cursor');
      if (mainCursorEl) {
        mainCursorEl.style.left = `${cursorPos.current.x}px`;
        mainCursorEl.style.top = `${cursorPos.current.y}px`;
      }
      
      // Style-specific animations
      switch(style) {
          case 'spotlight':
            const spotlight = document.getElementById('spotlight-overlay');
            if (spotlight) {
                spotlight.style.setProperty('--x', `${cursorPos.current.x}px`);
                spotlight.style.setProperty('--y', `${cursorPos.current.y}px`);
            }
            break;
          case 'matrix':
              if (timestamp - lastTimestamp.current > 80 && !isInteractive) {
                  lastTimestamp.current = timestamp;
                  createMatrixParticle(cursorPos.current.x, cursorPos.current.y);
              }
              break;
          case 'ghost':
            const ghostCursors = document.querySelectorAll('.ghost-cursor');
            ghostCursors.forEach((cursor, index) => {
                const typedCursor = cursor as HTMLElement;
                setTimeout(() => {
                     typedCursor.style.left = `${cursorPos.current.x}px`;
                     typedCursor.style.top = `${cursorPos.current.y}px`;
                }, index * 20)
            });
            break;
      }
        
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    
    cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.documentElement.classList.remove('custom-cursor-active');
        document.querySelectorAll('.matrix-cursor-particle, #main-cursor, #spotlight-overlay, .ghost-cursor').forEach(el => el.remove());
    };
    

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, [style, isInteractive]); // Rerun effect if style changes


  // Effect for creating/destroying DOM elements for cursors
  useEffect(() => {
    // Clean up old elements
    document.querySelectorAll('#main-cursor, #spotlight-overlay, .ghost-cursor').forEach(el => el.remove());
    
    if (style === 'none') return;
    
    let mainCursor: HTMLElement | null = null;
    
    // Create elements based on style
    switch(style) {
        case 'matrix':
            if (isInteractive && cursorText) {
                mainCursor = document.createElement('span');
                mainCursor.className = 'cursor-text-label';
                mainCursor.textContent = cursorText;
                mainCursor.style.setProperty('--cursor-glow-color', color);
            }
            break;
        case 'text':
            mainCursor = document.createElement('span');
            mainCursor.className = 'cursor-text-label';
            if (isInteractive && cursorText) {
                mainCursor.textContent = cursorText;
                mainCursor.style.setProperty('--cursor-glow-color', color);
            }
            break;
        case 'orb':
            if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = 'light-cursor';
            }
            break;
        case 'jello':
             if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = cn('jello-cursor', isInteractive && 'interactive');
            }
            break;
        case 'underline':
             if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = cn('underline-cursor', isInteractive && 'interactive');
            }
            break;
        case 'spotlight':
            const spotlight = document.createElement('div');
            spotlight.id = 'spotlight-overlay';
            spotlight.className = cn('spotlight-overlay', darkMode ? 'dark' : 'light');
            document.body.appendChild(spotlight);
            break;
        case 'ghost':
            if (darkMode) {
                for(let i = 0; i < 3; i++) {
                    const ghost = document.createElement('div');
                    ghost.className = 'ghost-cursor';
                    document.body.appendChild(ghost);
                }
            }
            break;
    }
    
    if (mainCursor) {
        mainCursor.id = 'main-cursor';
        document.body.appendChild(mainCursor);
    }
    
  }, [style, darkMode, isInteractive, cursorText, color])

  return null;
};

const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
const colors = [
    'hsl(260, 60%, 65%)', 'hsl(var(--accent))', '#ff6b6b', '#feca57', 
    'hsl(var(--primary))', '#48dbfb'
];
let colorIndex = 0;

const createMatrixParticle = (x: number, y: number) => {
    if (x === 0 && y === 0) return;
    const particle = document.createElement('span');
    particle.className = 'matrix-cursor-particle';
    particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    
    const color = colors[colorIndex];
    particle.style.color = color;
    particle.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    colorIndex = (colorIndex + 1) % colors.length;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
};


export default MatrixCursor;
