import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch products ordered by: AdFlow promoted first, then by volatility
    const feed = await db
      .select()
      .from(products)
      .orderBy(
        desc(products.isAdflowPromoted),
        desc(sql`ABS(CAST(${products.priceChange} AS DECIMAL))`)
      )
      .limit(20);

    return NextResponse.json({ products: feed });
  } catch (error) {
    console.error("Failed to fetch ticker feed:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
