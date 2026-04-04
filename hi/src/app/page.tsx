
"use client";

import React from 'react';
import { flushSync } from 'react-dom';
import type { PortfolioData, Qualification, HeaderData, AboutData, HeroData, AiAssistantSettings, SiteMeta, ThemePalette } from '@/lib/types';
import { isThemePalette } from '@/lib/types';
import { defaultData } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getPortfolioData, savePortfolioData, mergePortfolioRow } from '@/lib/firestore';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { useIsMobile } from '@/hooks/use-mobile';
import { uploadFile } from '@/lib/storage';
import { motion, AnimatePresence } from 'framer-motion';

import LoginScreen from '@/components/login-screen';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MatrixCursor from '@/components/matrix-cursor';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import ExperienceSection from '@/components/sections/experience';
import SkillsSection from '@/components/sections/skills';
import ProjectsSection from '@/components/sections/projects';
import EducationSection from '@/components/sections/education';
import CertificationsSection from '@/components/sections/certifications';
import ResumeSection from '@/components/sections/resume';
import ContactSection from '@/components/sections/contact';
import ProjectRecommender from '@/components/sections/project-recommender';
import NotesSection from '@/components/sections/notes-section';
import DownloadableAssetsSection from '@/components/sections/downloadable-assets-section';
import SiteMetaSection from '@/components/sections/site-meta-section';
import SiteMetadata from '@/components/site-metadata';
import JsonLd from '@/components/json-ld';
import FloatingChatbot from '@/components/floating-chatbot';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingCursorSelector from '@/components/floating-cursor-selector';
import { PortfolioStarrySky } from '@/components/portfolio-starry-sky';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

export type CursorStyle = 'matrix' | 'text' | 'orb' | 'ghost' | 'jello' | 'underline' | 'ink_bloom' | 'aurora' | 'circuit_pulse' | 'starlight' | 'none';


const SELECTION_WORDS = [
  "Select", "Elegir", "Choisir", "Wählen", "選択", "선택", "选择", "Выбрать", "Selezionare", "Kies",
  "ചुनें", "تحديد", "בחירה", "Valitse", "Velg", "Vælg", "Selecione", "Seç", "เลือก", "kies", "zgjidhni", "ይምረጡ", "يختار", "ընտրել", "চয়ন কৰা", "seçin", "নির্বাচন করুন", "izaberite", "изберете", "seleccionar", "选择", "選擇", "izabrati", "vybrat", "vælge", "selecteren", "select", "vali", "valita", "sélectionner", "აირჩიე", "auswählen", "επιλέγω", "પસંદ કરો", "chwazi", "בחר", "चयन करें", "kiválaszt", "velja", "pilih", "selezionare", "選択する", "ಆಯ್ಕೆಮಾಡಿ", "таңдаңыз", "선택하다", "izvēlēties", "pasirinkti", "избери", "pilih", "agħżel", "निवडा", "сонгох", "चयन गर्नुहोस्", "velge", "انتخاب کنید", "wybierz", "selecionar", "ਚੁਣੋ", "selectați", "выбрать", "изаберите", "vybrať", "izberite", "seleccionar", "chagua", "välj", "தேர்வு செய்யவும்", "ఎంచుకోండి", "seçmek", "вибрати", "منتخب کریں", "chọn", "dewiswch"
];

const CURSOR_COLORS = [
    'hsl(260, 60%, 65%)', '#ff6b6b', '#feca57', 
    'hsl(228, 64%, 33%)', '#48dbfb', 'hsl(169, 100%, 50%)'
];

export default function HomePage() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  
  const [data, setData] = React.useState<PortfolioData>(defaultData);
  const [initialDataLoading, setInitialDataLoading] = React.useState(true);
  const [showLogin, setShowLogin] = React.useState(true);
  const [editMode, setEditMode] = React.useState(false);
  const [isResumeUploading, setIsResumeUploading] = React.useState(false);
  const [isAboutPhotoUploading, setIsAboutPhotoUploading] = React.useState(false);
  const [cursorText, setCursorText] = React.useState('');
  const [cursorColor, setCursorColor] = React.useState(CURSOR_COLORS[0]);
  const [cursorStyle, setCursorStyle] = React.useState<CursorStyle>('matrix');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [darkMode, setDarkMode] = React.useState(true);
  
  const { toast } = useToast();
  const wordIndexRef = React.useRef(0);
  const colorIndexRef = React.useRef(0);
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const importInputRef = React.useRef<HTMLInputElement>(null);
  const dataRef = React.useRef(data);
  dataRef.current = data;
  const [previewAsVisitor, setPreviewAsVisitor] = React.useState(false);
  const sessionBaselineRef = React.useRef<PortfolioData | null>(null);
  const prevEditMode = React.useRef(false);

  // Fetch initial data
  React.useEffect(() => {
    const fetchData = async () => {
      setInitialDataLoading(true);
      try {
        const portfolioData = await getPortfolioData();
        setData(portfolioData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching data',
          description: 'Could not load portfolio data. Displaying default content.'
        });
      } finally {
        setInitialDataLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
  // Handle auth state changes
  React.useEffect(() => {
    if (!authLoading) {
      if (user) {
        setEditMode(true);
        setShowLogin(false);
        toast({ title: "Welcome!", description: "Edit mode activated." });
      } else {
        setEditMode(false);
      }
    }
  }, [user, authLoading, toast]);

  /** Visitors: restore palette from localStorage (owners keep portfolio JSON). */
  React.useEffect(() => {
    if (initialDataLoading || authLoading) return;
    if (user) return;
    try {
      const raw = localStorage.getItem('portfolio-theme-palette');
      if (isThemePalette(raw)) {
        setData((prev) =>
          prev.themePalette === raw ? prev : { ...prev, themePalette: raw }
        );
      }
    } catch {
      /* ignore */
    }
  }, [initialDataLoading, authLoading, user]);

  // Handle custom cursor visibility based on edit mode and style
  React.useEffect(() => {
    const isInteractive = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      const clickableTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'];
      const isClickable = clickableTags.includes(element.tagName) || (element.onclick !== null) || (element.style.cursor === 'pointer');
      return isClickable || isInteractive(element.parentElement);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isInteractive(target)) {
        wordIndexRef.current = (wordIndexRef.current + 1) % SELECTION_WORDS.length;
        setCursorText(SELECTION_WORDS[wordIndexRef.current]);

        colorIndexRef.current = (colorIndexRef.current + 1) % CURSOR_COLORS.length;
        setCursorColor(CURSOR_COLORS[colorIndexRef.current]);
      } else {
        setCursorText('');
      }
    };
    
    const handleMouseOut = () => {
        setCursorText('');
    };

    // Keep listeners in edit mode too — otherwise matrix/text cursors get no cursorText on hovers and disappear on buttons/inputs
    if (cursorStyle !== 'none') {
      window.addEventListener('mouseover', handleMouseOver);
      window.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [editMode, darkMode, cursorStyle]);


  const debouncedSave = useDebouncedCallback(async (newData: Partial<PortfolioData>) => {
    if (!editMode) return;
    try {
      await savePortfolioData(newData);
      toast({ description: "Changes saved automatically." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save changes.' });
    }
  }, 1500);

  const handleUpdate = React.useCallback(<K extends keyof PortfolioData>(
    section: K,
    id: number,
    field: string,
    value: any
  ) => {
    setData(prevData => {
      const sectionData = prevData[section] as any[];
      const updatedSectionData = sectionData.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      const newData = { ...prevData, [section]: updatedSectionData };
      debouncedSave({ [section]: updatedSectionData });
      return newData;
    });
  }, [debouncedSave]);
  
  const handleAdd = React.useCallback(<K extends keyof PortfolioData>(
    section: K,
    itemType?: 'education' | 'certification'
  ) => {
    setData(prevData => {
        const sectionData = prevData[section] as any[];
        const newId = sectionData.length > 0 ? Math.max(...sectionData.map(item => item.id)) + 1 : 1;
        
        let newItem: any;
        switch (section) {
            case 'experience':
                newItem = { id: newId, role: 'New Role', company: 'New Company', duration: 'Present', description: '...' };
                break;
            case 'skills':
                newItem = { id: newId, name: 'New Skill', level: 50 };
                break;
            case 'projects':
                newItem = { id: newId, title: 'New Project', description: '...', tags: [], link: '#', slug: '', caseStudyBody: '' };
                break;
            case 'notes':
                newItem = {
                  id: newId,
                  slug: `note-${newId}`,
                  title: 'New note',
                  excerpt: '',
                  body: '',
                  publishedAt: new Date().toISOString().slice(0, 10),
                };
                break;
            case 'downloadableAssets':
                newItem = { id: newId, label: 'New file', url: '#' };
                break;
            case 'qualifications':
                newItem = { id: newId, type: itemType, title: 'New Entry', institution: 'Institution', duration: 'Year', description: '...' };
                break;
            case 'contact':
                newItem = { id: newId, icon: 'Mail', label: 'New Contact', value: 'new@contact.com', href: '#' };
                break;
        }

        const updatedSection = [...(sectionData || []), newItem];
        const newData = { ...prevData, [section]: updatedSection };
        debouncedSave({ [section]: updatedSection });
        return newData;
    });
  }, [debouncedSave]);

  const handleDelete = React.useCallback(<K extends keyof PortfolioData>(section: K, id: number) => {
    setData(prevData => {
        const sectionData = prevData[section] as any[];
        const updatedSectionData = sectionData.filter(item => item.id !== id);
        const newData = { ...prevData, [section]: updatedSectionData };
        debouncedSave({ [section]: updatedSectionData });
        return newData;
    });
  }, [debouncedSave]);
  
  const handleHeaderUpdate = React.useCallback((field: keyof HeaderData, value: string) => {
    setData(prevData => {
        const newHeader = { ...prevData.header, [field]: value };
        debouncedSave({ header: newHeader });
        return { ...prevData, header: newHeader };
    });
  }, [debouncedSave]);

  const handleHeroUpdate = React.useCallback((field: keyof HeroData, value: string) => {
    setData(prevData => {
        const newHero = { ...prevData.hero, [field]: value };
        debouncedSave({ hero: newHero });
        return { ...prevData, hero: newHero };
    });
  }, [debouncedSave]);

  const handleAboutUpdate = React.useCallback((field: keyof AboutData, value: string) => {
    setData(prevData => {
        const newAbout = { ...prevData.about, [field]: value };
        debouncedSave({ about: newAbout });
        return { ...prevData, about: newAbout };
    });
  }, [debouncedSave]);

  const handleAiAssistantUpdate = React.useCallback(
    (field: keyof AiAssistantSettings, value: string) => {
      setData((prevData) => {
        const next: AiAssistantSettings = { ...prevData.aiAssistant, [field]: value };
        debouncedSave({ aiAssistant: next });
        return { ...prevData, aiAssistant: next };
      });
    },
    [debouncedSave]
  );

  const handleSiteMetaUpdate = React.useCallback(
    (field: keyof SiteMeta, value: string) => {
      setData((prevData) => {
        const siteMeta = { ...prevData.siteMeta, [field]: value };
        debouncedSave({ siteMeta });
        return { ...prevData, siteMeta };
      });
    },
    [debouncedSave]
  );

  const handleThemePaletteChange = React.useCallback(
    (themePalette: ThemePalette) => {
      try {
        localStorage.setItem('portfolio-theme-palette', themePalette);
      } catch {
        /* ignore quota / private mode */
      }
      setData((prevData) => ({ ...prevData, themePalette }));
      if (editMode) debouncedSave({ themePalette });
    },
    [debouncedSave, editMode]
  );

  React.useEffect(() => {
    document.documentElement.setAttribute("data-palette", data.themePalette);
  }, [data.themePalette]);

  React.useEffect(() => {
    if (editMode && user && !prevEditMode.current) {
      sessionBaselineRef.current = JSON.parse(JSON.stringify(dataRef.current));
    }
    if (!editMode || !user) {
      sessionBaselineRef.current = null;
    }
    prevEditMode.current = editMode;
  }, [editMode, user]);

  const handleExportPortfolio = React.useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast({ description: "Portfolio JSON downloaded." });
  }, [data, toast]);

  const handleImportPortfolio: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !user) return;
      try {
        const text = await file.text();
        const raw = JSON.parse(text) as Record<string, unknown>;
        const merged = mergePortfolioRow(raw);
        await savePortfolioData(merged);
        setData(merged);
        toast({ title: "Imported", description: "Portfolio JSON was saved." });
      } catch {
        toast({
          variant: "destructive",
          title: "Import failed",
          description: "Check that the file is valid portfolio JSON.",
        });
      }
    },
    [toast, user]
  );

  const handleRevertSession = React.useCallback(async () => {
    const snap = sessionBaselineRef.current;
    if (!snap) {
      toast({ variant: "destructive", title: "No session snapshot" });
      return;
    }
    try {
      flushSync(() => setData(snap));
      await savePortfolioData(snap);
      toast({ title: "Restored", description: "Reverted to data from when this edit session started." });
    } catch {
      toast({ variant: "destructive", title: "Revert failed" });
    }
  }, [toast]);
  
  const handleResumeUpload = async (file: File) => {
    if (!editMode || !user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload a resume.' });
      return;
    }
    if (isResumeUploading) return;
  
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF file (max 50 MB).' });
      return;
    }
  
    setIsResumeUploading(true);
    const { id: toastId, update } = toast({ description: "Uploading resume..." });
  
    try {
      const filePath = `resumes/${user.id}/${file.name}`;
      const downloadURL = await uploadFile(file, filePath);
  
      await savePortfolioData({ ...data, resumeUrl: downloadURL });
  
      setData(prevData => ({ ...prevData, resumeUrl: downloadURL }));
      
      update({ id: toastId, title: "Success!", description: "Resume uploaded successfully." });
    } catch (error: any) {
      console.error("Resume upload failed:", error);
      update({
        id: toastId,
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Could not upload resume. Please check the console.'
      });
    } finally {
      setIsResumeUploading(false);
    }
  };

  const handleAboutPhotoUpload = async (file: File) => {
    if (!editMode || !user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload a photo.' });
      return;
    }
    if (isAboutPhotoUploading) return;
    setIsAboutPhotoUploading(true);
    const { id: toastId, update } = toast({ description: 'Uploading photo...' });
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, '_');
      const filePath = `photos/${user.id}/${Date.now()}-${safeName}`;
      const url = await uploadFile(file, filePath);
      const newAbout = await new Promise<AboutData>((resolve) => {
        flushSync(() => {
          setData((prev) => {
            const next = { ...prev.about, imageUrl: url };
            resolve(next);
            return { ...prev, about: next };
          });
        });
      });
      await savePortfolioData({ about: newAbout });
      update({ id: toastId, title: 'Success!', description: 'Profile photo updated.' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      update({ id: toastId, variant: 'destructive', title: 'Upload Failed', description: message });
    } finally {
      setIsAboutPhotoUploading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    await signIn(email, password);
  };

  const handleViewerMode = () => {
    setTimeout(() => {
        setShowLogin(false);
    }, 300); // Small delay for fade out to start
  };
  
  const handleLogout = async () => {
    await signOut();
    setEditMode(false);
    setShowLogin(true);
  };

  const handleReturnToLogin = () => {
    setShowLogin(true);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // If element is not found (e.g., 'home'), scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  if (authLoading || initialDataLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Portfolio...</p>
      </div>
    );
  }

  const educationItems = data.qualifications?.filter(q => q.type === 'education') || [];
  const certificationItems = data.qualifications?.filter(q => q.type === 'certification') || [];
  const editChrome = editMode && !previewAsVisitor;
  const showNotesNav = data.notes.length > 0 || !!editChrome;
  const showDownloadsNav = data.downloadableAssets.length > 0 || !!editChrome;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

  return (
    <>
      <SiteMetadata
        siteMeta={data.siteMeta}
        canonicalUrl={siteUrl ? `${siteUrl}/` : undefined}
      />
      <JsonLd data={data} siteUrl={siteUrl || undefined} />
      <MatrixCursor 
          darkMode={darkMode} 
          cursorText={cursorText} 
          color={cursorColor} 
          style={cursorStyle}
          reduceMotion={reduceMotion}
        />
      <AnimatePresence mode="wait">
        {(showLogin && !user) ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          >
            <LoginScreen
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSignIn={handleSignIn}
              handleViewerMode={handleViewerMode}
              isSupabaseConfigured={isSupabaseConfigured}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className="relative flex min-h-screen flex-col"
          >
            <PortfolioStarrySky darkMode={darkMode} fullscreen />
            <div className="relative z-[5] flex flex-1 flex-col">
              {editMode && user && previewAsVisitor && (
                <div className="fixed top-16 left-0 right-0 z-[55] flex flex-wrap items-center justify-center gap-3 border-b border-accent/30 bg-background/95 px-4 py-2 text-sm backdrop-blur">
                  <span>Previewing as a visitor (editing hidden)</span>
                  <Button type="button" size="sm" onClick={() => setPreviewAsVisitor(false)}>
                    Exit preview
                  </Button>
                </div>
              )}
              <Header 
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                scrollToSection={scrollToSection}
                headerData={data.header}
                editMode={!!editChrome}
                onUpdate={handleHeaderUpdate}
                showNotesNav={showNotesNav}
                showDownloadsNav={showDownloadsNav}
                themePalette={data.themePalette}
                onThemePaletteChange={handleThemePaletteChange}
              />
              
              <div className="fixed bottom-4 left-4 z-50 flex max-w-[min(100vw-2rem,22rem)] flex-col gap-2">
                {editMode && user ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" size="sm" variant="secondary" onClick={handleExportPortfolio}>
                        Export JSON
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => importInputRef.current?.click()}
                      >
                        Import JSON
                      </Button>
                      <input
                        ref={importInputRef}
                        type="file"
                        accept="application/json,.json"
                        className="hidden"
                        onChange={handleImportPortfolio}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={handleRevertSession}>
                        Revert session
                      </Button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setPreviewAsVisitor((p) => !p)}
                    >
                      {previewAsVisitor ? "Stop preview" : "Preview as visitor"}
                    </Button>
                    <Button onClick={handleLogout}>Logout &amp; Exit Edit Mode</Button>
                  </>
                ) : (
                  <Button onClick={handleReturnToLogin}>Login to Edit</Button>
                )}
              </div>

              <main className="flex-1">
                <HeroSection 
                    data={data.hero}
                    editMode={!!editChrome}
                    onUpdate={handleHeroUpdate}
                    scrollToSection={scrollToSection} 
                    darkMode={darkMode}
                />
                <AboutSection 
                  data={data.about}
                  editMode={!!editChrome}
                  onUpdate={handleAboutUpdate}
                  onProfileImageUpload={handleAboutPhotoUpload}
                  isProfileImageUploading={isAboutPhotoUploading}
                  darkMode={darkMode}
                />
                <ExperienceSection 
                    data={data.experience} 
                    editMode={!!editChrome} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <SkillsSection 
                    data={data.skills} 
                    editMode={!!editChrome}
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <ProjectsSection 
                    data={data.projects} 
                    editMode={!!editChrome} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <ProjectRecommender darkMode={darkMode} />
                <NotesSection
                  data={data.notes}
                  editMode={!!editChrome}
                  updateEntry={handleUpdate as any}
                  addEntry={handleAdd as any}
                  deleteEntry={handleDelete as any}
                  darkMode={darkMode}
                />
                <EducationSection 
                    data={educationItems} 
                    editMode={!!editChrome} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <CertificationsSection 
                    data={certificationItems} 
                    editMode={!!editChrome} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <DownloadableAssetsSection
                  data={data.downloadableAssets}
                  editMode={!!editChrome}
                  updateEntry={handleUpdate as any}
                  addEntry={handleAdd as any}
                  deleteEntry={handleDelete as any}
                  darkMode={darkMode}
                />
                <ResumeSection 
                    resumeUrl={data.resumeUrl}
                    editMode={!!editChrome}
                    onUpload={handleResumeUpload}
                    isUploading={isResumeUploading}
                    darkMode={darkMode}
                />
                <ContactSection
                    data={data.contact}
                    editMode={!!editChrome}
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                {editChrome && (
                  <SiteMetaSection siteMeta={data.siteMeta} onChange={handleSiteMetaUpdate} />
                )}
              </main>
              <Footer />
              <FloatingChatbot
                darkMode={darkMode}
                portfolioData={data}
                isLoggedIn={!!user}
                onAiAssistantChange={handleAiAssistantUpdate}
                reduceMotion={reduceMotion}
              />
              {!isMobile && (
                <FloatingCursorSelector 
                  darkMode={darkMode} 
                  selectedStyle={cursorStyle} 
                  onStyleChange={setCursorStyle} 
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
