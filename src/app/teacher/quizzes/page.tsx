
"use client";

import React, { useState, useEffect } from 'react';
import { initialQuizzes, classes as initialClasses } from '@/lib/mock-data';
import { Quiz, Question, Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, BookOpen, Save, X, ListPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function QuizManagement() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Partial<Quiz> | null>(null);
  const [bulkCount, setBulkCount] = useState<number>(1);
  
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('app_quizzes');
    const savedClasses = localStorage.getItem('app_classes');

    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    } else {
      setQuizzes(initialQuizzes);
      localStorage.setItem('app_quizzes', JSON.stringify(initialQuizzes));
    }

    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      setClasses(initialClasses);
    }
  }, []);

  const saveQuizzes = (newQuizzes: Quiz[]) => {
    setQuizzes(newQuizzes);
    localStorage.setItem('app_quizzes', JSON.stringify(newQuizzes));
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classes.find(c => c.id === q.classId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRequest = (id: string) => {
    setQuizToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (quizToDelete) {
      const updated = quizzes.filter(q => q.id !== quizToDelete);
      saveQuizzes(updated);
      toast({ title: "Kuis Dihapus", description: "Data kuis telah dihapus secara permanen." });
    }
    setIsDeleteDialogOpen(false);
  };

  const openAddDialog = () => {
    setBulkCount(1);
    setEditingQuiz({
      id: `quiz-${Date.now()}`,
      title: '',
      classId: '',
      questions: [{ id: 'q1', text: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (quiz: Quiz) => {
    setBulkCount(1);
    setEditingQuiz({ ...quiz });
    setIsDialogOpen(true);
  };

  const handleSaveQuiz = () => {
    if (!editingQuiz?.title || !editingQuiz?.classId) {
      toast({ variant: "destructive", title: "Data Belum Lengkap", description: "Mohon isi judul dan pilih kelas." });
      return;
    }

    const updatedQuizzes = [...quizzes];
    const index = updatedQuizzes.findIndex(q => q.id === editingQuiz.id);
    
    if (index >= 0) {
      updatedQuizzes[index] = editingQuiz as Quiz;
    } else {
      updatedQuizzes.push(editingQuiz as Quiz);
    }

    saveQuizzes(updatedQuizzes);
    setIsDialogOpen(false);
    toast({ title: "Berhasil Disimpan", description: `Kuis "${editingQuiz.title}" telah diperbarui.` });
  };

  const addQuestions = (count: number) => {
    if (editingQuiz) {
      const newQuestions = [...(editingQuiz.questions || [])];
      for (let i = 0; i < count; i++) {
        newQuestions.push({
          id: `q-${Date.now()}-${i}`,
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        });
      }
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
      toast({
        title: "Soal Ditambahkan",
        description: `${count} butir soal baru telah ditambahkan ke daftar.`
      });
    }
  };

  const removeQuestion = (idx: number) => {
    if (editingQuiz && editingQuiz.questions && editingQuiz.questions.length > 1) {
      const newQuestions = [...editingQuiz.questions];
      newQuestions.splice(idx, 1);
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
    }
  };

  const updateQuestion = (idx: number, field: keyof Question, value: any) => {
    if (editingQuiz && editingQuiz.questions) {
      const newQuestions = [...editingQuiz.questions];
      newQuestions[idx] = { ...newQuestions[idx], [field]: value };
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kuis</h1>
          <p className="text-lg font-bold text-muted-foreground mt-1">Kelola bank soal untuk setiap jenjang kelas.</p>
        </div>
        
        <Button onClick={openAddDialog} className="h-14 px-8 font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
          <Plus className="mr-2" size={24} /> Tambah Kuis
        </Button>
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
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(quiz)} className="h-10 w-10 rounded-xl border-2 hover:bg-primary hover:text-white transition-all"><Pencil size={18} /></Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteRequest(quiz.id)} className="h-10 w-10 rounded-xl border-2 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></Button>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0">
          <div className="bg-primary p-8 text-white sticky top-0 z-10">
            <DialogHeader>
              <DialogTitle className="text-3xl font-headline font-black">
                {editingQuiz?.id?.includes('quiz-') ? 'Edit Kuis' : 'Buat Kuis Baru'}
              </DialogTitle>
              <DialogDescription className="text-white/80 font-bold text-lg">Sesuaikan informasi dan butir soal di bawah ini.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Judul Kuis</label>
                <Input 
                  value={editingQuiz?.title || ''}
                  onChange={(e) => setEditingQuiz({ ...editingQuiz!, title: e.target.value })}
                  placeholder="Contoh: Aljabar Dasar - Sesi 1" 
                  className="h-14 rounded-xl border-2 font-bold text-lg" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tingkat Kelas</label>
                <Select value={editingQuiz?.classId || ''} onValueChange={(val) => setEditingQuiz({ ...editingQuiz!, classId: val })}>
                  <SelectTrigger className="h-14 rounded-xl border-2 font-bold text-lg">
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-dashed pb-6 gap-4">
                <h3 className="text-xl font-black text-primary uppercase tracking-widest flex items-center gap-2">
                  <BookOpen size={24} /> Butir Soal ({editingQuiz?.questions?.length || 0})
                </h3>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-2xl border-2 border-primary/10">
                  <div className="flex items-center gap-2 px-3">
                    <ListPlus size={18} className="text-primary" />
                    <Input 
                      type="number" 
                      min={1} 
                      max={20}
                      value={bulkCount}
                      onChange={(e) => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 h-10 font-black text-center border-2 rounded-lg"
                    />
                  </div>
                  <Button 
                    onClick={() => addQuestions(bulkCount)} 
                    variant="default" 
                    className="rounded-xl font-bold h-10 shadow-md"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Tambah {bulkCount > 1 ? bulkCount : ''} Soal
                  </Button>
                </div>
              </div>

              {editingQuiz?.questions?.map((q, qIdx) => (
                <Card key={q.id} className="border-2 rounded-2xl overflow-hidden shadow-sm student-card-hover group">
                  <CardHeader className="bg-muted/30 py-4 px-6 flex flex-row justify-between items-center transition-colors group-hover:bg-primary/5">
                    <span className="font-black text-lg">Soal #{qIdx + 1}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeQuestion(qIdx)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      disabled={editingQuiz.questions!.length <= 1}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pertanyaan</label>
                       <Input 
                        placeholder="Masukkan teks pertanyaan di sini..." 
                        value={q.text}
                        onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                        className="h-12 font-bold text-lg border-2 focus:ring-primary/20" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <div className="flex gap-2 items-center">
                            <Button 
                              variant={q.correctAnswer === oIdx ? "default" : "outline"}
                              size="icon"
                              className="shrink-0 h-10 w-10 rounded-lg font-black border-2"
                              onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                              title="Tandai sebagai jawaban benar"
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </Button>
                            <Input 
                              placeholder={`Pilihan ${String.fromCharCode(65 + oIdx)}`}
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[oIdx] = e.target.value;
                                updateQuestion(qIdx, 'options', newOpts);
                              }}
                              className={`h-10 font-medium ${q.correctAnswer === oIdx ? 'border-primary ring-1 ring-primary/20' : ''}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t sticky bottom-0 flex gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 rounded-xl font-black text-lg">
              <X className="mr-2" /> Batal
            </Button>
            <Button onClick={handleSaveQuiz} className="h-14 px-10 rounded-xl font-black text-lg shadow-lg">
              <Save className="mr-2" /> Simpan Kuis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black">Hapus Kuis?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-bold">
              Tindakan ini tidak dapat dibatalkan. Seluruh data kuis dan progres siswa yang terkait akan ikut terhapus.
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
