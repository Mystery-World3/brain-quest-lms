
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { initialQuizzes } from '@/lib/mock-data';
import { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send, Timer, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export default function QuizPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [studentName, setStudentName] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('student_name') || 'Siswa';
    setStudentName(name);

    const foundQuiz = initialQuizzes.find(q => q.classId === classId) || initialQuizzes[0];
    setQuiz(foundQuiz);
    setAnswers(new Array(foundQuiz.questions.length).fill(-1));
  }, [classId]);

  if (!quiz) return <div className="p-8 text-center font-bold">Memuat quiz...</div>;

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleSelectOption = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx + 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const prevQuestion = () => {
    if (currentIdx > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIdx(currentIdx - 1);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleFinish = () => {
    let scoreCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) scoreCount++;
    });
    const finalScore = (scoreCount / quiz.questions.length) * 100;

    const result = {
      score: finalScore,
      answers,
      quizId: quiz.id,
      classId: classId as string,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('last_result', JSON.stringify(result));
    router.push('/student/results');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      {/* Universal Theme Toggle for Students */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-3xl space-y-6">
        {/* Animated Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-card p-6 rounded-3xl shadow-xl border-2 border-primary/10 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl">
               <Star className="text-primary fill-primary animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-headline font-bold text-primary">{quiz.title}</h1>
              <p className="text-sm font-medium text-muted-foreground">Halo, <span className="text-primary font-bold">{studentName}</span>! Semangat ya!</p>
            </div>
          </div>
          <div className="text-center sm:text-right w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-end gap-2 mb-2">
              <Timer size={16} className="text-muted-foreground" />
              <span className="text-sm font-bold text-primary">Soal {currentIdx + 1} dari {quiz.questions.length}</span>
            </div>
            <Progress value={progress} className="w-full sm:w-48 h-3 rounded-full bg-muted shadow-inner" />
          </div>
        </div>

        {/* Question Card with Animation */}
        <Card className={cn(
          "border-none shadow-2xl overflow-hidden rounded-3xl transition-all duration-300",
          isTransitioning ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
        )}>
          <CardHeader className="bg-primary/5 border-b border-primary/10 py-10 px-8 md:px-12">
            <CardTitle className="text-2xl md:text-3xl leading-relaxed text-foreground font-headline">
              <span className="text-primary mr-2 font-black">{currentIdx + 1}.</span> {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-12">
            <RadioGroup 
              value={answers[currentIdx].toString()} 
              onValueChange={(val) => handleSelectOption(parseInt(val))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, i) => (
                <div key={i}>
                  <Label
                    htmlFor={`opt-${i}`}
                    className={cn(
                      "flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 active:scale-95 group",
                      answers[currentIdx] === i 
                        ? 'border-primary bg-primary/10 shadow-lg ring-2 ring-primary' 
                        : 'border-border bg-card hover:border-accent hover:bg-accent/5'
                    )}
                  >
                    <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="sr-only" />
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black border-2 transition-all duration-300 group-hover:rotate-12",
                      answers[currentIdx] === i 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : 'border-muted-foreground/20 text-muted-foreground'
                    )}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-lg md:text-xl font-semibold">{option}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between p-8 bg-muted/10 border-t">
            <Button 
              variant="outline" 
              onClick={prevQuestion}
              disabled={currentIdx === 0}
              className="h-14 px-8 rounded-2xl border-2 font-bold transition-all"
            >
              <ChevronLeft className="mr-2" /> Kembali
            </Button>

            {currentIdx === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleFinish}
                disabled={answers.some(a => a === -1)}
                className="h-14 px-10 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 animate-pulse-slow"
              >
                Kumpulkan <Send className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button 
                onClick={nextQuestion}
                disabled={answers[currentIdx] === -1}
                className="h-14 px-8 rounded-2xl font-bold transition-all"
              >
                Berikutnya <ChevronRight className="ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
