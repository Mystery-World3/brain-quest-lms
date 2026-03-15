
"use client";

import React, { useState, useEffect } from 'react';
import { listenToClasses, saveClass, deleteClass } from '@/services/database';
import { Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Search, School, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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

  useEffect(() => {
    // Data akan langsung ditarik dari cache lokal (0ms)
    const unsubscribe = listenToClasses(setClasses);
    return () => unsubscribe();
  }, []);

  const handleSaveClass = async () => {
    if (!editingClass?.name?.trim()) {
      toast({ variant: "destructive", title: "Nama kelas kosong!" });
      return;
    }
    
    // Instant UI: Tutup modal segera agar terasa sangat cepat
    setIsDialogOpen(false);
    
    try {
      await saveClass(editingClass);
      toast({ title: "Berhasil!", description: "Data tersinkron otomatis." });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal Simpan', description: 'Koneksi bermasalah.' });
      setIsDialogOpen(true);
    }
  };

  const handleToggleStatus = async (cls: Class) => {
    try {
      await saveClass({ ...cls, active: !cls.active });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal update status' });
    }
  };

  const confirmDelete = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete);
      toast({ title: "Terhapus" });
    }
    setIsConfirmOpen(false);
  };

  const filteredClasses = classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter flex items-center gap-3">
            Manajemen Kelas <Sparkles className="text-primary" />
          </h1>
          <p className="text-base font-bold text-muted-foreground mt-1">Data Anda tersinkron instan antar perangkat.</p>
        </div>
        <Button onClick={() => { setEditingClass({ name: '', active: true }); setIsDialogOpen(true); }} className="w-full sm:w-auto h-14 px-8 font-black rounded-2xl shadow-xl shadow-primary/20">
          <Plus className="mr-2" size={24} /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden glass-morphism">
        <CardHeader className="bg-card/50 border-b p-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Cari kelas..." 
              className="pl-12 h-14 rounded-2xl font-bold bg-background border-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="h-16 font-black uppercase text-xs pl-8 text-foreground">Nama Kelas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs text-center text-foreground">Status</TableHead>
                  <TableHead className="text-right h-16 font-black uppercase text-xs pr-8 text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length > 0 ? filteredClasses.map((cls) => (
                  <TableRow key={cls.id} className="hover:bg-primary/5 border-b transition-colors group">
                    <TableCell className="pl-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl transition-all group-hover:rotate-6", cls.active ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-muted text-muted-foreground")}>
                          <School size={20} />
                        </div>
                        <span className="font-black text-lg">{cls.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Switch checked={cls.active} onCheckedChange={() => handleToggleStatus(cls)} className="scale-110" />
                        <Badge className={cn("text-[10px] font-black border-none px-3", cls.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {cls.active ? 'AKTIF' : 'NONAKTIF'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" size="icon" onClick={() => { setEditingClass(cls); setIsDialogOpen(true); }} className="h-11 w-11 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"><Pencil size={18} /></Button>
                        <Button variant="outline" size="icon" onClick={() => { setClassToDelete(cls.id); setIsConfirmOpen(true); }} className="h-11 w-11 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 font-bold text-muted-foreground">Tidak ada data.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2.5rem] p-0 bg-background overflow-hidden border-none shadow-3xl">
          <div className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">{editingClass?.id ? 'Ubah Nama Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Nama Lengkap Kelas</label>
              <Input 
                value={editingClass?.name || ''} 
                onChange={(e) => setEditingClass({ ...editingClass!, name: e.target.value })} 
                placeholder="Misal: Kelas XI RPL 2" 
                className="h-16 rounded-2xl font-black text-xl border-2"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t flex gap-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 h-14 rounded-2xl font-bold text-lg border-2">Batal</Button>
            <Button onClick={handleSaveClass} className="flex-1 h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-2xl">Hapus Kelas Ini?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-lg mt-2">Tindakan ini permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 mt-8">
            <AlertDialogCancel className="h-14 rounded-2xl font-bold text-lg border-2 m-0">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 font-black text-lg shadow-xl shadow-red-500/20 m-0">Hapus Permanen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
