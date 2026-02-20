// Email template wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Curio</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #ffffff;
      text-decoration: none;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Curio</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Curio. All rights reserved.</p>
      <p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}">Visit Curio</a> • 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/about">About</a> • 
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// Welcome email template
const welcomeEmail = (username) => {
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Welcome to Curio! 🎉</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      Thank you for joining Curio! We're excited to have you as part of our community of writers and readers.
    </p>
    <p style="font-size: 16px; color: #555;">
      Here's what you can do now:
    </p>
    <ul style="font-size: 16px; color: #555;">
      <li>Explore amazing articles from our community</li>
      <li>Follow your favorite authors</li>
      <li>Start writing your own articles</li>
      <li>Engage with comments and discussions</li>
    </ul>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/articles" class="button">
      Start Reading
    </a>
    <p style="font-size: 14px; color: #888; margin-top: 30px;">
      If you have any questions, feel free to reach out to us anytime.
    </p>
  `;
  return emailWrapper(content);
};

// Password reset email template
const passwordResetEmail = (username, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Reset Your Password 🔑</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <a href="${resetUrl}" class="button">
      Reset Password
    </a>
    <p style="font-size: 14px; color: #888; margin-top: 30px;">
      Or copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
    </p>
    <p style="font-size: 14px; color: #888; margin-top: 20px;">
      ⚠️ This link will expire in 1 hour for security reasons.
    </p>
    <p style="font-size: 14px; color: #888; margin-top: 20px;">
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
    </p>
  `;
  return emailWrapper(content);
};

// Password changed confirmation email
const passwordChangedEmail = (username) => {
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Password Changed Successfully ✅</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      Your password has been successfully changed.
    </p>
    <p style="font-size: 16px; color: #555;">
      If you made this change, no further action is needed.
    </p>
    <p style="font-size: 14px; color: #d9534f; margin-top: 20px; padding: 15px; background-color: #fff5f5; border-left: 4px solid #d9534f;">
      <strong>⚠️ Security Alert:</strong><br>
      If you did NOT make this change, please contact us immediately at 
      <a href="mailto:support@curio.com" style="color: #d9534f;">support@curio.com</a>
    </p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
      Log In
    </a>
  `;
  return emailWrapper(content);
};

// Email verification template
const emailVerificationTemplate = (username, verificationToken) => {
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
  
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">Verify Your Email Address ✉️</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      Thanks for signing up! Please verify your email address to complete your registration and start using Curio.
    </p>
    <a href="${verifyUrl}" class="button">
      Verify Email Address
    </a>
    <p style="font-size: 14px; color: #888; margin-top: 30px;">
      Or copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
    </p>
    <p style="font-size: 14px; color: #888; margin-top: 20px;">
      This link will expire in 24 hours.
    </p>
  `;
  return emailWrapper(content);
};

// New comment notification email
const commentNotificationEmail = (username, commenterName, articleTitle, articleSlug) => {
  const articleUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/articles/${articleSlug}`;
  
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">New Comment on Your Article 💬</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      <strong>${commenterName}</strong> commented on your article: <strong>"${articleTitle}"</strong>
    </p>
    <a href="${articleUrl}" class="button">
      View Comment
    </a>
    <p style="font-size: 14px; color: #888; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings">Manage notification preferences</a>
    </p>
  `;
  return emailWrapper(content);
};

// New follower notification email
const followerNotificationEmail = (username, followerName, followerUsername) => {
  const profileUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/user/${followerUsername}`;
  
  const content = `
    <h1 style="color: #333; margin-bottom: 20px;">New Follower! 👤</h1>
    <p style="font-size: 16px; color: #555;">Hi ${username},</p>
    <p style="font-size: 16px; color: #555;">
      <strong>${followerName}</strong> started following you!
    </p>
    <a href="${profileUrl}" class="button">
      View Profile
    </a>
    <p style="font-size: 14px; color: #888; margin-top: 30px;">
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/settings">Manage notification preferences</a>
    </p>
  `;
  return emailWrapper(content);
};

module.exports = {
  welcomeEmail,
  passwordResetEmail,
  passwordChangedEmail,
  emailVerificationTemplate,
  commentNotificationEmail,
  followerNotificationEmail,
};
