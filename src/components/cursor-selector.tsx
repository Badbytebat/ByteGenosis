
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import type { CursorStyle } from '@/app/page';

type Props = {
  darkMode: boolean;
  selectedStyle: CursorStyle;
  onStyleChange: (style: CursorStyle) => void;
};

const cursorOptions: { style: CursorStyle; name: string; description: string }[] = [
  { style: 'matrix', name: 'Matrix Trail', description: 'A falling stream of characters follows your cursor.' },
  { style: 'text', name: 'Text Glow', description: 'Highlights interactive elements with a glowing word.' },
  { style: 'orb', name: 'Inverted Orb', description: 'A classic inverted color orb (light mode only).' },
  { style: 'none', name: 'None', description: 'Use the standard system cursor.' },
];

const CursorSelector: React.FC<Props> = ({ darkMode, selectedStyle, onStyleChange }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.section
      ref={ref}
      id="cursor-lab"
      className="py-20"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Cursor Lab
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose your browsing experience.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cursorOptions.map((option) => (
          <motion.div key={option.style} variants={itemVariants}>
            <Card className={cn(
              "text-center h-full flex flex-col transition-all duration-300",
              darkMode 
                ? "bg-card/50 border-primary/20" 
                : "bg-card border",
              selectedStyle === option.style && "ring-2 ring-accent border-accent"
            )}>
              <CardHeader>
                <CardTitle>{option.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
              <div className="p-4">
                <Button
                  onClick={() => onStyleChange(option.style)}
                  variant={selectedStyle === option.style ? 'default' : 'outline'}
                  className={cn(
                    "w-full",
                    darkMode ? "glass-effect" : "light-btn",
                    selectedStyle === option.style && (darkMode ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground")
                  )}
                  disabled={option.style === 'orb' && darkMode}
                >
                  {selectedStyle === option.style ? 'Selected' : 'Select'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CursorSelector;

    