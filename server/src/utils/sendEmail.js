// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Send email
  await transporter.sendMail({
    from: `"Curio" <${process.env.SMTP_FROM}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;