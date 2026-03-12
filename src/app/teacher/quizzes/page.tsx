"use client";

import React, { useState, useEffect } from 'react';
import { initialQuizzes, classes as initialClasses } from '@/lib/mock-data';
import { Quiz, Question, Class, QuestionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Save, Upload, Info, Check, Sigma, Type, List, X, BookOpen } from 'lucide-react';
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
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [uploadJson, setUploadJson] = useState('');
  
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
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (quizToDelete) {
      const updated = quizzes.filter(q => q.id !== quizToDelete);
      saveQuizzes(updated);
      toast({ title: "Kuis Dihapus", description: "Data kuis telah dihapus secara permanen." });
    }
    setIsConfirmOpen(false);
  };

  const openAddDialog = () => {
    setBulkCount(1);
    setEditingQuiz({
      id: `quiz-${Date.now()}`,
      title: '',
      classId: '',
      questions: [{ id: 'q1', type: 'multiple-choice', text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
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
    if (!uploadJson.trim()) {
      toast({ variant: "destructive", title: "Data Kosong", description: "Harap tempelkan data JSON soal." });
      return;
    }

    try {
      const parsed = JSON.parse(uploadJson);
      if (!Array.isArray(parsed)) throw new Error("Format harus berupa array []");
      
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
        toast({ title: "Upload Berhasil", description: `${validatedQuestions.length} soal telah ditambahkan ke kuis.` });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload Gagal", description: "Pastikan format JSON sudah benar sesuai contoh." });
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
          <h1 className="text-3xl md:text-4xl font-headline font-black text-foreground tracking-tighter text-primary">Manajemen Kuis</h1>
          <p className="text-base md:text-lg font-bold text-muted-foreground mt-1">Kelola bank soal untuk setiap jenjang kelas.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button onClick={openAddDialog} className="flex-1 sm:flex-none h-12 md:h-14 px-6 md:px-8 font-black text-base md:text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all">
            <Plus className="mr-2" size={24} /> Tambah Kuis
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-card/50 backdrop-blur-sm">
        <CardHeader className="bg-card border-b p-6 md:p-8">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Cari kuis atau kelas..." 
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
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] h-16 font-black uppercase text-xs tracking-widest pl-8 text-foreground">Judul Kuis</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Kelas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Jumlah Soal</TableHead>
                  <TableHead className="h-16 font-black uppercase text-xs tracking-widest text-foreground">Status</TableHead>
                  <TableHead className="text-right h-16 font-black uppercase text-xs tracking-widest pr-8 text-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuizzes.map((quiz) => (
                  <TableRow key={quiz.id} className="hover:bg-primary/5 transition-colors group border-b">
                    <TableCell className="font-black text-lg pl-8 py-6 text-foreground">{quiz.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-black py-1.5 px-4 rounded-xl border-none bg-accent/10 text-accent">
                        {classes.find(c => c.id === quiz.classId)?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-muted-foreground">{quiz.questions.length} Soal</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-100 border-none py-1.5 px-4 rounded-xl font-black text-xs">
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
              <div className="p-16 md:p-24 text-center">
                <div className="bg-muted/20 inline-block p-6 md:p-8 rounded-full mb-6">
                  <Search className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground opacity-20" />
                </div>
                <p className="text-xl md:text-2xl font-black text-muted-foreground">Tidak ada kuis ditemukan.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl p-0 bg-[#0a0c10] text-white">
          <div className="p-6 md:p-8 shrink-0">
            <DialogHeader className="flex flex-row justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-xl md:text-3xl font-headline font-black text-white">
                  {editingQuiz?.id?.includes('quiz-') ? 'Edit Kuis' : 'Tambah Soal Baru'}
                </DialogTitle>
                <DialogDescription className="text-white/40 font-bold text-xs md:text-sm">Sesuaikan informasi dan butir soal di bawah ini.</DialogDescription>
              </div>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                variant="outline" 
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 hidden sm:flex h-12 rounded-xl"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Soal JSON
              </Button>
            </DialogHeader>
          </div>
          
          <ScrollArea className="flex-1 overflow-y-auto px-4 md:px-8">
            <div className="space-y-8 md:space-y-10 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60 ml-1">Judul Kuis</label>
                  <Input 
                    placeholder="Contoh: Matematika - Persamaan Kuadrat" 
                    value={editingQuiz?.title || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz!, title: e.target.value })}
                    className="h-12 md:h-14 rounded-xl border-white/10 bg-white/5 font-bold text-base md:text-lg text-white" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60 ml-1">Pilih Kelas</label>
                  <Select value={editingQuiz?.classId || ''} onValueChange={(val) => setEditingQuiz({ ...editingQuiz!, classId: val })}>
                    <SelectTrigger className="h-12 md:h-14 rounded-xl border-white/10 bg-white/5 font-bold text-base md:text-lg text-white">
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1d23] text-white border-white/10">
                      {classes.map(c => <SelectItem key={c.id} value={c.id} className="font-bold focus:bg-primary focus:text-white">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-8 md:space-y-12">
                {editingQuiz?.questions?.map((q, qIdx) => (
                  <div key={q.id} className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 bg-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                       <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2 md:gap-3">
                         Soal <span className="text-primary">#{qIdx + 1}</span>
                       </h3>
                       <div className="flex items-center gap-2">
                          <Tabs 
                            value={q.type} 
                            onValueChange={(val) => updateQuestion(qIdx, 'type', val as QuestionType)}
                          >
                            <TabsList className="bg-white/10 border border-white/10 rounded-xl h-10 p-1">
                              <TabsTrigger value="multiple-choice" className="data-[state=active]:bg-primary rounded-lg text-[10px] md:text-xs font-black">PG</TabsTrigger>
                              <TabsTrigger value="short-answer" className="data-[state=active]:bg-primary rounded-lg text-[10px] md:text-xs font-black">Isian</TabsTrigger>
                            </TabsList>
                          </Tabs>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeQuestion(qIdx)}
                            className="text-red-400 hover:bg-red-400/10 h-10 w-10 rounded-xl"
                            disabled={editingQuiz.questions!.length <= 1}
                          >
                            <Trash2 size={18} />
                          </Button>
                       </div>
                    </div>

                    {/* PERTANYAAN */}
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex items-center gap-2 text-white/40">
                         <Sigma size={14} className="text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Keyboard Matematika (Pertanyaan)</span>
                      </div>
                      <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'text', s)} />
                      <Input 
                        placeholder="Ketik pertanyaan di sini..." 
                        value={q.text}
                        onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                        className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-white/10 border-white/10 font-medium text-base md:text-lg text-white placeholder:text-white/20 px-4 md:px-6 focus:ring-primary/40 focus:border-primary" 
                      />
                    </div>
                    
                    {/* OPSI / JAWABAN */}
                    <div className="space-y-4 md:space-y-6">
                      <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Check size={16} className="text-primary" /> Konfigurasi Jawaban
                      </h4>
                      
                      {q.type === 'multiple-choice' ? (
                        <div className="grid grid-cols-1 gap-4 md:gap-6">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="space-y-2 md:space-y-3">
                              <div className="flex gap-3">
                                <Button 
                                  variant={q.correctAnswer === oIdx ? "default" : "ghost"}
                                  size="icon"
                                  className={cn(
                                    "shrink-0 h-12 md:h-14 w-12 md:w-14 rounded-xl md:rounded-2xl border transition-all",
                                    q.correctAnswer === oIdx 
                                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                      : "bg-white/5 border-white/10 text-white/20 hover:text-white hover:bg-white/10"
                                  )}
                                  onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                                >
                                  {q.correctAnswer === oIdx ? <Check size={20} className="md:w-6 md:h-6" /> : <span className="font-black text-xs md:text-sm">{String.fromCharCode(65 + oIdx)}</span>}
                                </Button>
                                <Input 
                                  placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...q.options];
                                    newOpts[oIdx] = e.target.value;
                                    updateQuestion(qIdx, 'options', newOpts);
                                  }}
                                  className="h-12 md:h-14 bg-white/5 border-white/10 rounded-xl md:rounded-2xl text-white font-medium px-4 md:px-6 focus:ring-primary/40 focus:border-primary"
                                />
                              </div>
                              <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'option', s, oIdx)} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3 md:space-y-4">
                           <div className="flex bg-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl border border-primary/20 items-center gap-3 md:gap-4">
                              <div className="bg-primary p-2 md:p-3 rounded-lg md:rounded-xl text-white shadow-lg">
                                <Check size={18} className="md:w-5 md:h-5" />
                              </div>
                              <div className="flex-1">
                                <Input 
                                  placeholder="Ketik kunci jawaban isian..." 
                                  value={q.correctAnswer as string}
                                  onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)}
                                  className="bg-transparent border-none text-lg md:text-xl font-black text-white placeholder:text-white/20 focus-visible:ring-0 p-0 h-auto" 
                                />
                              </div>
                           </div>
                           <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'correctAnswer', s)} />
                        </div>
                      )}
                    </div>

                    {/* PEMBAHASAN / CARA PENGERJAAN */}
                    <div className="space-y-3 md:space-y-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-white/40">
                         <BookOpen size={14} className="text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Pembahasan / Cara Pengerjaan (Opsional)</span>
                      </div>
                      <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'explanation', s)} />
                      <Textarea 
                        placeholder="Tuliskan langkah-langkah penyelesaian agar siswa paham..." 
                        value={q.explanation || ''}
                        onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                        className="min-h-[80px] md:min-h-[100px] rounded-xl md:rounded-2xl bg-white/5 border-white/10 font-medium text-white placeholder:text-white/20 px-4 md:px-6 focus:ring-primary/40 focus:border-primary" 
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-4 md:pt-8">
                  <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 p-3 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl w-full sm:w-auto">
                    <div className="flex items-center gap-3 px-4 w-full sm:w-auto justify-center">
                      <span className="text-[10px] font-black text-white/40 uppercase">Jumlah</span>
                      <Input 
                        type="number" 
                        min={1} 
                        max={20}
                        value={bulkCount}
                        onChange={(e) => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 h-10 font-black text-center bg-white/10 border-white/10 rounded-xl"
                      />
                    </div>
                    <Button 
                      onClick={() => addQuestions(bulkCount)} 
                      variant="outline" 
                      className="w-full sm:w-auto rounded-xl md:rounded-2xl font-black h-12 md:h-14 px-6 md:px-8 bg-primary hover:bg-primary/90 border-none text-white shadow-xl shadow-primary/20"
                    >
                      <Plus className="mr-2 h-5 w-5" /> {bulkCount > 1 ? `Tambah ${bulkCount} Soal` : 'Tambah 1 Soal Baru'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 md:p-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row gap-4 shrink-0">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-12 md:h-14 px-8 rounded-xl md:rounded-2xl font-black text-lg text-white/40 hover:text-white hover:bg-white/5 w-full sm:w-auto order-2 sm:order-1">
              Batal
            </Button>
            <Button onClick={handleSaveQuiz} className="h-12 md:h-14 px-10 md:px-12 rounded-xl md:rounded-2xl font-black text-lg shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-white w-full sm:w-auto order-1 sm:order-2">
              <Save className="mr-2" /> Simpan Seluruh Kuis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl w-[95vw] md:w-full rounded-[2rem] md:rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-[#0a0c10] text-white">
          <div className="bg-primary p-6 md:p-10 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
               <Upload size={120} />
            </div>
            <div className="flex items-center gap-4 md:gap-6 relative z-10">
               <div className="bg-white/20 p-3 md:p-5 rounded-xl md:rounded-[1.5rem] shadow-inner ring-4 ring-white/10">
                 <Upload size={24} />
               </div>
               <div>
                  <DialogTitle className="text-xl md:text-3xl font-black tracking-tight">Impor Bank Soal</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold text-xs md:text-lg">Gunakan format JSON untuk impor massal.</DialogDescription>
               </div>
            </div>
          </div>
          
          <div className="p-4 md:p-10 space-y-6 md:space-y-8">
            <div className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/10 space-y-3 shadow-inner">
               <div className="flex items-center gap-2 text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  <Info size={16} /> Contoh Struktur Data
               </div>
               <ScrollArea className="h-24 md:h-40">
                <pre className="text-[10px] md:text-[11px] font-mono bg-black/40 p-3 md:p-5 rounded-xl md:rounded-2xl text-white/60 leading-relaxed border border-white/5">
{`[
  {
    "type": "multiple-choice",
    "text": "1 + 1 = ?",
    "explanation": "Cukup jumlahkan angka satu dengan satu.",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": 1
  },
  {
    "type": "short-answer",
    "text": "Siapa penemu lampu?",
    "explanation": "Thomas Edison mematenkan lampu pijar pada tahun 1879.",
    "correctAnswer": "Thomas Edison"
  }
]`}
                </pre>
               </ScrollArea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40 ml-1">Tempelkan JSON di sini</label>
              <Textarea 
                value={uploadJson}
                onChange={(e) => setUploadJson(e.target.value)}
                placeholder='[ { "type": "multiple-choice", ... }, ... ]'
                className="min-h-[120px] md:min-h-[250px] font-mono text-xs md:text-sm bg-white/5 border-white/10 rounded-xl md:rounded-2xl text-white placeholder:text-white/20 focus:ring-primary/40 focus:border-primary shadow-inner"
              />
            </div>
          </div>

          <DialogFooter className="p-4 md:p-10 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsUploadOpen(false)} 
              className="h-12 md:h-14 rounded-xl md:rounded-2xl font-black text-white/40 hover:text-white hover:bg-white/5 w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button 
              onClick={handleBulkUpload} 
              className="flex-1 h-12 md:h-16 rounded-xl md:rounded-2xl font-black shadow-2xl bg-primary hover:bg-primary/90 text-white ring-4 ring-primary/20 w-full sm:w-auto"
            >
              Mulai Impor Data <Check className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[1.5rem] md:rounded-[2.5rem] w-[90vw] max-w-lg bg-[#0a0c10] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl md:text-2xl font-black text-white">Hapus Kuis?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 text-base md:text-lg font-bold">
              Tindakan ini tidak dapat dibatalkan. Seluruh data kuis dan progres siswa yang terkait akan ikut terhapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
            <AlertDialogCancel className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-12 md:h-14 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-700 font-black text-white w-full sm:w-auto shadow-xl shadow-red-900/20">
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
