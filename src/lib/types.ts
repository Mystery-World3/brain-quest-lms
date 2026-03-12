
export type Class = {
  id: string;
  name: string;
  active: boolean;
};

export type QuestionType = 'multiple-choice' | 'short-answer';

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  explanation?: string; // Penjelasan cara pengerjaan
  options: string[]; // Digunakan untuk multiple-choice
  correctAnswer: string | number; // Index untuk multiple-choice, string untuk short-answer
};

export type Quiz = {
  id: string;
  classId: string;
  title: string;
  questions: Question[];
};

export type StudentResult = {
  id: string;
  studentName: string;
  classId: string;
  quizId: string;
  score: number;
  answers: (string | number)[];
  timestamp: string;
};
