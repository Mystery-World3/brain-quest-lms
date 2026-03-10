
export type Class = {
  id: string;
  name: string;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
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
  answers: number[]; // Index of selected options
  timestamp: string;
};
