// ============================================
// FIREBASE CONFIGURATION & SERVICES
// ============================================

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  type DocumentData
} from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATBHsSRVhMuu3gIpVipU2WRE2xHyWvT7s",
  authDomain: "hay-una-ia-en-mi-jardin.firebaseapp.com",
  projectId: "hay-una-ia-en-mi-jardin",
  storageBucket: "hay-una-ia-en-mi-jardin.firebasestorage.app",
  messagingSenderId: "380436575923",
  appId: "1:380436575923:web:d8452653fbd2b94925a2c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
export const COLLECTIONS = {
  PRODUCTOS: 'productos',
  CATEGORIAS: 'categorias',
  CARRITO: 'carrito'
} as const;

export { db, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where };
export type { DocumentData };
