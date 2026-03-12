
"use client";

import React, { useState, useEffect } from 'react';
import { getClasses, saveClass, deleteClass } from '@/services/database';
import { Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Search, School, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ClassManagement() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<Partial<Class> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await getClasses();
      setClasses(data);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal Memuat Data', description: 'Pastikan koneksi internet stabil.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await saveClass({ id, active: !currentStatus });
      await loadClasses();
      toast({ title: "Status Diperbarui", description: "Status kelas telah berhasil diubah." });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal Memperbarui', description: 'Gagal menghubungi database.' });
    }
  };

  const handleDeleteRequest = (id: string) => {
    setClassToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (classToDelete) {
      try {
        await deleteClass(classToDelete);
        await loadClasses();
        toast({ title: "Kelas Dihapus", description: "Data kelas telah dihapus secara permanen." });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Gagal Menghapus', description: 'Data kelas tidak dapat dihapus.' });
      }
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingClass({
      name: '',
      active: true
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass({ ...cls });
    setIsDialogOpen(true);
  };

  const handleSaveClass = async () => {
    if (!editingClass?.name) {
      toast({ variant: "destructive", title: "Data Belum Lengkap", description: "Mohon isi nama kelas." });
      return;
    }

    setIsSaving(true);
    try {
      await saveClass(editingClass);
      await loadClasses();
      setIsDialogOpen(false);
      toast({ title: "Berhasil Disimpan", description: `Kelas "${editingClass.name}" telah disimpan.` });
    } catch (err) {
      console.error("Save error:", err);
      toast({ variant: 'destructive', title: 'Gagal Menyimpan', description: 'Terjadi kesalahan saat menyimpan.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kelas</h1>
          <p className="text-sm md:text-lg font-bold text-muted-foreground mt-1">Kelola daftar kelas dan kontrol akses kuis.</p>
        </div>
        
        <Button onClick={openAddDialog} className="w-full sm:w-auto h-12 md:h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus className="mr-2" size={24} /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6 md:p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari nama kelas..." 
              className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold text-base md:text-lg bg-background text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full overflow-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest pl-8 text-foreground">Nama Kelas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-center text-foreground">Status Akses</TableHead>
                  <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-8 text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 font-bold animate-pulse">Memuat data...</TableCell></TableRow>
                ) : filteredClasses.map((cls) => (
                  <TableRow key={cls.id} className="hover:bg-primary/5 transition-colors group border-b">
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-2xl transition-all shadow-inner",
                          cls.active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                          <School size={20} />
                        </div>
                        <span className="font-black text-lg md:text-xl text-foreground">{cls.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                         <Switch 
                          checked={cls.active} 
                          onCheckedChange={() => handleToggleStatus(cls.id, cls.active)}
                        />
                        <Badge className={cn(
                          "border-none py-1 px-3 rounded-lg font-black text-[10px] tracking-widest",
                          cls.active ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                        )}>
                          {cls.active ? 'AKTIF' : 'NONAKTIF'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)} className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white transition-all text-foreground"><Pencil size={18} /></Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(cls.id)} className="h-10 w-10 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-background">
          <div className="bg-primary p-6 md:p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-headline font-black text-white">
                {editingClass?.id ? 'Edit Kelas' : 'Tambah Kelas Baru'}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-bold text-sm md:text-lg">Data akan langsung tersinkron ke semua perangkat.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Kelas</label>
              <Input 
                value={editingClass?.name || ''}
                onChange={(e) => setEditingClass({ ...editingClass!, name: e.target.value })}
                placeholder="Contoh: Kelas 7 - A" 
                className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground" 
              />
            </div>
          </div>
          <DialogFooter className="p-6 md:p-8 bg-muted/20 border-t flex flex-row gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="flex-1 h-12 md:h-14 rounded-xl font-black text-foreground">Batal</Button>
            <Button onClick={handleSaveClass} disabled={isSaving} className="flex-1 h-12 md:h-14 rounded-xl font-black shadow-lg">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem] w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl md:text-2xl font-black text-red-600">Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription className="text-base md:text-lg font-bold">
              Data akan dihapus permanen. Murid tidak akan bisa mengakses kelas ini lagi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4 flex-row">
            <AlertDialogCancel className="flex-1 h-12 rounded-xl font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-black">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
