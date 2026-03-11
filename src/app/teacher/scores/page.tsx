
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { classes as initialClasses, initialQuizzes } from '@/lib/mock-data';
import { Class } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, User, TrendingUp, Trash2, Pencil, Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function StudentScores() {
  const { toast } = useToast();
  const [scores, setScores] = useState<any[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scoreToDelete, setScoreToDelete] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<any>(null);

  useEffect(() => {
    const savedScores = localStorage.getItem('app_scores');
    const savedClasses = localStorage.getItem('app_classes');

    if (savedScores) {
      setScores(JSON.parse(savedScores));
    } else {
      const mock = [
        { id: '1', name: 'Budi Santoso', classId: '7-a', className: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 85, date: '2023-11-20' },
        { id: '2', name: 'Ani Wijaya', classId: '7-a', className: 'Kelas 7 - A', quiz: 'Bilangan Bulat', score: 92, date: '2023-11-20' },
        { id: '3', name: 'Citra Dewi', classId: '7-b', className: 'Kelas 7 - B', quiz: 'Aljabar I', score: 78, date: '2023-11-19' },
      ];
      setScores(mock);
      localStorage.setItem('app_scores', JSON.stringify(mock));
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      setClasses(initialClasses);
    }
  }, []);

  const saveScores = (newScores: any[]) => {
    setScores(newScores);
    localStorage.setItem('app_scores', JSON.stringify(newScores));
  };

  const filteredScores = scores.filter(s => {
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleDeleteRequest = (id: string) => {
    setScoreToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (scoreToDelete) {
      const updated = scores.filter(s => s.id !== scoreToDelete);
      saveScores(updated);
      toast({ title: "Nilai Dihapus", description: "Catatan nilai siswa telah dihapus." });
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingScore({
      id: `score-${Date.now()}`,
      name: '',
      classId: '',
      quiz: '',
      score: 0,
      date: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (score: any) => {
    setEditingScore({ ...score });
    setIsDialogOpen(true);
  };

  const handleSaveScore = () => {
    if (!editingScore?.name || !editingScore?.classId || !editingScore?.quiz) {
      toast({ variant: "destructive", title: "Data Belum Lengkap", description: "Mohon isi seluruh data siswa." });
      return;
    }

    const className = classes.find(c => c.id === editingScore.classId)?.name || '';
    const updatedScores = [...scores];
    const index = updatedScores.findIndex(s => s.id === editingScore.id);
    
    const finalData = { ...editingScore, className };

    if (index >= 0) {
      updatedScores[index] = finalData;
    } else {
      updatedScores.push(finalData);
    }

    saveScores(updatedScores);
    setIsDialogOpen(false);
    toast({ title: "Berhasil Disimpan", description: `Nilai untuk ${editingScore.name} telah diperbarui.` });
  };

  const avgScore = scores.length > 0 
    ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Laporan Nilai Siswa</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Monitoring progres dan hasil evaluasi setiap siswa.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => {
            toast({ title: "Laporan Diekspor", description: "File laporan Excel sedang disiapkan." });
          }} className="h-14 px-8 font-black text-lg rounded-2xl border-2 text-foreground">
            <Download size={22} className="mr-2" /> Ekspor
          </Button>
          <Button onClick={openAddDialog} className="h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20">
            <Plus size={22} className="mr-2" /> Tambah Manual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-primary text-white p-6 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10">
              <TrendingUp size={32} />
           </div>
           <div>
             <p className="text-white/70 font-black text-xs uppercase tracking-widest">Rata-rata Skor</p>
             <h3 className="text-4xl font-black">{avgScore}</h3>
           </div>
        </Card>
        <Card className="border-none shadow-xl bg-accent text-white p-6 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10">
              <User size={32} />
           </div>
           <div>
             <p className="text-white/70 font-black text-xs uppercase tracking-widest">Total Catatan</p>
             <h3 className="text-4xl font-black">{scores.length}</h3>
           </div>
        </Card>
        <Card className="border-none shadow-xl bg-card p-6 rounded-[2rem] flex items-center gap-6 border-2 border-primary/5">
           <div className="bg-primary/10 p-4 rounded-2xl text-primary ring-4 ring-primary/5">
              <Calendar size={32} />
           </div>
           <div>
             <p className="text-muted-foreground font-black text-xs uppercase tracking-widest">Update Terakhir</p>
             <h3 className="text-xl font-black text-foreground">Hari ini</h3>
           </div>
        </Card>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filter Kelas</label>
               <Select onValueChange={setSelectedClass} defaultValue="all">
                <SelectTrigger className="w-full sm:w-56 h-14 rounded-xl border-2 font-bold text-lg bg-background text-foreground">
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
                  className="pl-12 h-14 rounded-xl border-2 font-bold text-lg bg-background text-foreground" 
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
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest pl-10 text-foreground">Nama Siswa</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Kelas</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Judul Kuis</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Skor</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Tanggal</TableHead>
                <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-10 text-foreground">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScores.map((item) => (
                <TableRow key={item.id} className="hover:bg-primary/5 transition-colors group border-b">
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
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(item)} className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white transition-all text-foreground"><Pencil size={18} /></Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(item.id)} className="h-10 w-10 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredScores.length === 0 && (
            <div className="p-24 text-center">
              <p className="text-2xl font-black text-muted-foreground">Tidak ada hasil ditemukan.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Score Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-black text-white">
                {editingScore?.id?.includes('score-') ? 'Edit Nilai' : 'Tambah Nilai Manual'}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-bold text-lg">Lengkapi data hasil ujian siswa.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Siswa</label>
              <Input 
                value={editingScore?.name || ''}
                onChange={(e) => setEditingScore({ ...editingScore!, name: e.target.value })}
                placeholder="Nama Lengkap" 
                className="h-14 rounded-xl border-2 font-bold text-lg text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tingkat Kelas</label>
              <Select value={editingScore?.classId || ''} onValueChange={(val) => setEditingScore({ ...editingScore!, classId: val })}>
                <SelectTrigger className="h-14 rounded-xl border-2 font-bold text-lg text-foreground">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Kuis / Materi</label>
              <Input 
                value={editingScore?.quiz || ''}
                onChange={(e) => setEditingScore({ ...editingScore!, quiz: e.target.value })}
                placeholder="Contoh: Matematika Dasar" 
                className="h-14 rounded-xl border-2 font-bold text-lg text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Skor Akhir (0-100)</label>
              <Input 
                type="number"
                max={100}
                min={0}
                value={editingScore?.score || 0}
                onChange={(e) => setEditingScore({ ...editingScore!, score: parseInt(e.target.value) || 0 })}
                className="h-14 rounded-xl border-2 font-bold text-2xl text-foreground" 
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t flex gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 rounded-xl font-black text-foreground">Batal</Button>
            <Button onClick={handleSaveScore} className="h-14 px-10 rounded-xl font-black shadow-lg">Simpan Nilai</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-foreground">Hapus Data Nilai?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-bold">
              Catatan nilai siswa ini akan dihapus secara permanen dari sistem laporan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="h-12 rounded-xl font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-black">
              Hapus Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
