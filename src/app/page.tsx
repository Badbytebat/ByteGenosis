
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { PortfolioData, Qualification, HeaderData, AboutData } from '@/lib/types';
import { defaultData } from '@/lib/data';
import { getPortfolioData, savePortfolioData } from '@/lib/firestore';
import { useAuth } from '@/context/auth-provider';
import { useToast, toast } from '@/hooks/use-toast';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { uploadFile } from '@/lib/storage';

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
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  
  const [shatterActive, setShatterActive] = useState(false);
  const [batAnimation, setBatAnimation] = useState(false);

  const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'CHANGEME';

  // Fetch initial data
  useEffect(() => {
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
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setEditMode(true);
        setShowLogin(false);
        toast({ title: "Welcome!", description: "Edit mode activated." });
        document.documentElement.classList.remove('viewer-mode-active');
      } else {
        setEditMode(false);
      }
    }
  }, [user, authLoading, toast]);

  const debouncedSave = useDebouncedCallback(async (newData: PortfolioData) => {
    if (!editMode) return;
    try {
      await savePortfolioData(newData);
      toast({ description: "Changes saved automatically." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save changes.' });
    }
  }, 1500);

  const handleUpdate = useCallback(<K extends keyof PortfolioData>(
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
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);
  
  const handleAdd = useCallback(<K extends keyof PortfolioData>(
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

        const newData = { ...prevData, [section]: [...(sectionData || []), newItem] };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);

  const handleDelete = useCallback(<K extends keyof PortfolioData>(section: K, id: number) => {
    setData(prevData => {
        const sectionData = prevData[section] as any[];
        const updatedSectionData = sectionData.filter(item => item.id !== id);
        const newData = { ...prevData, [section]: updatedSectionData };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);
  
  const handleHeaderUpdate = useCallback((field: keyof HeaderData, value: string) => {
    setData(prevData => {
        const newHeader = { ...prevData.header, [field]: value };
        const newData = { ...prevData, header: newHeader };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);

  const handleAboutUpdate = useCallback((field: keyof AboutData, value: string) => {
    setData(prevData => {
        const newAbout = { ...prevData.about, [field]: value };
        const newData = { ...prevData, about: newAbout };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);
  
  const handleResumeUpload = async (file: File) => {
    if (!editMode || !file) return;

    const { id: toastId, update } = toast({ description: "Uploading resume..." });
    try {
        const downloadURL = await uploadFile(file, `resumes/resume_${Date.now()}_${file.name}`);
        setData(prevData => {
            const newData = { ...prevData, resumeUrl: downloadURL };
            debouncedSave(newData);
            return newData;
        });
        update({ id: toastId, description: "Resume uploaded successfully." });
    } catch (error) {
        update({ id: toastId, variant: 'destructive', title: 'Upload failed', description: 'Could not upload resume.' });
    }
  };

  const handleProfilePicUpload = async (file: File) => {
    if (!editMode || !file) return;

    console.log("Starting profile picture upload for file:", file.name);
    const { id: toastId, update } = toast({ description: "Uploading profile picture..." });

    try {
        const downloadURL = await uploadFile(file, `profile-pictures/profile_${Date.now()}_${file.name}`);
        console.log("Upload successful. Download URL:", downloadURL);

        setData(prevData => {
            const newAbout = { ...prevData.about, imageUrl: downloadURL };
            const newData = { ...prevData, about: newAbout };
            console.log("Updating local state and preparing to save to Firestore.");
            debouncedSave(newData);
            return newData;
        });

        update({ id: toastId, description: "Profile picture updated successfully." });
    } catch (error) {
        console.error("Profile picture upload failed:", error);
        update({ id: toastId, variant: 'destructive', title: 'Upload failed', description: 'Could not upload profile picture.' });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) return;
    await signIn(email, password);
  };

  const handleViewerMode = () => {
    setShatterActive(true);
    setBatAnimation(true);
    document.documentElement.classList.add('viewer-mode-active');
    setTimeout(() => setShowLogin(false), 1000); 
  };
  
  const handleLogout = async () => {
    await signOut();
    setEditMode(false);
    setShowLogin(true);
    document.documentElement.classList.remove('viewer-mode-active');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (authLoading || initialDataLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Portfolio...</p>
      </div>
    );
  }

  if (showLogin && !user) {
    return (
      <LoginScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSignIn={handleSignIn}
        handleViewerMode={handleViewerMode}
        shatterActive={shatterActive}
        batAnimation={batAnimation}
        isFirebaseConfigured={isFirebaseConfigured}
      />
    );
  }

  const educationItems = data.qualifications?.filter(q => q.type === 'education') || [];
  const certificationItems = data.qualifications?.filter(q => q.type === 'certification') || [];
  
  return (
    <>
      {!editMode && <MatrixCursor />}
      <Header 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrollToSection={scrollToSection}
        headerData={data.header}
        editMode={editMode}
        onUpdate={handleHeaderUpdate}
      />
      
      {editMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={handleLogout}>Logout &amp; Exit Edit Mode</Button>
        </div>
      )}

      <main className="flex min-h-screen flex-col bg-background">
        <HeroSection scrollToSection={scrollToSection} />
        <AboutSection 
          data={data.about}
          editMode={editMode}
          onUpload={handleProfilePicUpload}
          onUpdate={handleAboutUpdate}
        />
        <ExperienceSection 
            data={data.experience} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <SkillsSection 
            data={data.skills} 
            editMode={editMode}
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <ProjectsSection 
            data={data.projects} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <EducationSection 
            data={educationItems} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <CertificationsSection 
            data={certificationItems} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <ResumeSection 
            resumeUrl={data.resumeUrl}
            editMode={editMode}
            onUpload={handleResumeUpload}
        />
        <ContactSection
            data={data.contact}
            editMode={editMode}
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
      </main>
      <Footer />
    </>
  );
}
