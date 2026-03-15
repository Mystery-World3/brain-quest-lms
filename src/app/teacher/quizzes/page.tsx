
"use client";

import React, { useState, useEffect } from 'react';
import { listenToQuizzes, saveQuiz, deleteQuiz, getClasses, listenToClasses } from '@/services/database';
import { Quiz, Question, Class, QuestionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Save, Upload, Check, Sigma, BookOpen, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const mathSymbols = [
  "x", "x₁", "x₂", "y", "y₁", "y₂", "r", "r₁", "r₂", "m", "+", "-", "×", "÷", "·",
  "=", "≠", "≈", "→", "±", "√", "π", "²", "³", "ⁿ", "°", "<", ">", "≤", "≥",
  "(", ")", "[", "]", "{", "}"
];

export default function QuizManagement() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Partial<Quiz> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadJson, setUploadJson] = useState('');
  
  useEffect(() => {
    const unsubscribeQuizzes = listenToQuizzes((data) => {
      setQuizzes(data);
      setLoading(false);
    });

    const unsubscribeClasses = listenToClasses((data) => {
      setClasses(data);
    });

    return () => {
      unsubscribeQuizzes();
      unsubscribeClasses();
    };
  }, []);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classes.find(c => c.id === q.classId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRequest = (id: string) => {
    setQuizToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (quizToDelete) {
      try {
        await deleteQuiz(quizToDelete);
        toast({ title: "Kuis Dihapus" });
      } catch (err) {
        toast({ variant: 'destructive', title: 'Gagal Menghapus' });
      }
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setEditingQuiz({
      title: '',
      classId: '',
      questions: [{ id: `q-${Date.now()}`, type: 'multiple-choice', text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (quiz: Quiz) => {
    setEditingQuiz({ ...quiz });
    setIsDialogOpen(true);
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz?.title || !editingQuiz?.classId) {
      toast({ variant: "destructive", title: "Data Belum Lengkap" });
      return;
    }

    setIsSaving(true);
    const savePromise = saveQuiz(editingQuiz);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 3000)
    );

    try {
      await Promise.race([savePromise, timeoutPromise]);
      toast({ title: "Berhasil Disimpan" });
    } catch (err: any) {
      if (err.message === 'timeout') {
        toast({ title: "Sinkronisasi...", description: "Data dikirim ke Cloud." });
      } else {
        toast({ variant: 'destructive', title: 'Gagal Menyimpan' });
      }
    } finally {
      setIsSaving(false);
      setIsDialogOpen(false);
    }
  };

  const addQuestions = (count: number) => {
    if (editingQuiz) {
      const newQuestions = [...(editingQuiz.questions || [])];
      for (let i = 0; i < count; i++) {
        newQuestions.push({
          id: `q-${Date.now()}-${i}`,
          type: 'multiple-choice',
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        });
      }
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
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
      
      if (field === 'type') {
        newQuestions[idx].correctAnswer = value === 'multiple-choice' ? 0 : '';
      }
      
      setEditingQuiz({ ...editingQuiz, questions: newQuestions });
    }
  };

  const appendSymbol = (idx: number, field: string, symbol: string, optionIdx?: number) => {
    setEditingQuiz((prev) => {
      if (!prev || !prev.questions) return prev;
      const updatedQuestions = [...prev.questions];
      const q = { ...updatedQuestions[idx] };

      if (field === 'text') {
        q.text = (q.text || "") + symbol;
      } else if (field === 'explanation') {
        q.explanation = (q.explanation || "") + symbol;
      } else if (field === 'option' && typeof optionIdx === 'number') {
        const newOptions = [...q.options];
        newOptions[optionIdx] = (newOptions[optionIdx] || "") + symbol;
        q.options = newOptions;
      } else if (field === 'correctAnswer' && q.type === 'short-answer') {
        q.correctAnswer = (q.correctAnswer as string || '') + symbol;
      }

      updatedQuestions[idx] = q;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleBulkUpload = () => {
    if (!uploadJson.trim()) return;
    try {
      const parsed = JSON.parse(uploadJson);
      if (editingQuiz) {
        const validatedQuestions = parsed.map((q: any, i: number) => ({
          id: `q-bulk-${Date.now()}-${i}`,
          type: q.type || 'multiple-choice',
          text: q.text || '',
          explanation: q.explanation || '',
          options: q.options || (q.type === 'short-answer' ? [] : ['', '', '', '']),
          correctAnswer: q.correctAnswer ?? (q.type === 'short-answer' ? '' : 0)
        }));
        setEditingQuiz({
          ...editingQuiz,
          questions: [...(editingQuiz.questions || []), ...validatedQuestions]
        });
        setIsUploadOpen(false);
        setUploadJson('');
        toast({ title: "Import Berhasil" });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Format JSON Salah" });
    }
  };

  const StaticMathKeyboard = ({ onSelect }: { onSelect: (s: string) => void }) => (
    <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 p-3 bg-slate-900/50 rounded-2xl border border-white/5 mt-2">
      {mathSymbols.map(sym => (
        <Button 
          key={sym} 
          type="button"
          variant="ghost" 
          size="sm" 
          className="h-10 w-full p-0 text-white font-black text-sm hover:bg-primary hover:text-white transition-all rounded-xl border border-white/10 bg-white/5 shadow-sm"
          onPointerDown={(e) => {
            e.preventDefault();
            onSelect(sym);
          }}
        >
          {sym}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-headline font-black text-primary tracking-tighter">Manajemen Kuis</h1>
          <p className="text-base md:text-lg font-bold text-muted-foreground mt-1">Bank soal tersinkron otomatis.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={openAddDialog} className="flex-1 sm:flex-none h-12 md:h-14 px-6 md:px-8 font-black text-base md:text-lg rounded-2xl shadow-xl">
            <Plus className="mr-2" size={24} /> Tambah Kuis
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6 md:p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Cari kuis..." 
              className="pl-12 h-12 md:h-14 rounded-xl md:rounded-2xl border-2 font-bold text-base md:text-lg bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full overflow-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[300px] h-16 font-black uppercase text-xs tracking-widest pl-8 text-foreground">Judul Kuis</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Kelas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Jumlah Soal</TableHead>
                  <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-8 text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20 font-bold animate-pulse text-primary">Sinkronisasi Cloud...</TableCell></TableRow>
                ) : filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="hover:bg-primary/5 transition-colors group border-b">
                    <TableCell className="font-black text-lg pl-8 py-6 text-foreground">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-black py-1.5 px-4 rounded-xl border-none bg-accent/10 text-accent">
                        {classes.find(c => c.id === quiz.classId)?.name || 'Memuat...'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-muted-foreground">{quiz.questions.length} Soal</TableCell>
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
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl p-0 bg-[#0a0c10] text-white">
          <div className="p-6 md:p-8 shrink-0">
            <DialogHeader className="flex flex-row justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-xl md:text-3xl font-headline font-black text-white">
                  {editingQuiz?.id ? 'Edit Kuis' : 'Buat Kuis Cloud'}
                </DialogTitle>
                <DialogDescription className="text-white/40 font-bold">Data tersimpan otomatis.</DialogDescription>
              </div>
              <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                <Upload className="mr-2 h-4 w-4" /> Import JSON
              </Button>
            </DialogHeader>
          </div>
          
          <ScrollArea className="flex-1 overflow-y-auto px-4 md:px-8">
            <div className="space-y-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-white/60">Judul Kuis</label>
                  <Input 
                    placeholder="Judul..." 
                    value={editingQuiz?.title || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz!, title: e.target.value })}
                    className="h-12 rounded-xl border-white/10 bg-white/5 font-bold text-white" 
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-white/60">Kelas</label>
                  <Select value={editingQuiz?.classId || ''} onValueChange={(val) => setEditingQuiz({ ...editingQuiz!, classId: val })} disabled={isSaving}>
                    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 font-bold text-white">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1d23] text-white border-white/10">
                      {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-8">
                {editingQuiz?.questions?.map((q, qIdx) => (
                  <div key={q.id} className="space-y-6 bg-white/5 p-6 rounded-[1.5rem] border border-white/5 relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                       <h3 className="text-lg font-black text-white">Soal <span className="text-primary">#{qIdx + 1}</span></h3>
                       <div className="flex items-center gap-2">
                          <Tabs value={q.type} onValueChange={(val) => updateQuestion(qIdx, 'type', val as QuestionType)}>
                            <TabsList className="bg-white/10 rounded-xl h-10 p-1">
                              <TabsTrigger value="multiple-choice" className="data-[state=active]:bg-primary rounded-lg text-xs font-black">PG</TabsTrigger>
                              <TabsTrigger value="short-answer" className="data-[state=active]:bg-primary rounded-lg text-xs font-black">Isian</TabsTrigger>
                            </TabsList>
                          </Tabs>
                          <Button variant="ghost" size="icon" onClick={() => removeQuestion(qIdx)} className="text-red-400 h-10 w-10 rounded-xl" disabled={editingQuiz.questions!.length <= 1 || isSaving}>
                            <Trash2 size={18} />
                          </Button>
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                      <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'text', s)} />
                      <Input placeholder="Pertanyaan..." value={q.text} onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)} className="h-14 bg-white/10 border-white/10 text-white rounded-xl" disabled={isSaving} />
                    </div>

                    {q.type === 'multiple-choice' ? (
                      <div className="grid grid-cols-1 gap-4">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-2">
                            <div className="flex gap-3">
                              <Button 
                                variant={q.correctAnswer === oIdx ? "default" : "ghost"} 
                                className={cn("h-12 w-12 rounded-xl", q.correctAnswer === oIdx ? "bg-primary" : "bg-white/5 border border-white/10")}
                                onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                                disabled={isSaving}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </Button>
                              <Input value={opt} onChange={(e) => {
                                const newOpts = [...q.options];
                                newOpts[oIdx] = e.target.value;
                                updateQuestion(qIdx, 'options', newOpts);
                              }} className="h-12 bg-white/5 border-white/10 text-white rounded-xl" disabled={isSaving} />
                            </div>
                            <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'option', s, oIdx)} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <Input placeholder="Jawaban..." value={q.correctAnswer as string} onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)} className="h-14 bg-white/10 text-white rounded-xl" disabled={isSaving} />
                         <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'correctAnswer', s)} />
                      </div>
                    )}
                  </div>
                ))}
                <Button onClick={() => addQuestions(1)} className="w-full h-14 rounded-xl bg-primary font-black" disabled={isSaving}>
                  <Plus className="mr-2" /> Tambah Soal
                </Button>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 bg-white/5 border-t border-white/5 flex gap-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="h-12 rounded-xl font-black text-white/40">Batal</Button>
            <Button onClick={handleSaveQuiz} disabled={isSaving} className="flex-1 h-12 rounded-xl font-black bg-primary">
              {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Simpan Cloud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
