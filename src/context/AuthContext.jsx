import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, getDocs, query, where, collection, limit, serverTimestamp, runTransaction,
} from 'firebase/firestore';
import { encryptSensitiveData, decryptSensitiveData } from '../utils/crypto';

const AuthContext = createContext();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000;

// Gera proximo codigo de cliente sequencial (0001, 0002, ...)
async function allocateCustomerCode() {
  const counterRef = doc(db, 'counters', 'customers');
  const nextNumber = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().next || 1) : 1;
    tx.set(counterRef, { next: current + 1 }, { merge: true });
    return current;
  });
  return String(nextNumber).padStart(4, '0');
}

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

  // Login agora aceita codigo de cliente (0001) OU telefone (retrocompat)
  const login = useCallback(async (identifier, password) => {
    const now = Date.now();
    if (loginAttempts.current.lockedUntil > now) {
      const mins = Math.ceil((loginAttempts.current.lockedUntil - now) / 60000);
      throw new Error(`Muitas tentativas. Tente novamente em ${mins} minuto(s).`);
    }

    try {
      const trimmed = String(identifier || '').trim();
      let snap;

      // Tenta por codigo de cliente (apenas digitos e tamanho <= 6)
      const onlyDigits = trimmed.replace(/\D/g, '');
      const looksLikeCode = /^\d{1,6}$/.test(trimmed);
      if (looksLikeCode) {
        const padded = onlyDigits.padStart(4, '0');
        snap = await getDocs(query(collection(db, 'customers'), where('codigoCliente', '==', padded), limit(1)));
      }

      // Fallback: telefone (retrocompat)
      if (!snap || snap.empty) {
        snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', trimmed), limit(1)));
        if (snap.empty && onlyDigits) {
          snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', onlyDigits), limit(1)));
        }
      }

      if (snap.empty) {
        const err = new Error('Codigo de cliente nao encontrado');
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
    const codigoCliente = await allocateCustomerCode();
    const dataWithCode = { ...formData, codigoCliente };
    const encrypted = await encryptSensitiveData(dataWithCode, cred.user.uid);
    const profile = {
      ...encrypted,
      email,
      tipo: formData.tipo,
      codigoCliente,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'customers', cred.user.uid), profile);
    setCustomerProfile(dataWithCode);
    return { user: cred.user, codigoCliente };
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
  }, []);

  // Recupera email pelo codigo de cliente ou telefone (fallback)
  const findEmailByIdentifier = useCallback(async (identifier) => {
    const trimmed = String(identifier || '').trim();
    const onlyDigits = trimmed.replace(/\D/g, '');
    let snap;

    if (/^\d{1,6}$/.test(trimmed)) {
      const padded = onlyDigits.padStart(4, '0');
      snap = await getDocs(query(collection(db, 'customers'), where('codigoCliente', '==', padded), limit(1)));
    }
    if (!snap || snap.empty) {
      snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', trimmed), limit(1)));
      if (snap.empty && onlyDigits) {
        snap = await getDocs(query(collection(db, 'customers'), where('telefone', '==', onlyDigits), limit(1)));
      }
    }
    if (snap.empty) {
      const err = new Error('Codigo de cliente nao encontrado');
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
      findEmailByIdentifier,
      findEmailByPhone: findEmailByIdentifier, // retrocompat
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
