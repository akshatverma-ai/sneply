import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration - Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyAZVymUHi5Da04fusJNGvwoB9os8gIFEmw",
  authDomain: "sneply-3eb8f.firebaseapp.com",
  projectId: "sneply-3eb8f",
  storageBucket: "sneply-3eb8f.firebasestorage.app",
  messagingSenderId: "380734187977",
  appId: "1:380734187977:web:9ca5c95320a7a14d556018"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
