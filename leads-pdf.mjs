// Gera PDF a partir do leads-googlemaps.csv (ou leads-com-telefone.csv).
// Agrupa por cidade, mostra Nome / Tipo / Endereco / Telefone.
import fs from 'node:fs';
import { jsPDF } from 'jspdf';

const SRC = process.argv[2] || 'leads-googlemaps.csv';
const OUT = process.argv[3] || 'leads-frios-of.pdf';

if (!fs.existsSync(SRC)) {
  console.error(`Arquivo nao encontrado: ${SRC}`);
  process.exit(1);
}

function parseCSV(text) {
  // CSV com ; como separador, suporta campos com aspas
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(';');
  const out = [];
  for (const line of lines) {
    const cells = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i+1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ';') { cells.push(cur); cur = ''; }
        else cur += c;
      }
    }
    cells.push(cur);
    const row = {};
    header.forEach((h, idx) => { row[h] = cells[idx] || ''; });
    out.push(row);
  }
  return out;
}

const rows = parseCSV(fs.readFileSync(SRC, 'utf8'));
console.log(`${rows.length} estabelecimentos lidos de ${SRC}`);

const byCidade = new Map();
for (const r of rows) {
  const c = r.Cidade || r.cidade || 'Sem cidade';
  if (!byCidade.has(c)) byCidade.set(c, []);
  byCidade.get(c).push(r);
}

// Ordena cidades alfabeticamente, e dentro de cada cidade, com telefone primeiro
const cidades = Array.from(byCidade.keys()).sort();
for (const c of cidades) {
  byCidade.get(c).sort((a,b) => {
    const at = (a.Telefone || a.telefone) ? 0 : 1;
    const bt = (b.Telefone || b.telefone) ? 0 : 1;
    if (at !== bt) return at - bt;
    return (a.Nome || a.nome || '').localeCompare(b.Nome || b.nome || '');
  });
}

const doc = new jsPDF({ unit: 'pt', format: 'a4' });
const PAGE_W = doc.internal.pageSize.getWidth();
const PAGE_H = doc.internal.pageSize.getHeight();
const M = 36; // margem
let y = M;

function checkPage(needed = 60) {
  if (y + needed > PAGE_H - M) {
    doc.addPage();
    y = M;
  }
}

function header() {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(46, 125, 50); // verde Frios
  doc.text('Frios OF — Lista de Prospeccao', M, y);
  y += 22;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  const date = new Date().toLocaleDateString('pt-BR');
  const total = rows.length;
  const comTel = rows.filter(r => r.Telefone || r.telefone).length;
  doc.text(`Gerado em ${date} · ${total} estabelecimentos · ${comTel} com telefone`, M, y);
  y += 16;
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(1);
  doc.line(M, y, PAGE_W - M, y);
  y += 18;
}

function cidadeBlock(cidade, items) {
  checkPage(80);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(46, 125, 50);
  const comTel = items.filter(r => r.Telefone || r.telefone).length;
  doc.text(`${cidade}`, M, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`${items.length} estabelecimentos · ${comTel} com telefone`, M + 200, y);
  y += 18;

  for (const it of items) {
    const nome = it.Nome || it.nome || 'Sem nome';
    const tipo = it.Tipo || it.tipo || '';
    const end = it.Endereco || it.endereco || '';
    const tel = it.Telefone || it.telefone || '';
    const wpp = it.WhatsApp || it.whatsapp || '';
    const contato = tel || wpp;

    // Calcula altura necessaria
    const lines = [];
    const nomeLines = doc.splitTextToSize(nome, PAGE_W - 2*M - 130);
    lines.push(...nomeLines);
    if (end) lines.push(...doc.splitTextToSize(end, PAGE_W - 2*M - 20));
    const blockH = 14 + lines.length * 11 + 8;
    checkPage(blockH);

    // Nome em negrito
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30);
    let yy = y;
    for (const ln of nomeLines) {
      doc.text(ln, M, yy);
      yy += 13;
    }

    // Telefone alinhado a direita na primeira linha
    if (contato) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(46, 125, 50);
      doc.text(contato, PAGE_W - M, y, { align: 'right' });
    }

    // Tipo
    if (tipo) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(tipo, M, yy);
      yy += 11;
    }

    // Endereco
    if (end) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60);
      const endLines = doc.splitTextToSize(end, PAGE_W - 2*M - 20);
      for (const ln of endLines) {
        doc.text(ln, M, yy);
        yy += 11;
      }
    }

    y = yy + 8;
    // linha separadora suave
    doc.setDrawColor(230);
    doc.setLineWidth(0.5);
    doc.line(M, y - 4, PAGE_W - M, y - 4);
  }
  y += 8;
}

header();
for (const c of cidades) {
  cidadeBlock(c, byCidade.get(c));
}

// Footer em todas as paginas
const pages = doc.getNumberOfPages();
for (let i = 1; i <= pages; i++) {
  doc.setPage(i);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Frios OF · friosof.web.app · Pagina ${i} de ${pages}`, PAGE_W/2, PAGE_H - 18, { align: 'center' });
}

// jsPDF.save() so funciona no browser; em Node, usar output('arraybuffer')
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(OUT, pdfBuffer);
console.log(`PDF salvo: ${OUT}`);
