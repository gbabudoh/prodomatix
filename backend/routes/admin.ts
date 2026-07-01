// Admin-only platform management endpoints (stats, users, orders).
import { Router } from 'express';
import { prisma } from '../db/prisma.ts';
import { requireAuth, requireAdmin } from '../middleware/auth.ts';

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

export default router;
