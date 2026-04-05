
"use client";

import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sun, Moon, Upload, X, Loader2, SlidersHorizontal } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  scrollToSection: (id: string) => void;
  headerData: HeaderData;
  editMode: boolean;
  onUpdate: (field: keyof HeaderData, value: string | number | undefined) => void;
  onLogoUpload?: (file: File) => void;
  logoUploading?: boolean;
  showNotesNav: boolean;
  showDownloadsNav: boolean;
  themePalette: ThemePalette;
  onThemePaletteChange: (palette: ThemePalette) => void;
};

const DEFAULT_LOGO_W = 400;
const DEFAULT_LOGO_H = 48;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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
  onLogoUpload,
  logoUploading = false,
  showNotesNav,
  showDownloadsNav,
  themePalette,
  onThemePaletteChange,
}) => {
  const [logoSizeOpen, setLogoSizeOpen] = React.useState(false);
  /** Toggle + dropdown — exclude both from “click outside” close. */
  const logoSizeWrapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!logoSizeOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (logoSizeWrapRef.current?.contains(e.target as Node)) return;
      setLogoSizeOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLogoSizeOpen(false);
    };
    const t = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown, true);
    }, 0);
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [logoSizeOpen]);

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

  const logoUrl = headerData.logoImageUrl?.trim();
  const logoW = clamp(headerData.logoWidthPx ?? DEFAULT_LOGO_W, 80, 560);
  const logoH = clamp(headerData.logoHeightPx ?? DEFAULT_LOGO_H, 24, 120);

  const mark = logoUrl ? (
    <span className="inline-flex min-w-0 max-w-full items-center">
      <img
        src={logoUrl}
        alt=""
        style={{ maxWidth: logoW, maxHeight: logoH }}
        className="h-auto w-auto max-w-full rounded-md object-contain object-left"
        width={logoW}
        height={logoH}
        sizes="(max-width: 768px) 45vw, 400px"
      />
    </span>
  ) : (
    <LogoIcon className="h-10 w-10 shrink-0 text-primary" />
  );

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-40 flex min-w-0 items-center gap-2 px-4 py-4 transition-all duration-300 sm:gap-3 sm:px-8",
        "bg-background/50 backdrop-blur-lg border-b border-white/10"
      )}
    >
      {/* Equal flex sides + fixed center keeps nav + palette where they belong */}
      <div className="flex min-w-0 flex-1 basis-0 items-center justify-start gap-2">
        <a
          href="#home"
          data-matrix-cta
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="group flex min-h-0 min-w-0 flex-1 items-center gap-2 overflow-hidden"
        >
          {editMode ? (
            <Input
              value={headerData.logoText}
              onChange={(e) => onUpdate('logoText', e.target.value)}
              className="h-9 w-14 min-w-0 shrink-0 text-lg font-bold sm:w-20"
            />
          ) : (
            <span className="shrink-0 text-xl font-headline font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              {headerData.logoText}
            </span>
          )}
          <span className="min-w-0 flex-1">{mark}</span>
        </a>
        {editMode && onLogoUpload ? (
          <div className="relative z-[100] flex shrink-0 items-center gap-1">
            {/* Native label + visually hidden input — programmatic .click() on display:none inputs often fails */}
            <label
              className={cn(
                buttonVariants({ variant: 'outline', size: 'icon' }),
                'h-9 w-9 shrink-0 cursor-pointer',
                logoUploading && 'pointer-events-none opacity-50'
              )}
              title="Upload logo image"
            >
              <input
                type="file"
                accept="image/*,.ico"
                className="sr-only"
                disabled={logoUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) onLogoUpload(f);
                }}
              />
              {logoUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </label>
            {logoUrl ? (
              <>
                <div ref={logoSizeWrapRef} className="relative">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 shrink-0"
                    title="Logo width & height"
                    disabled={logoUploading}
                    aria-expanded={logoSizeOpen}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLogoSizeOpen((o) => !o);
                    }}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                  {logoSizeOpen ? (
                    <div
                      className="absolute left-0 top-[calc(100%+6px)] z-[200] w-80 space-y-4 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md"
                      role="dialog"
                      aria-label="Logo size"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs">Width ({logoW}px)</Label>
                          <span className="text-[10px] text-muted-foreground">80–560</span>
                        </div>
                        <Slider
                          min={80}
                          max={560}
                          step={4}
                          value={[logoW]}
                          onValueChange={([v]) => onUpdate('logoWidthPx', v)}
                          aria-label="Logo width"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <Label className="text-xs">Height ({logoH}px)</Label>
                          <span className="text-[10px] text-muted-foreground">24–120</span>
                        </div>
                        <Slider
                          min={24}
                          max={120}
                          step={2}
                          value={[logoH]}
                          onValueChange={([v]) => onUpdate('logoHeightPx', v)}
                          aria-label="Logo height"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => {
                          onUpdate('logoWidthPx', undefined);
                          onUpdate('logoHeightPx', undefined);
                        }}
                      >
                        Reset size to default
                      </Button>
                    </div>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 shrink-0 text-muted-foreground"
                  title="Remove custom logo"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLogoSizeOpen(false);
                    onUpdate('logoImageUrl', undefined);
                    onUpdate('logoWidthPx', undefined);
                    onUpdate('logoHeightPx', undefined);
                  }}
                  disabled={logoUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <nav className="hidden shrink-0 md:flex md:items-center md:gap-1 lg:gap-2">
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

      <div className="flex min-w-0 flex-1 basis-0 items-center justify-end gap-1 sm:gap-2">
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
