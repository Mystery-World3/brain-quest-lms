
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { classes } from '@/lib/mock-data';
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
  const router = useRouter();

  const handleStart = () => {
    if (selectedClass && studentName) {
      localStorage.setItem('student_name', studentName);
      localStorage.setItem('student_class', selectedClass);
      router.push(`/student/quiz/${selectedClass}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Header & Theme Toggle */}
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <Link href="/teacher/login" className="group">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap size={24} />
            </div>
            <span className="font-headline font-bold text-lg hidden sm:block text-primary">LKPD DIGITAL</span>
          </div>
        </Link>
      </div>

      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-none ring-1 ring-primary/10 bg-card/80 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-accent/20 p-4 rounded-full w-fit mb-4 animate-pulse">
              <BookOpen className="text-primary w-10 h-10" />
            </div>
            <CardTitle className="text-3xl font-headline font-bold text-primary">Mari Belajar!</CardTitle>
            <CardDescription className="text-base font-medium">
              Ayo selesaikan tantangan hari ini dan raih skor tertinggi!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {!showNameInput ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Pilih Kelas</label>
                  <Select onValueChange={(val) => setSelectedClass(val)}>
                    <SelectTrigger className="w-full h-14 text-lg border-2 rounded-2xl transition-all focus:ring-primary">
                      <SelectValue placeholder="-- Pilih Kelas --" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id} className="h-12 text-lg">
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => setShowNameInput(true)} 
                  disabled={!selectedClass}
                  className="w-full h-14 text-lg font-bold group rounded-2xl shadow-lg shadow-primary/30"
                >
                  Lanjutkan <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Siapa Namamu?</label>
                  <Input 
                    placeholder="Masukkan nama lengkap" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-14 text-lg border-2 rounded-2xl focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNameInput(false)} className="h-14 px-6 rounded-2xl">Kembali</Button>
                  <Button 
                    onClick={handleStart} 
                    disabled={!studentName}
                    className="flex-1 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/30"
                  >
                    Mulai <Sparkles className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-muted-foreground text-sm font-medium">
          Dibuat dengan ❤️ untuk pendidikan Indonesia yang cerdas.
        </p>
      </div>
    </div>
  );
}
