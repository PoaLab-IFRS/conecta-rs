import nodemailer from "nodemailer";

type PasswordResetEmailInput = {
  to: string;
  name: string;
  resetUrl: string;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? "587");
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom =
  process.env.SMTP_FROM ?? smtpUser ?? "Conecta RS <nao-responda@localhost>";

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailInput) {
  if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("Configuração SMTP incompleta");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const safeResetUrl = resetUrl.replaceAll("&", "&amp;");

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject: "Redefinição de senha - Conecta RS",
    text: `Olá, ${name}. Acesse o link para redefinir sua senha: ${resetUrl}`,
    html: `
      <p>Olá, ${name}.</p>
      <p>Recebemos uma solicitação para redefinir sua senha.</p>
      <p>
        <a href="${safeResetUrl}">
          Redefinir minha senha
        </a>
      </p>
      <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      <p>O link possui validade limitada.</p>
    `,
  });
}