"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classes } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, User, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function StudentScores() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockScores = [
    { id: '1', name: 'Budi Santoso', classId: '7-a', className: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 85, date: '2023-11-20' },
    { id: '2', name: 'Ani Wijaya', classId: '7-a', className: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 92, date: '2023-11-20' },
    { id: '3', name: 'Citra Dewi', classId: '7-b', className: 'Kelas 7 - B', quiz: 'Aljabar I', score: 78, date: '2023-11-19' },
    { id: '4', name: 'Dedi Kurniawan', classId: '8-a', className: 'Kelas 8 - A', quiz: 'Geometri', score: 88, date: '2023-11-18' },
    { id: '5', name: 'Eka Putri', classId: '9-a', className: 'Kelas 9 - A', quiz: 'Statistika', score: 100, date: '2023-11-18' },
  ];

  const filteredScores = mockScores.filter(s => {
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleExport = () => {
    toast({
      title: "Laporan Diekspor",
      description: "File laporan Excel sedang disiapkan untuk diunduh.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Laporan Nilai Siswa</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Monitoring progres dan hasil evaluasi setiap siswa.</p>
        </div>
        <Button onClick={handleExport} className="h-14 px-10 font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-3">
          <Download size={22} /> Ekspor Laporan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-primary text-white p-6 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10">
              <TrendingUp size={32} />
           </div>
           <div>
             <p className="text-white/70 font-black text-xs uppercase tracking-widest">Rata-rata Skor</p>
             <h3 className="text-4xl font-black">88.6</h3>
           </div>
        </Card>
        <Card className="border-none shadow-xl bg-accent text-white p-6 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10">
              <User size={32} />
           </div>
           <div>
             <p className="text-white/70 font-black text-xs uppercase tracking-widest">Total Siswa</p>
             <h3 className="text-4xl font-black">254</h3>
           </div>
        </Card>
        <Card className="border-none shadow-xl bg-card p-6 rounded-[2rem] flex items-center gap-6 border-2 border-primary/5">
           <div className="bg-primary/10 p-4 rounded-2xl text-primary ring-4 ring-primary/5">
              <Calendar size={32} />
           </div>
           <div>
             <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">Update Terakhir</p>
             <h3 className="text-xl font-black text-foreground">Hari ini, 10:45</h3>
           </div>
        </Card>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filter Kelas</label>
               <Select onValueChange={setSelectedClass} defaultValue="all">
                <SelectTrigger className="w-full sm:w-56 h-14 rounded-xl border-2 font-bold text-lg bg-background">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">Semua Kelas</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cari Siswa</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Ketik nama siswa..." 
                  className="pl-12 h-14 rounded-xl border-2 font-bold text-lg bg-background" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest pl-10">Nama Siswa</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Kelas</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Judul Kuis</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Skor</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Tanggal</TableHead>
                <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((item) => (
                <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                        <User size={20} />
                      </div>
                      <span className="font-black text-lg text-foreground">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-muted text-muted-foreground py-1.5 px-4 rounded-xl font-bold border-none">
                      {item.className}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-bold">{item.quiz}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <span className={cn(
                        "font-black text-2xl",
                        item.score >= 80 ? 'text-green-600' : item.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      )}>
                        {item.score}
                      </span>
                      <div className="w-24 bg-muted h-2 rounded-full overflow-hidden ring-1 ring-border/50">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            item.score >= 80 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                            item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground/80">{item.date}</TableCell>
                  <TableCell className="text-right pr-10">
                    <Button variant="outline" className="h-11 px-6 rounded-xl font-black border-2 hover:bg-primary hover:text-white transition-all">Detail</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredScores.length === 0 && (
            <div className="p-24 text-center">
              <p className="text-2xl font-black text-muted-foreground">Tidak ada hasil ditemukan.</p>
              <p className="text-muted-foreground font-bold">Sesuaikan filter atau pencarian Anda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
