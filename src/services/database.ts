
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { Class, Quiz } from '@/lib/types';

const CLASSES_COL = 'classes';
const QUIZZES_COL = 'quizzes';
const SCORES_COL = 'scores';

// Fungsi helper untuk membersihkan data sebelum dikirim
const cleanData = (data: any) => {
  const result = { ...data };
  delete result.id;
  return result;
};

// --- LISTENER REAL-TIME (Sinkronisasi Antar Perangkat) ---

export const listenToClasses = (callback: (classes: Class[]) => void) => {
  const q = query(collection(db, CLASSES_COL), orderBy('name', 'asc'));
  // includeMetadataChanges membuat UI update instan bahkan sebelum server menjawab
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class)));
  });
};

export const listenToQuizzes = (callback: (quizzes: Quiz[]) => void) => {
  const q = query(collection(db, QUIZZES_COL));
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
  });
};

export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
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

// --- FUNGSI SIMPAN (Optimistic & Background Sync) ---

export const saveClass = async (classData: Partial<Class>) => {
  const data = cleanData(classData);
  if (classData.id) {
    return updateDoc(doc(db, CLASSES_COL, classData.id), { ...data, updatedAt: serverTimestamp() });
  } else {
    return addDoc(collection(db, CLASSES_COL), { ...data, active: true, createdAt: serverTimestamp() });
  }
};

export const deleteClass = async (id: string) => {
  return deleteDoc(doc(db, CLASSES_COL, id));
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  const data = cleanData(quizData);
  if (quizData.id) {
    return updateDoc(doc(db, QUIZZES_COL, quizData.id), { ...data, updatedAt: serverTimestamp() });
  } else {
    return addDoc(collection(db, QUIZZES_COL), { ...data, createdAt: serverTimestamp() });
  }
};

export const deleteQuiz = async (id: string) => {
  return deleteDoc(doc(db, QUIZZES_COL, id));
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
  return updateDoc(doc(db, SCORES_COL, id), cleanData(data));
};
