const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASSWORD, // your email password or app password
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready to send emails');
  }
});

// Send email function
const sendEmail = async (options) => {
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Curio'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail, transporter };
