import { db } from "../src/db";
import { products, users } from "../src/db/schema";
import { eq } from "drizzle-orm";

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    ticker: "IPHN",
    description: "Apple's flagship smartphone with titanium design and A17 Pro chip",
    category: "Technology",
    itemType: "product" as const,
    brandName: "Apple",
  },
  {
    name: "Tesla Model 3",
    ticker: "TSL3",
    description: "Electric sedan with autopilot and long-range battery",
    category: "Automotive",
    itemType: "product" as const,
    brandName: "Tesla",
  },
  {
    name: "Netflix Streaming",
    ticker: "NFLX",
    description: "Premium streaming service with original content",
    category: "Entertainment",
    itemType: "service" as const,
    brandName: "Netflix",
  },
  {
    name: "Nike Air Max",
    ticker: "NIKM",
    description: "Iconic sneakers with visible Air cushioning",
    category: "Fashion",
    itemType: "product" as const,
    brandName: "Nike",
  },
  {
    name: "Spotify Premium",
    ticker: "SPOT",
    description: "Music streaming service with millions of songs",
    category: "Entertainment",
    itemType: "service" as const,
    brandName: "Spotify",
  },
  {
    name: "Samsung Galaxy S24",
    ticker: "GLXY",
    description: "Android flagship with AI features and stunning display",
    category: "Technology",
    itemType: "product" as const,
    brandName: "Samsung",
  },
  {
    name: "Starbucks Coffee",
    ticker: "SBUX",
    description: "Premium coffee experience with global presence",
    category: "Food & Beverage",
    itemType: "product" as const,
    brandName: "Starbucks",
  },
  {
    name: "Amazon Prime",
    ticker: "AMPZ",
    description: "Membership service with fast shipping and streaming",
    category: "Retail",
    itemType: "service" as const,
    brandName: "Amazon",
  },
  {
    name: "PlayStation 5",
    ticker: "PS5X",
    description: "Next-gen gaming console with incredible graphics",
    category: "Entertainment",
    itemType: "product" as const,
    brandName: "Sony",
  },
  {
    name: "Uber Rides",
    ticker: "UBER",
    description: "On-demand transportation service",
    category: "Travel",
    itemType: "service" as const,
    brandName: "Uber",
  },
];

async function seedProducts() {
  try {
    console.log("🌱 Starting product seed...\n");

    // First, find or create a demo business owner
    let [owner] = await db
      .select()
      .from(users)
      .where(eq(users.email, "busines@demo.com"))
      .limit(1);

    if (!owner) {
      console.log("⚠️  Demo business owner not found. Please register first at /register");
      console.log("   Email: busines@demo.com");
      console.log("   Password: businessacess");
      process.exit(1);
    }

    console.log(`✅ Found owner: ${owner.name} (ID: ${owner.id})\n`);

    // Check existing products
    const existingProducts = await db.select().from(products);
    console.log(`📦 Existing products: ${existingProducts.length}\n`);

    // Insert sample products
    let created = 0;
    for (const product of sampleProducts) {
      // Check if ticker already exists
      const [existing] = await db
        .select()
        .from(products)
        .where(eq(products.ticker, product.ticker))
        .limit(1);

      if (existing) {
        console.log(`⏭️  Skipping ${product.ticker} - already exists`);
        continue;
      }

      // Generate a random starting price between 5.0 and 8.5
      const startPrice = (5 + Math.random() * 3.5).toFixed(2);
      const priceChange = (Math.random() * 1 - 0.5).toFixed(2);

      await db.insert(products).values({
        name: product.name,
        ticker: product.ticker,
        description: product.description,
        category: product.category,
        itemType: product.itemType,
        brandName: product.brandName,
        ownerId: owner.id,
        currentPrice: startPrice,
        previousPrice: (parseFloat(startPrice) - parseFloat(priceChange)).toFixed(2),
        priceChange: priceChange,
        priceChangePercent: ((parseFloat(priceChange) / parseFloat(startPrice)) * 100).toFixed(2),
        status: "active",
        totalRatings: Math.floor(Math.random() * 500) + 50,
        hasDividendBadge: Math.random() > 0.7,
        dividendStreakDays: Math.floor(Math.random() * 30),
      });

      console.log(`✅ Created: ${product.ticker} - ${product.name}`);
      created++;
    }

    console.log(`\n🎉 Seed complete! Created ${created} new products.`);
    console.log(`📊 Total products now: ${existingProducts.length + created}`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }

  process.exit(0);
}

seedProducts();
