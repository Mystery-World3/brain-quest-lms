
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
    // Simulasikan delay untuk efek interaktif
    setTimeout(() => {
      if (email && password) {
        localStorage.setItem('teacher_session', 'active');
        router.push('/teacher/dashboard');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs for visual appeal */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      {/* Persistent Theme Toggle */}
      <div className="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md glass-morphism border-none ring-1 ring-white/20 animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center pt-10">
          <div className="mx-auto bg-primary p-5 rounded-3xl w-fit mb-6 shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <GraduationCap className="text-white w-12 h-12" />
          </div>
          <CardTitle className="text-3xl font-headline font-black text-foreground mb-2">Portal Pengajar</CardTitle>
          <CardDescription className="text-base font-medium">Silakan masuk untuk mengelola kuis dan memantau perkembangan siswa.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Sekolah</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="email" 
                  placeholder="guru@sekolah.id" 
                  className="pl-12 h-14 bg-background/50 border-2 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-14 bg-background/50 border-2 rounded-2xl focus:ring-primary focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 font-black text-xl rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all group"
              >
                {loading ? 'Memverifikasi...' : 'Masuk Dashboard'} 
                {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">Atau</span></div>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => router.push('/')} 
            className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-bold"
          >
            <ChevronLeft className="mr-2 w-4 h-4" /> Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
