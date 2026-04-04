
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon } from 'lucide-react';
import LogoIcon from './logo-icon';
import type { HeaderData, ThemePalette } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  scrollToSection: (id: string) => void;
  headerData: HeaderData;
  editMode: boolean;
  onUpdate: (field: keyof HeaderData, value: string) => void;
  showNotesNav: boolean;
  showDownloadsNav: boolean;
  themePalette: ThemePalette;
  onThemePaletteChange: (palette: ThemePalette) => void;
};

const PALETTE_OPTIONS: { value: ThemePalette; label: string; hint: string }[] = [
  { value: 'default', label: 'Default', hint: 'Site default colors' },
  { value: 'midnight', label: 'Midnight', hint: 'Violet accent' },
  { value: 'ocean', label: 'Ocean', hint: 'Teal / blue accent' },
  { value: 'paper', label: 'Paper', hint: 'Warm, low-contrast surfaces' },
  { value: 'luxury', label: 'Luxury', hint: 'Sun: charcoal + silver card rims, gold accents. Moon: deeper + metal trim' },
];

const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  scrollToSection,
  headerData,
  editMode,
  onUpdate,
  showNotesNav,
  showDownloadsNav,
  themePalette,
  onThemePaletteChange,
}) => {
  const navItems = [
    'about',
    'experience',
    'skills',
    'projects',
    ...(showNotesNav ? (['notes'] as const) : []),
    'education',
    'certifications',
    ...(showDownloadsNav ? (['downloads'] as const) : []),
    'resume',
    'contact',
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between transition-all duration-300",
      "bg-background/50 backdrop-blur-lg border-b border-white/10"
    )}>
      {/* Left Side */}
      <div className="flex-shrink-0">
        <a
          href="#home"
          data-matrix-cta
          onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          className="flex items-center gap-2 group"
        >
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
          <img src="/rm.png"className="h-10 w-10 object-contain" />
        </a>
      </div>

      {/* Center Nav - Hidden on small screens */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map((item) => (
          <Button
            type="button"
            data-matrix-cta
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
      <div className="flex items-center gap-1 sm:gap-2">
        <Select
          value={themePalette}
          onValueChange={(v) => onThemePaletteChange(v as ThemePalette)}
        >
          <SelectTrigger
            type="button"
            data-matrix-cta
            className="h-9 w-[min(8.5rem,30vw)] shrink-0 text-[10px] sm:w-[158px] sm:text-xs"
            aria-label="Accent palette"
            title="Accent palette. Luxury (sun): semi-dark charcoal, platinum/silver borders on cards, gold buttons. Saved when editing."
          >
            <SelectValue placeholder="Palette" />
          </SelectTrigger>
          <SelectContent className="z-[110]">
            {PALETTE_OPTIONS.map((o) => (
              <SelectItem
                key={o.value}
                value={o.value}
                className="text-xs"
                title={o.hint}
              >
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          data-matrix-cta
          onClick={() => setDarkMode(!darkMode)}
          variant="ghost"
          size="icon"
          className="hover:bg-accent/20 transition-all"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
