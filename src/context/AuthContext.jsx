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
const MIDNIGHT_CHECK_INTERVAL = 60 * 1000; // verifica a cada 1 minuto
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimer = useRef(null);
  const loginAttempts = useRef({ count: 0, lockedUntil: 0 });

  // --- Auto-logout ao virar a data (meia-noite) ---
  const loginDate = useRef(null);

  const startMidnightCheck = useCallback(() => {
    if (inactivityTimer.current) clearInterval(inactivityTimer.current);
    loginDate.current = new Date().toDateString();
    inactivityTimer.current = setInterval(async () => {
      const today = new Date().toDateString();
      if (loginDate.current && today !== loginDate.current && auth.currentUser) {
        clearInterval(inactivityTimer.current);
        await signOut(auth);
        setUser(null);
        setCustomerProfile(null);
        alert('Sessão encerrada. Um novo dia começou, faça login novamente.');
      }
    }, MIDNIGHT_CHECK_INTERVAL);
  }, []);

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
        startMidnightCheck();
      } else {
        setCustomerProfile(null);
        if (inactivityTimer.current) clearInterval(inactivityTimer.current);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [startMidnightCheck]);

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
      startMidnightCheck();
      return cred.user;
    } catch (err) {
      loginAttempts.current.count++;
      if (loginAttempts.current.count >= MAX_LOGIN_ATTEMPTS) {
        loginAttempts.current.lockedUntil = now + LOCKOUT_TIME;
        loginAttempts.current.count = 0;
      }
      throw err;
    }
  }, [startMidnightCheck]);

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
    startMidnightCheck();
    return cred.user;
  }, [startMidnightCheck]);

  const logout = useCallback(async () => {
    if (inactivityTimer.current) clearInterval(inactivityTimer.current);
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
