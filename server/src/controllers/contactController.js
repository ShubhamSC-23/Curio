const sendEmail = require('../utils/sendEmail'); // You'll need to create this

// POST /api/v1/contact
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Option 1: Save to database
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    // Option 2: Send email notification (recommended)
    // await sendEmail({
    //   to: 'support@curio.com',
    //   subject: `Contact Form: ${subject}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>From:</strong> ${name} (${email})</p>
    //     <p><strong>Subject:</strong> ${subject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // });

    // Send confirmation email to user
    // await sendEmail({
    //   to: email,
    //   subject: 'We received your message',
    //   html: `
    //     <h2>Thank you for contacting Curio!</h2>
    //     <p>Hi ${name},</p>
    //     <p>We've received your message and will get back to you within 24 hours.</p>
    //     <p>Best regards,<br>The Curio Team</p>
    //   `
    // });

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    next(error);
  }
};