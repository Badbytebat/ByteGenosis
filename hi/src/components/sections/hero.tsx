
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HeroData } from '@/lib/types';

type HeroSectionProps = {
  data: HeroData;
  editMode: boolean;
  onUpdate: (field: keyof HeroData, value: string) => void;
  scrollToSection: (id: string) => void;
  darkMode: boolean;
};

const HeroSection: React.FC<HeroSectionProps> = ({ data, editMode, onUpdate, scrollToSection, darkMode }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: darkMode 
        ? { duration: 0.8, ease: "easeInOut" }
        : { type: "spring", stiffness: 100, damping: 20 }
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className={cn(
            "absolute inset-0",
            darkMode ? "bg-gradient-to-b from-black via-black/80 to-background" : "bg-gradient-to-b from-background/50 to-background"
        )}></div>
        {darkMode && (
          <Image 
            src="https://placehold.co/1920x1080/0d0d0d/0d0d0d.png" 
            alt="Night Skyline" 
            data-ai-hint="night skyline"
            layout="fill" 
            objectFit="cover" 
            className="opacity-20"
          />
        )}
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          {editMode ? (
            <div className="space-y-4">
              <Input
                value={data.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                placeholder="Title"
                className="text-4xl md:text-6xl font-headline font-extrabold text-center bg-transparent border-2 border-dashed border-primary h-auto p-2"
              />
              <Textarea
                value={data.subtitle}
                onChange={(e) => onUpdate('subtitle', e.target.value)}
                placeholder="Subtitle"
                className="text-xl md:text-2xl text-foreground/80 font-light text-center bg-transparent border-2 border-dashed border-primary"
                rows={3}
              />
            </div>
          ) : (
            <>
              <motion.h1 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="text-4xl md:text-6xl font-headline font-extrabold mb-4 leading-tight"
              >
                <span className="miui-glow-text">
                  {data.title}
                </span>
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-foreground/80 font-light"
              >
                {data.subtitle}
              </motion.p>
            </>
          )}
        </div>

        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
          className="z-10 flex flex-col sm:flex-row gap-4 mt-10 justify-center"
        >
          <Button
            onClick={() => scrollToSection('projects')}
            className={cn(
                "rounded-full text-base py-6 px-8",
                darkMode 
                  ? "jelly-btn glass-effect shadow-lg shadow-primary/30 border-primary/50 hover:bg-primary hover:text-primary-foreground" 
                  : "light-btn"
            )}
          >
            View Portfolio
          </Button>
          <Button
            onClick={() => scrollToSection('resume')}
            variant="outline"
            className={cn(
              "rounded-full text-base py-6 px-8",
              darkMode
                ? "jelly-btn glass-effect shadow-lg shadow-accent/30 border-accent/50 hover:bg-accent hover:text-accent-foreground"
                : "light-btn"
            )}
          >
            Download Resume
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
