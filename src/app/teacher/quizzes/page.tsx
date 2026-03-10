
"use client";

import React, { useState } from 'react';
import { initialQuizzes, classes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classes.find(c => c.id === q.classId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-foreground">Manajemen Kuis</h1>
          <p className="text-muted-foreground">Buat dan kelola soal ujian untuk setiap kelas.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-11 px-6 font-bold shadow-lg shadow-primary/20">
              <Plus className="mr-2" size={18} /> Tambah Soal Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buat Kuis Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Judul Kuis</label>
                <Input placeholder="Contoh: Aljabar Dasar" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Pilih Kelas</label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <hr className="my-2" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Konten Soal (Beta)</p>
              <div className="space-y-4">
                <Input placeholder="Tulis soal di sini..." />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Opsi A" />
                  <Input placeholder="Opsi B" />
                  <Input placeholder="Opsi C" />
                  <Input placeholder="Opsi D" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Simpan Kuis</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-row items-center justify-between pb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Cari judul atau kelas..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px]">Judul Kuis</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jumlah Soal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-semibold">{quiz.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {classes.find(c => c.id === quiz.classId)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{quiz.questions.length} Soal</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Aktif</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="Edit"><Pencil size={16} /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" title="Hapus"><Trash2 size={16} /></Button>
                      <Button variant="ghost" size="icon" title="Lihat"><ExternalLink size={16} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredQuizzes.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              Tidak ada kuis ditemukan.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
