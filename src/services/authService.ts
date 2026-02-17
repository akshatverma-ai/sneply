import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, username: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Create user profile in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email,
        username,
        displayName,
        energyLevel: 0,
        creatorRank: 'Rising',
        followers: 0,
        following: 0,
        videos: 0,
        likes: 0,
        achievements: [],
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      return userData;
    } catch (error) {
      throw new Error(`Sign up failed: ${error}`);
    }
  },

  // Sign in existing user
  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // Create profile if it doesn't exist
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          username: email.split('@')[0], // Fallback username from email
          displayName: firebaseUser.displayName || email.split('@')[0],
          energyLevel: 0,
          creatorRank: 'Rising',
          followers: 0,
          following: 0,
          videos: 0,
          likes: 0,
          achievements: [],
          createdAt: new Date(),
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        return userData;
      }
      
      return userDoc.data() as User;
    } catch (error) {
      throw new Error(`Sign in failed: ${error}`);
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(`Sign out failed: ${error}`);
    }
  },

  // Listen to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  // Get current user
  getCurrentUser(): User | null {
    // This would need to be implemented with proper state management
    return null;
  },
};
