import { db } from "@/db";
import { products, ratings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { calculateWeightedScore } from "@/lib/calculate-score";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productId,
      statement,
      countryCode,
      satisfaction,
      quality,
      feel,
      trendy,
      speculation,
      userId,
    } = body;

    // Server-side 10-word validation
    const words = statement.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0 || words.length > 10) {
      return NextResponse.json(
        { error: "Statement must be between 1 and 10 words." },
        { status: 400 }
      );
    }

    // Validate indicators are 1-10
    const indicators = { satisfaction, quality, feel, trendy, speculation };
    for (const [key, value] of Object.entries(indicators)) {
      if (typeof value !== "number" || value < 1 || value > 10) {
        return NextResponse.json(
          { error: `${key} must be between 1 and 10.` },
          { status: 400 }
        );
      }
    }

    // Calculate weighted score for this rating
    const weightedScore = calculateWeightedScore(indicators);

    // Insert the rating
    const [newRating] = await db
      .insert(ratings)
      .values({
        productId,
        userId: userId || null,
        countryCode: countryCode || "US",
        tenWordStatement: statement,
        satisfaction,
        quality,
        feel,
        trendy,
        speculation,
        weightedScore: weightedScore.toString(),
      })
      .returning();

    // Update product score (calculate new average)
    const [scoreResult] = await db
      .select({
        avgScore: sql<number>`ROUND(AVG(CAST(weighted_score AS DECIMAL)), 2)`,
        totalRatings: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(eq(ratings.productId, productId));

    // Get current product for previous price
    const [currentProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    const newPrice = scoreResult.avgScore || weightedScore;
    const previousPrice = parseFloat(currentProduct.currentPrice || "5.00");
    const priceChange = newPrice - previousPrice;
    const priceChangePercent =
      previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

    // Update product with new score
    await db
      .update(products)
      .set({
        previousPrice: currentProduct.currentPrice,
        currentPrice: newPrice.toFixed(2),
        priceChange: priceChange.toFixed(2),
        priceChangePercent: priceChangePercent.toFixed(2),
        totalRatings: scoreResult.totalRatings,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: "Trade Executed",
      rating: newRating,
      newScore: newPrice,
      priceChange,
    });
  } catch (error) {
    console.error("Trade execution failed:", error);
    return NextResponse.json(
      { error: "Market Close: Transaction Failed" },
      { status: 500 }
    );
  }
}
