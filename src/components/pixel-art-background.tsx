'use client';

import { cn } from '@/lib/utils';
import { useMemo } from 'react';

type PixelArtBackgroundProps = {
    darkMode: boolean;
};

const PixelArtBackground: React.FC<PixelArtBackgroundProps> = ({ darkMode }) => {
  // useMemo ensures that the random values are generated only once per component mount
  const { stars, birds, clouds } = useMemo(() => {
    const starCount = Math.floor(Math.random() * 15) + 15; // Random number of stars (15-29)
    const stars = Array.from({ length: starCount }, (_, i) => ({
      id: `star-${i}`,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 2 + 2}s`, // Speed is already random
      }
    }));

    const birdCount = Math.floor(Math.random() * 3) + 2; // Random number of birds (2-4)
    const birds = Array.from({ length: birdCount }, (_, i) => ({
        id: `bird-${i}`,
        style: {
          top: `${10 + Math.random() * 20}%`,
          animationDelay: `${i * 4 + Math.random() * 2}s`,
          animationDuration: `${Math.random() * 8 + 8}s`, // Random speed (8s-16s)
        }
    }));
    
    const cloudCount = Math.floor(Math.random() * 4) + 3; // Random number of clouds (3-6)
    const clouds = Array.from({ length: cloudCount }, (_, i) => ({
      id: `cloud-${i}`,
      style: {
        top: `${15 + Math.random() * 30}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${i * 5 + Math.random() * 4}s`,
        animationDuration: `${Math.random() * 20 + 20}s`, // Random speed (20s-40s)
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
