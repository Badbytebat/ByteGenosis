
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon } from 'lucide-react';
import LogoIcon from './logo-icon';
import type { HeaderData } from '@/lib/types';
import { cn } from '@/lib/utils';

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  scrollToSection: (id: string) => void;
  headerData: HeaderData;
  editMode: boolean;
  onUpdate: (field: keyof HeaderData, value: string) => void;
  isLoggedIn: boolean;
};

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, scrollToSection, headerData, editMode, onUpdate, isLoggedIn }) => {
  const navItems = ['about', 'experience', 'skills', 'projects', 'education', 'certifications', 'resume', 'contact'];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between transition-all duration-300",
      "bg-background/50 backdrop-blur-lg border-b border-white/10"
    )}>
      {/* Left Side */}
      <div className="flex-shrink-0">
        <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="flex items-center gap-2 group">
          {editMode ? (
            <Input 
              value={headerData.logoText} 
              onChange={(e) => onUpdate('logoText', e.target.value)} 
              className="w-16 h-8 text-xl font-bold p-1"
            />
          ) : (
            <span className="text-xl font-headline font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {headerData.logoText}
            </span>
          )}
          <LogoIcon className="group-hover:text-accent transition-colors duration-300" />
        </a>
      </div>

      {/* Center Nav - Hidden on small screens */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <Button 
            key={item} 
            onClick={() => scrollToSection(item)} 
            variant="ghost" 
            className="glass-effect capitalize nav-link-animate"
          >
            <span className="pointer-events-none">{item}</span>
          </Button>
        ))}
      </nav>
      
      {/* Right Side */}
      <div className="flex items-center gap-2">
        <Button onClick={() => setDarkMode(!darkMode)} variant="ghost" size="icon" className="hover:bg-accent/20 transition-all" aria-label="Toggle theme">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
