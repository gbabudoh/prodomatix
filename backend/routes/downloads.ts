// On-the-fly file generation. Users can only download data they own.
import { Router } from 'express';
import { prisma } from '../db/prisma.ts';
import { requireAuth } from '../middleware/auth.ts';
import { getBusinessesByIds, getOwnedBusinessIds } from '../lib/businesses.ts';
import { buildExcel, buildPdf } from '../lib/exporters.ts';

const router = Router();

// GET /api/downloads?format=excel|pdf[&purchaseId=123]
// With purchaseId: only that order's records (must belong to the user).
// Without: every record the user owns.
router.get('/', requireAuth, async (req, res) => {
  const format = String(req.query.format || 'excel').toLowerCase();
  const purchaseId = req.query.purchaseId ? Number(req.query.purchaseId) : null;

  let ids: number[];
  let reference = 'ALL';

  if (purchaseId) {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId, userId: req.user!.id },
      include: { items: { select: { businessId: true } } }
    });
    if (!purchase) return res.status(404).json({ error: 'Order not found.' });
    reference = purchase.reference;
    ids = purchase.items.map((i) => i.businessId);
  } else {
    ids = await getOwnedBusinessIds(req.user!.id);
  }

  if (!ids.length) return res.status(404).json({ error: 'No purchased data to download.' });

  const businesses = await getBusinessesByIds(ids);
  const base = `prodomatix_${reference.toLowerCase()}`;

  if (format === 'pdf') {
    const buf = await buildPdf(businesses, { reference });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${base}.pdf"`);
    return res.send(buf);
  }

  const buf = await buildExcel(businesses, { reference });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${base}.xlsx"`);
  return res.send(buf);
});

export default router;
