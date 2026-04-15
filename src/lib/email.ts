import nodemailer from "nodemailer";

// Email configuration - supports multiple providers
const getTransporter = () => {
  // Check for different email providers
  if (process.env.SMTP_HOST) {
    // Generic SMTP configuration
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  if (process.env.RESEND_API_KEY) {
    // Resend configuration (uses SMTP)
    return nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
  }

  // Development: Log emails to console
  console.warn("⚠️ No email provider configured. Emails will be logged to console.");
  return null;
};

const transporter = getTransporter();

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@prodomatix.com";
const APP_NAME = "Prodomatix";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    if (!transporter) {
      // Development mode - log to console
      console.log("\n📧 EMAIL (Development Mode)");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Content:", text || html);
      console.log("---\n");
      return true;
    }

    await transporter.sendMail({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// Email Templates

export async function sendVerificationEmail(email: string, token: string, name: string): Promise<boolean> {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to ${APP_NAME}!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${name},
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Thanks for signing up! Please verify your email address to get started on the Stock Market of Sentiment.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${verifyUrl}" style="color: #10b981; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Verify your ${APP_NAME} account`,
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string, name: string): Promise<boolean> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${name},
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
            This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            If the button doesn't work, copy and paste this link:<br>
            <a href="${resetUrl}" style="color: #10b981; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Reset your ${APP_NAME} password`,
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${APP_NAME}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 You're Verified!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${name},
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Your email has been verified and your account is now fully activated. Welcome to the Stock Market of Sentiment!
          </p>
          <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #166534; margin: 0 0 12px; font-size: 16px;">What you can do now:</h3>
            <ul style="color: #334155; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Rate products and services</li>
              <li>Track sentiment trends</li>
              <li>Build your watchlist</li>
              <li>Join Prodo Groups</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #14b8a6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Start Exploring
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME} - Your account is verified!`,
    html,
  });
}

export async function sendPasswordChangedEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <div style="background: linear-gradient(135deg, #10b981, #14b8a6); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Changed</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${name},
          </p>
          <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
            Your password has been successfully changed. If you made this change, no further action is needed.
          </p>
          <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="color: #991b1b; margin: 0; font-size: 14px;">
              <strong>Didn't make this change?</strong><br>
              If you didn't change your password, please contact our support team immediately or reset your password.
            </p>
          </div>
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
            For security, all other sessions have been logged out.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Your ${APP_NAME} password was changed`,
    html,
  });
}
