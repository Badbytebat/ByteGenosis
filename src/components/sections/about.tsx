"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask } from "lucide-react";
import Image from "next/image";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { AboutData } from '@/lib/types';

type Props = {
  data: AboutData;
  editMode: boolean;
  onUpdate: (field: keyof AboutData, value: string) => void;
};

const AboutSection: React.FC<Props> = ({ data, editMode, onUpdate }) => {
    // Hardcode the image URL to guarantee it shows up, bypassing database issues.
    const profileImageUrl = "https://storage.googleapis.com/maker-me/uploads/user-file-1722449553073-1.png";

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
                    <Card className="overflow-hidden border-2 border-accent/20 shadow-lg shadow-accent/10 transition-all duration-300">
                        <Image
                            src={profileImageUrl}
                            data-ai-hint="professional portrait"
                            alt="Ritesh"
                            width={400}
                            height={500}
                            className="object-cover w-full h-auto rounded-lg"
                            priority
                        />
                    </Card>
                </div>
                <div className="md:col-span-3">
                    <Card className="bg-card/50 border-primary/20 p-6 rounded-lg transition-all duration-300 hover:shadow-lg">
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
