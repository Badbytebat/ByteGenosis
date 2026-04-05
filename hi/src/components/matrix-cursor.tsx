
"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { CursorStyle } from '@/app/page';
import { closestMatrixCta } from '@/lib/matrix-cursor-cta';

/** Avoid removeChild errors when React portals and cursor cleanup overlap. */
function safeDetach(el: Element) {
  const p = el.parentNode;
  if (!p) return;
  try {
    p.removeChild(el);
  } catch {
    try {
      el.remove();
    } catch {
      /* ignore */
    }
  }
}

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
  /** Smoothed positions for ghost trail (index 0 snaps to cursor). */
  const ghostSmoothedRef = useRef<{ x: number; y: number }[] | null>(null);

  useEffect(() => {
    if (style !== 'ghost') ghostSmoothedRef.current = null;
  }, [style]);

  const cursorStructureKey =
    style === 'none'
      ? 'none'
      : style === 'matrix' || style === 'text'
        ? `${style}|${darkMode}|${isInteractive}`
        : `${style}|${darkMode}`;

  /* Create cursor DOM before the RAF loop runs so #main-cursor always exists on first frame. */
  useEffect(() => {
    document.querySelectorAll('#main-cursor, .ghost-cursor, #starlight-cursor-wrap').forEach((el) => safeDetach(el));

    if (style === 'none') {
      return () => {
        document.querySelectorAll('#main-cursor, .ghost-cursor, #starlight-cursor-wrap').forEach((el) => safeDetach(el));
      };
    }

    let mainCursor: HTMLElement | null = null;

    switch (style) {
      case 'matrix':
        if (isInteractive) {
          mainCursor = document.createElement('span');
          mainCursor.className = 'cursor-text-label';
          mainCursor.textContent = cursorText || '·';
          mainCursor.style.setProperty('--cursor-glow-color', color);
        } else if (!darkMode) {
          mainCursor = document.createElement('div');
          mainCursor.className = 'light-cursor';
        }
        /* Dark + not on CTA: matrix trail only — no center dot. */
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
        for (let i = 0; i < 3; i++) {
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
          for (let i = 0; i < 3; i++) {
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

    return () => {
      document.querySelectorAll('#main-cursor, .ghost-cursor, #starlight-cursor-wrap').forEach((el) => safeDetach(el));
    };
  }, [cursorStructureKey]);

  useEffect(() => {
    if (style === 'none') return;
    const el = document.getElementById('main-cursor');
    if (!el?.classList.contains('cursor-text-label')) return;

    if (style === 'matrix' && isInteractive) {
      el.textContent = cursorText || '·';
      el.style.setProperty('--cursor-glow-color', color);
      return;
    }

    if (style === 'text' && isInteractive && cursorText) {
      el.textContent = cursorText;
      el.style.setProperty('--cursor-glow-color', color);
    }
  }, [cursorText, color, style, isInteractive]);

  useEffect(() => {
    let cleanup = () => {};

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
      const target = e.target as HTMLElement;
      const interactive =
        style === 'matrix' || style === 'text'
          ? !!closestMatrixCta(target)
          : isInteractiveElement(target);
      isInteractiveRef.current = interactive;
      setIsInteractive((prev) => (prev === interactive ? prev : interactive));
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
    };
    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    {
      const under = document.elementFromPoint(cursorPos.current.x, cursorPos.current.y) as HTMLElement | null;
      const initial =
        style === 'matrix' || style === 'text' ? !!closestMatrixCta(under) : isInteractiveElement(under);
      setIsInteractive(initial);
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    if (style === 'none') {
      document.documentElement.classList.remove('custom-cursor-active');
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }

    document.documentElement.classList.add('custom-cursor-active');

    const animate = (timestamp: number) => {
      const mainCursorEl = document.getElementById('main-cursor');
      if (mainCursorEl) {
        mainCursorEl.style.left = `${cursorPos.current.x}px`;
        mainCursorEl.style.top = `${cursorPos.current.y}px`;
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

      switch (style) {
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
          const n = ghostCursors.length;
          if (n === 0) break;
          const { x, y } = cursorPos.current;
          let smooth = ghostSmoothedRef.current;
          if (!smooth || smooth.length !== n) {
            smooth = Array.from({ length: n }, () => ({ x, y }));
            ghostSmoothedRef.current = smooth;
          }
          const lag = 0.34;
          ghostCursors.forEach((cursor, index) => {
            const el = cursor as HTMLElement;
            const tx = x - index * 8;
            const ty = y - index * 5;
            if (index === 0) {
              smooth![0].x = tx;
              smooth![0].y = ty;
            } else {
              smooth![index].x += (tx - smooth![index].x) * lag;
              smooth![index].y += (ty - smooth![index].y) * lag;
            }
            el.style.left = `${smooth![index].x}px`;
            el.style.top = `${smooth![index].y}px`;
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
        case 'starlight': {
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
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    cleanup = () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      document.documentElement.classList.remove('custom-cursor-active');
      document
        .querySelectorAll('.matrix-cursor-particle, .ink-bloom-particle, .aurora-particle, .circuit-pulse-particle')
        .forEach((el) => safeDetach(el));
    };

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cleanup();
    };
  }, [style, reduceMotion]);

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
    particle.addEventListener('animationend', () => safeDetach(particle));
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
    particle.addEventListener('animationend', () => safeDetach(particle));
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
    particle.addEventListener('animationend', () => safeDetach(particle));
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
    particle.addEventListener('animationend', () => safeDetach(particle));
}


export default MatrixCursor;
