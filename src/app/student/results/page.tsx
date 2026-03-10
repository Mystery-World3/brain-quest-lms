
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialQuizzes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, Home, Share2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);

  useEffect(() => {
    const lastResult = localStorage.getItem('last_result');
    if (!lastResult) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(lastResult);
    setResult(parsed);
    setQuiz(initialQuizzes.find(q => q.id === parsed.quizId));
  }, [router]);

  if (!result || !quiz) return <div className="p-8 text-center font-bold">Memuat hasil...</div>;

  const isHighPerformance = result.score >= 80;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      {/* Universal Theme Toggle for Students */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-3xl space-y-8 pb-32">
        {/* Celeb Header */}
        <div className={cn(
          "relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 shadow-2xl text-center border-4 border-white dark:border-primary/20",
          isHighPerformance ? "bg-gradient-to-br from-primary to-accent text-white" : "bg-gradient-to-br from-orange-500 to-red-500 text-white"
        )}>
          <div className="absolute -top-10 -right-10 opacity-20 rotate-12">
            <Trophy size={200} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-3xl mb-6 backdrop-blur-sm animate-bounce">
               <Award size={48} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-black mb-3 drop-shadow-lg">
              {isHighPerformance ? 'Hebat Sekali!' : 'Terus Semangat!'}
            </h1>
            <p className="text-white/80 text-lg font-medium mb-10 max-w-md mx-auto">
              {isHighPerformance 
                ? 'Kamu sudah bekerja keras dan mendapatkan hasil yang luar biasa. Pertahankan prestasimu!'
                : 'Jangan menyerah ya! Setiap kesalahan adalah pelajaran berharga untuk jadi lebih pintar.'}
            </p>
            
            <div className="relative scale-110">
              <div className="absolute inset-0 bg-white/40 blur-2xl rounded-full scale-110" />
              <div className="relative inline-flex flex-col items-center justify-center bg-white text-primary rounded-full w-48 h-48 shadow-2xl border-[12px] border-primary/20 animate-in zoom-in duration-700">
                <span className="text-6xl font-black">{Math.round(result.score)}</span>
                <span className="text-sm font-black uppercase tracking-[0.2em]">SKOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Header */}
        <div className="grid grid-cols-2 gap-4">
           <Card className="p-6 flex flex-col items-center gap-2 border-2 rounded-[2rem] hover:bg-primary/5 transition-all cursor-pointer group active:scale-95">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <Share2 size={24} />
              </div>
              <span className="font-bold">Bagikan Hasil</span>
           </Card>
           <Card className="p-6 flex flex-col items-center gap-2 border-2 rounded-[2rem] hover:bg-accent/5 transition-all cursor-pointer group active:scale-95">
              <div className="bg-accent/10 p-3 rounded-2xl text-accent group-hover:scale-110 transition-transform">
                <Trophy size={24} />
              </div>
              <span className="font-bold">Papan Skor</span>
           </Card>
        </div>

        {/* Review Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-headline font-black flex items-center gap-3 px-2">
            Evaluasi Jawaban
          </h2>
          <div className="grid gap-4">
            {quiz.questions.map((q: any, i: number) => {
              const isCorrect = result.answers[i] === q.correctAnswer;
              return (
                <Card key={q.id} className={cn(
                  "border-2 rounded-3xl shadow-md transition-all duration-300 student-card-hover",
                  isCorrect ? "hover:border-green-500/50" : "hover:border-red-500/50"
                )}>
                  <div className="p-6 flex gap-4 md:gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center font-black text-xl",
                      isCorrect ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {i + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg md:text-xl font-bold leading-tight">
                          {q.text}
                        </h3>
                        {isCorrect ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-none shrink-0 py-1.5 px-3 rounded-xl font-bold">
                            <CheckCircle2 size={16} className="mr-1" /> BENAR
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-none shrink-0 py-1.5 px-3 rounded-xl font-bold">
                            <XCircle size={16} className="mr-1" /> SALAH
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid gap-2 text-sm md:text-base">
                        <div className={cn(
                          "p-4 rounded-2xl border-2 flex flex-col gap-1",
                          isCorrect ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800" : "bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                        )}>
                          <span className="text-xs font-bold uppercase tracking-widest opacity-60">Jawaban Kamu</span>
                          <span className="font-bold">
                            {q.options[result.answers[i]] || 'Tidak Dijawab'}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div className="p-4 rounded-2xl border-2 border-green-200 bg-green-50/30 dark:border-green-800 dark:bg-green-900/5 flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-green-600 opacity-80">Jawaban Yang Benar</span>
                            <span className="font-bold text-green-700 dark:text-green-400">{q.options[q.correctAnswer]}</span>
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

        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-xl border-t-2 border-border/50 flex justify-center gap-4 z-50">
          <Button variant="outline" onClick={() => router.push('/')} className="h-14 px-8 rounded-2xl font-bold text-lg border-2">
            <Home size={20} className="mr-2" /> Beranda
          </Button>
          <Button onClick={() => router.push('/')} className="h-14 px-12 font-black text-xl rounded-2xl bg-primary shadow-xl shadow-primary/30 active:scale-95 transition-all">
            SELESAI
          </Button>
        </div>
      </div>
    </div>
  );
}
