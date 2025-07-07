'use client';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type PixelArtBackgroundProps = {
    darkMode: boolean;
};

const PixelArtBackground: React.FC<PixelArtBackgroundProps> = ({ darkMode }) => {
  // useMemo ensures that the random values are generated only once per component mount
  const { stars, birds, clouds } = useMemo(() => {
    // Star randomization
    const starCount = Math.floor(Math.random() * 40) + 45; // 45-84 stars
    const starColors = ['white', '#FFFFE0', '#F5F5DC']; // White, LightYellow, Beige
    
    const stars = Array.from({ length: starCount }, (_, i) => {
        const size = Math.random() * 2 + 2; // size between 2px and 4px
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        return {
          id: `star-${i}`,
          style: {
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            boxShadow: `0 0 ${size + 2}px ${color}`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 3 + 2}s`, // 2s to 5s
          }
        }
    });

    const birdCount = Math.floor(Math.random() * 3) + 2; // Random number of birds (2-4)
    const birds = Array.from({ length: birdCount }, (_, i) => ({
        id: `bird-${i}`,
        style: {
          top: `${10 + Math.random() * 20}%`,
          animationDelay: `${i * 4 + Math.random() * 2}s`,
          animationDuration: `${Math.random() * 10 + 10}s`, // Random speed (10s-20s)
        }
    }));
    
    const cloudCount = Math.floor(Math.random() * 5) + 3; // Random number of clouds (3-7)
    const clouds = Array.from({ length: cloudCount }, (_, i) => ({
      id: `cloud-${i}`,
      style: {
        top: `${15 + Math.random() * 30}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${i * 5 + Math.random() * 4}s`,
        animationDuration: `${Math.random() * 25 + 25}s`, // Random speed (25s-50s)
      }
    }));

    return { stars, birds, clouds };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {darkMode && stars.map(star => (
        <div key={star.id} className="pixel-star" style={star.style} />
      ))}
      
      {birds.map(bird => (
         <div key={bird.id} className="pixel-bird" style={bird.style} />
      ))}

      {clouds.map(cloud => (
        <div key={cloud.id} className={cn("pixel-cloud", darkMode ? "opacity-30" : "opacity-60")} style={cloud.style} />
      ))}
    </div>
  );
};

export default PixelArtBackground;
