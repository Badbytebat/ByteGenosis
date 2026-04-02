"use client";

import type { Qualification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

type Props = {
  data: Qualification[];
  editMode: boolean;
  updateEntry: (section: 'qualifications', id: number, field: string, value: any) => void;
  addEntry: (section: 'qualifications') => void;
  deleteEntry: (section: 'qualifications', id: number) => void;
};

const QualificationsSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry }) => {
  const handleUpdate = (id: number, field: keyof Qualification, value: string) => {
    updateEntry('qualifications', id, field, value);
  };

  return (
    <section id="qualifications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Training & Qualifications
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My academic background and certifications.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {data.map((item) => (
          <Card key={item.id} className="bg-card/50 border-primary/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    {editMode ? (
                      <Input value={item.title} onChange={(e) => handleUpdate(item.id, 'title', e.target.value)} placeholder="Degree/Certificate" className="text-lg font-bold" />
                    ) : (
                      <CardTitle>{item.title}</CardTitle>
                    )}
                    {editMode ? (
                      <Input value={item.institution} onChange={(e) => handleUpdate(item.id, 'institution', e.target.value)} placeholder="Institution" className="text-muted-foreground" />
                    ) : (
                      <CardDescription>{item.institution}</CardDescription>
                    )}
                  </div>
                  {editMode ? (
                        <Input value={item.duration} onChange={(e) => handleUpdate(item.id, 'duration', e.target.value)} placeholder="Duration" className="w-48 text-right"/>
                    ) : (
                        <p className="text-sm text-muted-foreground text-right">{item.duration}</p>
                    )}
              </div>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea value={item.description} onChange={(e) => handleUpdate(item.id, 'description', e.target.value)} placeholder="Description" />
              ) : (
                <p>{item.description}</p>
              )}
              {editMode && (
                <Button variant="destructive" size="sm" onClick={() => deleteEntry('qualifications', item.id)} className="mt-4">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {editMode && (
          <div className="text-center mt-8">
            <Button onClick={() => addEntry('qualifications')}>
              <Plus className="w-4 h-4 mr-2" /> Add Qualification
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QualificationsSection;
