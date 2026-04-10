const functions = require('@google-cloud/functions-framework');

// ============================================================
// Cloud Function: sendOrder
// Recebe pedido do site e envia via WhatsApp Cloud API
// ============================================================

// Configurar via variáveis de ambiente no deploy:
// WHATSAPP_TOKEN    = token de acesso da Meta Developer
// WHATSAPP_PHONE_ID = ID do telefone do WhatsApp Business
// RECIPIENT_PHONE   = numero que recebe os pedidos (ex: 5535998511194)

functions.http('sendOrder', async (req, res) => {
  // CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Mensagem do pedido e obrigatoria' });
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const recipient = process.env.RECIPIENT_PHONE || '5535998511194';

  if (!token || !phoneId) {
    console.error('WHATSAPP_TOKEN ou WHATSAPP_PHONE_ID nao configurados');
    return res.status(500).json({ error: 'Configuracao do WhatsApp incompleta' });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: recipient,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro WhatsApp API:', JSON.stringify(data));
      return res.status(500).json({ error: 'Falha ao enviar mensagem', details: data });
    }

    return res.status(200).json({ success: true, messageId: data.messages?.[0]?.id });
  } catch (err) {
    console.error('Erro ao enviar:', err);
    return res.status(500).json({ error: 'Erro interno ao enviar pedido' });
  }
});
