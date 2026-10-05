import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut as fbSignOut, 
  onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';

// Configuration loaded from provisioned JSON
const firebaseConfig = {
  projectId: "cedar-bebop-jsmzh",
  appId: "1:910877343711:web:adc1346fae5b8db5ff8e6a",
  apiKey: "AIzaSyBPPn-CwKmdWd1Dt7aUObdMPtlUML9M3oM",
  authDomain: "cedar-bebop-jsmzh.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-yonasongs-8e98af23-8a2d-414f-a85e-854578fd9030",
  storageBucket: "cedar-bebop-jsmzh.firebasestorage.app",
  messagingSenderId: "910877343711",
  measurementId: "",
  oAuthClientId: "910877343711-f4uudbkk327bhh8pmp99mqko9o7lhfcq.apps.googleusercontent.com"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async (): Promise<any> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const loginAnonymously = async (): Promise<any> => {
  const result = await signInAnonymously(auth);
  return result.user;
};

export const logoutFirebase = async () => {
  try {
    await fbSignOut(auth).catch(() => {});
  } catch {
    // Silently proceed
  }
};

export { logoutFirebase as signOut };
export { onAuthStateChanged };
export type { User };
export { collection, doc, setDoc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot };
