
"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { CursorStyle } from '@/app/page';

type MatrixCursorProps = {
  darkMode: boolean;
  cursorText: string;
  color: string;
  style: CursorStyle;
  /** When true, skip particle spam (accessibility). */
  reduceMotion?: boolean;
};

const isInteractiveElement = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  const clickableTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
  const isClickable = clickableTags.includes(element.tagName) || (element.onclick !== null) || (element.style.cursor === 'pointer');
  return isClickable || isInteractiveElement(element.parentElement);
};


const MatrixCursor: React.FC<MatrixCursorProps> = ({
  darkMode,
  cursorText,
  color,
  style,
  reduceMotion = false,
}) => {
  const animationFrameId = useRef<number>();
  /** Throttle spawns per effect — do not share one timestamp across styles. */
  const lastMatrixSpawn = useRef(0);
  const lastInkSpawn = useRef(0);
  const lastAuroraSpawn = useRef(0);
  const lastCircuitSpawn = useRef(0);
  const cursorPos = useRef({ x: 0, y: 0 });
  /** Ref avoids restarting the RAF loop on every hover (was causing jank). */
  const isInteractiveRef = useRef(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const isMouseDown = useRef(false);

  useEffect(() => {
    let cleanup = () => {};

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      const interactive = isInteractiveElement(e.target as HTMLElement);
      isInteractiveRef.current = interactive;
      setIsInteractive(interactive);
    };

    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };
    
    // Set initial state
    setIsInteractive(isInteractiveElement(document.elementFromPoint(cursorPos.current.x, cursorPos.current.y) as HTMLElement));


    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

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
        /* Light-mode (and matrix fallback) dots: hover / click feedback without remounting DOM. */
        const tag = mainCursorEl.tagName;
        if (tag === 'DIV') {
          mainCursorEl.classList.toggle('interactive', isInteractiveRef.current);
          mainCursorEl.classList.toggle('cursor-pressed', isMouseDown.current);
        }
        if (tag === 'SPAN' && mainCursorEl.classList.contains('cursor-text-label')) {
          mainCursorEl.classList.toggle('interactive', isInteractiveRef.current);
          mainCursorEl.classList.toggle('cursor-pressed', isMouseDown.current);
        }
      }

      // Style-specific animations
      switch(style) {
          case 'matrix':
              if (
                !reduceMotion &&
                !isInteractiveRef.current &&
                timestamp - lastMatrixSpawn.current > 80
              ) {
                  lastMatrixSpawn.current = timestamp;
                  createMatrixParticle(cursorPos.current.x, cursorPos.current.y);
              }
              break;
          case 'ghost': {
            const ghostCursors = document.querySelectorAll('.ghost-cursor');
            const { x, y } = cursorPos.current;
            ghostCursors.forEach((cursor, index) => {
                const el = cursor as HTMLElement;
                el.style.left = `${x - index * 5}px`;
                el.style.top = `${y - index * 5}px`;
            });
            break;
          }
        case 'ink_bloom':
            if (!reduceMotion && timestamp - lastInkSpawn.current > 60) {
                lastInkSpawn.current = timestamp;
                createInkBloomParticle(cursorPos.current.x, cursorPos.current.y);
            }
            break;
        case 'aurora':
             if (!reduceMotion && timestamp - lastAuroraSpawn.current > 50) {
                lastAuroraSpawn.current = timestamp;
                createAuroraParticle(cursorPos.current.x, cursorPos.current.y, isMouseDown.current);
            }
            break;
        case 'circuit_pulse':
             if (timestamp - lastCircuitSpawn.current > 100) {
                lastCircuitSpawn.current = timestamp;
                createCircuitPulseParticle(cursorPos.current.x, cursorPos.current.y, isMouseDown.current);
            }
            break;
        case 'starlight':
            const starlightWrap = document.getElementById('starlight-cursor-wrap');
            if (starlightWrap) {
                starlightWrap.style.left = `${cursorPos.current.x}px`;
                starlightWrap.style.top = `${cursorPos.current.y}px`;
                if (isMouseDown.current) {
                    starlightWrap.classList.add('clicked');
                } else {
                    starlightWrap.classList.remove('clicked');
                }
            }
            break;
      }
        
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
    
    cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.documentElement.classList.remove('custom-cursor-active');
        document.querySelectorAll('.matrix-cursor-particle, #main-cursor, .ghost-cursor, .ink-bloom-particle, .aurora-particle, .circuit-pulse-particle, #starlight-cursor-wrap').forEach(el => el.remove());
    };
    

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanup();
    };
  }, [style, reduceMotion]);


  // Effect for creating/destroying DOM elements for cursors
  useEffect(() => {
    // Clean up old elements
    document.querySelectorAll('#main-cursor, .ghost-cursor, #starlight-cursor-wrap').forEach(el => el.remove());
    
    if (style === 'none') return;
    
    let mainCursor: HTMLElement | null = null;
    
    // Create elements based on style
    switch(style) {
        case 'matrix':
            if (isInteractive) {
                mainCursor = document.createElement('span');
                mainCursor.className = 'cursor-text-label';
                mainCursor.textContent = cursorText || '·';
                mainCursor.style.setProperty('--cursor-glow-color', color);
            } else if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = 'light-cursor';
            } else {
                mainCursor = document.createElement('div');
                mainCursor.className = 'matrix-fallback-dot';
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
                mainCursor.className = 'jello-cursor';
            }
            break;
        case 'underline':
             if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.className = 'underline-cursor';
            }
            break;
        case 'ghost':
            for(let i = 0; i < 3; i++) {
                const ghost = document.createElement('div');
                ghost.className = 'ghost-cursor';
                document.body.appendChild(ghost);
            }
            break;
        case 'aurora':
             if (!darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.id = 'aurora-cursor-base';
            }
            break;
        case 'circuit_pulse':
            if (darkMode) {
                mainCursor = document.createElement('div');
                mainCursor.id = 'circuit-pulse-base';
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

const auroraGradients = [
    'linear-gradient(45deg, #fbc2eb, #a6c1ee)',
    'linear-gradient(45deg, #fdcbf1, #e6dee9)',
    'linear-gradient(45deg, #a1c4fd, #c2e9fb)',
];
let auroraColorIndex = 0;
const createAuroraParticle = (x: number, y: number, isClicked: boolean) => {
    const particle = document.createElement('div');
    particle.className = 'aurora-particle';
    const size = Math.random() * 15 + 8;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Cycle through gradients
    if (Math.random() > 0.9) {
      auroraColorIndex = (auroraColorIndex + 1) % auroraGradients.length;
    }
    particle.style.background = auroraGradients[auroraColorIndex];
    particle.style.opacity = isClicked ? '1' : '0.7';

    particle.style.left = `${x + (Math.random() - 0.5) * 30}px`;
    particle.style.top = `${y + (Math.random() - 0.5) * 30}px`;
    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
};

const createCircuitPulseParticle = (x: number, y: number, isClicked: boolean) => {
    const particle = document.createElement('div');
    particle.className = 'circuit-pulse-particle';
    const size = isClicked ? Math.random() * 50 + 40 : Math.random() * 30 + 20;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    if(isClicked) {
        particle.style.animationDuration = '0.5s';
        particle.style.borderColor = '#99ffff';
    }

    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
}


export default MatrixCursor;
