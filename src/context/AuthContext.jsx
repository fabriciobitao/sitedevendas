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
  doc, setDoc, getDoc, serverTimestamp, runTransaction,
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
    // Limpa chave antiga do antigo mecanismo de logout diario (retrocompat)
    localStorage.removeItem('authSessionDate');

    const ADMIN_EMAILS = ['fabricio.fazer@gmail.com', 'fabiomenezes@gmail.com'];
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'customers', firebaseUser.uid));
        const data = snap.exists() ? snap.data() : null;
        const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email);
        // Bloqueia sessao se cadastro nao foi aprovado pelo admin
        if (data && data.approved === false && !isAdmin) {
          await signOut(auth);
          setUser(null);
          setCustomerProfile(null);
          setLoading(false);
          return;
        }
        setUser(firebaseUser);
        if (data) {
          const decrypted = await decryptSensitiveData(data, firebaseUser.uid);
          setCustomerProfile(decrypted);
        } else {
          setCustomerProfile(null);
        }
      } else {
        setUser(null);
        setCustomerProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Resolve identifier (codigo de cliente ou telefone) -> email via login_index
  async function resolveEmailFromIndex(identifier) {
    const trimmed = String(identifier || '').trim();
    const onlyDigits = trimmed.replace(/\D/g, '');
    const keys = [];
    if (/^\d{1,6}$/.test(trimmed)) keys.push(onlyDigits.padStart(4, '0'));
    if (onlyDigits.length >= 10) keys.push(onlyDigits);
    for (const key of keys) {
      const snap = await getDoc(doc(db, 'login_index', key));
      if (snap.exists()) return snap.data().email;
    }
    return null;
  }

  // Login agora aceita codigo de cliente (0001) OU telefone (retrocompat)
  const login = useCallback(async (identifier, password) => {
    const now = Date.now();
    if (loginAttempts.current.lockedUntil > now) {
      const mins = Math.ceil((loginAttempts.current.lockedUntil - now) / 60000);
      throw new Error(`Muitas tentativas. Tente novamente em ${mins} minuto(s).`);
    }

    try {
      const email = await resolveEmailFromIndex(identifier);
      if (!email) {
        const err = new Error('Codigo de cliente nao encontrado');
        err.code = 'auth/user-not-found';
        throw err;
      }

      const cred = await signInWithEmailAndPassword(auth, email, password);
      loginAttempts.current = { count: 0, lockedUntil: 0 };
      const snap = await getDoc(doc(db, 'customers', cred.user.uid));
      const data = snap.exists() ? snap.data() : null;
      const ADMIN_EMAILS = ['fabricio.fazer@gmail.com', 'fabiomenezes@gmail.com'];
      const isAdmin = ADMIN_EMAILS.includes(cred.user.email);
      if (data && data.approved === false && !isAdmin) {
        await signOut(auth);
        const err = new Error('Seu cadastro está aguardando aprovação do vendedor. Você receberá um aviso assim que for liberado.');
        err.code = 'auth/pending-approval';
        throw err;
      }
      if (data) {
        const decrypted = await decryptSensitiveData(data, cred.user.uid);
        setCustomerProfile(decrypted);
      }
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
      approved: false, // Cliente so faz login depois que admin aprovar
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'customers', cred.user.uid), profile);

    // Indexa para login via codigo/telefone (sem expor dados sensiveis em customers.list)
    const indexPayload = { email, uid: cred.user.uid, updatedAt: serverTimestamp() };
    const telDigits = String(formData.telefone || '').replace(/\D/g, '');
    const writes = [setDoc(doc(db, 'login_index', codigoCliente), indexPayload)];
    if (telDigits.length >= 10) {
      writes.push(setDoc(doc(db, 'login_index', telDigits), indexPayload));
    }
    await Promise.all(writes);

    // Encerra a sessao imediatamente: cadastro fica pendente ate admin aprovar
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
    return { user: cred.user, codigoCliente };
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setCustomerProfile(null);
  }, []);

  // Recupera email pelo codigo de cliente ou telefone via login_index
  const findEmailByIdentifier = useCallback(async (identifier) => {
    const email = await resolveEmailFromIndex(identifier);
    if (!email) {
      const err = new Error('Codigo de cliente nao encontrado');
      err.code = 'auth/user-not-found';
      throw err;
    }
    return email;
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
