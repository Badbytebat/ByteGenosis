
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
};

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, scrollToSection, headerData, editMode, onUpdate }) => {
  const navItems = ['home', 'about', 'experience', 'skills', 'projects', 'education', 'certifications', 'resume', 'contact'];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center bg-background/50 backdrop-blur-lg border-b border-white/10">
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

      <nav className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item);
            }}
            className="uppercase text-sm tracking-wider hover:text-accent transition-all relative group"
          >
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
          </a>
        ))}
      </nav>

      <Button onClick={() => setDarkMode(!darkMode)} variant="ghost" size="icon" className="ml-4 hover:bg-accent/20 transition-all">
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
};

export default Header;
