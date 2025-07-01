"use client";

import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AboutData } from '@/lib/types';

type Props = {
  data: AboutData;
  editMode: boolean;
  onUpload: (file: File) => void;
  onUpdate: (field: keyof AboutData, value: string) => void;
};

const AboutSection: React.FC<Props> = ({ data, editMode, onUpload, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onUpload(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    About Me
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    A glimpse into the mind behind the cowl.
                </p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2 relative">
                    <Card className="overflow-hidden border-2 border-accent/20 shadow-lg shadow-accent/10 transition-all duration-300 hover:scale-105 hover:rotate-1">
                        <Image
                            src={data.imageUrl}
                            data-ai-hint="professional portrait"
                            alt="Ritesh"
                            width={400}
                            height={500}
                            className="object-cover w-full h-full"
                        />
                    </Card>
                     {editMode && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <Button onClick={handleUploadClick} variant="secondary">
                                <Upload className="mr-2 h-4 w-4" /> Change Picture
                            </Button>
                        </div>
                    )}
                </div>
                <div className="md:col-span-3">
                    <Card className="bg-card/50 border-primary/20 p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-rotate-1">
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                <VenetianMask className="text-primary"/>
                                {editMode ? (
                                    <Input value={data.title} onChange={(e) => onUpdate('title', e.target.value)} className="text-2xl font-bold" />
                                ) : (
                                    data.title
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-foreground/80">
                           {editMode ? (
                                <>
                                    <Textarea value={data.description1} onChange={(e) => onUpdate('description1', e.target.value)} rows={4} />
                                    <Textarea value={data.description2} onChange={(e) => onUpdate('description2', e.target.value)} rows={4} />
                                    <Textarea value={data.description3} onChange={(e) => onUpdate('description3', e.target.value)} rows={3} />
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
            </div>
        </section>
    )
}

export default AboutSection;
