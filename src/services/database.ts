
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
  limit,
  Timestamp
} from 'firebase/firestore';
import { Class, Quiz } from '@/lib/types';

const CLASSES_COL = 'classes';
const QUIZZES_COL = 'quizzes';
const SCORES_COL = 'scores';

/**
 * Pembersihan data sebelum dikirim ke Firestore
 */
const cleanForFirestore = (data: any) => {
  const result = { ...data };
  delete result.id;
  // Hapus properti undefined
  Object.keys(result).forEach(key => result[key] === undefined && delete result[key]);
  return result;
};

/**
 * MANAJEMEN KELAS (Real-time & Instan)
 */
export const listenToClasses = (callback: (classes: Class[]) => void) => {
  const q = query(collection(db, CLASSES_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class)));
  });
};

export const saveClass = async (classData: Partial<Class>) => {
  try {
    const data = cleanForFirestore(classData);
    if (classData.id && !classData.id.startsWith('temp-')) {
      await updateDoc(doc(db, CLASSES_COL, classData.id), { ...data, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, CLASSES_COL), { ...data, active: true, createdAt: serverTimestamp() });
    }
  } catch (error) {
    console.error("Gagal simpan kelas:", error);
    throw error;
  }
};

export const deleteClass = async (id: string) => {
  await deleteDoc(doc(db, CLASSES_COL, id));
};

/**
 * MANAJEMEN KUIS (Sinkronisasi Antar Perangkat)
 */
export const listenToQuizzes = (callback: (quizzes: Quiz[]) => void) => {
  const q = query(collection(db, QUIZZES_COL));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
  });
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  try {
    const data = cleanForFirestore(quizData);
    if (quizData.id && !quizData.id.startsWith('temp-')) {
      await updateDoc(doc(db, QUIZZES_COL, quizData.id), { ...data, updatedAt: serverTimestamp() });
    } else {
      await addDoc(collection(db, QUIZZES_COL), { ...data, createdAt: serverTimestamp() });
    }
  } catch (error) {
    console.error("Gagal simpan kuis:", error);
    throw error;
  }
};

export const deleteQuiz = async (id: string) => {
  await deleteDoc(doc(db, QUIZZES_COL, id));
};

/**
 * MANAJEMEN NILAI (Laporan Dashboard Guru)
 */
export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
};

export const addScore = async (scoreEntry: any) => {
  await addDoc(collection(db, SCORES_COL), {
    ...scoreEntry,
    timestamp: serverTimestamp()
  });
};

export const deleteScore = async (id: string) => {
  await deleteDoc(doc(db, SCORES_COL, id));
};

export const updateScore = async (id: string, data: any) => {
  const cleaned = cleanForFirestore(data);
  await updateDoc(doc(db, SCORES_COL, id), cleaned);
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
