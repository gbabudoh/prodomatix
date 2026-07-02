// Pure algorithm library — no Prisma, no Express. All functions are stateless.

// ─── Shared types ────────────────────────────────────────────────────────────

export interface BizDoc {
  id: number;
  businessName: string;
  industry: string;
  businessType: string;
  country: string;
  description: string;
  productOrService: string;
  staffCapacity: number;
  revenue: number;
  price: number;
  verified: number;
  email: string;
  phone: string;
  website: string;
  location: string;
  contactPersons?: unknown[];
}

// ─── 1. TF-IDF Search Ranking ────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return (text || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function buildIDF(docs: string[][]): Map<string, number> {
  const N = docs.length;
  const df = new Map<string, number>();
  for (const doc of docs) {
    for (const term of new Set(doc)) df.set(term, (df.get(term) || 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [term, count] of df) idf.set(term, Math.log((N + 1) / (count + 1)) + 1);
  return idf;
}

function fieldTF(tokens: string[], queryTerms: string[], idf: Map<string, number>): number {
  if (tokens.length === 0) return 0;
  const freq = new Map<string, number>();
  for (const t of tokens) freq.set(t, (freq.get(t) || 0) + 1);
  let score = 0;
  for (const term of queryTerms) {
    score += ((freq.get(term) || 0) / tokens.length) * (idf.get(term) || 0);
  }
  return score;
}

const FIELD_WEIGHTS = { name: 3.5, product: 2.5, industry: 2, type: 1.5, country: 1, description: 1 };

export function tfidfRank<T extends BizDoc>(query: string, businesses: T[]): Array<T & { score: number }> {
  const qTerms = tokenize(query);
  if (!qTerms.length) return businesses.map(b => ({ ...b, score: 0 }));

  const corpus = businesses.map(b =>
    tokenize([b.businessName, b.industry, b.businessType, b.country, b.productOrService, b.description].join(' '))
  );
  const idf = buildIDF(corpus);

  return businesses
    .map(b => {
      const score =
        fieldTF(tokenize(b.businessName),      qTerms, idf) * FIELD_WEIGHTS.name +
        fieldTF(tokenize(b.productOrService),  qTerms, idf) * FIELD_WEIGHTS.product +
        fieldTF(tokenize(b.industry),          qTerms, idf) * FIELD_WEIGHTS.industry +
        fieldTF(tokenize(b.businessType),      qTerms, idf) * FIELD_WEIGHTS.type +
        fieldTF(tokenize(b.country),           qTerms, idf) * FIELD_WEIGHTS.country +
        fieldTF(tokenize(b.description),       qTerms, idf) * FIELD_WEIGHTS.description;
      return { ...b, score };
    })
    .filter(b => b.score > 0)
    .sort((a, b) => b.score - a.score);
}

// ─── 2. Record Completeness Score ────────────────────────────────────────────

const COMPLETENESS_FIELDS: Record<string, number> = {
  businessName: 10, email: 15, phone: 10, website: 8,
  description: 10,  industry: 8, country: 5, location: 4,
  staffCapacity: 6, revenue: 6, productOrService: 8,
};
const COMPLETENESS_MAX =
  Object.values(COMPLETENESS_FIELDS).reduce((a, v) => a + v, 0) + 10 + 8; // + contacts + verified bonuses

export function completenessScore(b: BizDoc): number {
  let earned = 0;
  for (const [field, weight] of Object.entries(COMPLETENESS_FIELDS)) {
    const v = (b as unknown as Record<string, unknown>)[field];
    if (v !== undefined && v !== null && v !== '' && v !== 0) earned += weight;
  }
  if (Array.isArray(b.contactPersons) && b.contactPersons.length > 0) earned += 10;
  if (b.verified >= 80) earned += 8;
  return Math.min(100, Math.round((earned / COMPLETENESS_MAX) * 100));
}

// ─── 3. Cosine Similarity (Similar Suppliers) ────────────────────────────────

const INDUSTRIES = [
  'Food & Beverage','Electronics','Apparel & Textiles','Construction & Materials',
  'Industrial Equipment','Health & Beauty','Automotive','Packaging',
];
const BIZ_TYPES = ['Manufacturer', 'Distributor', 'Wholesaler'];

function oneHot(value: string, opts: string[]): number[] {
  return opts.map(o => (o === value ? 1 : 0));
}
function normalise(v: number, lo: number, hi: number): number {
  return hi === lo ? 0 : (v - lo) / (hi - lo);
}
function dot(a: number[], b: number[]): number { return a.reduce((s, x, i) => s + x * (b[i] ?? 0), 0); }
function mag(v: number[]): number { return Math.sqrt(v.reduce((s, x) => s + x * x, 0)); }
function cosine(a: number[], b: number[]): number {
  const m = mag(a) * mag(b);
  return m === 0 ? 0 : dot(a, b) / m;
}

function bizVector(b: BizDoc, lo: Record<string, number>, hi: Record<string, number>): number[] {
  return [
    ...oneHot(b.industry,      INDUSTRIES),
    ...oneHot(b.businessType,  BIZ_TYPES),
    normalise(b.staffCapacity, lo['staff']   ?? 0, hi['staff']   ?? 1),
    normalise(b.revenue,       lo['revenue'] ?? 0, hi['revenue'] ?? 1),
    normalise(b.price,         lo['price']   ?? 0, hi['price']   ?? 1),
    normalise(b.verified,      0, 100),
  ];
}

export function similarBusinesses<T extends BizDoc>(
  target: T, all: T[], topN = 5
): Array<T & { similarity: number }> {
  const lo = {
    staff:   Math.min(...all.map(b => b.staffCapacity)),
    revenue: Math.min(...all.map(b => b.revenue)),
    price:   Math.min(...all.map(b => b.price)),
  };
  const hi = {
    staff:   Math.max(...all.map(b => b.staffCapacity)),
    revenue: Math.max(...all.map(b => b.revenue)),
    price:   Math.max(...all.map(b => b.price)),
  };
  const tv = bizVector(target, lo, hi);
  return all
    .filter(b => b.id !== target.id)
    .map(b => ({ ...b, similarity: cosine(tv, bizVector(b, lo, hi)) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}

// ─── 4. RFM Scoring ──────────────────────────────────────────────────────────

export interface RFMInput {
  userId: number; email: string; name: string;
  lastPurchase: Date | null; purchaseCount: number; totalSpend: number;
}
export interface RFMResult extends RFMInput {
  recencyDays: number; r: number; f: number; m: number; rfm: number; segment: string;
}

function quintile(sorted: number[], value: number, higherIsBetter: boolean): number {
  if (sorted.length === 0) return 3;
  const idx = sorted.findIndex(v => v >= value);
  const pct = idx === -1 ? 1 : idx / sorted.length;
  const score = Math.min(5, Math.max(1, Math.ceil(pct * 5)));
  return higherIsBetter ? score : 6 - score;
}

const RFM_SEGMENTS: Array<{ label: string; min: number; colour: string }> = [
  { label: 'Champions',  min: 13, colour: '#16a34a' },
  { label: 'Loyal',      min: 10, colour: '#2e54d4' },
  { label: 'At Risk',    min: 7,  colour: '#d97706' },
  { label: 'Hibernating',min: 4,  colour: '#9333ea' },
  { label: 'Lost',       min: 0,  colour: '#dc2626' },
];

export function rfmColour(segment: string): string {
  return RFM_SEGMENTS.find(s => s.label === segment)?.colour ?? '#64748b';
}

export function rfmScore(users: RFMInput[]): RFMResult[] {
  const now = Date.now();
  const recencies = users.map(u =>
    u.lastPurchase ? (now - new Date(u.lastPurchase).getTime()) / 86_400_000 : 9999
  );
  const sR = [...recencies].sort((a, b) => a - b);
  const sF = [...users.map(u => u.purchaseCount)].sort((a, b) => a - b);
  const sM = [...users.map(u => u.totalSpend)].sort((a, b) => a - b);

  return users.map((u, i) => {
    const rec = recencies[i] ?? 9999;
    const r   = quintile(sR, rec,             false);
    const f   = quintile(sF, u.purchaseCount, true);
    const m   = quintile(sM, u.totalSpend,    true);
    const rfm = r + f + m;
    const seg = RFM_SEGMENTS.find(s => rfm >= s.min) ?? RFM_SEGMENTS[RFM_SEGMENTS.length - 1]!;
    return { ...u, recencyDays: Math.round(rec), r, f, m, rfm, segment: seg.label };
  }).sort((a, b) => b.rfm - a.rfm);
}

// ─── 5. Duplicate Detection (Jaccard) ────────────────────────────────────────

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

export interface DuplicatePair {
  a: { id: number; businessName: string; country: string; email: string };
  b: { id: number; businessName: string; country: string; email: string };
  nameScore: number; emailMatch: boolean; confidence: number;
}

export function detectDuplicates(businesses: BizDoc[], threshold = 0.4): DuplicatePair[] {
  const pairs: DuplicatePair[] = [];
  for (let i = 0; i < businesses.length; i++) {
    for (let j = i + 1; j < businesses.length; j++) {
      const ra = businesses[i]!;
      const rb = businesses[j]!;
      const tA = new Set(tokenize(ra.businessName));
      const tB = new Set(tokenize(rb.businessName));
      const nameScore   = jaccard(tA, tB);
      const emailMatch  = !!(ra.email && rb.email && ra.email.toLowerCase() === rb.email.toLowerCase());
      const confidence  = emailMatch ? Math.max(nameScore, 0.85) : nameScore;
      if (confidence >= threshold) {
        pairs.push({
          a: { id: ra.id, businessName: ra.businessName, country: ra.country, email: ra.email },
          b: { id: rb.id, businessName: rb.businessName, country: rb.country, email: rb.email },
          nameScore: Math.round(nameScore * 100) / 100,
          emailMatch,
          confidence: Math.round(confidence * 100) / 100,
        });
      }
    }
  }
  return pairs.sort((x, y) => y.confidence - x.confidence);
}

// ─── 6. Z-Score Anomaly Detection ────────────────────────────────────────────

function mean(vals: number[]): number { return vals.length === 0 ? 0 : vals.reduce((a, b) => a + b, 0) / vals.length; }
function std(vals: number[], m: number): number {
  return Math.sqrt(vals.reduce((a, v) => a + (v - m) ** 2, 0) / (vals.length || 1));
}
function zScore(v: number, m: number, s: number): number { return s === 0 ? 0 : (v - m) / s; }

export interface UserActivity {
  userId: number; email: string; name: string;
  purchaseCount: number; downloadCount: number; accountAgeDays: number;
}
export interface AnomalyResult extends UserActivity {
  purchasesPerDay: number; downloadsPerDay: number;
  purchaseZ: number; downloadZ: number; flagged: boolean; reasons: string[];
}

export function detectAnomalies(users: UserActivity[], threshold = 2): AnomalyResult[] {
  const pRates = users.map(u => u.accountAgeDays > 0 ? u.purchaseCount / u.accountAgeDays : u.purchaseCount);
  const dRates = users.map(u => u.accountAgeDays > 0 ? u.downloadCount / u.accountAgeDays : u.downloadCount);

  const pM = mean(pRates), pS = std(pRates, pM);
  const dM = mean(dRates), dS = std(dRates, dM);

  return users.map((u, i) => {
    const pr = pRates[i] ?? 0;
    const dr = dRates[i] ?? 0;
    const pZ = zScore(pr, pM, pS);
    const dZ = zScore(dr, dM, dS);
    const reasons: string[] = [];
    if (pZ > threshold) reasons.push(`Purchase rate ${pZ.toFixed(1)}σ above avg`);
    if (dZ > threshold) reasons.push(`Download rate ${dZ.toFixed(1)}σ above avg`);
    return {
      ...u,
      purchasesPerDay: +pr.toFixed(3),
      downloadsPerDay: +dr.toFixed(3),
      purchaseZ: +pZ.toFixed(2),
      downloadZ: +dZ.toFixed(2),
      flagged: reasons.length > 0,
      reasons,
    };
  }).sort((a, b) => (b.flagged ? 1 : 0) - (a.flagged ? 1 : 0) || b.purchaseZ - a.purchaseZ);
}

// ─── 7. Collaborative Filtering ──────────────────────────────────────────────

export interface PurchaseRecord { userId: number; businessIds: number[]; }

export function collaborativeRecommend(
  targetUserId: number,
  purchases: PurchaseRecord[],
  topN = 5
): number[] {
  const targetSet = new Set(purchases.find(p => p.userId === targetUserId)?.businessIds || []);
  if (targetSet.size === 0) return [];

  const scores = new Map<number, number>();
  for (const other of purchases) {
    if (other.userId === targetUserId) continue;
    const otherSet = new Set(other.businessIds);
    const inter  = [...targetSet].filter(id => otherSet.has(id)).length;
    const union  = new Set([...targetSet, ...otherSet]).size;
    const sim    = union === 0 ? 0 : inter / union;
    if (sim === 0) continue;
    for (const id of other.businessIds) {
      if (!targetSet.has(id)) scores.set(id, (scores.get(id) || 0) + sim);
    }
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([id]) => id);
}
