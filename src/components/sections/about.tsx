
"use client";

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AboutData } from '@/lib/types';
import { cn } from '@/lib/utils';

type Props = {
  data: AboutData;
  editMode: boolean;
  onUpdate: (field: keyof AboutData, value: string) => void;
  darkMode: boolean;
};

const AboutSection: React.FC<Props> = ({ data, editMode, onUpdate, darkMode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    const handleTextUpdate = (field: keyof AboutData, value: string) => {
        onUpdate(field, value);
    };
    
    const transition = darkMode 
        ? { duration: 0.8, ease: "easeOut" } 
        : { type: "spring", stiffness: 100, damping: 20 };

    return (
        <motion.section 
            ref={ref}
            id="about" 
            className="py-20 overflow-hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -100 }}
            transition={transition}
        >
            <div className="max-w-4xl mx-auto text-center mb-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    About Me
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    {darkMode ? "A glimpse into the mind behind the cowl." : "A brief introduction to my professional background."}
                </p>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className={cn(
                    "p-6 rounded-lg transition-all duration-300",
                    darkMode 
                        ? "bg-card/50 border-primary/20 hover:shadow-2xl hover:shadow-accent/20 hover:border-accent/50" 
                        : "bg-card border light-card"
                )}>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                            <VenetianMask className="text-primary"/>
                            {editMode ? (
                                <Input value={data.title} onChange={(e) => handleTextUpdate('title', e.target.value)} className="text-2xl font-bold" />
                            ) : (
                                data.title
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-foreground/80">
                       {editMode ? (
                            <>
                                <Textarea value={data.description1} onChange={(e) => handleTextUpdate('description1', e.target.value)} rows={4} />
                                <Textarea value={data.description2} onChange={(e) => handleTextUpdate('description2', e.target.value)} rows={4} />
                                <Textarea value={data.description3} onChange={(e) => handleTextUpdate('description3', e.target.value)} rows={3} />
                            </>
                       ) : (
                            <>
                                <p>{data.description1}</p>
                                <p>{data.description2}</p>
                                <p>{data.description3}</p>
                            </>
                       )}
                    </CardContent>
                </Card>
            </div>
        </motion.section>
    )
}

export default AboutSection;
