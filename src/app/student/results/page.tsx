
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initialQuizzes } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Trophy, RefreshCw, Home } from 'lucide-react';

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

  if (!result || !quiz) return <div className="p-8 text-center">Memuat hasil...</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8 pb-20">
        {/* Score Header */}
        <div className="relative overflow-hidden bg-primary text-white rounded-3xl p-8 md:p-12 shadow-2xl text-center">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={160} />
          </div>
          <h1 className="text-3xl font-headline font-bold mb-2">Hasil Kerja Kamu!</h1>
          <p className="text-primary-foreground/80 mb-6">Bagus sekali sudah menyelesaikan lembar kerja ini.</p>
          <div className="inline-flex flex-col items-center justify-center bg-white text-primary rounded-full w-40 h-40 shadow-inner border-8 border-primary-foreground/20">
            <span className="text-5xl font-black">{Math.round(result.score)}</span>
            <span className="text-xs font-bold uppercase tracking-wider">SKOR AKHIR</span>
          </div>
        </div>

        {/* Review Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-headline font-bold flex items-center gap-2 px-2">
            Koreksi Jawaban
          </h2>
          {quiz.questions.map((q: any, i: number) => {
            const isCorrect = result.answers[i] === q.correctAnswer;
            return (
              <Card key={q.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'} shadow-sm`}>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-snug">
                      {i + 1}. {q.text}
                    </CardTitle>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none shrink-0">
                        <CheckCircle2 size={14} className="mr-1" /> Benar
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none shrink-0">
                        <XCircle size={14} className="mr-1" /> Salah
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold text-muted-foreground">Jawaban Kamu: </span>
                    <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {q.options[result.answers[i]] || 'Tidak Dijawab'}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-sm">
                      <span className="font-semibold text-muted-foreground">Jawaban Benar: </span>
                      <span className="text-green-600 font-bold">{q.options[q.correctAnswer]}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selesai Button at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center gap-4 z-50">
          <Button variant="outline" onClick={() => router.push('/')} className="h-12 px-8 flex items-center gap-2">
            <Home size={18} /> Menu Utama
          </Button>
          <Button onClick={() => router.push('/')} className="h-12 px-12 font-bold text-lg flex items-center gap-2 bg-primary">
            Selesai <CheckCircle2 size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
