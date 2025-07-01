
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, Mail, Lock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

type LoginScreenProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleViewerMode: () => void;
  shatterActive: boolean;
  batAnimation: boolean;
  isFirebaseConfigured: boolean;
};

const LoginScreen: React.FC<LoginScreenProps> = ({
  email, setEmail,
  password, setPassword,
  handleSignIn,
  handleViewerMode, shatterActive, batAnimation,
  isFirebaseConfigured
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute inset-0 glass-effect opacity-40"></div>

      <Card className="relative z-10 w-full max-w-md bg-card/80 backdrop-blur-lg border-primary/20 shadow-xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
            🦇 Welcome to the Batcave
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
            <Button type="submit" className="w-full" disabled={!isFirebaseConfigured}>
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
            className="w-full glass-effect rounded-full shadow-lg shadow-accent/30 border-accent/50 hover:bg-accent hover:text-accent-foreground"
          >
            <Eye className="mr-2 h-4 w-4" /> Just Viewing?
          </Button>
        </CardContent>
      </Card>

      {shatterActive && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="glass-shard"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                transform: `rotate(${Math.random() * 360}deg) translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px)`,
                animationDelay: `${Math.random() * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      )}

      {batAnimation && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <Image
            src="https://placehold.co/200x100.png"
            data-ai-hint="bat silhouette"
            alt="Bat flyby"
            width={100}
            height={50}
            className="w-20 h-auto absolute right-0 top-1/2 transform -translate-y-1/2 animate-flyby filter invert"
          />
        </div>
      )}
    </div>
  );
};

export default LoginScreen;
