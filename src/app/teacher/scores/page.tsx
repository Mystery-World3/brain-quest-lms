
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classes } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StudentScores() {
  const [selectedClass, setSelectedClass] = useState('all');

  const mockScores = [
    { id: '1', name: 'Budi Santoso', class: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 85, date: '2023-11-20' },
    { id: '2', name: 'Ani Wijaya', class: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 92, date: '2023-11-20' },
    { id: '3', name: 'Citra Dewi', class: 'Kelas 7 - B', quiz: 'Aljabar I', score: 78, date: '2023-11-19' },
    { id: '4', name: 'Dedi Kurniawan', class: 'Kelas 8 - A', quiz: 'Geometri', score: 88, date: '2023-11-18' },
    { id: '5', name: 'Eka Putri', class: 'Kelas 9 - A', quiz: 'Statistika', score: 100, date: '2023-11-18' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Nilai Siswa</h1>
          <p className="text-muted-foreground">Lihat dan unduh laporan hasil kerja siswa.</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download size={18} /> Ekspor Excel
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select onValueChange={setSelectedClass} defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Semua Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Cari nama siswa..." className="pl-10" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} /> Update terakhir: Hari ini, 10:45
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Nama Siswa</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Judul Kuis</TableHead>
                <TableHead>Skor</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockScores.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full text-primary">
                        <User size={14} />
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.class}</TableCell>
                  <TableCell className="text-muted-foreground">{item.quiz}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                          style={{ width: `${item.score}%` }} 
                        />
                      </div>
                      <span className={`font-bold ${item.score >= 80 ? 'text-green-600' : item.score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.score}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Rincian</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
