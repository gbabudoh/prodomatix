import { db } from "@/db";
import { ratings, products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const productId = searchParams.get("productId");

    let query = db
      .select({
        id: ratings.id,
        statement: ratings.tenWordStatement,
        score: ratings.weightedScore,
        countryCode: ratings.countryCode,
        createdAt: ratings.createdAt,
        productId: ratings.productId,
        productTicker: products.ticker,
        productName: products.name,
      })
      .from(ratings)
      .innerJoin(products, eq(ratings.productId, products.id))
      .orderBy(desc(ratings.createdAt))
      .limit(limit)
      .$dynamic();

    if (productId) {
      query = query.where(eq(ratings.productId, parseInt(productId)));
    }

    const statements = await query;

    return NextResponse.json(statements);
  } catch (error) {
    console.error("Failed to fetch statements:", error);
    return NextResponse.json(
      { error: "Failed to fetch live feed" },
      { status: 500 }
    );
  }
}
