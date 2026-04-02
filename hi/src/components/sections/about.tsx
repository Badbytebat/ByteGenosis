
"use client";

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AboutData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.1 }
      }
    };
    
    const itemVariants = (fromLeft: boolean) => ({
      hidden: { opacity: 0, x: fromLeft ? -50 : 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        transition: darkMode 
          ? { duration: 0.8, ease: "easeOut" } 
          : { type: "spring", stiffness: 100, damping: 20 }
      }
    });

    const safeImageUrl = (url: string) => {
      if (!url || typeof url !== 'string') {
        return 'https://placehold.co/400x500.png';
      }
      // Fix for common invalid placehold.co URL
      if (url.startsWith('https://placehold.co') && !/\d+x\d+/.test(url)) {
         return 'https://placehold.co/400x500.png';
      }
      return url;
    }

    return (
        <section 
            id="about" 
            className="py-20"
        >
            <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    About Me
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    {darkMode ? "A glimpse into the mind behind the cowl." : "A brief introduction to my professional background."}
                </p>
            </div>
            
            <motion.div 
                ref={ref}
                className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div 
                    className="md:col-span-1"
                    variants={itemVariants(true)}
                >
                    <div className={cn(
                        "relative group aspect-[4/5] w-full max-w-xs mx-auto md:max-w-none rounded-lg overflow-hidden transition-all duration-300",
                         darkMode 
                        ? "shadow-2xl shadow-accent/20 border-2 border-accent/50 animate-pulse-glow" 
                        : "shadow-xl"
                    )}>
                      <Image 
                          src={safeImageUrl(data.imageUrl)}
                          alt="Profile Picture"
                          data-ai-hint="person portrait"
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 group-hover:scale-105"
                      />
                       {editMode && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <Textarea 
                                value={data.imageUrl} 
                                onChange={(e) => handleTextUpdate('imageUrl', e.target.value)} 
                                className="w-11/12 h-auto text-xs text-center bg-transparent border-dashed"
                                placeholder="Paste new image URL here"
                            />
                        </div>
                      )}
                    </div>
                </motion.div>

                <motion.div 
                    className="md:col-span-2"
                    variants={itemVariants(false)}
                >
                    <Card className={cn(
                        "p-6 rounded-lg transition-all duration-300 h-full",
                        darkMode 
                            ? "bg-card/50 border-primary/20" 
                            : "bg-card border"
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
                </motion.div>
            </motion.div>
        </section>
    )
}

export default AboutSection;
