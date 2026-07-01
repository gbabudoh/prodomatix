// Auth routes: register, login, Google sign-in, current user.
import { Router } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { Prisma } from '../generated/prisma/client.ts';
import { prisma } from '../db/prisma.ts';
import { signToken, requireAuth } from '../middleware/auth.ts';
import { config } from '../config.ts';

const router = Router();

const googleClient = new OAuth2Client(config.googleClientId);

const publicUser = (u: { id: number; email: string; name: string; role: string; freeCredits: number }) => ({
  id: u.id, email: u.email, name: u.name, role: u.role, freeCredits: u.freeCredits
});

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || '');

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!isEmail(email)) return res.status(400).json({ error: 'A valid email is required.' });
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        freeCredits: config.freeDownloadCredits
      }
    });
    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return res.status(409).json({ error: 'That email is already registered.' });
    }
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { email: (email || '').toLowerCase().trim() } });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

// Sign in / sign up with Google. The frontend sends the ID token (credential)
// returned by Google Identity Services; we verify it server-side, then
// find-or-create the user by email. No schema change needed — Google-only
// accounts get a random (effectively unusable) password hash.
router.post('/google', async (req, res) => {
  const { credential } = req.body || {};
  if (!credential) return res.status(400).json({ error: 'Missing Google credential.' });
  if (!config.googleClientId) {
    return res.status(503).json({ error: 'Google sign-in is not configured on the server.' });
  }

  const payload = await (async () => {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId
      });
      return ticket.getPayload();
    } catch {
      return undefined;
    }
  })();

  if (!payload) {
    return res.status(401).json({ error: 'Could not verify your Google sign-in. Please try again.' });
  }
  if (!payload.email || payload.email_verified === false) {
    return res.status(401).json({ error: 'Your Google account email is unavailable or not verified.' });
  }

  const email = payload.email.toLowerCase().trim();
  const name = (payload.name || email.split('@')[0] || 'User').trim();

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const randomHash = await bcrypt.hash(crypto.randomUUID(), 10);
    user = await prisma.user.create({
      data: { email, name, passwordHash: randomHash, freeCredits: config.freeDownloadCredits }
    });
  }

  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, role: true, freeCredits: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user });
});

export default router;
