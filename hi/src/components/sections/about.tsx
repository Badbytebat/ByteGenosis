
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
import { DURATION_ENTER, EASE_OUT, SPRING_UI, STAGGER_CHILD } from '@/lib/motion-presets';

type Props = {
  data: AboutData;
  editMode: boolean;
  onUpdate: (field: keyof AboutData, value: string) => void;
  onProfileImageUpload?: (file: File) => void;
  isProfileImageUploading?: boolean;
  darkMode: boolean;
};

const AboutSection: React.FC<Props> = ({
  data,
  editMode,
  onUpdate,
  onProfileImageUpload,
  isProfileImageUploading,
  darkMode,
}) => {
    const ref = useRef(null);
    const imageFileRef = useRef<HTMLInputElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    const handleTextUpdate = (field: keyof AboutData, value: string) => {
        onUpdate(field, value);
    };
    
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: STAGGER_CHILD, delayChildren: 0.04 }
      }
    };
    
    const itemVariants = (fromLeft: boolean) => ({
      hidden: { opacity: 0, x: fromLeft ? -28 : 28, scale: 0.98 },
      visible: { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        transition: darkMode 
          ? { duration: DURATION_ENTER, ease: EASE_OUT } 
          : SPRING_UI
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
                        "relative group aspect-[4/5] w-full max-w-xs mx-auto md:max-w-none rounded-lg overflow-hidden transition-all duration-200 ease-out",
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
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out p-2">
                           <input
                             type="file"
                             ref={imageFileRef}
                             className="hidden"
                             accept="image/*"
                             disabled={isProfileImageUploading}
                             onChange={(e) => {
                               const f = e.target.files?.[0];
                               if (f && onProfileImageUpload) onProfileImageUpload(f);
                               e.target.value = '';
                             }}
                           />
                           {onProfileImageUpload && (
                             <Button
                               type="button"
                               size="sm"
                               variant="secondary"
                               className="text-xs"
                               disabled={isProfileImageUploading}
                               onClick={() => imageFileRef.current?.click()}
                             >
                               {isProfileImageUploading ? 'Uploading…' : 'Upload image (max 50 MB)'}
                             </Button>
                           )}
                           <Textarea 
                                value={data.imageUrl} 
                                onChange={(e) => handleTextUpdate('imageUrl', e.target.value)} 
                                className="w-11/12 h-auto text-xs text-center bg-transparent border-dashed min-h-[3rem]"
                                placeholder="Or paste image URL"
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
                        "p-6 rounded-lg transition-all duration-200 ease-out h-full",
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
