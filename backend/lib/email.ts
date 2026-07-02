import nodemailer from 'nodemailer';
import { config } from '../config.ts';

const transporter = nodemailer.createTransport({
  host:   config.email.host,
  port:   config.email.port,
  secure: config.email.secure,
  auth:   { user: config.email.user, pass: config.email.pass },
});

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${config.appUrl}/verify-email?token=${token}`;
  await transporter.sendMail({
    from:    config.email.from,
    to,
    subject: 'Verify your Prodomatix email address',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
        <img src="${config.appUrl}/logo.png" alt="Prodomatix" style="height:22px;margin-bottom:28px" />
        <h2 style="font-size:22px;font-weight:700;color:#181b22;margin-bottom:8px">Welcome, ${name}!</h2>
        <p style="font-size:15px;color:#616b7a;line-height:1.6;margin-bottom:24px">
          Please verify your email address to confirm your Prodomatix account.
        </p>
        <a href="${link}" style="display:inline-block;background:#2e54d4;color:#fff;padding:12px 28px;border-radius:9px;font-size:15px;font-weight:600;text-decoration:none">
          Verify email address
        </a>
        <p style="font-size:12px;color:#9aa2ae;margin-top:24px">
          This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid #e3e6eb;margin:24px 0" />
        <p style="font-size:11px;color:#9aa2ae">© ${new Date().getFullYear()} Prodomatix · A subsidiary of Egobas Limited</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${config.appUrl}/reset-password?token=${token}`;
  await transporter.sendMail({
    from:    config.email.from,
    to,
    subject: 'Reset your Prodomatix password',
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
        <img src="${config.appUrl}/logo.png" alt="Prodomatix" style="height:22px;margin-bottom:28px" />
        <h2 style="font-size:22px;font-weight:700;color:#181b22;margin-bottom:8px">Reset your password</h2>
        <p style="font-size:15px;color:#616b7a;line-height:1.6;margin-bottom:24px">
          Hi ${name}, click below to set a new password. This link expires in 1 hour.
        </p>
        <a href="${link}" style="display:inline-block;background:#2e54d4;color:#fff;padding:12px 28px;border-radius:9px;font-size:15px;font-weight:600;text-decoration:none">
          Reset password
        </a>
        <p style="font-size:12px;color:#9aa2ae;margin-top:24px">If you did not request this, ignore this email — your password has not changed.</p>
        <hr style="border:none;border-top:1px solid #e3e6eb;margin:24px 0" />
        <p style="font-size:11px;color:#9aa2ae">© ${new Date().getFullYear()} Prodomatix · A subsidiary of Egobas Limited</p>
      </div>
    `,
  });
}
