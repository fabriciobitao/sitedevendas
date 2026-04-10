import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'customers', firebaseUser.uid));
        setCustomerProfile(snap.exists() ? snap.data() : null);
      } else {
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'customers', cred.user.uid));
    setCustomerProfile(snap.exists() ? snap.data() : null);
    return cred.user;
  }, []);

  const register = useCallback(async (email, password, formData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      ...formData,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'customers', cred.user.uid), profile);
    setCustomerProfile(profile);
    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
  }, []);

  const resetPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      customerProfile,
      loading,
      login,
      register,
      logout,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
