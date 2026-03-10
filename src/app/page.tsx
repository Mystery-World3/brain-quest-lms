
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { classes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { GraduationCap, BookOpen, ChevronRight, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (selectedClass && studentName) {
      // In a real app, save session data
      localStorage.setItem('student_name', studentName);
      localStorage.setItem('student_class', selectedClass);
      router.push(`/student/quiz/${selectedClass}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Hidden Teacher Portal Trigger */}
      <Link href="/teacher/login" className="absolute top-8 left-8 group opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg text-white shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap size={24} />
          </div>
          <span className="font-headline font-bold text-lg hidden sm:block text-primary">LKPD DIGITAL</span>
        </div>
      </Link>

      <div className="w-full max-w-md">
        <Card className="shadow-xl border-none ring-1 ring-primary/10 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-accent/20 p-3 rounded-full w-fit mb-4">
              <BookOpen className="text-primary w-8 h-8" />
            </div>
            <CardTitle className="text-3xl font-headline text-primary">Mari Belajar!</CardTitle>
            <CardDescription className="text-base">
              Pilih kelasmu untuk memulai lembar kerja interaktif hari ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {!showNameInput ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Pilih Kelas</label>
                  <Select onValueChange={(val) => setSelectedClass(val)}>
                    <SelectTrigger className="w-full h-12 text-lg">
                      <SelectValue placeholder="-- Pilih Kelas --" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => setShowNameInput(true)} 
                  disabled={!selectedClass}
                  className="w-full h-12 text-lg font-bold group"
                >
                  Lanjutkan <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Siapa Namamu?</label>
                  <Input 
                    placeholder="Masukkan nama lengkap" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowNameInput(false)} className="h-12 px-6">Kembali</Button>
                  <Button 
                    onClick={handleStart} 
                    disabled={!studentName}
                    className="flex-1 h-12 text-lg font-bold"
                  >
                    Mulai Kerjakan
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <p className="mt-8 text-center text-muted-foreground text-sm">
          Dibuat dengan ❤️ untuk pendidikan Indonesia yang lebih interaktif.
        </p>
      </div>
    </div>
  );
}
