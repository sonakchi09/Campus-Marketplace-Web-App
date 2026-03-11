import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAZIk2LMqBvWC50EPXh59hfVbSqlQfOrAc",
  authDomain: "campuscart-9d5e4.firebaseapp.com",
  projectId: "campuscart-9d5e4",
  storageBucket: "campuscart-9d5e4.firebasestorage.app",
  messagingSenderId: "308542812518",
  appId: "1:308542812518:web:8821a53fd4d826f64e98a7",
  measurementId: "G-7ZP5S64CEH",
  databaseURL: "https://campuscart-9d5e4-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Prevent re-initializing Firebase on hot reload in Next.js
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ hd: "kiit.ac.in" });

export default app;