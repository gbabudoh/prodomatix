// Prodomatix API server — Express + PostgreSQL + Prisma.
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { config } from './config.ts';
import authRoutes from './routes/auth.ts';
import businessRoutes from './routes/businesses.ts';
import purchaseRoutes from './routes/purchases.ts';
import downloadRoutes from './routes/downloads.ts';
import adminRoutes from './routes/admin.ts';
import paymentRoutes from './routes/payments.ts';

const app = express();

// Security headers with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", 'https://accounts.google.com', 'https://js.stripe.com', 'https://apis.google.com'],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'", 'https://api.stripe.com', 'https://accounts.google.com'],
      frameSrc:    ["'self'", 'https://js.stripe.com', 'https://accounts.google.com'],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

app.use(cookieParser(config.cookieSecret));

// CORS — restrict to configured origins only
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));

// Rate limiting on auth endpoints — max 20 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stripe webhooks need the raw body for signature verification — must come before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }), (req: Request, _res, next: NextFunction) => {
  (req as any).rawBody = req.body;
  next();
});

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'prodomatix-api' }));

// Friendly root so visiting the API host in a browser isn't confusing.
// The actual app is the frontend (http://localhost:5173).
app.get('/', (_req, res) => {
  res.json({
    service: 'prodomatix-api',
    status: 'running',
    note: 'This is the API server. Open the web app at http://localhost:5173',
    endpoints: ['/api/health', '/api/auth', '/api/businesses', '/api/purchases', '/api/downloads', '/api/admin']
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// 404 for unknown API routes.
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// Central error handler.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(config.port, () => {
  console.log(`Prodomatix API listening on http://localhost:${config.port}`);
});
