
"use client";

import React, from 'react';
import type { PortfolioData, Qualification, HeaderData, AboutData, HeroData } from '@/lib/types';
import { defaultData } from '@/lib/data';
import { getPortfolioData, savePortfolioData } from '@/lib/firestore';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
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
import FloatingChatbot from '@/components/floating-chatbot';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingCursorSelector from '@/components/floating-cursor-selector';

export type CursorStyle = 'matrix' | 'text' | 'orb' | 'ghost' | 'jello' | 'underline' | 'ink_bloom' | 'airflow' | 'glitch' | 'starlight' | 'none';


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
  const [cursorText, setCursorText] = React.useState('');
  const [cursorColor, setCursorColor] = React.useState(CURSOR_COLORS[0]);
  const [cursorStyle, setCursorStyle] = React.useState<CursorStyle>('matrix');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [darkMode, setDarkMode] = React.useState(true);
  
  const { toast } = useToast();
  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'CHANGEME';
  const wordIndexRef = React.useRef(0);
  const colorIndexRef = React.useRef(0);

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

    // Activate custom cursor if not in edit mode and a style is selected
    if (!editMode && cursorStyle !== 'none') {
      window.addEventListener('mouseover', handleMouseOver);
      window.addEventListener('mouseout', handleMouseOut);
    }
    
    return () => {
        window.removeEventListener('mouseover', handleMouseOver);
        window.removeEventListener('mouseout', handleMouseOut);
    }
  }, [editMode, darkMode, cursorStyle]);


  const debouncedSave = useDebouncedCallback(async (newData: Partial<PortfolioData>) => {
    if (!editMode) return;
    try {
      await savePortfolioData(newData as PortfolioData);
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
                newItem = { id: newId, title: 'New Project', description: '...', tags: [], link: '#' };
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
  
  const handleResumeUpload = async (file: File) => {
    if (!editMode || !user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to upload a resume.' });
      return;
    }
    if (isResumeUploading) return;
  
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    if (!allowedTypes.includes(file.type)) {
      toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PDF or DOCX file.' });
      return;
    }
  
    setIsResumeUploading(true);
    const { id: toastId, update } = toast({ description: "Uploading resume..." });
  
    try {
      const filePath = `resumes/${user.uid}/${file.name}`;
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) return;
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
  
  return (
    <>
      <MatrixCursor 
          darkMode={darkMode} 
          cursorText={cursorText} 
          color={cursorColor} 
          style={cursorStyle} 
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
              isFirebaseConfigured={isFirebaseConfigured}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </motion.div>
        ) : (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'easeInOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            className={`flex min-h-screen flex-col bg-background ${darkMode ? 'dark' : 'light'}`}
          >
            <div className="flex flex-1 flex-col">
              <Header 
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                scrollToSection={scrollToSection}
                headerData={data.header}
                editMode={editMode}
                onUpdate={handleHeaderUpdate}
                isLoggedIn={!!user}
              />
              
              <div className="fixed bottom-4 left-4 z-50">
                {editMode ? (
                  <Button onClick={handleLogout}>Logout &amp; Exit Edit Mode</Button>
                ) : (
                  <Button onClick={handleReturnToLogin}>Login to Edit</Button>
                )}
              </div>

              <main className="flex-1">
                <HeroSection 
                    data={data.hero}
                    editMode={editMode}
                    onUpdate={handleHeroUpdate}
                    scrollToSection={scrollToSection} 
                    darkMode={darkMode}
                />
                <AboutSection 
                  data={data.about}
                  editMode={editMode}
                  onUpdate={handleAboutUpdate}
                  darkMode={darkMode}
                />
                <ExperienceSection 
                    data={data.experience} 
                    editMode={editMode} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <SkillsSection 
                    data={data.skills} 
                    editMode={editMode}
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <ProjectsSection 
                    data={data.projects} 
                    editMode={editMode} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <ProjectRecommender darkMode={darkMode} />
                <EducationSection 
                    data={educationItems} 
                    editMode={editMode} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <CertificationsSection 
                    data={certificationItems} 
                    editMode={editMode} 
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
                <ResumeSection 
                    resumeUrl={data.resumeUrl}
                    editMode={editMode}
                    onUpload={handleResumeUpload}
                    isUploading={isResumeUploading}
                    darkMode={darkMode}
                />
                <ContactSection
                    data={data.contact}
                    editMode={editMode}
                    updateEntry={handleUpdate as any}
                    addEntry={handleAdd as any}
                    deleteEntry={handleDelete as any}
                    darkMode={darkMode}
                />
              </main>
              <Footer />
              <FloatingChatbot darkMode={darkMode} portfolioData={data} />
              <FloatingCursorSelector 
                darkMode={darkMode} 
                selectedStyle={cursorStyle} 
                onStyleChange={setCursorStyle} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

    

    

