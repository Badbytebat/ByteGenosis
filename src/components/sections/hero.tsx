
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type HeroSectionProps = {
  scrollToSection: (id: string) => void;
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection }) => {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-background"></div>
        <Image 
          src="https://placehold.co/1920x1080/0d0d0d/0d0d0d.png" 
          alt="Night Skyline" 
          data-ai-hint="night skyline"
          layout="fill" 
          objectFit="cover" 
          className="opacity-20"
        />
      </div>

      <div className="z-10 text-center max-w-3xl mx-auto">
        <motion.h1 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8, ease: "easeOut" }}
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
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-foreground/80 font-light"
        >
          Aspiring Data Scientist | Analytical Problem Solver | Technology Enthusiast
        </motion.p>
      </div>

      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="z-10 flex flex-col sm:flex-row gap-4 mt-10"
      >
        <Button
          onClick={() => scrollToSection('projects')}
          className="jelly-btn glass-effect rounded-full shadow-lg shadow-primary/30 border-primary/50 text-base py-6 px-8 hover:bg-primary hover:text-primary-foreground"
        >
          View Portfolio
        </Button>
        <Button
          onClick={() => scrollToSection('resume')}
          variant="outline"
          className="jelly-btn glass-effect rounded-full shadow-lg shadow-accent/30 border-accent/50 text-base py-6 px-8 hover:bg-accent hover:text-accent-foreground"
        >
          Download Resume
        </Button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
