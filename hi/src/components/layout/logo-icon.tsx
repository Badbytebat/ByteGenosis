import React from 'react';
import { cn } from '@/lib/utils';

const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("text-primary", className)}
    >
      <path d="M21 8v13H3V8l9-7 9 7z"></path>
      <line x1="12" y1="4" x2="12" y2="16"></line>
      <line x1="16" y1="12" x2="8" y2="12"></line>
    </svg>
  );
};

export default LogoIcon;
