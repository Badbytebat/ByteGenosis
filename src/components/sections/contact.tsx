
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactMethod } from "@/lib/types";
import { Github, Linkedin, Mail, Plus, Trash2, Instagram } from "lucide-react";
import { WhatsappIcon, KaggleIcon, HackerRankIcon, GeeksforGeeksIcon } from "@/components/layout/custom-icons";
import { cn } from '@/lib/utils';

type AnimatedCardProps = {
  method: ContactMethod;
  index: number;
  editMode: boolean;
  handleUpdate: (id: number, field: keyof ContactMethod, value: string) => void;
  deleteEntry: (section: 'contact', id: number) => void;
  formatHref: (url: string) => string;
  darkMode: boolean;
};

// Available icons: Mail, Linkedin, Github, Instagram, Whatsapp, Kaggle, HackerRank, GeeksforGeeks
const ICONS: { [key: string]: React.ElementType } = {
  Mail,
  Linkedin,
  Github,
  Instagram,
  Whatsapp: WhatsappIcon,
  Kaggle: KaggleIcon,
  HackerRank: HackerRankIcon,
  GeeksforGeeks: GeeksforGeeksIcon,
};

const AnimatedContactCard: React.FC<AnimatedCardProps> = ({ method, index, editMode, handleUpdate, deleteEntry, formatHref, darkMode }) => {
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
      <Card key={method.id} className={cn(
        "text-center p-6 transition-all duration-300 h-full",
        darkMode
          ? "bg-card/50 border-primary/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 hover:-rotate-1"
          : "bg-card border light-card"
      )}>
        {editMode ? (
          <div className="space-y-3 text-left">
            <div>
              <Label htmlFor={`icon-${method.id}`}>Icon Name (e.g. Mail, Whatsapp)</Label>
              <Input id={`icon-${method.id}`} value={method.icon} onChange={e => handleUpdate(method.id, 'icon', e.target.value)} />
            </div>
              <div>
              <Label htmlFor={`label-${method.id}`}>Label</Label>
              <Input id={`label-${method.id}`} value={method.label} onChange={e => handleUpdate(method.id, 'label', e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`value-${method.id}`}>Display Text</Label>
              <Input id={`value-${method.id}`} value={method.value} onChange={e => handleUpdate(method.id, 'value', e.target.value)} />
            </div>
            <div>
              <Label htmlFor={`href-${method.id}`}>Link URL</Label>
              <Input id={`href-${method.id}`} value={method.href} onChange={e => handleUpdate(method.id, 'href', e.target.value)} />
            </div>
            <Button variant="destructive" size="sm" onClick={() => deleteEntry('contact', method.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        ) : (
          <a href={formatHref(method.href)} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center h-full">
            <CardContent className="flex flex-col items-center justify-center gap-4">
                <IconComponent className={cn("w-10 h-10 text-accent", !darkMode && "light-icon-pop")} style={{ animationDelay: `${index * 100}ms` }}/>
                <p className="font-bold text-lg">{method.label}</p>
                <p className="text-sm text-muted-foreground">{method.value}</p>
            </CardContent>
          </a>
        )}
      </Card>
    </motion.div>
  );
};

type Props = {
  data: ContactMethod[];
  editMode: boolean;
  updateEntry: (section: 'contact', id: number, field: string, value: any) => void;
  addEntry: (section: 'contact') => void;
  deleteEntry: (section: 'contact', id: number) => void;
  darkMode: boolean;
};

const ContactSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  
  const handleUpdate = (id: number, field: keyof ContactMethod, value: string) => {
    updateEntry('contact', id, field, value);
  };
  
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
        {data.map((method, index) => (
          <AnimatedContactCard
            key={method.id}
            method={method}
            index={index}
            editMode={editMode}
            handleUpdate={handleUpdate}
            deleteEntry={deleteEntry}
            formatHref={formatHref}
            darkMode={darkMode}
          />
        ))}
        {editMode && (
          <Card className="flex items-center justify-center border-dashed border-2 min-h-[250px]">
            <Button variant="ghost" onClick={() => addEntry('contact')} className="text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Contact Method
            </Button>
          </Card>
        )}
      </div>
    </motion.section>
  );
};

export default ContactSection;
