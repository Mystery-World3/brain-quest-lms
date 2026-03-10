"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { classes } from '@/lib/mock-data';
import { Users, BookOpen, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherDashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const savedScores = localStorage.getItem('app_scores');
    const savedQuizzes = localStorage.getItem('app_quizzes');
    
    if (savedScores) setScores(JSON.parse(savedScores));
    if (savedQuizzes) setQuizzes(JSON.parse(savedQuizzes));
  }, []);

  // Calculate dynamic stats
  const totalClasses = classes.length;
  const activeQuizzes = quizzes.length;
  const totalStudentsFinished = scores.length;
  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length) 
    : 0;

  const stats = [
    { label: 'Total Kelas', value: totalClasses, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Kuis Tersedia', value: activeQuizzes, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
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
  }).filter(d => d.score > 0 || quizzes.some(q => q.classId === classes.find(c => c.name.includes(d.name))?.id));

  // If no data yet, show some placeholder labels for the chart
  const finalChartData = chartData.length > 0 ? chartData : [
    { name: '7-A', score: 0 },
    { name: '7-B', score: 0 },
    { name: '8-A', score: 0 },
  ];

  // Recent Activities from real scores
  const recentActivities = [...scores]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5)
    .map(s => ({
      user: s.name,
      action: `menyelesaikan kuis "${s.quiz}"`,
      time: s.date || 'Baru saja'
    }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Dashboard Guru</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Pantau perkembangan belajar siswa secara real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden student-card-hover">
            <CardContent className="p-8 flex items-center gap-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl ring-4 ring-white dark:ring-primary/5 shadow-inner`}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-card/50 backdrop-blur-sm">
          <CardHeader className="p-8 border-b border-border/50">
            <CardTitle className="text-2xl font-black flex items-center gap-3">
              <TrendingUp className="text-primary" /> Performa Rata-rata per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  className="font-black text-xs" 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  className="font-black text-xs"
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    fontWeight: 'bold',
                    padding: '12px 20px'
                  }}
                  cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 10 }}
                />
                <Bar 
                  dataKey="score" 
                  fill="hsl(var(--primary))" 
                  radius={[12, 12, 0, 0]} 
                  barSize={50} 
                  className="drop-shadow-xl"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-border/50 bg-primary/5">
            <CardTitle className="text-2xl font-black flex items-center gap-3 text-primary">
              <Clock /> Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {recentActivities.length > 0 ? recentActivities.map((item, i) => (
                <div key={i} className="flex gap-4 relative group">
                  {i !== recentActivities.length - 1 && (
                    <div className="absolute left-3 top-8 w-0.5 h-8 bg-border group-hover:bg-primary/30 transition-colors" />
                  )}
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 ring-4 ring-primary/10 z-10">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-base font-black text-foreground">{item.user}</p>
                    <p className="text-sm text-muted-foreground font-bold leading-snug">{item.action}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">{item.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                   <Users className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                   <p className="font-bold text-muted-foreground">Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
