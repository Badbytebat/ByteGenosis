
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactMethod } from "@/lib/types";
import { Github, Linkedin, Mail, Plus, Trash2 } from "lucide-react";

type Props = {
  data: ContactMethod[];
  editMode: boolean;
  updateEntry: (section: 'contact', id: number, field: string, value: any) => void;
  addEntry: (section: 'contact') => void;
  deleteEntry: (section: 'contact', id: number) => void;
};

const ICONS: { [key: string]: React.ElementType } = {
  Mail,
  Linkedin,
  Github,
};

const ContactSection: React.FC<Props> = ({ data, editMode, updateEntry, addEntry, deleteEntry }) => {
  
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

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Contact Me
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to work together? Send a signal.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(method => {
          const IconComponent = ICONS[method.icon] || Mail;
          return (
            <Card key={method.id} className="text-center p-6 bg-card/50 border-primary/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:scale-105 hover:-rotate-1">
              {editMode ? (
                <div className="space-y-3 text-left">
                  <div>
                    <Label htmlFor={`icon-${method.id}`}>Icon (Mail, Linkedin, Github)</Label>
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
                <a href={formatHref(method.href)} target="_blank" rel="noopener noreferrer">
                  <CardContent className="flex flex-col items-center justify-center gap-4">
                      <IconComponent className="w-10 h-10 text-accent"/>
                      <p className="font-bold text-lg">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.value}</p>
                  </CardContent>
                </a>
              )}
            </Card>
          )
        })}
        {editMode && (
          <Card className="flex items-center justify-center border-dashed border-2 min-h-[250px]">
            <Button variant="ghost" onClick={() => addEntry('contact')} className="text-muted-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Contact Method
            </Button>
          </Card>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
