
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
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { Class, Quiz } from '@/lib/types';

const CLASSES_COL = 'classes';
const QUIZZES_COL = 'quizzes';
const SCORES_COL = 'scores';

const cleanForFirestore = (data: any) => {
  const result = { ...data };
  delete result.id;
  Object.keys(result).forEach(key => result[key] === undefined && delete result[key]);
  return result;
};

// Listeners menggunakan snapshot metadata untuk membedakan data lokal vs server
export const listenToClasses = (callback: (classes: Class[]) => void) => {
  const q = query(collection(db, CLASSES_COL), orderBy('name', 'asc'));
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class)));
  });
};

export const saveClass = async (classData: Partial<Class>) => {
  const data = cleanForFirestore(classData);
  if (classData.id && !classData.id.startsWith('temp-')) {
    const ref = doc(db, CLASSES_COL, classData.id);
    return updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    return addDoc(collection(db, CLASSES_COL), { ...data, active: true, createdAt: serverTimestamp() });
  }
};

export const deleteClass = async (id: string) => {
  return deleteDoc(doc(db, CLASSES_COL, id));
};

export const listenToQuizzes = (callback: (quizzes: Quiz[]) => void) => {
  const q = query(collection(db, QUIZZES_COL));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
  });
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  const data = cleanForFirestore(quizData);
  if (quizData.id && !quizData.id.startsWith('temp-')) {
    return updateDoc(doc(db, QUIZZES_COL, quizData.id), { ...data, updatedAt: serverTimestamp() });
  } else {
    return addDoc(collection(db, QUIZZES_COL), { ...data, createdAt: serverTimestamp() });
  }
};

export const deleteQuiz = async (id: string) => {
  return deleteDoc(doc(db, QUIZZES_COL, id));
};

export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addScore = async (scoreEntry: any) => {
  return addDoc(collection(db, SCORES_COL), {
    ...scoreEntry,
    timestamp: serverTimestamp()
  });
};

export const deleteScore = async (id: string) => {
  return deleteDoc(doc(db, SCORES_COL, id));
};

export const updateScore = async (id: string, data: any) => {
  const cleaned = cleanForFirestore(data);
  return updateDoc(doc(db, SCORES_COL, id), cleaned);
};

export const listenToLeaderboard = (quizId: string, classId: string, callback: (scores: any[]) => void) => {
  const q = query(
    collection(db, SCORES_COL), 
    where('quizId', '==', quizId),
    where('classId', '==', classId),
    orderBy('score', 'desc'),
    limit(10)
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const getClasses = async () => {
  const snapshot = await getDocs(collection(db, CLASSES_COL));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
};

export const getQuizzes = async () => {
  const snapshot = await getDocs(collection(db, QUIZZES_COL));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
};
