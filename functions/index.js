const functions = require('@google-cloud/functions-framework');

// ============================================================
// Cloud Functions para integracao com WhatsApp Cloud API (Meta)
// ============================================================
// Variaveis de ambiente esperadas no deploy:
//   WHATSAPP_TOKEN    = token de acesso da Meta Developer
//   WHATSAPP_PHONE_ID = ID do telefone do WhatsApp Business
//   RECIPIENT_PHONE   = numero que recebe os pedidos (ex: 5535998511194)
// ============================================================

const WA_API_VERSION = 'v21.0';

function corsHeaders(res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

async function sendWhatsApp(payload) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  if (!token || !phoneId) {
    throw new Error('WHATSAPP_TOKEN ou WHATSAPP_PHONE_ID nao configurados');
  }
  const response = await fetch(
    `https://graph.facebook.com/${WA_API_VERSION}/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    console.error('Erro WhatsApp API:', JSON.stringify(data));
    throw new Error(data.error?.message || 'Falha na Meta API');
  }
  return data;
}

// ============================================================
// sendOrder: envia texto do pedido via WhatsApp
// ============================================================
functions.http('sendOrder', async (req, res) => {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo nao permitido' });

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Mensagem do pedido e obrigatoria' });

  const recipient = process.env.RECIPIENT_PHONE || '5535998511194';

  try {
    const data = await sendWhatsApp({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: message },
    });
    return res.status(200).json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    console.error('Erro ao enviar pedido:', err);
    return res.status(500).json({ error: 'Falha ao enviar mensagem', details: err.message });
  }
});

// ============================================================
// sendRegistration: envia ficha cadastral (PDF) + foto fachada
// Body: { pdfUrl, imageUrl, clientName, documento, telefone, tipo }
// ============================================================
functions.http('sendRegistration', async (req, res) => {
  corsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo nao permitido' });

  const { pdfUrl, imageUrl, clientName, documento, telefone, tipo } = req.body || {};
  if (!pdfUrl || !imageUrl || !clientName) {
    return res.status(400).json({ error: 'pdfUrl, imageUrl e clientName sao obrigatorios' });
  }

  const recipient = process.env.RECIPIENT_PHONE || '5535998511194';
  const tipoLabel = tipo === 'consumidor' ? 'CONSUMIDOR FINAL' : 'EMPRESA';

  const header =
    `🆕 *NOVO CADASTRO* (${tipoLabel})\n\n` +
    `👤 *Nome:* ${clientName}\n` +
    `📄 *CNPJ/CPF:* ${documento || '—'}\n` +
    `📞 *Telefone:* ${telefone || '—'}\n\n` +
    `📎 Ficha cadastral e foto da fachada em anexo.`;

  try {
    // 1) Mensagem de cabecalho (resumo)
    await sendWhatsApp({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: header },
    });

    // 2) PDF da ficha cadastral
    await sendWhatsApp({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'document',
      document: {
        link: pdfUrl,
        filename: `Ficha_Cadastral_${clientName.replace(/\s+/g, '_')}.pdf`,
        caption: `📋 Ficha Cadastral - ${clientName}`,
      },
    });

    // 3) Foto da fachada
    await sendWhatsApp({
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'image',
      image: {
        link: imageUrl,
        caption: `🏪 Fachada - ${clientName}`,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar cadastro:', err);
    return res.status(500).json({ error: 'Falha ao enviar cadastro', details: err.message });
  }
});
