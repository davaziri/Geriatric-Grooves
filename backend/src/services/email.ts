import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// Sends over HTTPS via SendGrid's API rather than raw SMTP. Most cloud
// hosts (Render's free tier included) can't route outbound SMTP to Gmail
// at all — connections fail with ENETUNREACH — but outbound HTTPS always
// works, so this sidesteps the problem entirely. EMAIL_FROM must be a
// SendGrid-verified sender (Single Sender Verification, no domain needed).
export async function sendMagicLinkEmail(email: string, magicLink: string): Promise<void> {
  if (!SENDGRID_API_KEY || !EMAIL_FROM) {
    console.log(`\n[dev] Magic link for ${email}:\n  ${magicLink}\n`);
    return;
  }

  try {
    await sgMail.send({
      to: email,
      from: EMAIL_FROM,
      subject: "Your Geriatric Grooves sign-in link",
      text: `Tap this link to sign in:\n\n${magicLink}\n\nThis link works once and expires in 15 minutes. If you didn't request this, you can ignore this email.`,
      html: `<p>Tap this link to sign in:</p><p><a href="${magicLink}">${magicLink}</a></p><p>This link works once and expires in 15 minutes. If you didn't request this, you can ignore this email.</p>`,
    });
  } catch (error) {
    console.error(`Failed to send magic link email to ${email}:`, error);
  }
}
