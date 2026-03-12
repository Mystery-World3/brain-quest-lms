"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialQuizzes, classes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, Home, Award, ArrowRight, User, Medal, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [classScores, setClassScores] = useState<any[]>([]);

  useEffect(() => {
    const lastResult = localStorage.getItem('last_result');
    const name = localStorage.getItem('student_name') || 'Siswa';
    setStudentName(name);

    if (!lastResult) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(lastResult);
    setResult(parsed);
    
    // Check localStorage quizzes first
    const savedQuizzesRaw = localStorage.getItem('app_quizzes');
    const quizzesToSearch = savedQuizzesRaw ? JSON.parse(savedQuizzesRaw) : initialQuizzes;
    setQuiz(quizzesToSearch.find((q: any) => q.id === parsed.quizId) || quizzesToSearch[0]);

    // Fetch scores for leaderboard from REAL system data
    const savedScoresRaw = localStorage.getItem('app_scores');
    const allScores = savedScoresRaw ? JSON.parse(savedScoresRaw) : [];
    
    // Filter by current quiz and class to make it relevant
    const relevantScores = allScores
      .filter((s: any) => s.quiz === (quizzesToSearch.find((q: any) => q.id === parsed.quizId)?.title || parsed.quizTitle) && s.classId === parsed.classId)
      .map((s: any) => ({
        ...s,
        isCurrent: s.name === name // Simplistic identification
      }))
      .sort((a: any, b: any) => b.score - a.score);

    setClassScores(relevantScores);
  }, [router]);

  if (!result || !quiz) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );

  const isHighPerformance = result.score >= 80;
  const currentClassName = classes.find(c => c.id === result.classId)?.name || "Kelas";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl space-y-10 pb-40">
        <div className={cn(
          "relative overflow-hidden rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 shadow-2xl text-center border-4 md:border-8 border-white dark:border-primary/20",
          isHighPerformance 
            ? "bg-gradient-to-br from-primary via-primary to-accent text-white" 
            : "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white"
        )}>
          <div className="absolute -top-16 -right-16 opacity-10 rotate-12 hidden md:block">
            <Trophy size={300} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/30 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] mb-6 md:mb-8 backdrop-blur-md animate-bounce ring-4 ring-white/50">
               <Award size={48} className="text-white md:w-16 md:h-16" />
            </div>
            <h1 className="text-4xl md:text-7xl font-headline font-black mb-4 md:mb-6 drop-shadow-2xl">
              {isHighPerformance ? 'LUAR BIASA!' : 'KERJA BAGUS!'}
            </h1>
            <p className="text-white/95 text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              {isHighPerformance 
                ? 'Prestasi yang membanggakan! Pertahankan semangat belajarmu untuk tantangan berikutnya.'
                : 'Kamu sudah mencoba yang terbaik! Mari kita ulas kembali jawaban yang kurang tepat agar lebih paham.'}
            </p>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-125 animate-pulse" />
              <div className="relative inline-flex flex-col items-center justify-center bg-white text-primary rounded-full w-44 h-44 md:w-56 md:h-56 shadow-[0_15px_60px_-15px_rgba(255,255,255,0.5)] border-[10px] md:border-[15px] border-primary/10 transition-transform group-hover:scale-105 duration-500">
                <span className="text-5xl md:text-7xl font-black">{Math.round(result.score)}</span>
                <span className="text-xs md:text-lg font-black uppercase tracking-[0.3em] opacity-80">SKOR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center px-4">
           <Card 
            onClick={() => setShowScoreboard(true)}
            className="w-full max-w-md p-6 md:p-8 flex flex-row items-center gap-4 md:gap-6 border-4 rounded-[2rem] md:rounded-[2.5rem] hover:bg-accent/5 transition-all cursor-pointer group shadow-xl hover:shadow-accent/20 active:scale-95 border-accent/10"
           >
              <div className="bg-accent/10 p-4 md:p-5 rounded-xl md:rounded-2xl text-accent group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-inner shrink-0">
                <Trophy size={28} className="md:w-8 md:h-8" />
              </div>
              <div className="text-left">
                <h3 className="text-xl md:text-2xl font-black text-foreground">Papan Skor</h3>
                <p className="text-sm md:text-base text-muted-foreground font-bold">Lihat peringkat {currentClassName}</p>
              </div>
           </Card>
        </div>

        <div className="space-y-6 md:space-y-8 px-4">
          <h2 className="text-2xl md:text-3xl font-headline font-black flex items-center gap-4">
            <span className="bg-foreground text-background px-3 py-1 rounded-xl">01</span> Evaluasi Jawaban
          </h2>
          <div className="grid gap-6">
            {quiz.questions.map((q: any, i: number) => {
              let isCorrect = false;
              if (q.type === 'multiple-choice') {
                isCorrect = result.answers[i] === q.correctAnswer;
              } else {
                isCorrect = result.answers[i]?.toString().trim().toLowerCase() === q.correctAnswer?.toString().trim().toLowerCase();
              }

              return (
                <Card key={q.id} className={cn(
                  "border-4 rounded-[2rem] md:rounded-[2.5rem] shadow-xl transition-all duration-300 student-card-hover overflow-hidden",
                  isCorrect ? "border-green-500/10 hover:border-green-500/50" : "border-red-500/10 hover:border-red-500/50"
                )}>
                  <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      <div className={cn(
                        "w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl shrink-0 flex items-center justify-center font-black text-xl md:text-2xl shadow-sm",
                        isCorrect 
                          ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" 
                          : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                      )}>
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          <h3 className="text-xl md:text-2xl font-black leading-tight text-foreground">
                            {q.text}
                          </h3>
                          {isCorrect ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-none shrink-0 py-2 px-4 rounded-xl font-black text-xs tracking-widest shadow-sm">
                              <CheckCircle2 size={16} className="mr-2" /> BENAR
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-none shrink-0 py-2 px-4 rounded-xl font-black text-xs tracking-widest shadow-sm">
                              <XCircle size={16} className="mr-2" /> SALAH
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={cn(
                            "p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-2 flex flex-col gap-2 shadow-inner",
                            isCorrect 
                              ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900" 
                              : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                          )}>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Jawabanmu</span>
                            <span className="text-base md:text-lg font-black">
                              {q.type === 'multiple-choice' 
                                ? (q.options[result.answers[i]] || 'Kosong')
                                : (result.answers[i] === -1 ? 'Kosong' : result.answers[i])
                              }
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border-4 border-green-500/20 bg-green-50/30 dark:bg-green-950/10 flex flex-col gap-2 shadow-inner">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Kunci Jawaban</span>
                              <span className="text-base md:text-lg font-black text-green-700 dark:text-green-400">
                                {q.type === 'multiple-choice' ? q.options[q.correctAnswer] : q.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="mt-2 md:mt-4 bg-muted/30 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-muted-foreground/20">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                          <BookOpen size={18} className="animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Cara Pengerjaan</span>
                        </div>
                        <p className="text-base md:text-lg font-medium leading-relaxed italic text-foreground/80">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 bg-background/80 backdrop-blur-2xl border-t-4 border-primary/5 flex justify-center gap-4 md:gap-6 z-50">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')} 
            className="h-14 md:h-16 px-6 md:px-10 rounded-xl md:rounded-2xl font-black text-lg md:text-xl border-4 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Home size={20} className="md:mr-3" /> <span className="hidden sm:inline">Beranda</span>
          </Button>
          <Button 
            onClick={() => router.push('/')} 
            className="flex-1 max-w-sm h-14 md:h-16 px-10 md:px-16 font-black text-xl md:text-2xl rounded-xl md:rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            SELESAI <ArrowRight size={20} className="ml-3" />
          </Button>
        </div>
      </div>

      <Dialog open={showScoreboard} onOpenChange={setShowScoreboard}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-[2rem] md:rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl bg-background">
          <div className="bg-primary p-8 md:p-12 text-center text-white relative">
            <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
              <Trophy size={200} />
            </div>
            <div className="relative z-10">
              <Medal size={48} className="mx-auto mb-4 md:mb-6 animate-bounce" />
              <DialogTitle className="text-2xl md:text-4xl font-headline font-black mb-2">Papan Skor Kelas</DialogTitle>
              <DialogDescription className="text-white/80 text-base md:text-lg font-bold">
                Peringkat kuis {quiz.title} untuk {currentClassName}
              </DialogDescription>
            </div>
          </div>
          <div className="p-4 md:p-8 space-y-4 max-h-[50vh] overflow-auto bg-background/50 backdrop-blur-sm">
            {classScores.length > 0 ? classScores.map((score, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-center justify-between p-4 md:p-6 rounded-2xl border-4 transition-all duration-300",
                  score.isCurrent 
                    ? "border-primary bg-primary/10 shadow-lg scale-[1.02]" 
                    : "border-muted/30 bg-card hover:border-accent/30"
                )}
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow-sm",
                    idx === 0 ? "bg-yellow-400 text-white" : 
                    idx === 1 ? "bg-slate-300 text-white" :
                    idx === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    {score.isCurrent ? <Sparkles size={18} className="text-primary animate-pulse" /> : <User size={18} className="text-muted-foreground" />}
                    <span className={cn("text-lg md:text-xl font-black", score.isCurrent ? "text-primary" : "text-foreground")}>
                      {score.name} {score.isCurrent && "(Kamu)"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl md:text-2xl font-black text-foreground">{Math.round(score.score)}</span>
                  <span className="text-[10px] font-black text-muted-foreground block uppercase tracking-tighter">Skor</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-muted-foreground font-bold">
                Belum ada data skor untuk kelas ini.
              </div>
            )}
          </div>
          <div className="p-6 md:p-8 bg-muted/20 border-t flex justify-center">
            <Button onClick={() => setShowScoreboard(false)} className="h-12 md:h-14 px-10 md:px-12 rounded-xl md:rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all w-full sm:w-auto">
              Tutup Papan Skor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
