
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getQuizzes, addScore } from '@/services/database';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Send, Timer, Star, CheckCircle2, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export default function QuizPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | number)[]>([]);
  const [studentName, setStudentName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const name = localStorage.getItem('student_name') || 'Siswa';
    setStudentName(name);

    const loadQuiz = async () => {
      try {
        const quizzes = await getQuizzes();
        const foundQuiz = quizzes.find(q => q.classId === classId) || quizzes[0];
        setQuiz(foundQuiz);
        setAnswers(new Array(foundQuiz.questions.length).fill(-1));
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [classId]);

  if (loading || !quiz) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-base md:text-lg">Memuat Kuis...</p>
      </div>
    </div>
  );

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleUpdateAnswer = (val: string | number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = val;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleFinish = async () => {
    let scoreCount = 0;
    quiz.questions.forEach((q, i) => {
      const studentAnswer = answers[i];
      if (q.type === 'multiple-choice') {
        if (studentAnswer === q.correctAnswer) scoreCount++;
      } else {
        const cleanStudent = studentAnswer?.toString().trim().toLowerCase();
        const cleanCorrect = q.correctAnswer?.toString().trim().toLowerCase();
        if (cleanStudent === cleanCorrect) scoreCount++;
      }
    });
    
    const finalScore = (scoreCount / quiz.questions.length) * 100;

    const newScoreEntry = {
      name: studentName,
      classId: classId as string,
      className: localStorage.getItem('student_class_name') || 'Kelas',
      quiz: quiz.title,
      quizId: quiz.id,
      score: finalScore,
      answers, // Simpan jawaban untuk review nanti
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    try {
      await addScore(newScoreEntry);
      localStorage.setItem('last_result', JSON.stringify({ ...newScoreEntry, answers }));
      router.push('/student/results');
    } catch (err) {
      console.error("Failed to save score:", err);
      alert("Terjadi kesalahan saat menyimpan nilai. Silakan coba lagi.");
    }
  };

  const isCurrentAnswered = answers[currentIdx] !== -1 && answers[currentIdx] !== '';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-4xl space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-card p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl border-2 border-primary/10 gap-4 md:gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-primary/10 p-3 md:p-4 rounded-xl md:rounded-2xl ring-2 ring-primary/20 shrink-0">
               <Star className="text-primary fill-primary animate-spin-slow w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-headline font-black text-primary leading-tight">{quiz.title}</h1>
              <p className="text-base md:text-lg font-bold text-muted-foreground">Halo, <span className="text-primary">{studentName}</span>!</p>
            </div>
          </div>
          <div className="text-center md:text-right w-full md:w-auto space-y-2 md:space-y-3">
            <div className="flex items-center justify-center md:justify-end gap-2 md:gap-3">
              <Timer size={18} className="text-primary animate-pulse" />
              <span className="text-base md:text-lg font-black text-foreground">Soal {currentIdx + 1} / {quiz.questions.length}</span>
            </div>
            <div className="relative pt-1">
               <Progress value={progress} className="w-full md:w-56 h-3 md:h-4 rounded-full bg-muted border-2 border-primary/5" />
            </div>
          </div>
        </div>

        <Card className={cn(
          "border-none shadow-2xl overflow-hidden rounded-[2rem] md:rounded-[3rem] transition-all duration-500 bg-card/50 backdrop-blur-sm",
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}>
          <CardHeader className="bg-primary/5 border-b border-primary/10 py-8 md:py-12 px-6 md:px-16">
            <CardTitle className="text-2xl md:text-4xl leading-snug text-foreground font-headline font-black flex items-start gap-3 md:gap-4">
              <span className="bg-primary text-white px-3 md:px-4 py-1 rounded-xl md:rounded-2xl shadow-lg shrink-0 text-lg md:text-2xl">{currentIdx + 1}</span> 
              <span className="flex-1">{currentQuestion.text}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-16">
            {currentQuestion.type === 'multiple-choice' ? (
              <RadioGroup 
                value={answers[currentIdx].toString()} 
                onValueChange={(val) => handleUpdateAnswer(parseInt(val))}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {currentQuestion.options.map((option, i) => {
                  const isSelected = answers[currentIdx] === i;
                  return (
                    <div key={i}>
                      <Label
                        htmlFor={`opt-${i}`}
                        className={cn(
                          "flex items-center gap-4 md:gap-6 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-4 cursor-pointer transition-all duration-300 active:scale-95 group relative overflow-hidden h-full",
                          isSelected 
                            ? 'border-primary bg-primary/10 shadow-xl ring-4 ring-primary/20 translate-y-[-4px]' 
                            : 'border-border bg-card hover:border-accent hover:bg-accent/5 hover:translate-y-[-2px]'
                        )}
                      >
                        <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="sr-only" />
                        <div className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl border-4 transition-all duration-300 group-hover:rotate-6 shrink-0",
                          isSelected 
                            ? 'bg-primary border-primary text-white shadow-xl' 
                            : 'border-muted-foreground/10 text-muted-foreground'
                        )}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-lg md:text-2xl font-black">{option}</span>
                        
                        {isSelected && (
                          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-primary animate-in fade-in zoom-in">
                            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />
                          </div>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            ) : (
              <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-accent/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-4 border-dashed border-accent/20">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 text-accent">
                    <Type size={20} className="md:w-6 md:h-6" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Ketik Jawabanmu</span>
                  </div>
                  <Input 
                    value={answers[currentIdx] === -1 ? '' : answers[currentIdx].toString()}
                    onChange={(e) => handleUpdateAnswer(e.target.value)}
                    placeholder="Tuliskan jawaban di sini..."
                    className="h-16 md:h-20 text-xl md:text-3xl font-black text-center bg-background border-4 rounded-[1.25rem] md:rounded-[1.5rem] focus:ring-8 focus:ring-accent/20 focus:border-accent transition-all shadow-inner"
                  />
                </div>
                <p className="text-center text-muted-foreground font-bold italic text-sm md:text-base">
                  *tulis jawaban hanya angka saja
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 md:p-10 bg-primary/5 border-t border-primary/10">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentIdx === 0}
              className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl border-4 font-black text-lg md:text-xl transition-all hover:bg-background w-full sm:w-auto"
            >
              <ChevronLeft className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Kembali
            </Button>

            {currentIdx === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleFinish}
                disabled={!isCurrentAnswered}
                className="h-14 md:h-16 px-10 md:px-12 bg-green-600 hover:bg-green-700 text-white font-black text-lg md:text-xl rounded-xl md:rounded-2xl shadow-xl shadow-green-500/40 active:scale-95 transition-all w-full sm:w-auto"
              >
                Selesai <Send className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" />
              </Button>
            ) : (
              <Button 
                onClick={nextQuestion}
                disabled={!isCurrentAnswered}
                className="h-14 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-lg md:text-xl transition-all shadow-xl shadow-primary/20 w-full sm:w-auto"
              >
                Berikutnya <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
