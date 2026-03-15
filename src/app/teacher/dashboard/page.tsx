
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listenToScores, listenToClasses, listenToQuizzes } from '@/services/database';
import { Class, Quiz } from '@/lib/types';
import { Users, BookOpen, CheckCircle, TrendingUp, Clock, Loader2, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export default function TeacherDashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubScores = listenToScores((data) => {
      setScores(data);
      setLoading(false);
    });
    const unsubClasses = listenToClasses(setClasses);
    const unsubQuizzes = listenToQuizzes(setQuizzes);

    return () => {
      unsubScores();
      unsubClasses();
      unsubQuizzes();
    };
  }, []);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
      <Loader2 className="w-16 h-16 text-primary animate-spin" />
      <p className="font-black text-muted-foreground tracking-[0.3em] uppercase text-xs animate-pulse">Menghubungkan ke Cloud...</p>
    </div>
  );

  const stats = [
    { label: 'Kelas Aktif', value: classes.filter(c => c.active).length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kuis Terbit', value: quizzes.length, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Siswa Selesai', value: scores.length, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Rata-rata Skor', value: `${scores.length > 0 ? Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length) : 0}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const chartData = classes.slice(0, 10).map(cls => ({
    name: (cls.name || 'Kelas').replace('Kelas ', ''),
    score: Math.round(scores.filter(s => s.classId === cls.id).reduce((a, s) => a + s.score, 0) / (scores.filter(s => s.classId === cls.id).length || 1))
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-headline font-black text-foreground tracking-tighter flex items-center gap-4">
            Dashboard Utama <Sparkles className="text-primary animate-bounce" />
          </h1>
          <p className="text-lg font-bold text-muted-foreground mt-2">Data kuis dan performa siswa diperbarui setiap detik secara real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-2xl rounded-[2rem] overflow-hidden student-card-hover transition-all bg-card/70 backdrop-blur-md animate-in zoom-in-95 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-8 flex items-center gap-6">
              <div className={cn(stat.bg, stat.color, "p-5 rounded-3xl shadow-inner transform transition-transform hover:rotate-12")}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                <h3 className="text-4xl font-black text-foreground">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-3xl rounded-[2.5rem] bg-card/60 backdrop-blur-xl overflow-hidden animate-in slide-in-from-left-4 duration-700">
          <CardHeader className="p-10 border-b border-white/10">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <TrendingUp className="text-primary" /> Statistik Performa Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} className="font-bold text-xs" />
                <YAxis axisLine={false} tickLine={false} className="font-bold text-xs" />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', fontWeight: 'bold' }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 16 }}
                />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[16, 16, 0, 0]} barSize={40} className="animate-in slide-in-from-bottom duration-1000" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-3xl rounded-[2.5rem] bg-card/60 backdrop-blur-xl overflow-hidden animate-in slide-in-from-right-4 duration-700">
          <CardHeader className="p-10 border-b bg-primary/5">
            <CardTitle className="text-2xl font-black flex items-center gap-3 text-primary">
              <Clock className="animate-pulse" /> Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-8">
              {scores.slice(0, 6).map((item, i) => (
                <div key={i} className="flex gap-5 group animate-in fade-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-inner group-hover:scale-110 group-hover:rotate-6">
                    <CheckCircle size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-black text-foreground truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground font-bold leading-tight">Mengerjakan {item.quiz}</p>
                    <p className="text-[10px] font-black uppercase text-primary mt-1 tracking-tighter">SKOR: {Math.round(item.score)}%</p>
                  </div>
                </div>
              ))}
              {scores.length === 0 && <p className="text-center py-20 text-muted-foreground font-bold">Belum ada aktivitas.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
