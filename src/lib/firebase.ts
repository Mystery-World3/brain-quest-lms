import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Konfigurasi Firebase asli Anda.
 * Data ini menghubungkan aplikasi ke server database Cloud (Firestore).
 */
const firebaseConfig = {
  apiKey: "AIzaSyAFaXrjm_OvCjKAD8714K5IfZtResCo8nU",
  authDomain: "brainquest-1fd17.firebaseapp.com",
  projectId: "brainquest-1fd17",
  storageBucket: "brainquest-1fd17.firebasestorage.app",
  messagingSenderId: "94395132879",
  appId: "1:94395132879:web:9a1ae56c370fd568d7c0ba",
  measurementId: "G-LSPY9SGVW2"
};

// Inisialisasi Firebase (menghindari inisialisasi ganda)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
