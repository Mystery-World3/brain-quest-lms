
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialQuizzes, classes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, Home, Share2, Award, ArrowRight, User, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [result, setResult] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [studentName, setStudentName] = useState('');

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
    setQuiz(initialQuizzes.find(q => q.id === parsed.quizId));
  }, [router]);

  if (!result || !quiz) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  );

  const isHighPerformance = result.score >= 80;

  const handleShare = async () => {
    const text = `Hore! Saya baru saja menyelesaikan kuis "${quiz.title}" dengan skor ${Math.round(result.score)}. Ayo belajar bersama di LKPD Digital!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hasil Kuis LKPD Digital',
          text: text,
          url: window.location.origin,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({
        title: "Berhasil Disalin!",
        description: "Pesan pencapaian kamu telah disalin ke papan klip.",
      });
    }
  };

  // Mock scoreboard data for the current class
  const classScores = [
    { name: studentName, score: result.score, isCurrent: true },
    { name: 'Rahmat Hidayat', score: 95, isCurrent: false },
    { name: 'Siti Aminah', score: 85, isCurrent: false },
    { name: 'Budi Utomo', score: 75, isCurrent: false },
    { name: 'Dewi Lestari', score: 60, isCurrent: false },
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl space-y-10 pb-40">
        {/* Celebration Header */}
        <div className={cn(
          "relative overflow-hidden rounded-[3rem] p-12 md:p-20 shadow-2xl text-center border-8 border-white dark:border-primary/20",
          isHighPerformance 
            ? "bg-gradient-to-br from-primary via-primary to-accent text-white" 
            : "bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-white"
        )}>
          <div className="absolute -top-16 -right-16 opacity-10 rotate-12">
            <Trophy size={300} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/30 p-6 rounded-[2rem] mb-8 backdrop-blur-md animate-bounce ring-4 ring-white/50">
               <Award size={64} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-black mb-6 drop-shadow-2xl">
              {isHighPerformance ? 'LUAR BIASA!' : 'KERJA BAGUS!'}
            </h1>
            <p className="text-white/90 text-xl md:text-2xl font-bold mb-12 max-w-2xl mx-auto leading-relaxed">
              {isHighPerformance 
                ? 'Prestasi yang membanggakan! Pertahankan semangat belajarmu untuk tantangan berikutnya.'
                : 'Kamu sudah mencoba yang terbaik! Mari kita ulas kembali jawaban yang kurang tepat agar lebih paham.'}
            </p>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full scale-125 animate-pulse" />
              <div className="relative inline-flex flex-col items-center justify-center bg-white text-primary rounded-full w-56 h-56 shadow-[0_15px_60px_-15px_rgba(255,255,255,0.5)] border-[15px] border-primary/10 transition-transform group-hover:scale-105 duration-500">
                <span className="text-7xl font-black">{Math.round(result.score)}</span>
                <span className="text-lg font-black uppercase tracking-[0.3em] opacity-80">SKOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card 
            onClick={handleShare}
            className="p-8 flex flex-row items-center gap-6 border-4 rounded-[2.5rem] hover:bg-primary/5 transition-all cursor-pointer group shadow-xl hover:shadow-primary/20 active:scale-95"
           >
              <div className="bg-primary/10 p-5 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-all shadow-inner">
                <Share2 size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-foreground">Bagikan Hasil</h3>
                <p className="text-muted-foreground font-bold">Pamerkan skormu!</p>
              </div>
           </Card>
           <Card 
            onClick={() => setShowScoreboard(true)}
            className="p-8 flex flex-row items-center gap-6 border-4 rounded-[2.5rem] hover:bg-accent/5 transition-all cursor-pointer group shadow-xl hover:shadow-accent/20 active:scale-95"
           >
              <div className="bg-accent/10 p-5 rounded-2xl text-accent group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-inner">
                <Trophy size={32} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-foreground">Papan Skor</h3>
                <p className="text-muted-foreground font-bold">Lihat peringkatmu</p>
              </div>
           </Card>
        </div>

        {/* Detailed Evaluation */}
        <div className="space-y-8">
          <h2 className="text-3xl font-headline font-black flex items-center gap-4 px-4">
            <span className="bg-foreground text-background p-2 rounded-xl">01</span> Evaluasi Jawaban
          </h2>
          <div className="grid gap-6">
            {quiz.questions.map((q: any, i: number) => {
              const isCorrect = result.answers[i] === q.correctAnswer;
              return (
                <Card key={q.id} className={cn(
                  "border-4 rounded-[2.5rem] shadow-xl transition-all duration-300 student-card-hover overflow-hidden",
                  isCorrect ? "hover:border-green-500/50" : "hover:border-red-500/50"
                )}>
                  <div className="p-8 flex flex-col md:flex-row gap-8">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center font-black text-2xl shadow-inner",
                      isCorrect 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" 
                        : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <h3 className="text-2xl font-black leading-tight text-foreground">
                          {q.text}
                        </h3>
                        {isCorrect ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-none shrink-0 py-2 px-5 rounded-2xl font-black text-sm tracking-widest shadow-sm">
                            <CheckCircle2 size={18} className="mr-2" /> BENAR
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-none shrink-0 py-2 px-5 rounded-2xl font-black text-sm tracking-widest shadow-sm">
                            <XCircle size={18} className="mr-2" /> SALAH
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={cn(
                          "p-6 rounded-3xl border-2 flex flex-col gap-2 shadow-inner",
                          isCorrect 
                            ? "bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900" 
                            : "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                        )}>
                          <span className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Pilihanmu</span>
                          <span className="text-lg font-black">
                            {q.options[result.answers[i]] || 'Kosong'}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div className="p-6 rounded-3xl border-4 border-green-500/20 bg-green-50/30 dark:bg-green-950/10 flex flex-col gap-2 shadow-inner">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-green-600">Kunci Jawaban</span>
                            <span className="text-lg font-black text-green-700 dark:text-green-400">{q.options[q.correctAnswer]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sticky Celebration Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-background/80 backdrop-blur-2xl border-t-4 border-primary/5 flex justify-center gap-6 z-50">
          <Button 
            variant="outline" 
            onClick={() => router.push('/')} 
            className="h-16 px-10 rounded-2xl font-black text-xl border-4 transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Home size={24} className="mr-3" /> Beranda
          </Button>
          <Button 
            onClick={() => router.push('/')} 
            className="h-16 px-16 font-black text-2xl rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            SELESAI <ArrowRight size={24} className="ml-3" />
          </Button>
        </div>
      </div>

      {/* Scoreboard Dialog */}
      <Dialog open={showScoreboard} onOpenChange={setShowScoreboard}>
        <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary p-12 text-center text-white relative">
            <div className="absolute -top-10 -right-10 opacity-10 rotate-12">
              <Trophy size={200} />
            </div>
            <Medal size={64} className="mx-auto mb-6 animate-bounce" />
            <DialogTitle className="text-4xl font-headline font-black mb-2">Papan Skor Kelas</DialogTitle>
            <DialogDescription className="text-white/80 text-lg font-bold">
              Peringkat kuis {quiz.title} untuk kelas {classes.find(c => c.id === result.classId)?.name}
            </DialogDescription>
          </div>
          <div className="p-8 space-y-4 max-h-[50vh] overflow-auto">
            {classScores.map((score, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-center justify-between p-6 rounded-2xl border-4 transition-all",
                  score.isCurrent 
                    ? "border-primary bg-primary/10 shadow-lg scale-[1.02]" 
                    : "border-muted/30 bg-card"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl",
                    idx === 0 ? "bg-yellow-400 text-white" : 
                    idx === 1 ? "bg-slate-300 text-white" :
                    idx === 2 ? "bg-amber-600 text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={20} className={score.isCurrent ? "text-primary" : "text-muted-foreground"} />
                    <span className={cn("text-xl font-black", score.isCurrent && "text-primary")}>
                      {score.name} {score.isCurrent && "(Kamu)"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-foreground">{Math.round(score.score)}</span>
                  <span className="text-xs font-black text-muted-foreground block uppercase">Skor</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 bg-muted/20 border-t flex justify-center">
            <Button onClick={() => setShowScoreboard(false)} className="h-14 px-12 rounded-2xl font-black text-lg shadow-xl">
              Tutup Papan Skor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
