
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type AnimatedCardProps = {
  item: Project;
  index: number;
  editMode: boolean;
  handleUpdate: (id: number, field: keyof Project, value: string | string[]) => void;
  deleteEntry: (section: 'projects', id: number) => void;
  darkMode: boolean;
}

const AnimatedProjectCard: React.FC<AnimatedCardProps> = ({ item, index, editMode, handleUpdate, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

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
      <Card className={cn(
        "flex flex-col h-full transition-all duration-300",
        darkMode
          ? "bg-card/50 border-primary/20 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 hover:-rotate-1"
          : "bg-card border light-card"
      )}>
        <CardHeader>
          {editMode ? (
            <Input value={item.title} onChange={(e) => handleUpdate(item.id, 'title', e.target.value)} placeholder="Title" className="text-lg font-bold" />
          ) : (
            <CardTitle>{item.title}</CardTitle>
          )}
          {editMode ? (
            <Textarea value={item.description} onChange={(e) => handleUpdate(item.id, 'description', e.target.value)} placeholder="Description" />
          ) : (
            <CardDescription>{item.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <Input 
                value={item.tags.join(', ')} 
                onChange={(e) => handleUpdate(item.id, 'tags', e.target.value.split(',').map(t => t.trim()))} 
                placeholder="Tags (comma-separated)"
              />
            ) : (
              item.tags.map((tag) => <Badge key={tag} variant={darkMode ? "secondary" : "default"}>{tag}</Badge>)
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {editMode ? (
            <>
              <Input value={item.link} onChange={(e) => handleUpdate(item.id, 'link', e.target.value)} placeholder="Link" />
              <Button variant="destructive" size="icon" onClick={() => deleteEntry('projects', item.id)} className="ml-2 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className={cn("group", !darkMode && "light-btn")}>
                View Project <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

type Props = {
  data: Project[];
  editMode: boolean;
  updateEntry: (section: 'projects', id: number, field: string, value: any) => void;
  addEntry: (section: 'projects') => void;
  deleteEntry: (section: 'projects', id: number) => void;
  darkMode: boolean;
};

const ProjectsSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const handleUpdate = (id: number, field: keyof Project, value: string | string[]) => {
    updateEntry('projects', id, field, value);
  };
  
  return (
    <motion.section 
      ref={ref}
      id="projects" 
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          { darkMode ? "Case Files" : "Projects"}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          { darkMode ? "A selection of my solved cases and creations." : "A selection of my professional work." }
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <AnimatedProjectCard 
            key={item.id} 
            item={item} 
            index={index} 
            editMode={editMode}
            handleUpdate={handleUpdate}
            deleteEntry={deleteEntry}
            darkMode={darkMode}
          />
        ))}
         {editMode && (
          <Card className="flex items-center justify-center border-dashed border-2 h-full min-h-[200px]">
            <Button variant="ghost" onClick={() => addEntry('projects')} className="text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </Card>
        )}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
