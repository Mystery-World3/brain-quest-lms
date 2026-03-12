
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
import { Class, Quiz } from '@/lib/types';

const CLASSES_COL = 'classes';
const QUIZZES_COL = 'quizzes';
const SCORES_COL = 'scores';

/**
 * CLASSES SERVICES
 */
export const getClasses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLASSES_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
  } catch (error) {
    console.error("Error getClasses:", error);
    throw error;
  }
};

export const saveClass = async (classData: Partial<Class>) => {
  const { id, ...data } = classData;
  const finalData = {
    name: data.name || '',
    active: data.active ?? true
  };

  try {
    if (id && !id.startsWith('temp-')) {
      const docRef = doc(db, CLASSES_COL, id);
      await updateDoc(docRef, finalData);
      return id;
    } else {
      const docRef = await addDoc(collection(db, CLASSES_COL), finalData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saveClass:", error);
    throw error;
  }
};

export const deleteClass = async (id: string) => {
  try {
    await deleteDoc(doc(db, CLASSES_COL, id));
  } catch (error) {
    console.error("Error deleteClass:", error);
    throw error;
  }
};

/**
 * QUIZZES SERVICES
 */
export const getQuizzes = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, QUIZZES_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
  } catch (error) {
    console.error("Error getQuizzes:", error);
    throw error;
  }
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  const { id, ...data } = quizData;
  
  // Bersihkan data dari undefined untuk Firestore
  const cleanQuestions = (data.questions || []).map(q => ({
    id: q.id || `q-${Date.now()}-${Math.random()}`,
    type: q.type || 'multiple-choice',
    text: q.text || '',
    explanation: q.explanation || '',
    options: q.options || [],
    correctAnswer: q.correctAnswer ?? (q.type === 'short-answer' ? '' : 0)
  }));

  const finalData = {
    title: data.title || '',
    classId: data.classId || '',
    questions: cleanQuestions
  };

  try {
    if (id && !id.startsWith('temp-')) {
      const docRef = doc(db, QUIZZES_COL, id);
      await updateDoc(docRef, finalData);
      return id;
    } else {
      const docRef = await addDoc(collection(db, QUIZZES_COL), finalData);
      return docRef.id;
    }
  } catch (error) {
    console.error("Error saveQuiz:", error);
    throw error;
  }
};

export const deleteQuiz = async (id: string) => {
  try {
    await deleteDoc(doc(db, QUIZZES_COL, id));
  } catch (error) {
    console.error("Error deleteQuiz:", error);
    throw error;
  }
};

/**
 * SCORES SERVICES
 */
export const getScores = async () => {
  try {
    const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getScores:", error);
    throw error;
  }
};

export const addScore = async (scoreEntry: any) => {
  try {
    const docRef = await addDoc(collection(db, SCORES_COL), {
      ...scoreEntry,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error addScore:", error);
    throw error;
  }
};

export const deleteScore = async (id: string) => {
  try {
    await deleteDoc(doc(db, SCORES_COL, id));
  } catch (error) {
    console.error("Error deleteScore:", error);
    throw error;
  }
};

export const updateScore = async (id: string, data: any) => {
  try {
    const { id: _, ...updateData } = data;
    await updateDoc(doc(db, SCORES_COL, id), updateData);
  } catch (error) {
    console.error("Error updateScore:", error);
    throw error;
  }
};

export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  }, (error) => {
    console.error("Listen to scores error:", error);
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
  }, (error) => {
    console.error("Listen to leaderboard error:", error);
  });
};
