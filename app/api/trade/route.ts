import { db } from "@/db";
import { products, ratings, userShares, shareTransactions } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { calculateWeightedScore, calculateNewPrice } from "@/lib/calculate-score";
import { getCurrentUser } from "@/lib/auth";
import { calculateAlphaGain, processScoutProgress } from "@/lib/scout";

export async function POST(req: Request) {
  try {
    // Require authentication - only consumers can submit ratings
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to submit a rating." },
        { status: 401 }
      );
    }

    if (user.role !== "consumer") {
      return NextResponse.json(
        { error: "Only consumers can submit sentiment ratings." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      productId,
      tenWordStatement,
      statement: legacyStatement,
      countryCode,
      satisfaction,
      quality,
      feel,
      trendy,
      speculation,
    } = body;

    // Support both field names for backwards compatibility
    const statementText = tenWordStatement || legacyStatement;

    if (!statementText) {
      return NextResponse.json(
        { error: "Statement is required." },
        { status: 400 }
      );
    }

    // Server-side 10-word validation
    const words = statementText.trim().split(/\s+/).filter(Boolean);
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

    // Get current product state for Alpha Score snapshotting
    const [currentProduct] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!currentProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const entryPrice = parseFloat(currentProduct.currentPrice || "5.00");
    const raterPosition = (currentProduct.totalRatings || 0) + 1;

    // Calculate weighted score for this rating
    const weightedScore = calculateWeightedScore(indicators);

    // Insert the rating with market snapshot
    const [newRating] = await db
      .insert(ratings)
      .values({
        productId,
        userId: user.id,
        countryCode: countryCode || user.countryCode || "US",
        tenWordStatement: statementText,
        satisfaction,
        quality,
        feel,
        trendy,
        speculation,
        weightedScore: weightedScore.toString(),
        entryPrice: entryPrice.toFixed(2),
        raterPosition: raterPosition,
      })
      .returning();

    // 106. Update product score (calculate new average)
    const [scoreResult] = await db
      .select({
        totalRatings: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(eq(ratings.productId, productId));

    // Determine scout influence based on tier
    const scoutWeight = 
      user.tier === 'gold' ? 3.0 : 
      user.tier === 'silver' ? 1.5 : 
      1.0;

    // Use our smooth EMA algorithm with scout weight
    const newPrice = calculateNewPrice(
      entryPrice,
      weightedScore,
      scoreResult.totalRatings || 0,
      0.1, // default smoothing
      scoutWeight
    );

    const previousPrice = entryPrice;
    const priceChange = newPrice - previousPrice;
    const priceChangePercent = previousPrice > 0 ? (priceChange / previousPrice) * 100 : 0;

    // Update product with new score
    await db
      .update(products)
      .set({
        previousPrice: currentProduct.currentPrice,
        currentPrice: newPrice.toFixed(2),
        priceChange: priceChange.toFixed(2),
        priceChangePercent: priceChangePercent.toFixed(2),
        totalRatings: (scoreResult.totalRatings || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // 🏆 SCOUT PROGRESSION
    const alphaGain = calculateAlphaGain('rate', 1.0);
    const progress = await processScoutProgress(user.id, alphaGain);

    // 💎 SHARE GRANT LOGIC (IPS PHASE ONLY)
    let shareGrant = null;
    if (currentProduct.status === 'ipo' && raterPosition <= 20) {
      try {
        const grantQuantity = "50.00";
        
        // 1. Check if we have available shares
        const available = parseFloat(currentProduct.availableShares || "0");
        if (available >= 50) {
          await db.transaction(async (tx) => {
            // Update User Shares (upsert)
            const [existing] = await tx
              .select()
              .from(userShares)
              .where(and(eq(userShares.userId, user.id), eq(userShares.productId, productId)))
              .limit(1);

            if (existing) {
              await tx
                .update(userShares)
                .set({
                  quantity: (parseFloat(existing.quantity || "0") + 50).toString(),
                  updatedAt: new Date(),
                })
                .where(eq(userShares.id, existing.id));
            } else {
              await tx.insert(userShares).values({
                userId: user.id,
                productId,
                quantity: grantQuantity,
                avgPurchasePrice: "0.0000", // Free grant
              });
            }

            // Create Transaction Record
            await tx.insert(shareTransactions).values({
              userId: user.id,
              productId,
              type: 'GRANT',
              quantity: grantQuantity,
              pricePerShare: "0.0000",
              totalValue: "0.00",
              performanceAtTime: newPrice.toFixed(2),
            });

            // Decrement Available Shares in Product
            await tx
              .update(products)
              .set({
                availableShares: (available - 50).toFixed(2),
              })
              .where(eq(products.id, productId));
          });
          
          shareGrant = {
            quantity: 50,
            type: 'Founder Analyst Grant'
          };
        }
      } catch (err) {
        console.error("Failed to grant shares:", err);
        // Don't fail the whole trade if share grant fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Trade Executed",
      rating: newRating,
      newScore: newPrice,
      priceChange,
      scoutProgress: progress,
      shareGrant,
    });
  } catch (error) {
    console.error("Trade execution failed:", error);
    return NextResponse.json(
      { error: "Market Close: Transaction Failed" },
      { status: 500 }
    );
  }
}
