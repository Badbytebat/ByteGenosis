
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, Mail, Lock, AlertTriangle, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import PixelArtBackground from './pixel-art-background';
import CelestialEye from './celestial-eye';


type LoginScreenProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleViewerMode: () => void;
  isFirebaseConfigured: boolean;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({
  email, setEmail,
  password, setPassword,
  handleSignIn,
  handleViewerMode,
  isFirebaseConfigured,
  darkMode, setDarkMode
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden transition-colors duration-500">
      <PixelArtBackground darkMode={darkMode} />
      
      <div className="relative z-10 flex flex-col items-center">
        <CelestialEye darkMode={darkMode} />
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-primary/20 shadow-xl shadow-primary/10 mt-[-40px]">
          <Button 
            onClick={() => setDarkMode(!darkMode)} 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <CardHeader className="text-center pt-12">
            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
              Welcome to Your Portfolio
            </CardTitle>
            <CardDescription>
              Please sign in to access edit mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isFirebaseConfigured && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/50 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">Firebase Not Configured</p>
                  <p className="text-xs">
                    Add your Firebase credentials to the <code>.env.local</code> file and restart the server. Authentication is disabled.
                  </p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSignIn} className="space-y-4 pt-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email" required autoComplete="email"
                    className="pl-10" disabled={!isFirebaseConfigured}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" required autoComplete="current-password"
                    className="pl-10" disabled={!isFirebaseConfigured}
                />
              </div>
              <Button type="submit" className="w-full animate-pulse-glow" disabled={!isFirebaseConfigured}>
                Sign In
              </Button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/20"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border/20"></div>
            </div>

            <Button
              onClick={handleViewerMode}
              variant="outline"
              className={cn(
                "w-full rounded-full",
                darkMode 
                  ? "jelly-btn glass-effect shadow-lg shadow-accent/30 border-accent/50 hover:bg-accent hover:text-accent-foreground"
                  : "light-btn"
              )}
            >
              <Eye className="mr-2 h-4 w-4" /> Just Viewing?
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginScreen;
