
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
        case 'ink_bloom':
            if (timestamp - lastTimestamp.current > 60) {
                lastTimestamp.current = timestamp;
                createInkBloomParticle(cursorPos.current.x, cursorPos.current.y);
            }
            break;
        case 'airflow':
             if (timestamp - lastTimestamp.current > 50) {
                lastTimestamp.current = timestamp;
                createAirflowParticle(cursorPos.current.x, cursorPos.current.y, isInteractive);
            }
            break;
        case 'starlight':
            const starlightWrap = document.getElementById('starlight-cursor-wrap');
            if (starlightWrap) {
                starlightWrap.style.left = `${cursorPos.current.x}px`;
                starlightWrap.style.top = `${cursorPos.current.y}px`;
            }
            break;
      }
        
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    
    cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.documentElement.classList.remove('custom-cursor-active');
        document.querySelectorAll('.matrix-cursor-particle, #main-cursor, .ghost-cursor, .ink-bloom-particle, .airflow-particle, .glitch-cursor, #starlight-cursor-wrap').forEach(el => el.remove());
    };
    

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, [style, isInteractive]); // Rerun effect if style changes


  // Effect for creating/destroying DOM elements for cursors
  useEffect(() => {
    // Clean up old elements
    document.querySelectorAll('#main-cursor, .ghost-cursor, #starlight-cursor-wrap, .glitch-cursor').forEach(el => el.remove());
    
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
        case 'ghost':
            for(let i = 0; i < 3; i++) {
                const ghost = document.createElement('div');
                ghost.className = 'ghost-cursor';
                document.body.appendChild(ghost);
            }
            break;
        case 'glitch':
             if (darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = 'glitch-cursor';
                const layer1 = document.createElement('div');
                const layer2 = document.createElement('div');
                layer2.className = 'glitch-layer-2';
                mainCursor.appendChild(layer1);
                mainCursor.appendChild(layer2);
            }
            break;
        case 'starlight':
            if (darkMode) {
                const wrap = document.createElement('div');
                wrap.id = 'starlight-cursor-wrap';
                wrap.className = 'starlight-cursor-wrap';
                const core = document.createElement('div');
                core.className = 'starlight-core';
                wrap.appendChild(core);
                for(let i=0; i<3; i++) {
                    const orb = document.createElement('div');
                    orb.className = 'starlight-orb';
                    wrap.appendChild(orb);
                }
                document.body.appendChild(wrap);
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
const matrixColors = [
    'hsl(260, 60%, 65%)', 'hsl(var(--accent))', '#ff6b6b', '#feca57', 
    'hsl(var(--primary))', '#48dbfb'
];
let matrixColorIndex = 0;

const createMatrixParticle = (x: number, y: number) => {
    if (x === 0 && y === 0) return;
    const particle = document.createElement('span');
    particle.className = 'matrix-cursor-particle';
    particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    
    const color = matrixColors[matrixColorIndex];
    particle.style.color = color;
    particle.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
    matrixColorIndex = (matrixColorIndex + 1) % matrixColors.length;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
};

const pastelColors = ['#f8a5c2', '#9b59b6', '#74b9ff', '#82ccdd', '#f19066'];
let inkColorIndex = 0;
const createInkBloomParticle = (x: number, y: number) => {
    const particle = document.createElement('div');
    particle.className = 'ink-bloom-particle';
    const size = Math.random() * 20 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = pastelColors[inkColorIndex];
    inkColorIndex = (inkColorIndex + 1) % pastelColors.length;
    particle.style.left = `${x + (Math.random() - 0.5) * 20}px`;
    particle.style.top = `${y + (Math.random() - 0.5) * 20}px`;
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
};

const createAirflowParticle = (x: number, y: number, isInteractive: boolean) => {
    const particle = document.createElement('div');
    particle.className = cn('airflow-particle', isInteractive && 'interactive');
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
}


export default MatrixCursor;
