import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { ratings, products } from "@/db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET - Fetch user's ratings
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    // Get user's ratings with product info
    const userRatings = await db
      .select({
        id: ratings.id,
        productId: ratings.productId,
        productName: products.name,
        productTicker: products.ticker,
        productCurrentPrice: products.currentPrice,
        productPriceChange: products.priceChange,
        tenWordStatement: ratings.tenWordStatement,
        satisfaction: ratings.satisfaction,
        quality: ratings.quality,
        feel: ratings.feel,
        trendy: ratings.trendy,
        speculation: ratings.speculation,
        weightedScore: ratings.weightedScore,
        createdAt: ratings.createdAt,
      })
      .from(ratings)
      .innerJoin(products, eq(ratings.productId, products.id))
      .where(eq(ratings.userId, user.id))
      .orderBy(desc(ratings.createdAt))
      .limit(limit);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(eq(ratings.userId, user.id));

    // Get average score
    const [avgResult] = await db
      .select({ avg: sql<number>`avg(${ratings.weightedScore})` })
      .from(ratings)
      .where(eq(ratings.userId, user.id));

    // Get this month's count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [monthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(ratings)
      .where(
        and(
          eq(ratings.userId, user.id),
          gte(ratings.createdAt, startOfMonth)
        )
      );

    return NextResponse.json({
      ratings: userRatings,
      total: Number(countResult?.count) || 0,
      avgScore: Number(avgResult?.avg) || 0,
      thisMonth: Number(monthResult?.count) || 0,
    });
  } catch (error) {
    console.error("Failed to fetch ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
