
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Lock, Mail, ChevronLeft, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('teacher_session', 'active');
        router.push('/teacher/dashboard');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2 animate-pulse delay-700" />

      {/* Navigation & Theme */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg glass-morphism border-none ring-4 ring-primary/5 animate-in fade-in zoom-in duration-700 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
        <CardHeader className="text-center pt-14 pb-4">
          <div className="mx-auto bg-primary p-6 rounded-[2rem] w-fit mb-8 shadow-2xl shadow-primary/40 rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer group">
            <GraduationCap className="text-white w-14 h-14 group-hover:scale-110 transition-transform" />
          </div>
          <CardTitle className="text-4xl font-headline font-black text-foreground mb-3 tracking-tighter">Portal Pengajar</CardTitle>
          <CardDescription className="text-lg font-bold text-muted-foreground/80 px-4">Masuk untuk mengelola kuis dan pantau prestasi siswamu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-12 pb-16">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-2">Email Institusi</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  placeholder="nama@sekolah.id" 
                  className="pl-14 h-16 bg-background/40 border-4 border-transparent rounded-[1.5rem] focus:border-primary/20 focus:ring-0 transition-all text-lg font-bold placeholder:font-medium shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-2">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-14 h-16 bg-background/40 border-4 border-transparent rounded-[1.5rem] focus:border-primary/20 focus:ring-0 transition-all text-lg font-bold placeholder:font-medium shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-16 font-black text-2xl rounded-[1.5rem] shadow-2xl shadow-primary/40 active:scale-95 transition-all group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? 'Verifikasi...' : 'Masuk Dashboard'} 
                  {!loading && <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </div>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-muted" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-4 text-muted-foreground font-black tracking-[0.4em]">ATAU</span></div>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => router.push('/')} 
            className="w-full h-14 rounded-2xl text-muted-foreground hover:text-foreground font-black text-lg transition-all hover:bg-muted/30"
          >
            <ChevronLeft className="mr-3 w-6 h-6" /> Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
      
      <p className="absolute bottom-8 text-muted-foreground/40 text-xs font-black uppercase tracking-[0.5em]">
        © 2024 LKPD DIGITAL INTERAKTIF
      </p>
    </div>
  );
}
