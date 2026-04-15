import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, ratings } from "@/db/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET - Fetch owner's products with stats
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "owner" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get owner's products
    const ownerProducts = await db
      .select()
      .from(products)
      .where(eq(products.ownerId, user.id))
      .orderBy(desc(products.createdAt));

    // Calculate stats
    const totalProducts = ownerProducts.length;
    const totalRatings = ownerProducts.reduce(
      (sum, p) => sum + (p.totalRatings || 0),
      0
    );
    const avgScore =
      totalProducts > 0
        ? ownerProducts.reduce(
            (sum, p) => sum + parseFloat(p.currentPrice || "5"),
            0
          ) / totalProducts
        : 0;
    const dividendBadges = ownerProducts.filter((p) => p.hasDividendBadge).length;

    // Get weekly changes (simplified - would need historical data for accurate calculation)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Count new products this week
    const newProductsThisWeek = ownerProducts.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= oneWeekAgo
    ).length;

    // Count new ratings this week for owner's products
    const productIds = ownerProducts.map((p) => p.id);
    let newRatingsThisWeek = 0;

    if (productIds.length > 0) {
      const [ratingsCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(ratings)
        .where(
          and(
            sql`${ratings.productId} IN (${sql.join(productIds.map(id => sql`${id}`), sql`, `)})`,
            gte(ratings.createdAt, oneWeekAgo)
          )
        );
      newRatingsThisWeek = Number(ratingsCount?.count) || 0;
    }

    return NextResponse.json({
      products: ownerProducts,
      stats: {
        totalProducts,
        totalRatings,
        avgScore,
        dividendBadges,
        weeklyChange: {
          products: newProductsThisWeek,
          ratings: newRatingsThisWeek,
          score: 0, // Would need historical data
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch owner products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "owner" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, ticker, description, category, imageUrl } = await request.json();

    // Validate required fields
    if (!name || !ticker) {
      return NextResponse.json(
        { error: "Name and ticker are required" },
        { status: 400 }
      );
    }

    // Check if ticker already exists
    const [existingTicker] = await db
      .select()
      .from(products)
      .where(eq(products.ticker, ticker.toUpperCase()))
      .limit(1);

    if (existingTicker) {
      return NextResponse.json(
        { error: "Ticker already exists" },
        { status: 400 }
      );
    }

    // Create the product
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        ticker: ticker.toUpperCase(),
        description: description || null,
        category: category || "General",
        imageUrl: imageUrl || null,
        ownerId: user.id,
        currentPrice: "5.00", // IPO price
        previousPrice: "5.00",
        priceChange: "0.00",
        priceChangePercent: "0.00",
        totalRatings: 0,
        status: "ipo",
      })
      .returning();

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
