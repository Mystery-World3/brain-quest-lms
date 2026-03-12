
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { Class, Quiz, Question } from '@/lib/types';

// Collections Names
const CLASSES_COL = 'classes';
const QUIZZES_COL = 'quizzes';
const SCORES_COL = 'scores';

/**
 * CLASSES SERVICES
 */
export const getClasses = async () => {
  const querySnapshot = await getDocs(collection(db, CLASSES_COL));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
};

export const saveClass = async (classData: Partial<Class>) => {
  if (classData.id && !classData.id.startsWith('class-')) {
    const { id, ...rest } = classData;
    await setDoc(doc(db, CLASSES_COL, id!), rest, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, CLASSES_COL), classData);
    return docRef.id;
  }
};

export const deleteClass = async (id: string) => {
  await deleteDoc(doc(db, CLASSES_COL, id));
};

/**
 * QUIZZES SERVICES
 */
export const getQuizzes = async () => {
  const querySnapshot = await getDocs(collection(db, QUIZZES_COL));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  if (quizData.id && !quizData.id.startsWith('quiz-')) {
    const { id, ...rest } = quizData;
    await setDoc(doc(db, QUIZZES_COL, id!), rest, { merge: true });
    return id;
  } else {
    const docRef = await addDoc(collection(db, QUIZZES_COL), quizData);
    return docRef.id;
  }
};

export const deleteQuiz = async (id: string) => {
  await deleteDoc(doc(db, QUIZZES_COL, id));
};

/**
 * SCORES SERVICES
 */
export const getScores = async () => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addScore = async (scoreEntry: any) => {
  const docRef = await addDoc(collection(db, SCORES_COL), {
    ...scoreEntry,
    timestamp: new Date().toISOString()
  });
  return docRef.id;
};

export const deleteScore = async (id: string) => {
  await deleteDoc(doc(db, SCORES_COL, id));
};

export const updateScore = async (id: string, data: any) => {
  await updateDoc(doc(db, SCORES_COL, id), data);
};

// Real-time listener for scores (Perfect for Dashboard)
export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  });
};

// Real-time listener for leaderboard
export const listenToLeaderboard = (quizId: string, classId: string, callback: (scores: any[]) => void) => {
  const q = query(
    collection(db, SCORES_COL), 
    where('quizId', '==', quizId),
    where('classId', '==', classId),
    orderBy('score', 'desc')
  );
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  });
};
