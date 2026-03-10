"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Lock, Mail } from 'lucide-react';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth: In this prototype, any non-empty credentials work
    if (email && password) {
      localStorage.setItem('teacher_session', 'active');
      router.push('/teacher/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-none ring-1 ring-primary/10 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
            <GraduationCap className="text-primary w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold text-primary">Portal Guru</CardTitle>
          <CardDescription>Masukkan kredensial Anda untuk mengakses dashboard pengajar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="email" 
                  placeholder="nama@sekolah.id" 
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 font-bold text-lg">
              Masuk ke Dashboard
            </Button>
          </form>

          <Button variant="ghost" onClick={() => router.push('/')} className="w-full">
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
