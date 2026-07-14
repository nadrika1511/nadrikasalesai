import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '@/core/firebase/config';

export const authRepository = {
  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  signOut() {
    return firebaseSignOut(auth);
  },

  subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async getIdTokenResult(user: User, forceRefresh = false) {
    return user.getIdTokenResult(forceRefresh);
  }
};
