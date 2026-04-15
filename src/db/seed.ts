import { db } from "./index";
import { products, ratings, priceHistory, users } from "./schema";
import { calculateWeightedScore } from "../lib/calculate-score";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// 10-word statements for seeding
const statements = [
  "This product changed the way I handle my daily tasks.",
  "Absolutely incredible quality and the design feels extremely premium now.",
  "Market leading features that keep me coming back every week.",
  "I highly recommend this service for anyone seeking top value.",
  "The trendiest design in the industry with a solid feel.",
  "Future updates look promising and I am speculating high growth.",
  "Simple clean interface that delivers exactly what it promised us.",
  "Best in class performance and the support team is great.",
  "I love how this brand represents luxury and high quality.",
  "Worth every penny for the satisfaction and feel it provides.",
  "Could be better but overall a solid product for everyone.",
  "Not impressed with the quality but the price is fair.",
  "Amazing innovation that sets new standards in the entire market.",
  "The feel is premium but functionality needs some more work.",
  "Exceeded my expectations in every single way possible today honestly.",
  "Good value for money but nothing special about this product.",
  "Revolutionary technology that will change how we do everything daily.",
  "Decent product but competitors offer better options at similar prices.",
  "The quality speaks for itself and I am very satisfied.",
  "Trendy and stylish but lacks substance in the core features.",
];

// Product data for seeding
const productData = [
  { name: "Apple iPhone 16", ticker: "AAPL", category: "Electronics" },
  { name: "Tesla Model S", ticker: "TSLA", category: "Automotive" },
  { name: "Nike Air Max", ticker: "NKE", category: "Fashion" },
  { name: "Starbucks Pumpkin Latte", ticker: "SBUX", category: "Food & Beverage" },
  { name: "Sony PlayStation 5", ticker: "SNY", category: "Gaming" },
  { name: "Dyson V15 Vacuum", ticker: "DYSN", category: "Home" },
  { name: "Spotify Premium", ticker: "SPOT", category: "Entertainment" },
  { name: "Lululemon Align Pants", ticker: "LULU", category: "Fashion" },
  { name: "Samsung Galaxy S24", ticker: "SMSN", category: "Electronics" },
  { name: "Amazon Prime", ticker: "AMZN", category: "Entertainment" },
  { name: "Netflix Standard", ticker: "NFLX", category: "Entertainment" },
  { name: "Peloton Bike+", ticker: "PTON", category: "Health" },
  { name: "Airbnb Experience", ticker: "ABNB", category: "Travel" },
  { name: "Uber Black", ticker: "UBER", category: "Travel" },
  { name: "McDonald's Big Mac", ticker: "MCD", category: "Food & Beverage" },
  { name: "Coca-Cola Classic", ticker: "KO", category: "Food & Beverage" },
  { name: "Adidas Ultraboost", ticker: "ADID", category: "Fashion" },
  { name: "Microsoft Surface Pro", ticker: "MSFT", category: "Electronics" },
  { name: "Google Pixel 8", ticker: "GOOG", category: "Electronics" },
  { name: "BMW i4", ticker: "BMW", category: "Automotive" },
  { name: "Porsche Taycan", ticker: "PRSC", category: "Automotive" },
  { name: "Rolex Submariner", ticker: "ROLX", category: "Fashion" },
  { name: "Louis Vuitton Neverfull", ticker: "LVMH", category: "Fashion" },
  { name: "Whole Foods Market", ticker: "WFM", category: "Food & Beverage" },
  { name: "Chipotle Burrito Bowl", ticker: "CMG", category: "Food & Beverage" },
  { name: "Nintendo Switch 2", ticker: "NTDO", category: "Gaming" },
  { name: "Xbox Series X", ticker: "XBOX", category: "Gaming" },
  { name: "Steam Deck OLED", ticker: "STEM", category: "Gaming" },
  { name: "Bose QuietComfort", ticker: "BOSE", category: "Electronics" },
  { name: "Apple AirPods Pro", ticker: "APOD", category: "Electronics" },
  { name: "Oura Ring Gen 3", ticker: "OURA", category: "Health" },
  { name: "Whoop 4.0", ticker: "WHOP", category: "Health" },
  { name: "Theragun Pro", ticker: "THER", category: "Health" },
  { name: "Delta Airlines First", ticker: "DAL", category: "Travel" },
  { name: "Marriott Bonvoy", ticker: "MAR", category: "Travel" },
  { name: "Hilton Honors", ticker: "HLT", category: "Travel" },
  { name: "Disney+ Bundle", ticker: "DIS", category: "Entertainment" },
  { name: "HBO Max", ticker: "HBO", category: "Entertainment" },
  { name: "YouTube Premium", ticker: "YT", category: "Entertainment" },
  { name: "Roomba j7+", ticker: "IRBT", category: "Home" },
  { name: "Nest Thermostat", ticker: "NEST", category: "Home" },
  { name: "Ring Doorbell Pro", ticker: "RING", category: "Home" },
  { name: "Sonos Arc", ticker: "SONO", category: "Home" },
  { name: "KitchenAid Mixer", ticker: "KTCH", category: "Home" },
  { name: "Vitamix Blender", ticker: "VTMX", category: "Home" },
  { name: "Patagonia Nano Puff", ticker: "PTGN", category: "Fashion" },
  { name: "Canada Goose Parka", ticker: "GOOS", category: "Fashion" },
  { name: "Allbirds Tree Runners", ticker: "BIRD", category: "Fashion" },
  { name: "Warby Parker Glasses", ticker: "WRBY", category: "Fashion" },
  { name: "Beyond Meat Burger", ticker: "BYND", category: "Food & Beverage" },
];

const countryCodes = ["US", "GB", "JP", "FR", "DE", "CA", "AU", "BR", "IN", "KR", "NG", "MX"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  console.log("🚀 Initializing Market Liquidity...\n");

  try {
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await db.delete(ratings);
    await db.delete(priceHistory);
    await db.delete(products);

    // Create test users
    console.log("👤 Creating test users...\n");
    
    const passwordHash = await bcrypt.hash("password123", 12);
    const consumerDemoHash = await bcrypt.hash("consumeracess", 12);
    const businessDemoHash = await bcrypt.hash("businessacess", 12);
    
    // Create a test owner
    const [testOwner] = await db
      .insert(users)
      .values({
        email: "owner@test.com",
        passwordHash,
        name: "Test Business",
        role: "owner",
        countryCode: "US",
        isVerified: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: "Test Business", role: "owner" },
      })
      .returning();

    // Create a test consumer
    const [testConsumer] = await db
      .insert(users)
      .values({
        email: "consumer@test.com",
        passwordHash,
        name: "Test Consumer",
        role: "consumer",
        countryCode: "US",
        isVerified: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: "Test Consumer", role: "consumer" },
      })
      .returning();

    // Create demo consumer account
    await db
      .insert(users)
      .values({
        email: "cosumer@demo.com",
        passwordHash: consumerDemoHash,
        name: "Demo Consumer",
        role: "consumer",
        countryCode: "US",
        isVerified: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: "Demo Consumer", role: "consumer", passwordHash: consumerDemoHash },
      });

    // Create demo business account
    await db
      .insert(users)
      .values({
        email: "busines@demo.com",
        passwordHash: businessDemoHash,
        name: "Demo Business",
        role: "owner",
        countryCode: "US",
        isVerified: true,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { name: "Demo Business", role: "owner", passwordHash: businessDemoHash },
      });

    console.log(`  ✓ Created owner: ${testOwner.email}`);
    console.log(`  ✓ Created consumer: ${testConsumer.email}`);
    console.log(`  ✓ Created demo consumer: cosumer@demo.com`);
    console.log(`  ✓ Created demo business: busines@demo.com`);
    console.log(`  ℹ Test password: password123`);
    console.log(`  ℹ Demo consumer password: consumeracess`);
    console.log(`  ℹ Demo business password: businessacess\n`);

    console.log("📦 Creating 50 products...\n");

    for (let i = 0; i < productData.length; i++) {
      const p = productData[i];
      const isPromoted = i % 10 === 0; // Every 10th product is promoted

      // Insert product - assign first 5 to test owner, rest to system
      const [product] = await db
        .insert(products)
        .values({
          name: p.name,
          ticker: p.ticker,
          category: p.category,
          description: `Premium ${p.category.toLowerCase()} product with exceptional quality.`,
          ownerId: i < 5 ? testOwner.id : testOwner.id, // All products owned by test owner for demo
          currentPrice: "5.00",
          previousPrice: "5.00",
          priceChange: "0.00",
          priceChangePercent: "0.00",
          totalRatings: 0,
          status: i < 5 ? "ipo" : "active",
          isAdflowPromoted: isPromoted,
          adflowExpiresAt: isPromoted
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            : null,
        })
        .returning();

      // Generate 10-20 ratings per product
      const numRatings = randomInt(10, 20);
      let totalScore = 0;

      for (let j = 0; j < numRatings; j++) {
        // Generate random but realistic indicator scores
        const baseScore = randomInt(5, 9); // Bias towards positive
        const variance = 2;

        const indicators = {
          satisfaction: Math.min(10, Math.max(1, baseScore + randomInt(-variance, variance))),
          quality: Math.min(10, Math.max(1, baseScore + randomInt(-variance, variance))),
          feel: Math.min(10, Math.max(1, baseScore + randomInt(-variance, variance))),
          trendy: Math.min(10, Math.max(1, baseScore + randomInt(-variance, variance))),
          speculation: Math.min(10, Math.max(1, baseScore + randomInt(-variance, variance))),
        };

        const weightedScore = calculateWeightedScore(indicators);
        totalScore += weightedScore;

        // Assign some ratings to the test consumer
        const userId = j < 3 ? testConsumer.id : null;

        await db.insert(ratings).values({
          productId: product.id,
          userId,
          countryCode: randomElement(countryCodes),
          tenWordStatement: randomElement(statements),
          ...indicators,
          weightedScore: weightedScore.toFixed(2),
          createdAt: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000),
        });
      }

      // Calculate final product score
      const avgScore = totalScore / numRatings;
      const previousPrice = 5 + (Math.random() - 0.5) * 2;
      const priceChange = avgScore - previousPrice;
      const priceChangePercent = (priceChange / previousPrice) * 100;

      // Update product with calculated scores
      await db
        .update(products)
        .set({
          currentPrice: avgScore.toFixed(2),
          previousPrice: previousPrice.toFixed(2),
          priceChange: priceChange.toFixed(2),
          priceChangePercent: priceChangePercent.toFixed(2),
          totalRatings: numRatings,
          hasDividendBadge: avgScore >= 8.0 && numRatings >= 15,
          dividendStreakDays: avgScore >= 8.0 ? randomInt(30, 90) : randomInt(0, 29),
        })
        .where(eq(products.id, product.id));

      // Generate price history (30 days)
      for (let day = 29; day >= 0; day--) {
        const historicalPrice = avgScore + (Math.random() - 0.5) * 1.5;
        await db.insert(priceHistory).values({
          productId: product.id,
          price: Math.max(1, Math.min(10, historicalPrice)).toFixed(2),
          volume: randomInt(5, 50),
          recordedAt: new Date(Date.now() - day * 24 * 60 * 60 * 1000),
        });
      }

      console.log(`  ✓ ${p.ticker} - ${p.name} (Score: ${avgScore.toFixed(2)}, Ratings: ${numRatings})`);
    }

    console.log("\n✅ Market Open: 50 Companies and 500+ Trades Synced.");
    console.log("🎯 The Trading Floor is ready!");
    console.log("\n📝 Test Accounts:");
    console.log("   Owner: owner@test.com / password123");
    console.log("   Consumer: consumer@test.com / password123");
    console.log("\n📝 Demo Accounts:");
    console.log("   Consumer: cosumer@demo.com / consumeracess");
    console.log("   Business: busines@demo.com / businessacess\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
