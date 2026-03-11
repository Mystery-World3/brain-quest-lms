
"use client";

import React, { useState, useEffect } from 'react';
import { classes as initialClasses } from '@/lib/mock-data';
import { Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Search, School, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

export default function ClassManagement() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<Partial<Class> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('app_classes');
    if (saved) {
      setClasses(JSON.parse(saved));
    } else {
      setClasses(initialClasses);
      localStorage.setItem('app_classes', JSON.stringify(initialClasses));
    }
  }, []);

  const saveClasses = (newClasses: Class[]) => {
    setClasses(newClasses);
    localStorage.setItem('app_classes', JSON.stringify(newClasses));
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    const updated = classes.map(c => 
      c.id === id ? { ...c, active: !c.active } : c
    );
    saveClasses(updated);
    toast({ 
      title: "Status Diperbarui", 
      description: "Status kelas telah berhasil diubah." 
    });
  };

  const handleDeleteRequest = (id: string) => {
    setClassToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      const updated = classes.filter(c => c.id !== classToDelete);
      saveClasses(updated);
      toast({ title: "Kelas Dihapus", description: "Data kelas telah dihapus secara permanen." });
    }
    setIsDeleteDialogOpen(false);
  };

  const openAddDialog = () => {
    setEditingClass({
      id: `class-${Date.now()}`,
      name: '',
      active: true
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass({ ...cls });
    setIsDialogOpen(true);
  };

  const handleSaveClass = () => {
    if (!editingClass?.name) {
      toast({ variant: "destructive", title: "Data Belum Lengkap", description: "Mohon isi nama kelas." });
      return;
    }

    const updatedClasses = [...classes];
    const index = updatedClasses.findIndex(c => c.id === editingClass.id);
    
    if (index >= 0) {
      updatedClasses[index] = editingClass as Class;
    } else {
      updatedClasses.push(editingClass as Class);
    }

    saveClasses(updatedClasses);
    setIsDialogOpen(false);
    toast({ title: "Berhasil Disimpan", description: `Kelas "${editingClass.name}" telah diperbarui.` });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kelas</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Kelola daftar kelas dan kontrol akses pengerjaan soal.</p>
        </div>
        
        <Button onClick={openAddDialog} className="h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus className="mr-2" size={24} /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari nama kelas..." 
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
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest pl-10">Nama Kelas</TableHead>
                <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-center">Status Akses</TableHead>
                <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id} className="hover:bg-primary/5 transition-colors group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl transition-all shadow-inner",
                        cls.active ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      )}>
                        <School size={24} />
                      </div>
                      <span className="font-black text-xl text-foreground">{cls.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Switch 
                        checked={cls.active} 
                        onCheckedChange={() => toggleStatus(cls.id)}
                      />
                      <Badge className={cn(
                        "border-none py-1 px-3 rounded-lg font-black text-[10px] tracking-widest",
                        cls.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {cls.active ? 'AKTIF' : 'NONAKTIF'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)} className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"><Pencil size={18} /></Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(cls.id)} className="h-10 w-10 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredClasses.length === 0 && (
            <div className="p-24 text-center">
              <div className="bg-muted/20 inline-block p-8 rounded-full mb-6">
                <School className="w-16 h-16 text-muted-foreground opacity-20" />
              </div>
              <p className="text-2xl font-black text-muted-foreground">Tidak ada kelas ditemukan.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-black">
                {editingClass?.id?.includes('class-') ? 'Edit Kelas' : 'Tambah Kelas Baru'}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-bold text-lg">Masukkan identitas kelas di bawah ini.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nama Kelas</label>
              <Input 
                value={editingClass?.name || ''}
                onChange={(e) => setEditingClass({ ...editingClass!, name: e.target.value })}
                placeholder="Contoh: Kelas 7 - A" 
                className="h-14 rounded-xl border-2 font-bold text-lg" 
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t flex gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 rounded-xl font-black">Batal</Button>
            <Button onClick={handleSaveClass} className="h-14 px-10 rounded-xl font-black shadow-lg">Simpan Kelas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-red-600">Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-bold">
              Tindakan ini tidak dapat dibatalkan. Seluruh data kuis dan nilai siswa yang terkait dengan kelas ini akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="h-12 rounded-xl font-bold">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-12 rounded-xl bg-red-600 hover:bg-red-700 font-black">
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
