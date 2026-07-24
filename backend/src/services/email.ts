import nodemailer from "nodemailer";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD;

// Uses the operator's own Gmail account (via an App Password) rather than a
// transactional email service, since those require verifying a custom
// domain to send to arbitrary recipients — this app intentionally has none.
const transporter =
  SMTP_USER && SMTP_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
      })
    : null;

export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<void> {
  if (!transporter) {
    console.log(`\n[dev] Magic link for ${email}:\n  ${magicLink}\n`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Geriatric Grooves" <${SMTP_USER}>`,
      to: email,
      subject: "Your Geriatric Grooves sign-in link",
      text: `Tap this link to sign in:\n\n${magicLink}\n\nThis link works once and expires in 15 minutes. If you didn't request this, you can ignore this email.`,
      html: `<p>Tap this link to sign in:</p><p><a href="${magicLink}">${magicLink}</a></p><p>This link works once and expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    console.error(`Failed to send magic link email to ${email}:`, error);
  }
}
