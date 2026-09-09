import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multiagentai-2139c.firebaseapp.com",
  projectId: "multiagentai-2139c",
  storageBucket: "multiagentai-2139c.firebasestorage.app",
  messagingSenderId: "75599005659",
  appId: "1:75599005659:web:ff9e3efe592764fd9dc9fe",
  measurementId: "G-7P7HSN5NPJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()