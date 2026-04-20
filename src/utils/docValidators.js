// Validadores e consultas para CPF/CNPJ brasileiros.

export function onlyDigits(v) {
  return (v || '').replace(/\D/g, '');
}

export function validarCPF(input) {
  const cpf = onlyDigits(input);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i], 10) * (10 - i);
  let d1 = 11 - (sum % 11);
  if (d1 >= 10) d1 = 0;
  if (d1 !== parseInt(cpf[9], 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i], 10) * (11 - i);
  let d2 = 11 - (sum % 11);
  if (d2 >= 10) d2 = 0;
  return d2 === parseInt(cpf[10], 10);
}

export function validarEmail(input) {
  const v = (input || '').trim().toLowerCase();
  if (!v || v.length > 254) return false;
  // RFC-ish: local@dominio.tld (aceita + . _ -), com TLD de 2+ letras
  const re = /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
  if (!re.test(v)) return false;
  // Nao aceita pontos consecutivos ou pontos no inicio/fim do local
  const [local] = v.split('@');
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  return true;
}

// Valida telefone brasileiro: 10 digitos (fixo) ou 11 (celular com 9).
// DDD valido: 11 a 99. Rejeita sequencias iguais e DDD 00/01..10.
export function validarTelefone(input) {
  const d = onlyDigits(input);
  if (d.length !== 10 && d.length !== 11) return false;
  if (/^(\d)\1+$/.test(d)) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  if (ddd < 11 || ddd > 99) return false;
  // Celular (11 digitos) precisa comecar com 9 no terceiro digito
  if (d.length === 11 && d[2] !== '9') return false;
  return true;
}

export function validarCNPJ(input) {
  const cnpj = onlyDigits(input);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base) => {
    const weights = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += parseInt(base[i], 10) * weights[i];
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(cnpj.slice(0, 12));
  if (d1 !== parseInt(cnpj[12], 10)) return false;
  const d2 = calc(cnpj.slice(0, 13));
  return d2 === parseInt(cnpj[13], 10);
}

// Consulta CNPJ na BrasilAPI.
// Retorna: { ok: true, data } | { ok: false, reason: 'notfound' | 'network' | 'invalid' }
export async function consultarCNPJ(cnpj) {
  const clean = onlyDigits(cnpj);
  if (clean.length !== 14) return { ok: false, reason: 'invalid' };

  const attempt = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.status === 404 || res.status === 400) return { ok: false, reason: 'notfound' };
      if (!res.ok) return { ok: false, reason: 'network' };
      const data = await res.json();
      return {
        ok: true,
        data: {
          razaoSocial: data.razao_social || '',
          nomeFantasia: data.nome_fantasia || '',
          situacao: data.descricao_situacao_cadastral || '',
          cep: (data.cep || '').replace(/\D/g, ''),
          endereco: data.logradouro || '',
          numero: data.numero || '',
          complemento: data.complemento || '',
          bairro: data.bairro || '',
          municipio: data.municipio || '',
          estado: data.uf || '',
          telefone: data.ddd_telefone_1 || '',
          email: data.email || '',
        }
      };
    } catch {
      clearTimeout(timeout);
      return { ok: false, reason: 'network' };
    }
  };

  // Uma tentativa + uma repeticao em caso de falha de rede
  let result = await attempt();
  if (!result.ok && result.reason === 'network') {
    await new Promise(r => setTimeout(r, 800));
    result = await attempt();
  }
  return result;
}
