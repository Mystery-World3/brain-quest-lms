
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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToClasses((data) => {
      setClasses(data);
      setLoading(false);
    });
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const filteredClasses = classes.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (cls: Class) => {
    try {
      await saveClass({ id: cls.id, name: cls.name, active: !cls.active });
      toast({ title: "Status Diperbarui" });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal' });
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
        toast({ title: "Berhasil" });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Gagal' });
      }
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingClass({ name: '', active: true });
    setIsDialogOpen(true);
  };

  const handleSaveClass = async () => {
    if (!editingClass?.name?.trim()) return;
    setIsSaving(true);
    try {
      await saveClass(editingClass);
      setIsDialogOpen(false);
      toast({ title: "Berhasil Disimpan" });
    } catch (err) {
      toast({ variant: 'destructive', title: 'Gagal' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-foreground tracking-tighter">Manajemen Kelas</h1>
          <p className="text-sm font-bold text-muted-foreground mt-1">Data tersinkron otomatis secara instan.</p>
        </div>
        <Button onClick={openAddDialog} className="w-full sm:w-auto h-12 px-6 font-black rounded-xl shadow-xl">
          <Plus className="mr-2" size={20} /> Tambah Kelas
        </Button>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Cari kelas..." 
              className="pl-12 h-12 rounded-xl font-bold bg-background"
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
                  <TableHead className="h-14 font-black uppercase text-xs pl-8">Nama Kelas</TableHead>
                  <TableHead className="h-14 font-black uppercase text-xs text-center">Status</TableHead>
                  <TableHead className="text-right h-14 font-black uppercase text-xs pr-8">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10 font-bold">Sinkronisasi...</TableCell></TableRow>
                ) : filteredClasses.length > 0 ? filteredClasses.map((cls) => (
                  <TableRow key={cls.id} className="hover:bg-primary/5 border-b">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", cls.active ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
                          <School size={18} />
                        </div>
                        <span className="font-black text-base">{cls.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Switch checked={cls.active} onCheckedChange={() => handleToggleStatus(cls)} />
                        <Badge className={cn("text-[9px] font-black border-none", cls.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {cls.active ? 'AKTIF' : 'NONAKTIF'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => { setEditingClass(cls); setIsDialogOpen(true); }} className="h-9 w-9 rounded-lg"><Pencil size={16} /></Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(cls.id)} className="h-9 w-9 rounded-lg text-red-500"><Trash2 size={16} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} className="text-center py-10 font-bold text-muted-foreground">Tidak ada data.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 bg-background overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-6 text-white font-black text-xl">{editingClass?.id ? 'Edit Kelas' : 'Tambah Kelas'}</div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">Nama Kelas</label>
              <Input value={editingClass?.name || ''} onChange={(e) => setEditingClass({ ...editingClass!, name: e.target.value })} placeholder="Contoh: Kelas 7 - A" className="h-14 rounded-xl font-bold" />
            </div>
          </div>
          <DialogFooter className="p-6 bg-muted/20 border-t flex gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="flex-1 h-12 rounded-xl font-bold">Batal</Button>
            <Button onClick={handleSaveClass} disabled={isSaving} className="flex-1 h-12 rounded-xl font-black">
              {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader><AlertDialogTitle className="font-black">Hapus Kelas?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-4">
            <AlertDialogCancel className="h-12 rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-12 rounded-xl bg-red-600 font-black">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
