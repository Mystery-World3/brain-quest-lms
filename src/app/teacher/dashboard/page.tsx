
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { classes, initialQuizzes } from '@/lib/mock-data';
import { Users, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherSummary() {
  const stats = [
    { label: 'Total Kelas', value: classes.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Ujian Aktif', value: initialQuizzes.length, icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Siswa Selesai', value: '24', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Rata-rata Skor', value: '82%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const chartData = [
    { name: '7-A', score: 85 },
    { name: '7-B', score: 78 },
    { name: '8-A', score: 92 },
    { name: '8-B', score: 80 },
    { name: '9-A', score: 88 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Ringkasan</h1>
          <p className="text-muted-foreground">Selamat datang kembali, Pak/Bu Guru. Berikut progres pembelajaran Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Performa Rata-rata per Kelas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(38, 102, 185, 0.05)' }}
                />
                <Bar dataKey="score" fill="#2666B9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Aktivitas Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { user: 'Budi Santoso', action: 'menyelesaikan Kuis Mat 7A', time: '5 menit lalu' },
                { user: 'Ani Wijaya', action: 'menyelesaikan Kuis Mat 7A', time: '12 menit lalu' },
                { user: 'Guru', action: 'memperbarui Soal Kelas 8B', time: '1 jam lalu' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.action}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
