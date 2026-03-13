
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
    const unsubscribe = listenToClasses((data) => {
      setClasses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredClasses = classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (cls: Class) => {
    try {
      // Kirim id dan status baru, saveClass di database.ts akan menjaga nama tetap ada
      await saveClass({ id: cls.id, active: !cls.active });
      toast({ title: "Status Diperbarui", description: `Kelas ${cls.name} sekarang ${!cls.active ? 'Aktif' : 'Nonaktif'}.` });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal mengubah status kelas.' });
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
        toast({ title: "Berhasil", description: "Kelas telah dihapus." });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal menghapus kelas.' });
      }
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingClass({ name: '', active: true });
    setIsDialogOpen(true);
  };

  const openEditDialog = (cls: Class) => {
    setEditingClass({ ...cls });
    setIsDialogOpen(true);
  };

  const handleSaveClass = async () => {
    if (!editingClass?.name?.trim()) {
      toast({ variant: "destructive", title: "Gagal", description: "Nama kelas tidak boleh kosong." });
      return;
    }

    setIsSaving(true);
    try {
      await saveClass(editingClass);
      setIsDialogOpen(false);
      toast({ title: "Berhasil", description: "Data kelas telah diperbarui di Cloud." });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal', description: 'Gagal menghubungi database.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kelas</h1>
          <p className="text-sm md:text-lg font-bold text-muted-foreground mt-1">Data tersinkron otomatis antar semua perangkat.</p>
        </div>
        
        <Button onClick={openAddDialog} className="w-full sm:w-auto h-12 md:h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus className="mr-2" size={24} /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6 md:p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Cari nama kelas..." 
              className="pl-12 h-12 md:h-14 rounded-xl border-2 font-bold bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full overflow-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="h-16 font-black uppercase text-xs pl-8">Nama Kelas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs text-center">Status Akses</TableHead>
                  <TableHead className="text-right h-16 font-black uppercase text-xs pr-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 animate-pulse font-bold">Menghubungkan ke Cloud...</TableCell></TableRow>
                ) : filteredClasses.length > 0 ? filteredClasses.map((cls) => (
                  <TableRow key={cls.id} className="hover:bg-primary/5 transition-colors border-b">
                    <TableCell className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl shadow-inner", cls.active ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          <School size={20} />
                        </div>
                        <span className="font-black text-lg text-foreground">{cls.name || 'Tanpa Nama'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Switch checked={cls.active} onCheckedChange={() => handleToggleStatus(cls)} />
                        <Badge className={cn("border-none text-[10px] font-black", cls.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {cls.active ? 'AKTIF' : 'NONAKTIF'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(cls)} className="h-10 w-10 rounded-xl border-2"><Pencil size={18} /></Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(cls.id)} className="h-10 w-10 rounded-xl border-2 text-red-500"><Trash2 size={18} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} className="text-center py-20 font-bold text-muted-foreground">Belum ada kelas.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md w-[95vw] rounded-[2rem] border-none shadow-2xl p-0 bg-background overflow-hidden">
          <div className="bg-primary p-6 text-white"><DialogHeader><DialogTitle className="text-2xl font-black">{editingClass?.id ? 'Edit Kelas' : 'Tambah Kelas'}</DialogTitle></DialogHeader></div>
          <div className="p-6 space-y-4">
            <label className="text-xs font-black uppercase text-muted-foreground ml-1">Nama Kelas</label>
            <Input value={editingClass?.name || ''} onChange={(e) => setEditingClass({ ...editingClass!, name: e.target.value })} placeholder="Contoh: Kelas 7 - A" className="h-14 rounded-xl border-2 font-bold" />
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t flex flex-row gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="flex-1 h-12 rounded-xl font-bold">Batal</Button>
            <Button onClick={handleSaveClass} disabled={isSaving} className="flex-1 h-12 rounded-xl font-black">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem] w-[90vw] max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-red-600">Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription className="font-bold">Aksi ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4 flex-row">
            <AlertDialogCancel className="flex-1 h-12 rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="flex-1 h-12 rounded-xl bg-red-600 font-black">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
