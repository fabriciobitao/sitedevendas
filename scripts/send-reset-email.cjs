const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const nodemailer = require('nodemailer');

initializeApp({ projectId: 'friosof' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fabricio.fazer@gmail.com',
    pass: 'kkbotpekbojdglmr',
  },
});

async function sendResetEmail(toEmail) {
  const link = await getAuth().generatePasswordResetLink(toEmail, {
    url: 'https://friosof.web.app',
  });

  const html = `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#ffffff">
  <div style="text-align:center;padding:20px 0;border-bottom:3px solid #E8AB1D">
    <h1 style="color:#4D2B18;margin:0;font-size:24px">Frios Ouro Fino</h1>
    <p style="color:#8B5E3C;margin:6px 0 0;font-size:13px">Qualidade nas entregas e atendimento rapido</p>
  </div>
  <div style="padding:28px 0">
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 16px">Ola,</p>
    <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 24px">
      Voce solicitou a redefinicao de senha da sua conta no catalogo Frios Ouro Fino.
      Clique no botao abaixo para criar uma nova senha:
    </p>
    <div style="text-align:center;margin:32px 0">
      <a href="${link}" style="background:#E8AB1D;color:#4D2B18;padding:16px 40px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;box-shadow:0 4px 12px rgba(232,171,29,0.3)">
        Clique aqui para redefinir sua senha
      </a>
    </div>
    <p style="color:#999;font-size:12px;line-height:1.5;margin:24px 0 0">
      Se voce nao solicitou esta alteracao, ignore este email. Sua senha permanecera a mesma.
    </p>
  </div>
  <div style="border-top:1px solid #eee;padding:16px 0 0;text-align:center">
    <p style="color:#aaa;font-size:11px;margin:0">Equipe Frios Ouro Fino</p>
  </div>
</div>`;

  await transporter.sendMail({
    from: 'Frios Ouro Fino <fabricio.fazer@gmail.com>',
    to: toEmail,
    subject: 'Frios Ouro Fino - Redefinir sua senha',
    html,
  });

  console.log('Email enviado com sucesso para:', toEmail);
}

const email = process.argv[2] || 'fabricio.fazer@gmail.com';
sendResetEmail(email).catch(err => console.error('Erro:', err.message));
