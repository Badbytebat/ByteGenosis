
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, X, Wand, Ghost, Orbit, Waves, Bot, Eye, Wind, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CursorStyle } from '@/app/page';

type StyleOption = {
  style: CursorStyle;
  name: string;
  icon: React.ElementType;
};

// Different sets of animations for dark and light mode
const darkStyles: StyleOption[] = [
  { style: 'matrix', name: 'Matrix', icon: Wand },
  { style: 'ghost', name: 'Ghost', icon: Ghost },
  { style: 'circuit_pulse', name: 'Circuit Pulse', icon: Bot },
  { style: 'starlight', name: 'Starlight', icon: Sparkles },
  { style: 'none', name: 'None', icon: X },
];

const lightStyles: StyleOption[] = [
  { style: 'orb', name: 'Inverted', icon: Orbit },
  { style: 'jello', name: 'Jello', icon: Waves },
  { style: 'underline', name: 'Underline', icon: Sparkles },
  { style: 'ink_bloom', name: 'Ink Bloom', icon: Palette },
  { style: 'aurora', name: 'Aurora', icon: Wind },
  { style: 'none', name: 'None', icon: X },
];

type Props = {
  darkMode: boolean;
  selectedStyle: CursorStyle;
  onStyleChange: (style: CursorStyle) => void;
};

const FloatingCursorSelector: React.FC<Props> = ({ darkMode, selectedStyle, onStyleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cursorOptions = darkMode ? darkStyles : lightStyles;

  const wrapperVariants = {
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
        delay: i * 0.05,
      },
    }),
    closed: (i: number) => ({
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
        delay: i * 0.05,
      },
    }),
  };
  
  const mainButtonVariants = {
      open: { rotate: 45 },
      closed: { rotate: 0 }
  }

  return (
    <div className="fixed bottom-6 right-24 z-50">
      <motion.nav initial={false} animate={isOpen ? "open" : "closed"}>
        {/* Unfolding cards */}
        <AnimatePresence>
            {isOpen && (
                 <motion.ul
                    variants={wrapperVariants}
                    className="absolute bottom-20 right-0 w-48 space-y-2"
                >
                    {cursorOptions.map((option, i) => (
                        <motion.li
                            key={option.style}
                            variants={itemVariants}
                            custom={i}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                type="button"
                                data-matrix-cta
                                onClick={() => {
                                    onStyleChange(option.style)
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-4 p-3 rounded-lg text-sm font-medium transition-colors",
                                    darkMode ? "glass-effect" : "light-btn border bg-background/80 backdrop-blur-sm",
                                    selectedStyle === option.style 
                                        ? "bg-primary text-primary-foreground" 
                                        : "hover:bg-primary/20"
                                )}
                            >
                                <option.icon className="w-5 h-5" />
                                <span>{option.name}</span>
                            </button>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            type="button"
            data-matrix-cta
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "rounded-full w-16 h-16 shadow-2xl",
              darkMode ? "glass-effect shadow-accent/40" : "light-btn"
            )}
            size="icon"
          >
            <motion.div variants={mainButtonVariants}>
              <Sparkles className="w-8 h-8" />
            </motion.div>
            <span className="sr-only">Toggle Cursor Lab</span>
          </Button>
        </motion.div>
      </motion.nav>
    </div>
  );
};

export default FloatingCursorSelector;
