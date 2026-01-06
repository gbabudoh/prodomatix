import { db } from "./lib/db";
import { brands, products, reviews, retailers } from "./lib/db/schema";

async function seed() {
  console.log("Seeding database...");

  // 1. Create Demo Brand
  const [brand] = await db
    .insert(brands)
    .values({
      name: "Prodomatix Demo",
      website: "https://prodomatix.com",
    })
    .returning();
  console.log("Created Brand:", brand.id);

  // 2. Create Demo Product
  await db.insert(products).values({
    id: "5ca6dd48-7359-4221-9065-aba57099f696",
    brandId: brand.id,
    name: "Ultra Widget Pro",
    sku: "UWP-001",
    description: "The ultimate widget for all your needs.",
    imageUrl: "https://placehold.co/400x400/333/fff?text=Widget",
  });
  console.log("Created Product: 5ca6dd48-7359-4221-9065-aba57099f696");

  // 3. Create Retailers
  const retailerData = await db
    .insert(retailers)
    .values([
      { name: "Amazon", website: "https://amazon.com" },
      { name: "Best Buy", website: "https://bestbuy.com" },
      { name: "Direct Site", website: "https://prodomatix.com" },
    ])
    .returning();

  const rAmazon = retailerData.find(r => r.name === "Amazon");
  const rBestBuy = retailerData.find(r => r.name === "Best Buy");
  const rDirect = retailerData.find(r => r.name === "Direct Site");

  // 4. Create Demo Reviews (Distributed)
  await db.insert(reviews).values([
    {
      productId: "5ca6dd48-7359-4221-9065-aba57099f696",
      retailerId: rAmazon?.id,
      rating: 5,
      title: "Amazing product!",
      content: "This widget exceeded all my expectations. Build quality is top notch.",
      reviewerName: "John D.",
      status: "approved",
      sentiment: "positive",
      isVerified: true,
      tags: "Quality,Build",
    },
    {
      productId: "5ca6dd48-7359-4221-9065-aba57099f696",
      retailerId: rBestBuy?.id,
      rating: 4,
      title: "Great value",
      content: "Good bang for your buck. Shipping was fast too.",
      reviewerName: "Sarah M.",
      status: "approved",
      sentiment: "positive",
      isVerified: false,
      tags: "Price,Shipping",
    },
    {
      productId: "5ca6dd48-7359-4221-9065-aba57099f696",
      retailerId: rDirect?.id,
      rating: 3,
      title: "OK product",
      content: "It works, but the instructions could be clearer.",
      reviewerName: "Mike P.",
      status: "approved",
      sentiment: "neutral",
      isVerified: true,
      tags: "Usability",
    },
    {
      productId: "5ca6dd48-7359-4221-9065-aba57099f696",
      retailerId: rAmazon?.id,
      rating: 4,
      title: "Good battery",
      content: "Battery life is decent, but charging is slow.",
      reviewerName: "Alex K.",
      status: "approved",
      sentiment: "neutral",
      isVerified: true,
      tags: "Battery,Performance",
    },
  ]);

  console.log("Created 3 demo reviews.");
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
