
import { Class, Quiz } from './types';

export const classes: Class[] = [
  { id: '7-a', name: 'Kelas 7 - A', active: true },
  { id: '7-b', name: 'Kelas 7 - B', active: true },
  { id: '8-a', name: 'Kelas 8 - A', active: true },
  { id: '8-b', name: 'Kelas 8 - B', active: true },
  { id: '9-a', name: 'Kelas 9 - A', active: true },
  { id: '9-b', name: 'Kelas 9 - B', active: true },
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    classId: '7-a',
    title: 'Matematika Dasar - Bilangan Bulat',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        text: 'Hasil dari 5 + (-3) adalah...',
        options: ['2', '-2', '8', '-8'],
        correctAnswer: 0,
      },
      {
        id: 'q2',
        type: 'short-answer',
        text: 'Berapakah hasil dari 12 dikali 3?',
        options: [],
        correctAnswer: '36',
      },
    ],
  },
];
