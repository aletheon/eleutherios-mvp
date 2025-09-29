// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA3brwHpI2dGR2KPAsZyJcIIaONDc0UDkQ",
  authDomain: "eleutherios-mvp-3c717.firebaseapp.com",
  projectId: "eleutherios-mvp-3c717",
  storageBucket: "eleutherios-mvp-3c717.firebasestorage.app",
  messagingSenderId: "10734001589",
  appId: "1:10734001589:web:2dc26f4e63f1f6a450cdfc",
  databaseURL: "https://eleutherios-mvp-3c717-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { auth };