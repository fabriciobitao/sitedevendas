const SECRET = 'F0r1$-0ur0-F1n0-2026-LGPD';

async function deriveKey(salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET + salt), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptField(value, uid) {
  if (!value) return '';
  const key = await deriveKey(uid);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(value)
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptField(encoded, uid) {
  if (!encoded) return '';
  try {
    const key = await deriveKey(uid);
    const data = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return encoded; // fallback: dado não encriptado (migração)
  }
}

export const SENSITIVE_FIELDS = ['cpf', 'cnpj', 'inscMunicipal', 'inscEstadual'];

export async function encryptSensitiveData(data, uid) {
  const encrypted = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    if (encrypted[field]) {
      encrypted[field] = await encryptField(encrypted[field], uid);
    }
  }
  return encrypted;
}

export async function decryptSensitiveData(data, uid) {
  const decrypted = { ...data };
  for (const field of SENSITIVE_FIELDS) {
    if (decrypted[field]) {
      decrypted[field] = await decryptField(decrypted[field], uid);
    }
  }
  return decrypted;
}
