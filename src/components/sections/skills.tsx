
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  data: Skill[];
  editMode: boolean;
  updateEntry: (section: 'skills', id: number, field: string, value: any) => void;
  addEntry: (section: 'skills') => void;
  deleteEntry: (section: 'skills', id: number) => void;
  darkMode: boolean;
};

const SkillsSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const handleUpdate = (id: number, field: keyof Skill, value: string | number) => {
    updateEntry('skills', id, field, value);
  };
  
  const transition = darkMode 
      ? { duration: 0.8, ease: "easeOut" } 
      : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.section 
      ref={ref}
      id="skills" 
      className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
      transition={transition}
    >
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          { darkMode ? "My Arsenal" : "My Skills" }
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          { darkMode ? "The tools and technologies I wield." : "A summary of my technical abilities."}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className={cn(
          "p-6 sm:p-10 transition-all duration-300",
          darkMode
            ? "bg-card/50 border-primary/20 hover:shadow-lg hover:border-accent/50"
            : "bg-card border light-card"
        )}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {data.map((skill) => (
              <div key={skill.id} className="space-y-2 group">
                <div className="flex justify-between items-center">
                  {editMode ? (
                    <Input
                      value={skill.name}
                      onChange={(e) => handleUpdate(skill.id, 'name', e.target.value)}
                      placeholder="Skill Name"
                      className="text-base font-medium"
                    />
                  ) : (
                    <span className="text-base font-medium">{skill.name}</span>
                  )}
                  {editMode && (
                    <Button variant="ghost" size="icon" className="w-8 h-8 opacity-50 group-hover:opacity-100" onClick={() => deleteEntry('skills', skill.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
                {editMode ? (
                  <div className="flex items-center gap-2">
                     <Input 
                        type="range" 
                        min="0" max="100" 
                        value={skill.level} 
                        onChange={(e) => handleUpdate(skill.id, 'level', parseInt(e.target.value))}
                        className="p-0"
                    />
                    <span className="text-sm text-muted-foreground w-12 text-right">{skill.level}%</span>
                  </div>
                ) : (
                  <Progress value={parseInt(skill.level.toString())} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" />
                )}
              </div>
            ))}
            {editMode && (
              <div className="md:col-span-2 text-center mt-8">
                <Button onClick={() => addEntry('skills')}>
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};

export default SkillsSection;
