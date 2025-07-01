"use client";

import React, { useState, useEffect } from 'react';

// A set of characters to use for the rain effect
const CHARS = "RITESH01".split('');

type Raindrop = {
  id: number;
  char: string;
  left: string;
  duration: string;
  delay: string;
  fontSize: string;
};

type DigitalRainProps = {
  isActive: boolean;
  count?: number;
};

const DigitalRain: React.FC<DigitalRainProps> = ({ isActive, count = 100 }) => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  useEffect(() => {
    if (isActive) {
      const generateRaindrops = () => {
        return Array.from({ length: count }).map((_, i) => ({
          id: i,
          char: CHARS[Math.floor(Math.random() * CHARS.length)],
          left: `${Math.random() * 100}vw`,
          duration: `${Math.random() * 3 + 2}s`, // 2s to 5s duration
          delay: `${Math.random() * 2}s`, // 0s to 2s delay
          fontSize: `${Math.random() * 1.5 + 0.5}rem`, // 0.5rem to 2rem
        }));
      };
      setRaindrops(generateRaindrops());

      // Clear the raindrops after the animation finishes to remove them from the DOM
      const longestAnimationTime = 5000 + 2000; // max duration + max delay
      const timer = setTimeout(() => {
          setRaindrops([]);
      }, longestAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [isActive, count]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {raindrops.map(drop => (
        <span
          key={drop.id}
          className="digital-rain-character"
          style={{
            left: drop.left,
            fontSize: drop.fontSize,
            animationDuration: drop.duration,
            animationDelay: drop.delay,
          }}
        >
          {drop.char}
        </span>
      ))}
    </div>
  );
};

export default DigitalRain;
