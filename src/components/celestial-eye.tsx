'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type CelestialEyeProps = {
  darkMode: boolean;
};

const CelestialEye: React.FC<CelestialEyeProps> = ({ darkMode }) => {
  const pupilsRef = useRef<NodeListOf<HTMLDivElement> | null>(null);

  useEffect(() => {
    pupilsRef.current = document.querySelectorAll('.pupil');
    
    const handleMouseMove = (e: MouseEvent) => {
        if (!pupilsRef.current) return;

        pupilsRef.current.forEach((pupil) => {
            const eyeContainer = pupil.parentElement;
            if (!eyeContainer) return;

            const rect = eyeContainer.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            const angle = Math.atan2(y, x);
            
            // We rotate the pupil itself, but the pupil is just a dot.
            // To make it look like it's moving, we need to rotate its container
            // or use transform translate. Let's adjust the pupil's container.
            // A simpler approach is to rotate an invisible line/handle that the pupil is attached to.
            // For now, simple rotation will just spin it in place. Let's stick with the prompt's simplicity.
            // The prompt says `eye.style.transform = rotate...` which implies the pupil.
            // A better visual effect would be `transform: translate(x,y)` within the eyeball bounds.
            // Let's stick to the prompt's implied logic first.
            // The prompt is actually `pupil.style.transform = rotate...`
            // This is incorrect for movement. It should be translating the pupil.
            // Let's correct the logic to move the pupil inside the eye.
            const moveRadius = eyeContainer.offsetWidth / 4;
            const pupilX = Math.cos(angle) * moveRadius;
            const pupilY = Math.sin(angle) * moveRadius;
            
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className={cn(
        'absolute top-8 right-8 z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl',
        darkMode 
            ? 'bg-gray-200 border-4 border-gray-400' 
            : 'bg-yellow-400 border-4 border-yellow-200'
      )}
    >
      {darkMode && (
        <>
          <div className="absolute top-3 left-4 w-3 h-3 rounded-full bg-gray-400/80"></div>
          <div className="absolute bottom-4 right-3 w-5 h-5 rounded-full bg-gray-400/80"></div>
          <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-gray-400/80"></div>
        </>
      )}

      <div className="eye-container relative w-6 h-6 bg-white rounded-full flex items-center justify-center mx-1 border-2 border-gray-800">
        <div className="pupil w-3 h-3 bg-black rounded-full" />
      </div>
      <div className="eye-container relative w-6 h-6 bg-white rounded-full flex items-center justify-center mx-1 border-2 border-gray-800">
        <div className="pupil w-3 h-3 bg-black rounded-full" />
      </div>
    </div>
  );
};

export default CelestialEye;
