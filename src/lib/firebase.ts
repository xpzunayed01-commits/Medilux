import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA43cJ9UXApvn_QOS7xEzqpSE-sFdVgKH0",
  authDomain: "gen-lang-client-0355674633.firebaseapp.com",
  projectId: "gen-lang-client-0355674633",
  storageBucket: "gen-lang-client-0355674633.firebasestorage.app",
  messagingSenderId: "501968413861",
  appId: "1:501968413861:web:0c452ad8373f0007dcd94c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
