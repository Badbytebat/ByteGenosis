
'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import Chatbot from '@/components/chatbot';
import { cn } from '@/lib/utils';
import type { PortfolioData, AiAssistantSettings } from '@/lib/types';

type Props = {
  darkMode: boolean;
  portfolioData: PortfolioData;
  isLoggedIn: boolean;
  onAiAssistantChange: (field: keyof AiAssistantSettings, value: string) => void;
  reduceMotion?: boolean;
};

const FloatingChatbot: React.FC<Props> = ({
  darkMode,
  portfolioData,
  isLoggedIn,
  onAiAssistantChange,
  reduceMotion = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tag = t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || t.isContentEditable) return;
      e.preventDefault();
      setIsOpen(true);
      requestAnimationFrame(() => chatInputRef.current?.focus());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const toggleChat = () => setIsOpen((open) => !open);

  const panelTransition = reduceMotion
    ? { duration: 0.12 }
    : { type: 'spring' as const, stiffness: 520, damping: 34, mass: 0.75 };

  /** Portal to body so `position: fixed` is not trapped by Framer Motion transforms on the page root. */
  const ui = (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Panel is absolutely above the FAB; exit animates upward so it never sweeps over the toggle. */}
      <div className="relative inline-flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-panel"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 20 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1, transition: panelTransition }
                  : { opacity: 1, scale: 1, y: 0, transition: panelTransition }
              }
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { opacity: 0, scale: 0.96, y: -12, transition: { duration: 0.2, ease: 'easeIn' } }
              }
              className="absolute bottom-full right-0 mb-2 max-h-[calc(100dvh-7rem)] min-h-0 w-[min(100vw-1.5rem,32rem)] max-w-lg origin-bottom-right overflow-y-auto overscroll-contain"
            >
              <Chatbot
                darkMode={darkMode}
                portfolioData={portfolioData}
                isLoggedIn={isLoggedIn}
                onAiAssistantChange={onAiAssistantChange}
                inputRef={chatInputRef}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          type="button"
          onClick={toggleChat}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
          className={cn(
            'relative z-10 h-16 w-16 shrink-0 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95',
            darkMode ? 'glass-effect shadow-accent/40' : 'light-btn'
          )}
          size="icon"
        >
          {isOpen ? <X className="!h-8 !w-8" /> : <MessageSquare className="!h-8 !w-8" />}
        </Button>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(ui, document.body);
};

export default FloatingChatbot;
