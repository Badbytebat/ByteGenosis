
"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Download, Upload, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';

type Props = {
  resumeUrl: string;
  editMode: boolean;
  onUpload: (file: File) => void;
  isUploading: boolean;
  darkMode: boolean;
};

const ResumeSection: React.FC<Props> = ({ resumeUrl, editMode, onUpload, isUploading, darkMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const motionRef = useRef(null);
  const isInView = useInView(motionRef, { once: false, amount: 0.2 });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const transition = darkMode 
    ? { duration: 0.8, ease: "easeOut" } 
    : { type: "spring", stiffness: 100, damping: 20 };

  return (
    <motion.section 
      ref={motionRef}
      id="resume" 
      className="py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={transition}
    >
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
         <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Get My Resume
        </h2>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          Want a copy of my full professional profile? Download it here.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={resumeUrl} download="Ritesh-Resume.pdf" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className={cn(
              "rounded-full shadow-lg text-base py-6 px-8",
              darkMode
                ? "jelly-btn glass-effect border-accent/50 hover:bg-accent hover:text-accent-foreground shadow-accent/30"
                : "light-btn"
            )}>
              <Download className="w-5 h-5 mr-3" />
              Download Resume
            </Button>
          </a>
          {editMode && (
            <div>
               <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf"
                disabled={isUploading}
              />
              <Button onClick={handleUploadClick} size="lg" variant="outline" className="rounded-full py-6 px-8" disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin"/>
                ) : (
                  <Upload className="w-5 h-5 mr-3"/>
                )}
                {isUploading ? 'Uploading...' : 'Upload New'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default ResumeSection;
