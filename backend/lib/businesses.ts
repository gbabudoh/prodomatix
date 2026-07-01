// Shared business queries (Prisma) + the preview/full serializer that enforces
// "details locked until purchased" at the API layer.
import { prisma } from '../db/prisma.ts';
import type { Business, ContactPerson } from '../generated/prisma/client.ts';

export type BusinessWithContacts = Business & { contactPersons: ContactPerson[] };

// Fields safe to expose for a record the user does NOT own (the teaser).
export interface BusinessPreview {
  id: number;
  businessName: string;
  businessType: string;
  industry: string;
  country: string;
  region: string;
  verified: number;
  price: number;
  createdAt: Date;
  owned: boolean;
  locked: boolean;
}

// Decide what shape to send. Admins and owners get everything; everyone else
// gets the teaser only. This is the real protection — the UI never receives
// locked fields for records the user hasn't bought.
export function serializeBusiness(
  b: BusinessWithContacts,
  { owned, isAdmin }: { owned: boolean; isAdmin: boolean }
): BusinessWithContacts & { owned: boolean; locked: boolean } | BusinessPreview {
  if (owned || isAdmin) {
    return { ...b, owned, locked: false };
  }
  return {
    id: b.id,
    businessName: b.businessName,
    businessType: b.businessType,
    industry: b.industry,
    country: b.country,
    region: b.region,
    verified: b.verified,
    price: b.price,
    createdAt: b.createdAt,
    owned: false,
    locked: true
  };
}

// Fetch businesses by id (with contacts), preserving the input order.
export async function getBusinessesByIds(ids: number[]): Promise<BusinessWithContacts[]> {
  if (!ids.length) return [];
  const rows = await prisma.business.findMany({
    where: { id: { in: ids } },
    include: { contactPersons: true }
  });
  const byId = new Map(rows.map((b) => [b.id, b]));
  return ids.map((id) => byId.get(id)).filter((b): b is BusinessWithContacts => Boolean(b));
}

// Set of business ids a user already owns (across all past purchases).
export async function getOwnedBusinessIds(userId: number): Promise<number[]> {
  const rows = await prisma.purchaseItem.findMany({
    where: { purchase: { userId } },
    select: { businessId: true },
    distinct: ['businessId']
  });
  return rows.map((r) => r.businessId);
}
