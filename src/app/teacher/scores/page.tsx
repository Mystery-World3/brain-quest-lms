
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getClasses, getScores, addScore, deleteScore, updateScore, listenToScores } from '@/services/database';
import { Class } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Calendar, Download, Search, User, TrendingUp, Trash2, Pencil, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const cData = await getClasses();
        setClasses(cData);
      } catch (err) {
        console.error("Failed to load classes:", err);
      }
    };
    loadData();

    const unsubscribe = listenToScores((data) => {
      setScores(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredScores = scores.filter(s => {
    const matchesClass = selectedClass === 'all' || s.classId === selectedClass;
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const handleDeleteRequest = (id: string) => {
    setScoreToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (scoreToDelete) {
      try {
        await deleteScore(scoreToDelete);
        toast({ title: "Nilai Dihapus", description: "Catatan nilai siswa telah dihapus dari database." });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal menghapus data.' });
      }
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingScore({
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

  const handleSaveScore = async () => {
    if (!editingScore?.name || !editingScore?.classId || !editingScore?.quiz) {
      toast({ variant: "destructive", title: "Data Belum Lengkap", description: "Mohon isi seluruh data siswa." });
      return;
    }

    setIsSaving(true);
    try {
      const className = classes.find(c => c.id === editingScore.classId)?.name || '';
      const finalData = { ...editingScore, className };

      if (editingScore.id) {
        await updateScore(editingScore.id, finalData);
      } else {
        await addScore(finalData);
      }
      
      setIsDialogOpen(false);
      toast({ title: "Berhasil Disimpan", description: `Nilai untuk ${editingScore.name} telah diperbarui.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Gagal menyimpan data.' });
    } finally {
      setIsSaving(false);
    }
  };

  const avgScore = scores.length > 0 
    ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-black text-foreground tracking-tighter">Laporan Nilai Siswa</h1>
          <p className="text-sm md:text-lg font-bold text-muted-foreground mt-1">Monitoring progres dan hasil evaluasi setiap siswa.</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <Button onClick={openAddDialog} className="flex-1 lg:flex-none h-12 md:h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20">
            <Plus size={22} className="mr-2" /> Tambah Manual
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        <Card className="border-none shadow-xl bg-primary text-white p-6 md:p-8 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10 shrink-0">
              <TrendingUp size={32} className="md:w-10 md:h-10" />
           </div>
           <div>
             <p className="text-white/70 font-black text-[10px] md:text-xs uppercase tracking-widest">Rata-rata Skor</p>
             <h3 className="text-3xl md:text-5xl font-black">{avgScore}%</h3>
           </div>
        </Card>
        <Card className="border-none shadow-xl bg-accent text-white p-6 md:p-8 rounded-[2rem] flex items-center gap-6">
           <div className="bg-white/20 p-4 rounded-2xl ring-4 ring-white/10 shrink-0">
              <User size={32} className="md:w-10 md:h-10" />
           </div>
           <div>
             <p className="text-white/70 font-black text-[10px] md:text-xs uppercase tracking-widest">Total Siswa</p>
             <h3 className="text-3xl md:text-5xl font-black">{scores.length}</h3>
           </div>
        </Card>
        <Card className="hidden sm:flex border-none shadow-xl bg-card p-6 md:p-8 rounded-[2rem] items-center gap-6 border-2 border-primary/5">
           <div className="bg-primary/10 p-4 rounded-2xl text-primary ring-4 ring-primary/5 shrink-0">
              <Calendar size={32} className="md:w-10 md:h-10" />
           </div>
           <div>
             <p className="text-muted-foreground font-black text-[10px] md:text-xs uppercase tracking-widest">Update Cloud</p>
             <h3 className="text-xl md:text-2xl font-black text-foreground">Real-time</h3>
           </div>
        </Card>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filter Kelas</label>
               <Select onValueChange={setSelectedClass} defaultValue="all">
                <SelectTrigger className="w-full sm:w-56 h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg bg-background text-foreground">
                  <SelectValue placeholder="Semua Kelas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="font-bold">Semua Kelas</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cari Nama Siswa</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Ketik nama..." 
                  className="pl-12 h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg bg-background text-foreground" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full overflow-auto">
            <Table className="min-w-[800px]">
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
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-20 font-bold animate-pulse">Menghubungkan ke Cloud Database...</TableCell></TableRow>
                ) : filteredScores.map((item) => (
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
                          {Math.round(item.score)}
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
            {!loading && filteredScores.length === 0 && (
              <div className="p-20 text-center">
                <p className="text-xl md:text-2xl font-black text-muted-foreground">Belum ada data nilai.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background">
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black text-white">
                {editingScore?.id ? 'Edit Nilai' : 'Tambah Nilai Manual'}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-bold text-sm md:text-lg">Data akan tersimpan secara terpusat.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Siswa</label>
              <Input 
                value={editingScore?.name || ''}
                onChange={(e) => setEditingScore({ ...editingScore!, name: e.target.value })}
                placeholder="Nama Lengkap" 
                className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Pilih Kelas</label>
              <Select value={editingScore?.classId || ''} onValueChange={(val) => setEditingScore({ ...editingScore!, classId: val })}>
                <SelectTrigger className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Materi / Kuis</label>
              <Input 
                value={editingScore?.quiz || ''}
                onChange={(e) => setEditingScore({ ...editingScore!, quiz: e.target.value })}
                placeholder="Contoh: Matematika Dasar" 
                className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Skor (0-100)</label>
              <Input 
                type="number"
                value={editingScore?.score || 0}
                onChange={(e) => setEditingScore({ ...editingScore!, score: parseInt(e.target.value) || 0 })}
                className="h-12 md:h-14 rounded-xl border-2 font-black text-2xl text-foreground" 
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t flex flex-row gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="flex-1 h-12 md:h-14 rounded-xl font-black text-foreground">Batal</Button>
            <Button onClick={handleSaveScore} disabled={isSaving} className="flex-1 h-12 md:h-14 rounded-xl font-black shadow-lg">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan Nilai'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem] w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl md:text-2xl font-black text-foreground">Hapus Data Nilai?</AlertDialogTitle>
            <AlertDialogDescription className="text-base md:text-lg font-bold">
              Catatan nilai siswa ini akan dihapus secara permanen dari sistem laporan cloud.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4 flex-row">
            <AlertDialogCancel className="flex-1 h-12 rounded-xl font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-black">
              Hapus Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
