
import { Class, Quiz } from './types';

export const classes: Class[] = [
  { id: '7-a', name: 'Kelas 7 - A' },
  { id: '7-b', name: 'Kelas 7 - B' },
  { id: '8-a', name: 'Kelas 8 - A' },
  { id: '8-b', name: 'Kelas 8 - B' },
  { id: '9-a', name: 'Kelas 9 - A' },
  { id: '9-b', name: 'Kelas 9 - B' },
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    classId: '7-a',
    title: 'Matematika Dasar - Bilangan Bulat',
    questions: [
      {
        id: 'q1',
        text: 'Hasil dari 5 + (-3) adalah...',
        options: ['2', '-2', '8', '-8'],
        correctAnswer: 0,
      },
      {
        id: 'q2',
        text: 'Berapakah 12 x 3?',
        options: ['34', '36', '38', '40'],
        correctAnswer: 1,
      },
    ],
  },
];
