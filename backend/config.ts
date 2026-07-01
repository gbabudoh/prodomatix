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

  // CORS — comma-separated list of allowed origins
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim()),

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
