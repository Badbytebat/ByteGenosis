
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatAboutRitesh } from '@/ai/flows/chatbot-flow';
import { useToast } from '@/hooks/use-toast';
import { PortfolioData } from '@/lib/types';

type Message = {
  id: number;
  role: 'user' | 'bot';
  text: string;
};

type Props = {
  darkMode: boolean;
  portfolioData: PortfolioData;
};

const Chatbot: React.FC<Props> = ({ darkMode, portfolioData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start with a welcome message from the bot
    setMessages([
        { id: 1, role: 'bot', text: "Hello! I'm a chatbot assistant. Feel free to ask me anything about Ritesh." }
    ]);
  }, []);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    if (!portfolioData) {
       toast({
        variant: 'destructive',
        title: 'Chatbot Not Ready',
        description: 'The portfolio data is still loading. Please try again in a moment.',
      });
      return;
    }

    const newUserMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: input,
    };
    
    const newMessages = [...messages, newUserMessage];

    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const historyForAI = newMessages.map(({ id, ...re }) => re );
      
      const response = await chatAboutRitesh({ 
        question: input, 
        portfolioData: portfolioData,
        history: historyForAI
      });
      const newBotMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: response.answer,
      };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast({
        variant: 'destructive',
        title: 'Chatbot Error',
        description: 'Sorry, I couldn\'t get a response. Please try again.',
      });
       const errorBotMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm having a little trouble connecting right now. Please try again in a moment.",
      };
      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-lg mx-auto transition-all duration-300",
      darkMode
        ? "bg-card/50 border-primary/20"
        : "bg-card border"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="text-accent" />
          Chat with my AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 overflow-y-auto pr-4 space-y-4 border rounded-md p-4 mb-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {message.text}
                </div>
                 {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <User size={20} />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
                 <motion.div
                    key="loading"
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-start items-start gap-3"
                  >
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <Bot size={20} />
                      </div>
                    <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 flex items-center">
                        <Loader2 className="w-5 h-5 animate-spin"/>
                    </div>
                 </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about my experience..."
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;
