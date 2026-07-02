// Auth routes: register, login, Google, email verify, logout, MFA.
import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { generate as totpGenerate, verify as totpVerify, generateSecret as totpGenerateSecret, generateURI } from 'otplib';
import QRCode from 'qrcode';
import { OAuth2Client } from 'google-auth-library';
import { Prisma } from '../generated/prisma/client.ts';
import { prisma } from '../db/prisma.ts';
import { signToken, setAuthCookie, clearAuthCookie, requireAuth } from '../middleware/auth.ts';
import { config } from '../config.ts';
import { sendVerificationEmail } from '../lib/email.ts';
import { audit } from '../lib/audit.ts';

const router = Router();
const googleClient = new OAuth2Client(config.googleClientId);

const publicUser = (u: { id: number; email: string; name: string; role: string; freeCredits: number; emailVerified: boolean }) => ({
  id: u.id, email: u.email, name: u.name, role: u.role,
  freeCredits: u.freeCredits, emailVerified: u.emailVerified,
});

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');

// ── Register ──────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!isEmail(email)) return res.status(400).json({ error: 'A valid email is required.' });
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

  const passwordHash  = await bcrypt.hash(password, 10);
  const verifyToken   = crypto.randomBytes(32).toString('hex');

  try {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        freeCredits: config.freeDownloadCredits,
        emailVerified: false,
        verifyToken,
      }
    });

    // Send verification email — fire and forget so registration doesn't fail if email is down
    sendVerificationEmail(user.email, user.name, verifyToken).catch(console.error);

    await audit(req, 'auth.register', { userId: user.id, metadata: { email: user.email } });

    setAuthCookie(res, signToken(user));
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'That email is already registered.' });
    }
    throw err;
  }
});

// ── Verify email ──────────────────────────────────────────────────────────────
router.post('/verify-email', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Token required.' });

  const user = await prisma.user.findUnique({ where: { verifyToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired verification link.' });

  await prisma.user.update({
    where: { id: user.id },
    data:  { emailVerified: true, verifyToken: null },
  });

  await audit(req, 'auth.verify_email', { userId: user.id });
  res.json({ ok: true });
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email: (email || '').toLowerCase().trim() } });

  // Account locked?
  if (user?.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    await audit(req, 'auth.login_locked', { userId: user.id });
    return res.status(429).json({ error: `Account locked. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}.` });
  }

  const valid = user && await bcrypt.compare(password || '', user.passwordHash);

  if (!valid) {
    if (user) {
      const attempts = user.loginAttempts + 1;
      const shouldLock = attempts >= config.maxLoginAttempts;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: attempts,
          lockedUntil:   shouldLock ? new Date(Date.now() + config.lockoutMinutes * 60 * 1000) : null,
        },
      });
      await audit(req, 'auth.login_failed', { userId: user.id, metadata: { attempts } });
      if (shouldLock) {
        return res.status(429).json({ error: `Too many failed attempts. Account locked for ${config.lockoutMinutes} minutes.` });
      }
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // If MFA is enabled, require TOTP before issuing cookie
  if (user.mfaEnabled) {
    const { totp } = req.body || {};
    if (!totp) return res.status(200).json({ mfaRequired: true });
    const valid2 = user.mfaSecret && await totpVerify({ token: totp, secret: user.mfaSecret });
    if (!valid2) return res.status(401).json({ error: 'Invalid authenticator code.' });
  }

  // Clear lockout on successful login
  await prisma.user.update({ where: { id: user.id }, data: { loginAttempts: 0, lockedUntil: null } });
  await audit(req, 'auth.login', { userId: user.id });

  setAuthCookie(res, signToken(user));
  res.json({ user: publicUser(user) });
});

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: 'Missing Google credential.' });
  if (!config.googleClientId) return res.status(503).json({ error: 'Google sign-in is not configured.' });

  const payload = await (async () => {
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: config.googleClientId });
      return ticket.getPayload();
    } catch { return undefined; }
  })();

  if (!payload) return res.status(401).json({ error: 'Could not verify your Google sign-in. Please try again.' });
  if (!payload.email || payload.email_verified === false) return res.status(401).json({ error: 'Google account email unavailable or not verified.' });

  const email = payload.email.toLowerCase().trim();
  const name  = (payload.name || email.split('@')[0] || 'User').trim();

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const randomHash = await bcrypt.hash(crypto.randomUUID(), 10);
    user = await prisma.user.create({
      data: { email, name, passwordHash: randomHash, freeCredits: config.freeDownloadCredits, emailVerified: true }
    });
  }

  await audit(req, 'auth.google', { userId: user.id });
  setAuthCookie(res, signToken(user));
  res.json({ user: publicUser(user) });
});

// ── Me ────────────────────────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where:  { id: req.user!.id },
    select: { id: true, email: true, name: true, role: true, freeCredits: true, emailVerified: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

// ── Logout ────────────────────────────────────────────────────────────────────
router.post('/logout', requireAuth, async (req, res) => {
  await audit(req, 'auth.logout');
  clearAuthCookie(res);
  res.json({ ok: true });
});

// ── Resend verification email ─────────────────────────────────────────────────
router.post('/resend-verification', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || user.emailVerified) return res.json({ ok: true });

  const verifyToken = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({ where: { id: user.id }, data: { verifyToken } });
  sendVerificationEmail(user.email, user.name, verifyToken).catch(console.error);
  res.json({ ok: true });
});

// ── MFA: setup (admin only) ───────────────────────────────────────────────────
router.post('/mfa/setup', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });

  const secret  = await totpGenerateSecret();
  const otpauth = generateURI({ issuer: 'Prodomatix', label: user.email, secret });
  const qrCode  = await QRCode.toDataURL(otpauth);

  // Store secret temporarily — only activate once verified
  await prisma.user.update({ where: { id: user.id }, data: { mfaSecret: secret } });
  res.json({ qrCode, secret });
});

// ── MFA: confirm setup ────────────────────────────────────────────────────────
router.post('/mfa/confirm', requireAuth, async (req, res) => {
  const { totp } = req.body || {};
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user?.mfaSecret) return res.status(400).json({ error: 'MFA setup not started.' });

  const valid = await totpVerify({ token: totp || '', secret: user.mfaSecret });
  if (!valid) return res.status(401).json({ error: 'Invalid code. Try again.' });

  await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: true } });
  await audit(req, 'mfa.setup', { userId: user.id });
  res.json({ ok: true });
});

// ── MFA: disable ──────────────────────────────────────────────────────────────
router.post('/mfa/disable', requireAuth, async (req, res) => {
  const { password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });

  const valid = await bcrypt.compare(password || '', user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Incorrect password.' });

  await prisma.user.update({ where: { id: user.id }, data: { mfaEnabled: false, mfaSecret: null } });
  res.json({ ok: true });
});

export default router;
