// Business catalogue: filtered listing for users (teaser only), full CRUD for admins.
import { Router } from 'express';
import { Prisma } from '../generated/prisma/client.ts';
import { prisma } from '../db/prisma.ts';
import { requireAuth, requireAdmin } from '../middleware/auth.ts';
import { getOwnedBusinessIds, serializeBusiness } from '../lib/businesses.ts';

const router = Router();

const asList = (v: unknown): string[] =>
  Array.isArray(v) ? (v as string[]) : typeof v === 'string' && v ? v.split(',') : [];

const SIZE_BANDS: Record<string, Prisma.IntFilter> = {
  small: { lte: 200 },
  medium: { gte: 201, lte: 1000 },
  large: { gt: 1000 }
};
const REVENUE_BANDS: Record<string, Prisma.IntFilter> = {
  under50: { lt: 50 },
  '50to250': { gte: 50, lte: 250 },
  over250: { gt: 250 }
};
const SORTS: Record<string, Prisma.BusinessOrderByWithRelationInput> = {
  relevance: { businessName: 'asc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  verified: { verified: 'desc' },
  newest: { createdAt: 'desc' }
};

// GET /api/businesses — filtered/sorted/paginated list with facet counts.
// Non-owned records come back as teasers; returns an envelope.
router.get('/', requireAuth, async (req, res) => {
  const {
    search = '', types, industries, regions, countries,
    priceMin, priceMax, verifiedMin, sizeBand, revenueBand,
    sort = 'relevance', page = '1', pageSize = '12'
  } = req.query as Record<string, string>;

  // Build named conditions so facet counts can exclude their own dimension.
  const conds: Record<string, Prisma.BusinessWhereInput> = {};

  const q = (search || '').trim();
  if (q) {
    conds.search = {
      OR: [
        { businessName: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
        { industry: { contains: q, mode: 'insensitive' } },
        { businessType: { contains: q, mode: 'insensitive' } }
      ]
    };
  }
  const tps = asList(types);
  if (tps.length) conds.type = { businessType: { in: tps } };
  const inds = asList(industries);
  if (inds.length) conds.industry = { industry: { in: inds } };
  const regs = asList(regions);
  if (regs.length) conds.region = { region: { in: regs } };
  const ctrs = asList(countries);
  if (ctrs.length) conds.country = { country: { in: ctrs } };

  const price: Prisma.IntFilter = {};
  if (priceMin !== undefined && priceMin !== '' && !Number.isNaN(Number(priceMin))) price.gte = Number(priceMin);
  if (priceMax !== undefined && priceMax !== '' && !Number.isNaN(Number(priceMax))) price.lte = Number(priceMax);
  if (Object.keys(price).length) conds.price = { price };

  if (verifiedMin && !Number.isNaN(Number(verifiedMin))) conds.verified = { verified: { gte: Number(verifiedMin) } };
  if (sizeBand && SIZE_BANDS[sizeBand]) conds.size = { staffCapacity: SIZE_BANDS[sizeBand] };
  if (revenueBand && REVENUE_BANDS[revenueBand]) conds.revenue = { revenue: REVENUE_BANDS[revenueBand] };

  const compose = (exclude?: string): Prisma.BusinessWhereInput | undefined => {
    const arr = Object.entries(conds).filter(([k]) => k !== exclude).map(([, v]) => v);
    return arr.length ? { AND: arr } : undefined;
  };
  const whereAll = compose();

  const orderBy = SORTS[sort] || SORTS.relevance;
  const pageN = Math.max(1, Number(page) || 1);
  const sizeN = Math.min(100, Math.max(1, Number(pageSize) || 12));

  const [total, rows, typeFacet, indFacet, regFacet, ctrFacet, bounds] = await Promise.all([
    prisma.business.count({ where: whereAll }),
    prisma.business.findMany({
      where: whereAll,
      orderBy,
      skip: (pageN - 1) * sizeN,
      take: sizeN,
      include: { contactPersons: true }
    }),
    prisma.business.groupBy({ by: ['businessType'], where: compose('type'), _count: { _all: true } }),
    prisma.business.groupBy({ by: ['industry'], where: compose('industry'), _count: { _all: true } }),
    prisma.business.groupBy({ by: ['region'], where: compose('region'), _count: { _all: true } }),
    prisma.business.groupBy({ by: ['country'], where: compose('country'), _count: { _all: true }, orderBy: { country: 'asc' } }),
    prisma.business.aggregate({ _min: { price: true }, _max: { price: true } })
  ]);

  const isAdmin = req.user!.role === 'admin';
  const ownedSet = new Set(await getOwnedBusinessIds(req.user!.id));
  const items = rows.map((b) => serializeBusiness(b, { owned: ownedSet.has(b.id), isAdmin }));

  const facetMap = (arr: Array<{ _count: { _all: number } }>, key: string) =>
    Object.fromEntries(arr.map((r) => [(r as Record<string, unknown>)[key], r._count._all]));

  res.json({
    items,
    total,
    page: pageN,
    pageSize: sizeN,
    facets: {
      types: facetMap(typeFacet, 'businessType'),
      industries: facetMap(indFacet, 'industry'),
      regions: facetMap(regFacet, 'region'),
      countries: facetMap(ctrFacet, 'country')
    },
    priceBounds: { min: bounds._min.price ?? 0, max: bounds._max.price ?? 0 }
  });
});

// GET /api/businesses/options — distinct facet values for the filter sidebar.
router.get('/options', requireAuth, async (_req, res) => {
  const [types, inds, regs, ctrs] = await Promise.all([
    prisma.business.findMany({ distinct: ['businessType'], select: { businessType: true }, orderBy: { businessType: 'asc' } }),
    prisma.business.findMany({ distinct: ['industry'], select: { industry: true }, orderBy: { industry: 'asc' } }),
    prisma.business.findMany({
      distinct: ['region'],
      select: { region: true },
      where: { region: { not: '' } },
      orderBy: { region: 'asc' }
    }),
    prisma.business.findMany({
      distinct: ['country'],
      select: { country: true },
      where: { country: { not: '' } },
      orderBy: { country: 'asc' }
    })
  ]);
  res.json({
    types: types.map((r) => r.businessType),
    industries: inds.map((r) => r.industry),
    regions: regs.map((r) => r.region),
    countries: ctrs.map((r) => r.country)
  });
});

// GET /api/businesses/:id — single record (teaser unless owned/admin).
router.get('/:id', requireAuth, async (req, res) => {
  const b = await prisma.business.findUnique({
    where: { id: Number(req.params.id) },
    include: { contactPersons: true }
  });
  if (!b) return res.status(404).json({ error: 'Business not found.' });
  const isAdmin = req.user!.role === 'admin';
  const ownedSet = new Set(await getOwnedBusinessIds(req.user!.id));
  res.json(serializeBusiness(b, { owned: ownedSet.has(b.id), isAdmin }));
});

// ---- Admin CRUD --------------------------------------------------------

interface ContactInput {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
}

function businessData(body: Record<string, unknown>) {
  const num = (v: unknown, d: number) => (v === undefined || v === null || v === '' ? d : Number(v));
  const str = (v: unknown, d = '') => (v === undefined || v === null ? d : String(v));
  return {
    businessName: str(body.businessName),
    businessType: str(body.businessType, 'Manufacturer'),
    industry: str(body.industry, 'Other'),
    country: str(body.country),
    location: str(body.location),
    region: str(body.region),
    website: str(body.website),
    email: str(body.email),
    phone: str(body.phone),
    staffCapacity: num(body.staffCapacity, 0),
    revenue: num(body.revenue, 0),
    productOrService: str(body.productOrService),
    description: str(body.description),
    contacts: num(body.contacts, 1),
    verified: num(body.verified, 90),
    price: num(body.price, 49)
  };
}

const contactRows = (list: unknown) =>
  (Array.isArray(list) ? (list as ContactInput[]) : []).map((c) => ({
    name: c.name || '',
    title: c.title || '',
    email: c.email || '',
    phone: c.phone || ''
  }));

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const data = businessData(req.body || {});
  if (!data.businessName.trim()) return res.status(400).json({ error: 'businessName is required.' });

  const created = await prisma.business.create({
    data: { ...data, contactPersons: { create: contactRows(req.body?.contactPersons) } },
    include: { contactPersons: true }
  });
  res.status(201).json(created);
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const data = businessData(req.body || {});

  const updated = await prisma.$transaction(async (tx) => {
    if (req.body?.contactPersons !== undefined) {
      await tx.contactPerson.deleteMany({ where: { businessId: id } });
      await tx.contactPerson.createMany({
        data: contactRows(req.body.contactPersons).map((c) => ({ ...c, businessId: id }))
      });
    }
    return tx.business.update({ where: { id }, data, include: { contactPersons: true } });
  });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.business.delete({ where: { id: Number(req.params.id) } });
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      return res.status(409).json({ error: 'Cannot delete: this record has already been purchased by users.' });
    }
    throw err;
  }
});

export default router;
