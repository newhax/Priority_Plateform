import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-for-social-good-490706",
  appId: "1:938172586538:web:8030ae10175a614d480153",
  apiKey: "AIzaSyD_qGCFVunI89cjSmelQi9nx7uMxHq39d0",
  authDomain: "ai-for-social-good-490706.firebaseapp.com",
  storageBucket: "ai-for-social-good-490706.firebasestorage.app",
  messagingSenderId: "938172586538"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-citizendevlepmen-2d060159-7b18-4db7-9265-fb325a885128");

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
