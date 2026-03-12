
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
  onSnapshot
} from 'firebase/firestore';
import { Class, Quiz, StudentResult } from '@/lib/types';

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
  const { id, ...data } = classData;
  // Pastikan data memiliki field 'active' default jika baru
  const finalData = {
    name: data.name || '',
    active: data.active ?? true
  };

  if (id && !id.startsWith('temp-')) {
    const docRef = doc(db, CLASSES_COL, id);
    await updateDoc(docRef, finalData);
    return id;
  } else {
    const docRef = await addDoc(collection(db, CLASSES_COL), finalData);
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
  const { id, ...data } = quizData;
  if (id && !id.startsWith('temp-')) {
    const docRef = doc(db, QUIZZES_COL, id);
    await updateDoc(docRef, data);
    return id;
  } else {
    const docRef = await addDoc(collection(db, QUIZZES_COL), data);
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
  const { id: _, ...updateData } = data;
  await updateDoc(doc(db, SCORES_COL, id), updateData);
};

export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  });
};

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
