
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import Chatbot from '@/components/chatbot';
import { cn } from '@/lib/utils';

type Props = {
  darkMode: boolean;
};

const FloatingChatbot: React.FC<Props> = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const containerVariants = {
    closed: { opacity: 0, y: 50, scale: 0.9, originX: 1, originY: 1 },
    open: { opacity: 1, y: 0, scale: 1, originX: 1, originY: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="mb-2"
          >
            <Chatbot darkMode={darkMode} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={toggleChat}
          className={cn(
            "rounded-full w-16 h-16 shadow-2xl",
            darkMode ? "glass-effect shadow-accent/40" : "light-btn"
          )}
          size="icon"
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
          <span className="sr-only">Toggle Chat</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default FloatingChatbot;
