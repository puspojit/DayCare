// /api/sendConfirmationEmail.js
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key in environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, role, location } = req.body;

  // Basic email validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Construct email content based on role
  let subject, htmlContent;

  if (role === 'provider') {
    subject = 'Thanks for registering your daycare!';
    htmlContent = `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for registering your daycare on GTA Childcare. We'll notify parents when your listing goes live.</p>
      <p>Your listed area: ${location || 'N/A'}</p>
      <p>— The GTA Childcare Team</p>
    `;
  } else {
    subject = 'Thanks for signing up for GTA Childcare updates!';
    htmlContent = `
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thanks for signing up for GTA Childcare updates! We'll notify you when we launch.</p>
      <p>Your area: ${location || 'N/A'}</p>
      <p>— The GTA Childcare Team</p>
    `;
  }

  try {
    await sgMail.send({
      to: email,
      from: 'no-reply@daycare-8l4.pages.dev', // Must be verified in SendGrid
      subject: subject,
      html: htmlContent,
    });

    return res.status(200).json({ message: 'Confirmation email sent!' });
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
