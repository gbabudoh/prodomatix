import { db } from "@/db";
import { products, ratings, priceHistory } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    // Get product details
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get recent ratings/statements
    const recentRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.productId, productId))
      .orderBy(desc(ratings.createdAt))
      .limit(10);

    // Get price history
    const history = await db
      .select()
      .from(priceHistory)
      .where(eq(priceHistory.productId, productId))
      .orderBy(desc(priceHistory.recordedAt))
      .limit(30);

    // Get country breakdown
    const countryBreakdown = await db
      .select({
        countryCode: ratings.countryCode,
        avgScore: sql<number>`ROUND(AVG(CAST(weighted_score AS DECIMAL)), 2)`,
        totalRatings: sql<number>`COUNT(*)`,
      })
      .from(ratings)
      .where(eq(ratings.productId, productId))
      .groupBy(ratings.countryCode);

    return NextResponse.json({
      product,
      recentRatings,
      priceHistory: history.reverse(),
      countryBreakdown,
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await req.json();

    const [updated] = await db
      .update(products)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
