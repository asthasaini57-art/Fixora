import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk0E7h5JO-H3NW2ptKicynX9ofaCKEUZA",
  authDomain: "fixora-97b6d.firebaseapp.com",
  projectId: "fixora-97b6d",
  storageBucket: "fixora-97b6d.firebasestorage.app",
  messagingSenderId: "947102342848",
  appId: "1:947102342848:web:d7df1b632c984826501725"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  firebaseSignOut,
  onAuthStateChanged,
};

export type { User };
