// Seeds the admin + demo users and the supplier catalogue.
// Run with: npm run db:seed
//
// NOTE: this resets the catalogue (and the test purchases that reference it) in
// the prodomatix_app schema only. User accounts are preserved (upserted).
import bcrypt from 'bcryptjs';
import { prisma } from './prisma.ts';
import { config } from '../config.ts';
import { SEED_BUSINESSES } from './seed-data.ts';

async function seedAdmin() {
  const { email, password, name } = config.seedAdmin;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { role: 'admin' },
    create: { email: email.toLowerCase(), passwordHash, name, role: 'admin', freeCredits: config.freeDownloadCredits }
  });
  console.log(`✓ Admin ready: ${email} / ${password}`);
}

async function seedDemo() {
  const { email, password, name } = config.seedDemo;
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { freeCredits: config.freeDownloadCredits },
    create: { email: email.toLowerCase(), passwordHash, name, role: 'user', freeCredits: config.freeDownloadCredits }
  });
  console.log(`✓ Demo user ready: ${email} / ${password}`);
}

async function seedBusinesses() {
  // Clear the catalogue and any purchases that point at it (test data only).
  await prisma.purchaseItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.contactPerson.deleteMany();
  await prisma.business.deleteMany();

  for (const b of SEED_BUSINESSES) {
    await prisma.business.create({
      data: {
        businessName: b.businessName,
        businessType: b.businessType,
        industry: b.industry,
        country: b.country,
        location: b.location,
        region: b.region,
        website: b.website,
        email: b.email,
        phone: b.phone,
        staffCapacity: b.staffCapacity,
        revenue: b.revenue,
        productOrService: b.productOrService,
        description: b.description,
        contacts: b.contacts,
        verified: b.verified,
        price: b.price,
        contactPersons: { create: b.contactPersons }
      }
    });
  }
  console.log(`✓ Seeded ${SEED_BUSINESSES.length} suppliers.`);
}

async function main() {
  await seedAdmin();
  await seedDemo();
  await seedBusinesses();
  console.log('✓ Seed complete.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
