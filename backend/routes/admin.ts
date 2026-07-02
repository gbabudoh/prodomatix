// Admin-only platform management endpoints (stats, users, orders, insights).
import { Router } from 'express';
import { prisma } from '../db/prisma.ts';
import { requireAuth, requireAdmin } from '../middleware/auth.ts';
import {
  completenessScore,
  detectDuplicates,
  rfmScore,
  detectAnomalies,
} from '../lib/algorithms.ts';

const router = Router();
router.use(requireAuth, requireAdmin);

// GET /api/admin/stats — headline numbers for the admin dashboard.
router.get('/stats', async (_req, res) => {
  const [users, businesses, purchases, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.business.count(),
    prisma.purchase.count(),
    prisma.purchase.aggregate({ _sum: { total: true } })
  ]);
  res.json({
    users,
    businesses,
    purchases,
    revenue: revenue._sum.total ?? 0
  });
});

// GET /api/admin/users — all accounts with order counts + spend.
router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      freeCredits: true,
      createdAt: true,
      purchases: { select: { total: true } }
    }
  });
  res.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      freeCredits: u.freeCredits,
      createdAt: u.createdAt,
      orders: u.purchases.length,
      spent: u.purchases.reduce((s, p) => s + p.total, 0)
    }))
  );
});

// GET /api/admin/orders — every purchase across the platform.
router.get('/orders', async (_req, res) => {
  const orders = await prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reference: true,
      total: true,
      isFree: true,
      createdAt: true,
      user: { select: { email: true } },
      _count: { select: { items: true } }
    }
  });
  res.json(
    orders.map((o) => ({
      id: o.id,
      reference: o.reference,
      total: o.total,
      isFree: o.isFree,
      createdAt: o.createdAt,
      userEmail: o.user.email,
      records: o._count.items
    }))
  );
});

// ── Algorithm-powered Insights ────────────────────────────────────────────────

// GET /api/admin/quality — completeness score for every business record.
router.get('/quality', async (_req, res) => {
  const businesses = await prisma.business.findMany({ include: { contactPersons: true } });
  const results = businesses
    .map(b => ({ id: b.id, businessName: b.businessName, industry: b.industry, country: b.country, score: completenessScore(b as any) }))
    .sort((a, b) => a.score - b.score); // worst first so admins fix lowest
  res.json(results);
});

// GET /api/admin/duplicates — Jaccard-similarity duplicate pairs above threshold.
router.get('/duplicates', async (_req, res) => {
  const businesses = await prisma.business.findMany({ include: { contactPersons: true } });
  const pairs = detectDuplicates(businesses as any, 0.4);
  res.json(pairs);
});

// GET /api/admin/rfm — RFM segmentation of all users.
router.get('/rfm', async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'user' },
    include: { purchases: { select: { total: true, createdAt: true } } },
  });
  const inputs = users.map(u => ({
    userId:        u.id,
    email:         u.email,
    name:          u.name,
    lastPurchase:  u.purchases.length ? u.purchases.slice().sort((x, y) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime())[0]!.createdAt : null,
    purchaseCount: u.purchases.length,
    totalSpend:    u.purchases.reduce((s, p) => s + p.total, 0),
  }));
  res.json(rfmScore(inputs));
});

// GET /api/admin/anomalies — Z-score flagged users.
router.get('/anomalies', async (_req, res) => {
  const users = await prisma.user.findMany({
    where: { role: 'user' },
    include: {
      purchases:  { select: { id: true } },
      auditLogs:  { where: { action: 'download.file' }, select: { id: true } },
    },
  });
  const now = Date.now();
  const inputs = users.map(u => ({
    userId:        u.id,
    email:         u.email,
    name:          u.name,
    purchaseCount: u.purchases.length,
    downloadCount: u.auditLogs.length,
    accountAgeDays: Math.max(1, Math.round((now - new Date(u.createdAt).getTime()) / 86_400_000)),
  }));
  res.json(detectAnomalies(inputs, 2));
});

// GET /api/admin/audit — paginated audit log (newest first).
router.get('/audit', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const take = 50;
  const skip = (page - 1) * take;

  const [total, logs] = await Promise.all([
    prisma.auditLog.count(),
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: { user: { select: { email: true, name: true } } },
    }),
  ]);

  res.json({
    logs: logs.map((l) => ({
      id:         l.id,
      action:     l.action,
      resource:   l.resource,
      resourceId: l.resourceId,
      ip:         l.ip,
      userAgent:  l.userAgent,
      metadata:   l.metadata,
      createdAt:  l.createdAt,
      userEmail:  l.user?.email ?? null,
      userName:   l.user?.name ?? null,
    })),
    total,
    page,
    pages: Math.ceil(total / take),
  });
});

export default router;
