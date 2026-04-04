
"use client";

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { recommendProject, type RecommendProjectOutput } from '@/ai/flows/recommend-project-flow';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

type Props = {
  darkMode: boolean;
};

const ProjectRecommender: React.FC<Props> = ({ darkMode }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const { toast } = useToast();

    const [skills, setSkills] = useState('');
    const [recommendation, setRecommendation] = useState<RecommendProjectOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRecommend = async () => {
        if (!skills) {
            toast({
                variant: 'destructive',
                title: 'No skills provided',
                description: 'Please enter some skills to get a recommendation.'
            });
            return;
        }
        setIsLoading(true);
        setRecommendation(null);
        try {
            const result = await recommendProject({ skills });
            setRecommendation(result);
        } catch (error) {
            console.error("Error recommending project:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not generate a project recommendation. Please try again.'
            });
        }
        setIsLoading(false);
    };

    const containerVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.8,
          ease: "easeOut"
        }
      }
    };

    return (
        <motion.section 
            ref={ref}
            id="project-recommender" 
            className="py-20 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    AI Project Recommender
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Get a project idea tailored to your skills.
                </p>
            </div>
            
            <div className="max-w-2xl mx-auto px-4">
                <Card className={cn(
                    "transition-all duration-300",
                    darkMode 
                        ? "bg-card/50 border-primary/20" 
                        : "bg-card border"
                )}>
                    <CardHeader>
                        <CardTitle className="text-lg">Enter Your Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Input 
                                placeholder="e.g., React, Next.js, Firebase, Tailwind CSS"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
                            />
                            <Button type="button" data-matrix-cta onClick={handleRecommend} disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4 mr-2" />
                                )}
                                Suggest Project
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="text-center mt-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground mt-2">Generating your project...</p>
                    </div>
                )}

                {recommendation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8"
                    >
                        <Card className={cn(
                            "transition-all duration-300",
                            darkMode
                              ? "bg-card/50 border-accent/30"
                              : "bg-card border"
                        )}>
                            <CardHeader>
                                <CardTitle>{recommendation.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p>{recommendation.description}</p>
                                <div>
                                    <h4 className="font-semibold mb-2">Suggested Technologies:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {recommendation.technologies.map(tech => (
                                            <Badge key={tech} variant={darkMode ? "secondary" : "default"}>{tech}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Difficulty:</h4>
                                    <p>{recommendation.difficulty}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </motion.section>
    )
}

export default ProjectRecommender;
