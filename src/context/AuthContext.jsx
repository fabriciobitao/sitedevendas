import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
// useRef kept for loginAttempts
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, query, where, collection, limit, serverTimestamp } from 'firebase/firestore';
import { encryptSensitiveData, decryptSensitiveData } from '../utils/crypto';

const AuthContext = createContext();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginAttempts = useRef({ count: 0, lockedUntil: 0 });

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
      } else {
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (phone, password) => {
    // Proteção contra brute force
    const now = Date.now();
    if (loginAttempts.current.lockedUntil > now) {
      const mins = Math.ceil((loginAttempts.current.lockedUntil - now) / 60000);
      throw new Error(`Muitas tentativas. Tente novamente em ${mins} minuto(s).`);
    }

    try {
      // Buscar email do cliente pelo telefone no Firestore
      // Tenta com e sem máscara para compatibilidade
      const phoneDigits = phone.replace(/\D/g, '');
      let snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', phone), limit(1)));
      if (snap.empty) {
        snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', phoneDigits), limit(1)));
      }
      if (snap.empty) {
        const err = new Error('Telefone não encontrado');
        err.code = 'auth/user-not-found';
        throw err;
      }
      const customerData = snap.docs[0].data();
      const email = customerData.email;

      const cred = await signInWithEmailAndPassword(auth, email, password);
      loginAttempts.current = { count: 0, lockedUntil: 0 };
      const decrypted = await decryptSensitiveData(customerData, cred.user.uid);
      setCustomerProfile(decrypted);
      return cred.user;
    } catch (err) {
      loginAttempts.current.count++;
      if (loginAttempts.current.count >= MAX_LOGIN_ATTEMPTS) {
        loginAttempts.current.lockedUntil = now + LOCKOUT_TIME;
        loginAttempts.current.count = 0;
      }
      throw err;
    }
  }, []);

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
    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
  }, []);

  const findEmailByPhone = useCallback(async (phone) => {
    const phoneDigits = phone.replace(/\D/g, '');
    let snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', phone), limit(1)));
    if (snap.empty) {
      snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', phoneDigits), limit(1)));
    }
    if (snap.empty) {
      const err = new Error('Telefone não encontrado');
      err.code = 'auth/user-not-found';
      throw err;
    }
    return snap.docs[0].data().email;
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
      findEmailByPhone,
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
