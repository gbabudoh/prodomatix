import { db } from "./index";
import { brands, products } from "./schema";

async function seed() {
  console.log("Seeding initial data...");

  // Create a brand
  const [brand] = await db
    .insert(brands)
    .values({
      name: "Acme Corp",
      website: "https://acme.com",
    })
    .returning();

  console.log(`Created brand: ${brand.name} (${brand.id})`);

  // Create a product
  const [product] = await db
    .insert(products)
    .values({
      brandId: brand.id,
      name: "Super Vacuum X1",
      sku: "VAC-X1",
      description: "The most powerful vacuum in the Acme lineup.",
    })
    .returning();

  console.log(`Created product: ${product.name} (${product.id})`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
