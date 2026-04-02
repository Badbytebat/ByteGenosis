
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Experience } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// A sub-component for each timeline item to handle its own animation state
type ExperienceItemProps = {
  item: Experience;
  index: number;
  editMode: boolean;
  updateEntry: (section: 'experience', id: number, field: string, value: any) => void;
  deleteEntry: (section: 'experience', id: number) => void;
  darkMode: boolean;
};

const ExperienceItem: React.FC<ExperienceItemProps> = ({ item, index, editMode, updateEntry, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  // Trigger animation when the item is 30% in view. Reversible.
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const handleUpdate = (id: number, field: keyof Experience, value: string) => {
    updateEntry('experience', id, field, value);
  };

  // Determine the slide-in direction based on even/odd index
  const initialX = index % 2 !== 0 ? -100 : 100;

  const transition = darkMode 
    ? { duration: 0.8, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : initialX }}
      transition={transition}
      className="relative pl-8 sm:pl-0"
    >
      <div className="absolute left-0 sm:left-1/2 top-1 h-4 w-4 bg-primary rounded-full -translate-x-1/2 border-4 border-background"></div>
      <Card className={cn(
        "relative transition-all duration-300",
        darkMode 
          ? `bg-card/50 border-primary/20 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/50 ${index % 2 !== 0 ? 'sm:ml-0 sm:mr-[55%] sm:text-right sm:pr-10' : 'sm:ml-[55%] sm:pl-10'}`
          : `bg-card border light-card ${index % 2 !== 0 ? 'sm:ml-0 sm:mr-[55%] sm:text-right sm:items-end' : 'sm:ml-[55%]'}`
      )}>
        <CardHeader className={cn(
          index % 2 !== 0 && 'sm:text-right sm:items-end'
        )}>
          {editMode ? (
            <Input value={item.role} onChange={(e) => handleUpdate(item.id, 'role', e.target.value)} placeholder="Role" className="text-lg font-bold" />
          ) : (
            <CardTitle>{item.role}</CardTitle>
          )}
          {editMode ? (
            <Input value={item.company} onChange={(e) => handleUpdate(item.id, 'company', e.target.value)} placeholder="Company" className="text-muted-foreground" />
          ) : (
            <CardDescription>{item.company}</CardDescription>
          )}
          {editMode ? (
            <Input value={item.duration} onChange={(e) => handleUpdate(item.id, 'duration', e.target.value)} placeholder="Duration" className="text-sm text-muted-foreground"/>
          ) : (
            <p className="text-sm text-muted-foreground">{item.duration}</p>
          )}
        </CardHeader>
        <CardContent>
          {editMode ? (
            <Textarea value={item.description} onChange={(e) => handleUpdate(item.id, 'description', e.target.value)} placeholder="Description" />
          ) : (
            <p>{item.description}</p>
          )}
          {editMode && (
            <Button variant="destructive" size="sm" onClick={() => deleteEntry('experience', item.id)} className="mt-4">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};


type Props = {
  data: Experience[];
  editMode: boolean;
  updateEntry: (section: 'experience', id: number, field: string, value: any) => void;
  addEntry: (section: 'experience') => void;
  deleteEntry: (section: 'experience', id: number) => void;
  darkMode: boolean;
};

const ExperienceSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry, darkMode }) => {
  return (
    <section id="experience" className="py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Work Experience
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My professional journey and key accomplishments.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 relative px-4 sm:px-6 lg:px-8">
        <div className="absolute left-0 sm:left-1/2 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
        {data.map((item, index) => (
           <ExperienceItem 
            key={item.id} 
            item={item} 
            index={index} 
            editMode={editMode} 
            updateEntry={updateEntry} 
            deleteEntry={deleteEntry}
            darkMode={darkMode}
          />
        ))}
        {editMode && (
          <div className="text-center mt-8">
            <Button onClick={() => addEntry('experience')}>
              <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
