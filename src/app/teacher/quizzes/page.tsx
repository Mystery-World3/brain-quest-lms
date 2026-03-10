
"use client";

import React, { useState } from 'react';
import { initialQuizzes, classes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, ExternalLink, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function QuizManagement() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classes.find(c => c.id === q.classId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
    toast({
      title: "Kuis Dihapus",
      description: "Data kuis telah berhasil dihapus dari sistem.",
    });
  };

  const handleSaveQuiz = () => {
    setIsDialogOpen(false);
    toast({
      title: "Kuis Disimpan",
      description: "Kuis baru telah berhasil ditambahkan (Simulasi).",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kuis</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Kelola bank soal untuk setiap jenjang kelas.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
              <Plus className="mr-2" size={24} /> Tambah Kuis
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-3xl font-headline font-black">Buat Kuis Baru</DialogTitle>
                <DialogDescription className="text-white/80 font-bold text-lg">Lengkapi informasi kuis di bawah ini.</DialogDescription>
              </DialogHeader>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Judul Kuis</label>
                <Input placeholder="Contoh: Aljabar Dasar - Sesi 1" className="h-14 rounded-xl border-2 font-bold text-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tingkat Kelas</label>
                <Select>
                  <SelectTrigger className="h-14 rounded-xl border-2 font-bold text-lg">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t-2 border-dashed">
                <p className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                  <BookOpen size={18} /> Konten Soal (Beta)
                </p>
                <div className="space-y-4 bg-muted/30 p-6 rounded-2xl border-2 border-border/50">
                  <Input placeholder="Tulis soal di sini..." className="h-12 rounded-lg font-bold" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Opsi A" className="h-12" />
                    <Input placeholder="Opsi B" className="h-12" />
                    <Input placeholder="Opsi C" className="h-12" />
                    <Input placeholder="Opsi D" className="h-12" />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/20 border-t flex gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 rounded-xl font-black">Batal</Button>
              <Button onClick={handleSaveQuiz} className="h-14 px-10 rounded-xl font-black shadow-lg">Simpan Sekarang</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari kuis atau kelas..." 
              className="pl-12 h-14 rounded-2xl border-2 font-bold text-lg bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] h-16 font-black uppercase text-xs tracking-widest pl-8">Judul Kuis</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Kelas</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Jumlah Soal</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest">Status</TableHead>
                <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-8">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-black text-lg pl-8 py-6">{quiz.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-black py-1.5 px-4 rounded-xl border-none bg-accent/10 text-accent">
                      {classes.find(c => c.id === quiz.classId)?.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground">{quiz.questions.length} Soal</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none py-1.5 px-4 rounded-xl font-black text-xs">
                      AKTIF
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"><Pencil size={18} /></Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(quiz.id)} className="h-10 w-10 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 hover:bg-accent hover:text-white transition-all"><ExternalLink size={18} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredQuizzes.length === 0 && (
            <div className="p-24 text-center">
              <div className="bg-muted/20 inline-block p-8 rounded-full mb-6">
                <Search className="w-16 h-16 text-muted-foreground opacity-20" />
              </div>
              <p className="text-2xl font-black text-muted-foreground">Tidak ada kuis ditemukan.</p>
              <p className="text-muted-foreground font-bold">Coba kata kunci lain atau buat kuis baru.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
