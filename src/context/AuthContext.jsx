import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { encryptSensitiveData, decryptSensitiveData } from '../utils/crypto';

const AuthContext = createContext();
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);
  const loginAttempts = useRef({ count: 0, lockedUntil: 0 });

  // --- Auto-logout por inatividade ---
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (auth.currentUser) {
      inactivityTimer.current = setTimeout(async () => {
        await signOut(auth);
        setUser(null);
        setCustomerProfile(null);
        alert('Sessão expirada por inatividade. Faça login novamente.');
      }, INACTIVITY_TIMEOUT);
    }
  }, []);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handler = () => resetInactivityTimer();
    events.forEach(e => window.addEventListener(e, handler, { passive: true }));
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'customers', firebaseUser.uid));
        if (snap.exists()) {
          const decrypted = await decryptSensitiveData(snap.data(), firebaseUser.uid);
          setCustomerProfile(decrypted);
        } else {
          setCustomerProfile(null);
        }
        resetInactivityTimer();
      } else {
        setCustomerProfile(null);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [resetInactivityTimer]);

  const login = useCallback(async (email, password) => {
    // Proteção contra brute force
    const now = Date.now();
    if (loginAttempts.current.lockedUntil > now) {
      const mins = Math.ceil((loginAttempts.current.lockedUntil - now) / 60000);
      throw new Error(`Muitas tentativas. Tente novamente em ${mins} minuto(s).`);
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      loginAttempts.current = { count: 0, lockedUntil: 0 };
      const snap = await getDoc(doc(db, 'customers', cred.user.uid));
      if (snap.exists()) {
        const decrypted = await decryptSensitiveData(snap.data(), cred.user.uid);
        setCustomerProfile(decrypted);
      } else {
        setCustomerProfile(null);
      }
      resetInactivityTimer();
      return cred.user;
    } catch (err) {
      loginAttempts.current.count++;
      if (loginAttempts.current.count >= MAX_LOGIN_ATTEMPTS) {
        loginAttempts.current.lockedUntil = now + LOCKOUT_TIME;
        loginAttempts.current.count = 0;
      }
      throw err;
    }
  }, [resetInactivityTimer]);

  const register = useCallback(async (email, password, formData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const encrypted = await encryptSensitiveData(formData, cred.user.uid);
    const profile = {
      ...encrypted,
      email,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'customers', cred.user.uid), profile);
    setCustomerProfile(formData); // manter dados legíveis em memória
    resetInactivityTimer();
    return cred.user;
  }, [resetInactivityTimer]);

  const logout = useCallback(async () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
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
