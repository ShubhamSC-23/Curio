const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send email
 * @param {object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Article Publishing'} <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

/**
 * Send verification email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} verificationUrl - Verification URL
 */
const sendVerificationEmail = async (email, name, verificationUrl) => {
  const subject = 'Verify Your Email Address';
  const html = `
    <h1>Welcome to Article Publishing Platform!</h1>
    <p>Hello ${name},</p>
    <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
    <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, please ignore this email.</p>
  `;

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} name - User name
 * @param {string} resetUrl - Password reset URL
 */
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const subject = 'Password Reset Request';
  const html = `
    <h1>Password Reset Request</h1>
    <p>Hello ${name},</p>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">
      Reset Password
    </a>
    <p>Or copy and paste this link in your browser:</p>
    <p>${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>
  `;

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send welcome email
 * @param {string} email - User email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Article Publishing Platform';
  const html = `
    <h1>Welcome ${name}!</h1>
    <p>Your account has been successfully created.</p>
    <p>You can now start exploring articles, commenting, and engaging with the community.</p>
    <p>If you're interested in becoming an author, you can apply from your dashboard.</p>
    <p>Happy reading!</p>
  `;

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send author approval notification
 * @param {string} email - Author email
 * @param {string} name - Author name
 */
const sendAuthorApprovalEmail = async (email, name) => {
  const subject = 'Author Application Approved!';
  const html = `
    <h1>Congratulations ${name}!</h1>
    <p>Your author application has been approved.</p>
    <p>You can now start creating and publishing articles on our platform.</p>
    <p>Login to your account to get started!</p>
  `;

  return await sendEmail({ to: email, subject, html });
};

/**
 * Send article published notification
 * @param {string} email - Author email
 * @param {string} name - Author name
 * @param {string} articleTitle - Article title
 * @param {string} articleUrl - Article URL
 */
const sendArticlePublishedEmail = async (email, name, articleTitle, articleUrl) => {
  const subject = 'Your Article Has Been Published!';
  const html = `
    <h1>Great News ${name}!</h1>
    <p>Your article "<strong>${articleTitle}</strong>" has been published and is now live.</p>
    <a href="${articleUrl}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
      View Article
    </a>
    <p>Share it with your audience!</p>
  `;

  return await sendEmail({ to: email, subject, html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendAuthorApprovalEmail,
  sendArticlePublishedEmail
};
