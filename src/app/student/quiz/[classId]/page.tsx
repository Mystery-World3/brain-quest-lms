
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { initialQuizzes, classes } from '@/lib/mock-data';
import { Quiz, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronLeft, ChevronRight, Send } from 'lucide-react';

export default function QuizPage() {
  const { classId } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('student_name') || 'Siswa';
    setStudentName(name);

    // Find quiz for this class
    const foundQuiz = initialQuizzes.find(q => q.classId === classId) || initialQuizzes[0];
    setQuiz(foundQuiz);
    setAnswers(new Array(foundQuiz.questions.length).fill(-1));
  }, [classId]);

  if (!quiz) return <div className="p-8 text-center">Memuat quiz...</div>;

  const currentQuestion = quiz.questions[currentIdx];
  const progress = ((currentIdx + 1) / quiz.questions.length) * 100;

  const handleSelectOption = (optionIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optionIdx;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
    // Calculate Score
    let scoreCount = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) scoreCount++;
    });
    const finalScore = (scoreCount / quiz.questions.length) * 100;

    // Store results
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
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-primary/10">
          <div>
            <h1 className="text-xl font-headline font-bold text-primary">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">Halo, {studentName}! Semangat belajarnya.</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-primary">Soal {currentIdx + 1} dari {quiz.questions.length}</span>
            <Progress value={progress} className="w-32 h-2 mt-1" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10 py-8">
            <CardTitle className="text-2xl leading-relaxed text-foreground">
              {currentIdx + 1}. {currentQuestion.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10">
            <RadioGroup 
              value={answers[currentIdx].toString()} 
              onValueChange={(val) => handleSelectOption(parseInt(val))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="group">
                  <Label
                    htmlFor={`opt-${i}`}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${answers[currentIdx] === i 
                        ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary' 
                        : 'border-border hover:border-accent hover:bg-accent/5'}`}
                  >
                    <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="sr-only" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 transition-colors
                      ${answers[currentIdx] === i 
                        ? 'bg-primary border-primary text-white' 
                        : 'border-muted-foreground/30 text-muted-foreground'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-lg font-medium">{option}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between p-6 bg-muted/30 border-t">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="h-11 px-6"
            >
              <ChevronLeft className="mr-2" /> Sebelumnya
            </Button>

            {currentIdx === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleFinish}
                disabled={answers.some(a => a === -1)}
                className="h-11 px-8 bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                Selesai & Kumpulkan <Send className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentIdx(Math.min(quiz.questions.length - 1, currentIdx + 1))}
                className="h-11 px-6"
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
