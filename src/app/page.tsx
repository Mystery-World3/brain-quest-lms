
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
import { GraduationCap, BookOpen, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Listener real-time untuk sinkronisasi instan kelas aktif
    const unsubscribe = listenToClasses((classes) => {
      setAvailableClasses(classes.filter(c => c.active));
      setLoading(false);
    });

    // Fallback safety: Jika koneksi sangat lambat, paksa matikan loading setelah 6 detik
    const timer = setTimeout(() => setLoading(false), 6000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
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
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[80px] md:blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-accent/20 rounded-full blur-[80px] md:blur-[100px]" />

      <header className="w-full p-4 md:p-8 flex items-center justify-between z-20 relative max-w-7xl mx-auto">
        <Link href="/teacher/login" className="group">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-primary p-2 md:p-2.5 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <GraduationCap size={24} className="md:w-7 md:h-7" />
            </div>
            <span className="font-headline font-black text-lg md:text-2xl text-primary tracking-tighter uppercase">BRAINQUEST</span>
          </div>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 z-10 relative">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-none ring-1 ring-primary/20 bg-card/90 backdrop-blur-md rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <CardHeader className="text-center pb-2 pt-8 md:pt-12">
              <div className="mx-auto bg-accent/20 p-4 md:p-5 rounded-full w-fit mb-4 md:mb-6 ring-4 ring-accent/10 animate-pulse">
                <BookOpen className="text-primary w-10 h-10 md:w-12 md:h-12" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-headline font-black text-foreground">Ayo Mulai!</CardTitle>
              <CardDescription className="text-base md:text-lg font-semibold text-muted-foreground mt-2">
                Siapkan dirimu untuk tantangan hari ini!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6 md:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="font-black text-muted-foreground animate-pulse">Menghubungkan ke Cloud...</p>
                </div>
              ) : !showNameInput ? (
                <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                  <div className="space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Pilih Kelas</label>
                    <Select onValueChange={(val) => setSelectedClass(val)}>
                      <SelectTrigger className="w-full h-14 md:h-16 text-lg md:text-xl border-2 rounded-2xl md:rounded-[1.25rem] transition-all focus:ring-4 focus:ring-primary/20 bg-background font-bold">
                        <SelectValue placeholder="-- Pilih Kelas --" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {availableClasses.length > 0 ? availableClasses.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id} className="h-12 md:h-14 text-base md:text-lg font-bold">
                            {cls.name}
                          </SelectItem>
                        )) : (
                          <div className="p-4 text-center text-muted-foreground font-bold">
                            Belum ada kelas aktif.
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => setShowNameInput(true)} 
                    disabled={!selectedClass}
                    className="w-full h-14 md:h-16 text-lg md:text-xl font-black group rounded-2xl md:rounded-[1.25rem] shadow-xl shadow-primary/30 active:scale-95 transition-all"
                  >
                    Lanjutkan <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-3">
                    <label className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Siapa Namamu?</label>
                    <Input 
                      placeholder="Masukkan nama lengkap" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="h-14 md:h-16 text-lg md:text-xl border-2 rounded-2xl md:rounded-[1.25rem] focus:ring-4 focus:ring-primary/20 bg-background font-bold placeholder:font-medium"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button variant="outline" onClick={() => setShowNameInput(false)} className="h-14 md:h-16 px-8 rounded-2xl md:rounded-[1.25rem] border-2 font-bold text-base md:text-lg order-2 sm:order-1">Kembali</Button>
                    <Button 
                      onClick={handleStart} 
                      disabled={!studentName}
                      className="flex-1 h-14 md:h-16 text-lg md:text-xl font-black rounded-2xl md:rounded-[1.25rem] shadow-xl shadow-primary/30 active:scale-95 transition-all order-1 sm:order-2"
                    >
                      Mulai <Sparkles className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="w-full text-center pb-8 text-muted-foreground/40 text-[10px] font-black uppercase tracking-[0.5em] z-10 px-4">
        © 2024 BRAINQUEST DIGITAL
      </footer>
    </div>
  );
}
