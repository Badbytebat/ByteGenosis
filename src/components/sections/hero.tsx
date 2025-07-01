
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type HeroSectionProps = {
  scrollToSection: (id: string) => void;
  darkMode: boolean;
};

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection, darkMode }) => {
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
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-6">
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

      <div className="z-10 text-center max-w-3xl mx-auto">
        <motion.h1 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-4xl md:text-6xl font-headline font-extrabold mb-4 leading-tight"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Ritesh
          </span>
        </motion.h1>
        <motion.p 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground/80 font-light"
        >
          Aspiring Data Scientist | Analytical Problem Solver | Technology Enthusiast
        </motion.p>
      </div>

      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="z-10 flex flex-col sm:flex-row gap-4 mt-10"
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
    </section>
  );
};

export default HeroSection;
