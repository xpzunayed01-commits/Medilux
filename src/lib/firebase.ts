import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDboXCf0-2ABlHik3BMAqcSkE7k4ZvisGs",
  authDomain: "medilux001.firebaseapp.com",
  projectId: "medilux001",
  storageBucket: "medilux001.firebasestorage.app",
  messagingSenderId: "333882915652",
  appId: "1:333882915652:web:1bf71aab9f16e170bf3511",
  measurementId: "G-WNC8ERG01N"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
