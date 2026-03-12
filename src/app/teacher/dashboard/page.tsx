
"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listenToScores, getClasses, getQuizzes } from '@/services/database';
import { Class } from '@/lib/types';
import { Users, BookOpen, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export default function TeacherDashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    // Load static once
    const loadMaster = async () => {
      const cls = await getClasses();
      const qz = await getQuizzes();
      setClasses(cls);
      setQuizzes(qz);
    };
    loadMaster();

    // Listen to scores real-time!
    const unsubscribe = listenToScores((data) => {
      setScores(data);
    });

    return () => unsubscribe();
  }, []);

  // Calculate dynamic stats
  const activeClassesCount = classes.filter(c => c.active).length;
  const activeQuizzesCount = quizzes.length;
  const totalStudentsFinished = scores.length;
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length) 
    : 0;

  const stats = [
    { label: 'Kelas Aktif', value: activeClassesCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kuis Tersedia', value: activeQuizzesCount, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Siswa Selesai', value: totalStudentsFinished, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Rata-rata Skor', value: `${averageScore}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  // Prepare chart data: Average score per class
  const chartData = classes.map(cls => {
    const classScores = scores.filter(s => s.classId === cls.id);
    const avg = classScores.length > 0 
      ? Math.round(classScores.reduce((acc, s) => acc + s.score, 0) / classScores.length)
      : 0;
    return { name: cls.name.replace('Kelas ', ''), score: avg };
  }).filter(d => d.score > 0 || quizzes.some(q => q.classId === classes.find(c => c.name?.includes(d.name))?.id));

  const finalChartData = chartData.length > 0 ? chartData : [
    { name: '7-A', score: 0 },
    { name: '7-B', score: 0 },
    { name: '8-A', score: 0 },
  ];

  // Recent Activities
  const recentActivities = [...scores]
    .slice(0, 5)
    .map(s => ({
      user: s.name,
      action: `menyelesaikan kuis "${s.quiz}"`,
      time: s.date || 'Baru saja'
    }));

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex justify-between items-end px-1">
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-black text-foreground tracking-tighter">Dashboard</h1>
          <p className="text-sm md:text-lg font-bold text-muted-foreground mt-1">Pantau perkembangan belajar siswa secara real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden student-card-hover bg-card/60 backdrop-blur-sm">
            <CardContent className="p-5 md:p-8 flex items-center gap-4 md:gap-6">
              <div className={cn(stat.bg, stat.color, "p-3 md:p-5 rounded-2xl ring-4 ring-white dark:ring-primary/5 shadow-inner shrink-0")}>
                <stat.icon size={24} className="md:w-8 md:h-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground truncate">{stat.label}</p>
                <h3 className="text-xl md:text-3xl font-black text-foreground truncate">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[1.5rem] md:rounded-[3rem] bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="p-6 md:p-10 border-b border-border/50">
            <CardTitle className="text-lg md:text-2xl font-black flex items-center gap-3">
              <TrendingUp className="text-primary" /> Performa Rata-rata per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] md:h-[450px] p-4 md:p-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  className="font-black text-[10px] md:text-xs" 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  className="font-black text-[10px] md:text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    padding: '12px 20px',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 10 }}
                />
                <Bar 
                  dataKey="score" 
                  fill="hsl(var(--primary))" 
                  radius={[12, 12, 0, 0]} 
                  barSize={40} 
                  className="drop-shadow-xl"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[3rem] bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="p-6 md:p-10 border-b border-border/50 bg-primary/5">
            <CardTitle className="text-lg md:text-2xl font-black flex items-center gap-3 text-primary">
              <Clock /> Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10">
            <div className="space-y-6 md:space-y-10">
              {recentActivities.length > 0 ? recentActivities.map((item, i) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== recentActivities.length - 1 && (
                    <div className="absolute left-3 top-8 w-0.5 h-10 bg-border group-hover:bg-primary/30 transition-colors" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ring-4 ring-primary/10 z-10">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm md:text-base font-black text-foreground truncate">{item.user}</p>
                    <p className="text-xs md:text-sm text-muted-foreground font-bold leading-snug">{item.action}</p>
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">{item.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 md:py-20">
                   <Users className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="font-bold text-muted-foreground text-sm md:text-base">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
