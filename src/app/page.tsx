"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { classes as initialClasses } from '@/lib/mock-data';
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
    const savedClasses = localStorage.getItem('app_classes');
    const classesToFilter = savedClasses ? JSON.parse(savedClasses) : initialClasses;
    // Only show active classes
    setAvailableClasses(classesToFilter.filter((c: Class) => c.active));
  }, []);

  const handleStart = () => {
    if (selectedClass && studentName) {
      const className = availableClasses.find(c => c.id === selectedClass)?.name || '';
      localStorage.setItem('student_name', studentName);
      localStorage.setItem('student_class', selectedClass);
      localStorage.setItem('student_class_name', className);
      router.push(`/student/quiz/${selectedClass}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

      {/* Header & Theme Toggle */}
      <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <Link href="/teacher/login" className="group">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
              <GraduationCap size={28} />
            </div>
            <span className="font-headline font-black text-xl hidden sm:block text-primary tracking-tighter">BRAINQUEST</span>
          </div>
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-none ring-1 ring-primary/20 bg-card/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardHeader className="text-center pb-2 pt-10">
            <div className="mx-auto bg-accent/20 p-5 rounded-full w-fit mb-6 ring-4 ring-accent/10 animate-pulse">
              <BookOpen className="text-primary w-12 h-12" />
            </div>
            <CardTitle className="text-4xl font-headline font-black text-foreground">Ayo Mulai!</CardTitle>
            <CardDescription className="text-lg font-semibold text-muted-foreground mt-2">
              Siapkan dirimu untuk tantangan hari ini!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {!showNameInput ? (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
                <div className="space-y-3">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Pilih Kelas</label>
                  <Select onValueChange={(val) => setSelectedClass(val)}>
                    <SelectTrigger className="w-full h-16 text-xl border-2 rounded-[1.25rem] transition-all focus:ring-4 focus:ring-primary/20 bg-background font-bold">
                      <SelectValue placeholder="-- Pilih Kelas --" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id} className="h-14 text-lg font-bold">
                          {cls.name}
                        </SelectItem>
                      ))}
                      {availableClasses.length === 0 && (
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
                  className="w-full h-16 text-xl font-black group rounded-[1.25rem] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                >
                  Lanjutkan <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="space-y-3">
                  <label className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-1">Siapa Namamu?</label>
                  <Input 
                    placeholder="Masukkan nama lengkap" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-16 text-xl border-2 rounded-[1.25rem] focus:ring-4 focus:ring-primary/20 bg-background font-bold placeholder:font-medium"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowNameInput(false)} className="h-16 px-8 rounded-[1.25rem] border-2 font-bold text-lg">Kembali</Button>
                  <Button 
                    onClick={handleStart} 
                    disabled={!studentName}
                    className="flex-1 h-16 text-xl font-black rounded-[1.25rem] shadow-2xl shadow-primary/30 active:scale-95 transition-all"
                  >
                    Mulai <Sparkles className="ml-2 w-6 h-6" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
