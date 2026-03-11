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
import { Plus, Pencil, Trash2, Search, BookOpen, Save, X, ListPlus, Type, List, Sigma, Upload, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

const mathSymbols = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
  "x", "x₁", "x₂", "y", "y₁", "y₂", "r", "r₁", "r₂", "m",
  "+", "-", "×", "÷", "·", "=", "≠", "≈", "→", "±", "√", "π",
  "²", "³", "ⁿ", "°", "<", ">", "≤", "≥",
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
      questions: [{ id: 'q1', type: 'multiple-choice', text: '', options: ['', '', '', ''], correctAnswer: 0 }]
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
          correctAnswer: 0
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
    try {
      const parsed = JSON.parse(uploadJson);
      if (!Array.isArray(parsed)) throw new Error("Format harus berupa array []");
      
      if (editingQuiz) {
        const validatedQuestions = parsed.map((q: any, i: number) => ({
          id: `q-bulk-${Date.now()}-${i}`,
          type: q.type || 'multiple-choice',
          text: q.text || '',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correctAnswer ?? 0
        }));

        setEditingQuiz({
          ...editingQuiz,
          questions: [...(editingQuiz.questions || []), ...validatedQuestions]
        });
        setIsUploadOpen(false);
        setUploadJson('');
        toast({ title: "Upload Berhasil", description: `${validatedQuestions.length} soal telah ditambahkan.` });
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Upload Gagal", description: "Pastikan format JSON benar." });
    }
  };

  const StaticMathKeyboard = ({ onSelect }: { onSelect: (s: string) => void }) => (
    <div className="flex flex-wrap gap-1 p-2 bg-muted/40 rounded-xl border-2 border-primary/5 mt-2">
      {mathSymbols.map(sym => (
        <Button 
          key={sym} 
          type="button"
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-foreground font-black text-xs hover:bg-primary hover:text-white transition-all rounded-md border border-border"
          onClick={(e) => {
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
          <h1 className="text-3xl md:text-4xl font-headline font-black text-foreground tracking-tighter">Manajemen Kuis</h1>
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
        <DialogContent className="max-w-4xl w-[95vw] md:w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[1.5rem] md:rounded-[2.5rem] border-none shadow-2xl p-0">
          <div className="bg-primary p-6 md:p-8 text-white shrink-0">
            <DialogHeader className="flex flex-row justify-between items-center">
              <div>
                <DialogTitle className="text-2xl md:text-3xl font-headline font-black">
                  {editingQuiz?.id?.includes('quiz-') ? 'Edit Kuis' : 'Buat Kuis Baru'}
                </DialogTitle>
                <DialogDescription className="text-white/80 font-bold text-base md:text-lg">Sesuaikan informasi dan butir soal di bawah ini.</DialogDescription>
              </div>
              <Button 
                onClick={() => setIsUploadOpen(true)}
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hidden sm:flex"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Soal
              </Button>
            </DialogHeader>
          </div>
          
          <ScrollArea className="flex-1 overflow-y-auto bg-muted/5">
            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Judul Kuis</label>
                  <Input 
                    value={editingQuiz?.title || ''}
                    onChange={(e) => setEditingQuiz({ ...editingQuiz!, title: e.target.value })}
                    placeholder="Contoh: Aljabar Dasar - Sesi 1" 
                    className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tingkat Kelas</label>
                  <Select value={editingQuiz?.classId || ''} onValueChange={(val) => setEditingQuiz({ ...editingQuiz!, classId: val })}>
                    <SelectTrigger className="h-12 md:h-14 rounded-xl border-2 font-bold text-base md:text-lg text-foreground">
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
                  <h3 className="text-lg md:text-xl font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <BookOpen size={24} /> Butir Soal ({editingQuiz?.questions?.length || 0})
                  </h3>
                  <div className="flex items-center gap-2 md:gap-3 bg-muted/30 p-2 rounded-2xl border-2 border-primary/10 w-full sm:w-auto">
                    <div className="flex items-center gap-2 px-2 md:px-3 flex-1 sm:flex-none">
                      <ListPlus size={18} className="text-primary" />
                      <Input 
                        type="number" 
                        min={1} 
                        max={20}
                        value={bulkCount}
                        onChange={(e) => setBulkCount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full sm:w-16 h-10 font-black text-center border-2 rounded-lg"
                      />
                    </div>
                    <Button 
                      onClick={() => addQuestions(bulkCount)} 
                      variant="default" 
                      className="rounded-xl font-bold h-10 shadow-md whitespace-nowrap"
                    >
                      <Plus className="mr-2 h-4 w-4" /> {bulkCount > 1 ? `+${bulkCount}` : '+1'} Soal
                    </Button>
                  </div>
                </div>

                {editingQuiz?.questions?.map((q, qIdx) => (
                  <Card key={q.id} className="border-2 rounded-xl md:rounded-2xl overflow-hidden shadow-sm group bg-card">
                    <CardHeader className="bg-muted/30 py-3 md:py-4 px-4 md:px-6 flex flex-row justify-between items-center">
                      <div className="flex items-center gap-2 md:gap-4 overflow-x-auto">
                        <span className="font-black text-base md:text-lg text-foreground whitespace-nowrap">#{qIdx + 1}</span>
                        <Tabs 
                          value={q.type} 
                          onValueChange={(val) => updateQuestion(qIdx, 'type', val as QuestionType)}
                          className="w-fit shrink-0"
                        >
                          <TabsList className="h-8 md:h-9 p-1 rounded-lg bg-background border-2">
                            <TabsTrigger value="multiple-choice" className="text-[10px] md:text-xs font-black gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                              <List size={14} /> PG
                            </TabsTrigger>
                            <TabsTrigger value="short-answer" className="text-[10px] md:text-xs font-black gap-1 md:gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
                              <Type size={14} /> Isian
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeQuestion(qIdx)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 shrink-0"
                        disabled={editingQuiz.questions!.length <= 1}
                      >
                        <Trash2 size={18} md:size={20} />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pertanyaan</label>
                         <Input 
                          placeholder="Masukkan teks pertanyaan di sini..." 
                          value={q.text}
                          onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)}
                          className="h-10 md:h-12 font-bold text-base md:text-lg border-2 focus:ring-primary/20 text-foreground" 
                        />
                        <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'text', s)} />
                      </div>
                      
                      {q.type === 'multiple-choice' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="space-y-2 p-3 rounded-xl border-2 bg-muted/10">
                              <div className="flex gap-2 items-center">
                                <Button 
                                  variant={q.correctAnswer === oIdx ? "default" : "outline"}
                                  size="icon"
                                  className="shrink-0 h-10 w-10 rounded-lg font-black border-2 text-xs"
                                  onClick={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
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
                                  className={cn("h-10 font-medium text-foreground text-sm", q.correctAnswer === oIdx ? 'border-primary ring-1 ring-primary/20' : '')}
                                />
                              </div>
                              <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'option', s, oIdx)} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2 pt-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Jawaban Benar</label>
                           <Input 
                            placeholder="Masukkan kunci jawaban..." 
                            value={q.correctAnswer as string}
                            onChange={(e) => updateQuestion(qIdx, 'correctAnswer', e.target.value)}
                            className="h-10 md:h-12 font-black text-base md:text-lg border-2 border-primary/20 focus:border-primary text-foreground" 
                          />
                          <StaticMathKeyboard onSelect={(s) => appendSymbol(qIdx, 'correctAnswer', s)} />
                          <p className="text-[10px] font-bold text-muted-foreground ml-1 italic">*Huruf besar/kecil diabaikan saat koreksi.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 md:p-8 bg-muted/20 border-t flex flex-col sm:flex-row gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="h-12 md:h-14 px-6 md:px-8 rounded-xl font-black text-base md:text-lg text-foreground w-full sm:w-auto order-2 sm:order-1">
              <X className="mr-2" /> Batal
            </Button>
            <Button onClick={handleSaveQuiz} className="h-12 md:h-14 px-8 md:px-10 rounded-xl font-black text-base md:text-lg shadow-lg w-full sm:w-auto order-1 sm:order-2">
              <Save className="mr-2" /> Simpan Kuis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <div className="bg-accent p-8 text-white">
            <div className="flex items-center gap-4">
               <Upload size={32} />
               <div>
                  <DialogTitle className="text-2xl font-black">Upload Banyak Soal</DialogTitle>
                  <DialogDescription className="text-white/80 font-bold">Tempelkan data soal dalam format JSON di bawah ini.</DialogDescription>
               </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary space-y-2">
               <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  <Info size={14} /> Contoh Format JSON
               </div>
               <pre className="text-[10px] font-mono bg-black/5 p-2 rounded overflow-auto text-muted-foreground">
{`[
  {
    "type": "multiple-choice",
    "text": "1 + 1 = ?",
    "options": ["1", "2", "3", "4"],
    "correctAnswer": 1
  },
  {
    "type": "short-answer",
    "text": "Siapa penemu lampu?",
    "correctAnswer": "Thomas Edison"
  }
]`}
               </pre>
            </div>
            <Textarea 
              value={uploadJson}
              onChange={(e) => setUploadJson(e.target.value)}
              placeholder='Paste JSON di sini...'
              className="min-h-[200px] font-mono text-sm border-2 rounded-xl"
            />
          </div>
          <DialogFooter className="p-8 bg-muted/20 border-t flex gap-3">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="h-14 px-8 rounded-xl font-black text-foreground">Batal</Button>
            <Button onClick={handleBulkUpload} className="h-14 px-10 rounded-xl font-black shadow-lg bg-accent hover:bg-accent/90">Mulai Impor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="rounded-[1.5rem] md:rounded-[2rem] w-[90vw] max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl md:text-2xl font-black text-foreground">Hapus Kuis?</AlertDialogTitle>
            <AlertDialogDescription className="text-base md:text-lg font-bold">
              Tindakan ini tidak dapat dibatalkan. Seluruh data kuis dan progres siswa yang terkait akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-4">
            <AlertDialogCancel className="h-10 md:h-12 rounded-xl font-bold w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-10 md:h-12 rounded-xl bg-red-600 hover:bg-red-700 font-black w-full sm:w-auto">
              Hapus Permanen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
