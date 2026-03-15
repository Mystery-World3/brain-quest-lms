
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { listenToClasses } from '@/services/database';
import { Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { GraduationCap, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = listenToClasses((classes) => {
      setAvailableClasses(classes.filter(c => c.active));
    });
    return () => unsubscribe();
  }, []);

  const handleStart = () => {
    if (selectedClass && studentName) {
      const selectedCls = availableClasses.find(c => c.id === selectedClass);
      localStorage.setItem('student_name', studentName);
      localStorage.setItem('student_class', selectedClass);
      localStorage.setItem('student_class_name', selectedCls?.name || 'Kelas');
      router.push(`/student/quiz/${selectedClass}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden animate-in fade-in duration-700">
      {/* Background Decor */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <header className="w-full p-6 md:p-10 flex items-center justify-between z-20 relative max-w-7xl mx-auto">
        <Link href="/teacher/login" className="group">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-white shadow-2xl shadow-primary/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <GraduationCap size={28} />
            </div>
            <span className="font-headline font-black text-2xl text-primary tracking-tighter uppercase">BRAINQUEST</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-lg transform hover:scale-[1.01] transition-transform duration-500">
          <Card className="shadow-3xl border-none ring-1 ring-primary/10 bg-card/80 backdrop-blur-xl rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-700">
            <CardHeader className="text-center pb-2 pt-12 md:pt-16 px-8">
              <div className="mx-auto bg-accent/20 p-6 rounded-full w-fit mb-8 ring-8 ring-accent/5 animate-bounce">
                <BookOpen className="text-primary w-14 h-14" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-headline font-black text-foreground tracking-tight">Selamat Datang!</CardTitle>
              <CardDescription className="text-xl font-bold text-muted-foreground/80 mt-4 leading-relaxed">
                Pilih kelasmu dan mulai petualangan belajarmu sekarang.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-10 md:p-12">
              {!showNameInput ? (
                <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Pilih Kelas Kamu</label>
                    <Select onValueChange={(val) => setSelectedClass(val)}>
                      <SelectTrigger className="w-full h-16 md:h-20 text-xl md:text-2xl border-4 rounded-[1.5rem] transition-all bg-background font-black shadow-inner focus:ring-8 focus:ring-primary/10">
                        <SelectValue placeholder="-- Ketuk Untuk Memilih --" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-3xl p-2 bg-card/95 backdrop-blur-xl">
                        {availableClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id} className="h-16 text-xl font-black rounded-xl hover:bg-primary/10">
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => setShowNameInput(true)} 
                    disabled={!selectedClass}
                    className="w-full h-16 md:h-20 text-xl md:text-2xl font-black group rounded-[1.5rem] shadow-2xl shadow-primary/30 active:scale-95 transition-all bg-primary hover:bg-primary/90"
                  >
                    Lanjutkan <ChevronRight className="ml-3 group-hover:translate-x-3 transition-transform w-8 h-8" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-12 duration-500">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Siapa Nama Lengkapmu?</label>
                    <Input 
                      placeholder="Masukkan nama lengkap" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-16 md:h-20 text-xl md:text-2xl border-4 rounded-[1.5rem] focus:ring-8 focus:ring-primary/10 bg-background font-black placeholder:font-medium shadow-inner"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button variant="outline" onClick={() => setShowNameInput(false)} className="h-16 md:h-20 px-10 rounded-[1.5rem] border-4 font-black text-xl order-2 sm:order-1 active:scale-95 transition-all">Kembali</Button>
                    <Button 
                      onClick={handleStart} 
                      disabled={!studentName}
                      className="flex-1 h-16 md:h-20 text-xl md:text-2xl font-black rounded-[1.5rem] shadow-2xl shadow-primary/30 active:scale-95 transition-all order-1 sm:order-2 bg-primary hover:bg-primary/90"
                    >
                      Mulai Kuis <Sparkles className="ml-3 w-7 h-7" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="w-full text-center pb-10 text-muted-foreground/30 text-[10px] font-black uppercase tracking-[0.6em] z-10 px-4 animate-in slide-in-from-bottom-4 duration-700">
        © 2024 BRAINQUEST DIGITAL • INSTANT LEARNING
      </footer>
    </div>
  );
}
