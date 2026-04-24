export function maskCPF(cpf) {
  if (!cpf) return '';
  const digits = String(cpf).replace(/\D/g, '');
  if (digits.length !== 11) return String(cpf);
  return `${digits.slice(0, 3)}.***.***-${digits.slice(9, 11)}`;
}

export function maskCNPJ(cnpj) {
  if (!cnpj) return '';
  const digits = String(cnpj).replace(/\D/g, '');
  if (digits.length !== 14) return String(cnpj);
  return `${digits.slice(0, 2)}.***.***/***-${digits.slice(12, 14)}`;
}

export function maskTelefone(tel) {
  if (!tel) return '';
  const digits = String(tel).replace(/\D/g, '');
  if (digits.length < 10) return String(tel);
  const ddd = digits.slice(0, 2);
  const last = digits.slice(-4);
  const middle = '*'.repeat(digits.length - 6);
  return `(${ddd}) ${middle}-${last}`;
}

export function maskEmail(email) {
  if (!email) return '';
  const s = String(email);
  const at = s.indexOf('@');
  if (at < 2) return s;
  return `${s.slice(0, 2)}${'*'.repeat(Math.max(1, at - 2))}${s.slice(at)}`;
}
