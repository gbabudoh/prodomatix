// JWT authentication + role guards.
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.ts';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  name: string;
}

declare global {
  namespace Express {
    interface Request { user?: AuthUser; }
  }
}

export function signToken(user: { id: number; email: string; role: string; name: string }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] }
  );
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly:  true,
    secure:    config.isProd,
    sameSite:  'lax',
    maxAge:    7 * 24 * 60 * 60 * 1000, // 7 days
    path:      '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('token', { httpOnly: true, secure: config.isProd, sameSite: 'lax', path: '/' });
}

// Reads token from httpOnly cookie (primary) or Authorization header (fallback for API clients).
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.token;
  const header = req.headers.authorization || '';
  const bearerToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.user = jwt.verify(token, config.jwtSecret) as AuthUser;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
}
