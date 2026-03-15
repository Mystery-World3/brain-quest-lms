
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc,
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

/**
 * Helper to clean data before sending to Firestore
 */
const cleanData = (data: any) => {
  const clean: any = {};
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && key !== 'id') {
      clean[key] = data[key];
    }
  });
  return clean;
};

/**
 * CLASSES SERVICES
 */
export const getClasses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CLASSES_COL));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
  } catch (error) {
    console.error("Error getClasses:", error);
    return [];
  }
};

export const listenToClasses = (callback: (classes: Class[]) => void) => {
  const q = query(collection(db, CLASSES_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (querySnapshot) => {
    const classes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
    callback(classes);
  }, (error) => {
    console.error("Listen to classes error:", error);
    callback([]);
  });
};

export const saveClass = async (classData: Partial<Class>) => {
  const { id, ...data } = classData;
  const cleaned = cleanData(data);
  
  try {
    if (id && !id.startsWith('temp-')) {
      const docRef = doc(db, CLASSES_COL, id);
      await updateDoc(docRef, {
        ...cleaned,
        updatedAt: serverTimestamp()
      });
      return id;
    } else {
      const finalData = {
        name: cleaned.name || 'Tanpa Nama',
        active: cleaned.active ?? true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
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
    return [];
  }
};

export const listenToQuizzes = (callback: (quizzes: Quiz[]) => void) => {
  const q = query(collection(db, QUIZZES_COL));
  return onSnapshot(q, (querySnapshot) => {
    const quizzes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
    callback(quizzes);
  }, (error) => {
    callback([]);
  });
};

export const saveQuiz = async (quizData: Partial<Quiz>) => {
  const { id, ...data } = quizData;
  const cleanQuestions = (data.questions || []).map(q => ({
    id: q.id || `q-${Date.now()}-${Math.random()}`,
    type: q.type || 'multiple-choice',
    text: q.text || '',
    explanation: q.explanation || '',
    options: q.options || [],
    correctAnswer: q.correctAnswer ?? (q.type === 'short-answer' ? '' : 0)
  }));

  try {
    const payload = {
      title: data.title || 'Kuis Baru',
      classId: data.classId || '',
      questions: cleanQuestions,
      updatedAt: serverTimestamp()
    };

    if (id && !id.startsWith('temp-')) {
      await updateDoc(doc(db, QUIZZES_COL, id), payload);
      return id;
    } else {
      const docRef = await addDoc(collection(db, QUIZZES_COL), {
        ...payload,
        createdAt: serverTimestamp()
      });
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
    throw error;
  }
};

/**
 * SCORES SERVICES
 */
export const addScore = async (scoreEntry: any) => {
  try {
    const docRef = await addDoc(collection(db, SCORES_COL), {
      ...scoreEntry,
      timestamp: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const deleteScore = async (id: string) => {
  try {
    await deleteDoc(doc(db, SCORES_COL, id));
  } catch (error) {
    throw error;
  }
};

export const updateScore = async (id: string, data: any) => {
  try {
    const { id: _, ...updateData } = data;
    const cleaned = cleanData(updateData);
    await updateDoc(doc(db, SCORES_COL, id), {
      ...cleaned,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw error;
  }
};

export const listenToScores = (callback: (scores: any[]) => void) => {
  const q = query(collection(db, SCORES_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  }, (error) => {
    callback([]);
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
  return onSnapshot(q, (querySnapshot) => {
    const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(scores);
  }, (error) => {
    callback([]);
  });
};
