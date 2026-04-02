"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import type { ContactMethod } from "@/lib/types";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";
import { WhatsappIcon, KaggleIcon, HackerRankIcon, GeeksforGeeksIcon, LeetCodeIcon } from "@/components/layout/custom-icons";
import { cn } from '@/lib/utils';

// Available icons: Mail, Linkedin, Github, Instagram, Whatsapp, Kaggle, HackerRank, GeeksforGeeks, LeetCode
const ICONS: { [key: string]: React.ElementType } = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Whatsapp: WhatsappIcon,
  Kaggle: KaggleIcon,
  HackerRank: HackerRankIcon,
  GeeksforGeeks: GeeksforGeeksIcon,
  LeetCode: LeetCodeIcon,
};

type AnimatedCardProps = {
  method: ContactMethod;
  index: number;
  formatHref: (url: string) => string;
  darkMode: boolean;
};

const AnimatedContactCard: React.FC<AnimatedCardProps> = ({ method, index, formatHref, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const IconComponent = ICONS[method.icon] || Mail;

  const transition = darkMode 
    ? { duration: 0.8, delay: index * 0.1, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <a href={formatHref(method.href)} target="_blank" rel="noopener noreferrer" className="block h-full">
        <Card key={method.id} className={cn(
          "text-center p-6 transition-all duration-300 h-full",
          darkMode
            ? "bg-card/50 border-primary/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 hover:-rotate-1"
            : "bg-card border light-card"
        )}>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-0">
                <IconComponent className={cn("w-10 h-10 text-accent", !darkMode && "light-icon-pop")} style={{ animationDelay: `${index * 100}ms` }}/>
                <p className="font-bold text-lg">{method.label}</p>
                <p className="text-sm text-muted-foreground">{method.value}</p>
            </CardContent>
        </Card>
      </a>
    </motion.div>
  );
};


type Props = {
  data: ContactMethod[];
  editMode: boolean; // editMode is kept for potential future use but the form will be visible always
  updateEntry: (section: 'contact', id: number, field: string, value: any) => void;
  addEntry: (section: 'contact') => void;
  deleteEntry: (section: 'contact', id: number) => void;
  darkMode: boolean;
};

const ContactSection: React.FC<Props> = ({ data, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  
  const formatHref = (url: string = ''): string => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      return url;
    }
    if (url.includes('@')) {
      return `mailto:${url}`;
    }
    return `https://${url}`;
  };

  const transition = darkMode 
    ? { duration: 0.8, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.section 
      ref={ref}
      id="contact" 
      className="py-20 overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <div className="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Contact Me
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          {darkMode ? "Have a question or want to work together? Send a signal." : "Let's connect. I'm available for new opportunities."}
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {data.map((method, index) => (
              <AnimatedContactCard
                key={method.id}
                method={method}
                index={index}
                formatHref={formatHref}
                darkMode={darkMode}
              />
            ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ContactSection;
