import { db } from "@/db";
import { products, ratings } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get market-wide statistics
    const [productStats] = await db
      .select({
        totalProducts: sql<number>`COUNT(*)`,
        avgScore: sql<number>`ROUND(AVG(CAST(current_price AS DECIMAL)), 2)`,
        totalRatings: sql<number>`SUM(total_ratings)`,
        gainers: sql<number>`SUM(CASE WHEN CAST(price_change AS DECIMAL) > 0 THEN 1 ELSE 0 END)`,
        losers: sql<number>`SUM(CASE WHEN CAST(price_change AS DECIMAL) < 0 THEN 1 ELSE 0 END)`,
      })
      .from(products);

    // Get today's trading volume
    const [volumeStats] = await db
      .select({
        todayVolume: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(sql`DATE(created_at) = CURRENT_DATE`);

    const sentiment =
      productStats.gainers > productStats.losers
        ? "Bullish"
        : productStats.gainers < productStats.losers
        ? "Bearish"
        : "Neutral";

    return NextResponse.json({
      totalProducts: productStats.totalProducts || 0,
      marketIndex: productStats.avgScore || 0,
      totalRatings: productStats.totalRatings || 0,
      todayVolume: volumeStats.todayVolume || 0,
      gainers: productStats.gainers || 0,
      losers: productStats.losers || 0,
      sentiment,
    });
  } catch (error) {
    console.error("Failed to fetch market stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch market statistics" },
      { status: 500 }
    );
  }
}
