// Central configuration loaded from environment variables.
// Copy .env.example to .env and adjust for your machine.
import 'dotenv/config';

const toBool = (v: string | undefined) => v === 'true' || v === '1';

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  freeDownloadCredits: Number(process.env.FREE_DOWNLOAD_CREDITS) || 3,

  // Stripe
  stripeSecretKey:     process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',

  // Environment
  isProd: process.env.NODE_ENV === 'production',
  appUrl: process.env.APP_URL || 'http://localhost:5173',

  // CORS — comma-separated list of allowed origins
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()),

  // Cookie
  cookieSecret: process.env.COOKIE_SECRET || 'dev-cookie-secret-change-me',

  // Email (SMTP via Nodemailer)
  email: {
    host:     process.env.EMAIL_HOST     || '',
    port:     Number(process.env.EMAIL_PORT)  || 587,
    secure:   process.env.EMAIL_SECURE   === 'true',
    user:     process.env.EMAIL_USER     || '',
    pass:     process.env.EMAIL_PASS     || '',
    from:     process.env.EMAIL_FROM     || 'Prodomatix <noreply@prodomatix.com>',
  },

  // Security
  maxLoginAttempts: 5,
  lockoutMinutes:   15,

  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',

  // Prisma + the app both connect using this.
  databaseUrl: process.env.DATABASE_URL || '',
  dbSsl: toBool(process.env.DB_SSL),

  // Seed accounts created on `npm run db:seed`.
  seedAdmin: {
    email: process.env.SEED_ADMIN_EMAIL || 'admin@prodomatix.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'admin12345',
    name: process.env.SEED_ADMIN_NAME || 'Platform Admin'
  },
  seedDemo: {
    email: process.env.SEED_DEMO_EMAIL || 'demo@prodomatix.com',
    password: process.env.SEED_DEMO_PASSWORD || 'demo12345',
    name: process.env.SEED_DEMO_NAME || 'Demo User'
  }
};
