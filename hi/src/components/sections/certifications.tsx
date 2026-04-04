
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Qualification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
type AnimatedCardProps = {
  item: Qualification;
  index: number;
  editMode: boolean;
  handleUpdate: (id: number, field: keyof Qualification, value: string) => void;
  deleteEntry: (section: 'qualifications', id: number) => void;
  darkMode: boolean;
};

const AnimatedCertificationCard: React.FC<AnimatedCardProps> = ({ item, index, editMode, handleUpdate, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const transition = darkMode 
    ? { duration: 0.8, delay: index * 0.1, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20, delay: index * 0.1 };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 100 }}
      transition={transition}
    >
      <Card key={item.id} className={cn(
        "transition-all duration-300",
        darkMode 
          ? "bg-card/50 border-primary/20 hover:shadow-lg hover:border-accent/50 hover:scale-105 hover:-rotate-1"
          : "bg-card border light-card"
      )}>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div className="flex-grow">
                {editMode ? (
                  <Input value={item.title} onChange={(e) => handleUpdate(item.id, 'title', e.target.value)} placeholder="Degree/Certificate" className="text-lg font-bold" />
                ) : (
                  <CardTitle>{item.title}</CardTitle>
                )}
                {editMode ? (
                  <Input value={item.institution} onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)} placeholder="Institution" className="text-muted-foreground mt-1" />
                ) : (
                  <CardDescription>{item.institution}</CardDescription>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                {editMode ? (
                      <Input value={item.duration} onChange={(e) => handleUpdate(item.id, 'duration', e.target.value)} placeholder="Duration" className="w-48"/>
                  ) : (
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                  )}
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <Textarea value={item.description} onChange={(e) => handleUpdate(item.id, 'description', e.target.value)} placeholder="Description" />
          ) : (
            item.description && <p>{item.description}</p>
          )}
          
          {!editMode && item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className={item.description ? 'mt-4 inline-block' : 'inline-block'}>
              <Button data-matrix-cta variant="outline" className={cn("group", !darkMode && "light-btn")}>
                View Certificate <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </a>
          )}

          {editMode && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor={`cert-link-${item.id}`} className="mb-2 block">Certificate Link</Label>
                <Input 
                    id={`cert-link-${item.id}`}
                    value={item.link || ''} 
                    onChange={(e) => handleUpdate(item.id, 'link', e.target.value)} 
                    placeholder="https://..." 
                />
              </div>
              <Button variant="destructive" size="sm" onClick={() => deleteEntry('qualifications', item.id)}>
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

type Props = {
  data: Qualification[];
  editMode: boolean;
  updateEntry: (section: 'qualifications', id: number, field: string, value: any) => void;
  addEntry: (section: 'qualifications', type: 'education' | 'certification') => void;
  deleteEntry: (section: 'qualifications', id: number) => void;
  darkMode: boolean;
};

const CertificationsSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry, darkMode }) => {
  const ref = useRef(null);
  const handleUpdate = (id: number, field: keyof Qualification, value: string) => {
    updateEntry('qualifications', id, field, value);
  };

  return (
    <motion.section 
      ref={ref}
      id="certifications" 
      className="py-20 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Licenses &amp; Certifications
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My professional certifications and credentials.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        {data.map((item, index) => (
          <AnimatedCertificationCard 
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
          <div className="text-center mt-8">
            <Button onClick={() => addEntry('qualifications', 'certification')}>
              <Plus className="w-4 h-4 mr-2" /> Add Certification
            </Button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default CertificationsSection;
