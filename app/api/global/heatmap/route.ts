import { db } from "@/db";
import { ratings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let query;

    if (productId && productId !== "all") {
      // Get country breakdown for specific product
      query = db
        .select({
          countryCode: ratings.countryCode,
          avgScore: sql<number>`ROUND(AVG(CAST(weighted_score AS DECIMAL)), 2)`,
          totalRatings: sql<number>`COUNT(*)`,
          avgSatisfaction: sql<number>`ROUND(AVG(satisfaction), 1)`,
          avgQuality: sql<number>`ROUND(AVG(quality), 1)`,
          avgFeel: sql<number>`ROUND(AVG(feel), 1)`,
          avgTrendy: sql<number>`ROUND(AVG(trendy), 1)`,
          avgSpeculation: sql<number>`ROUND(AVG(speculation), 1)`,
        })
        .from(ratings)
        .where(eq(ratings.productId, parseInt(productId)))
        .groupBy(ratings.countryCode);
    } else {
      // Get global country breakdown across all products
      query = db
        .select({
          countryCode: ratings.countryCode,
          avgScore: sql<number>`ROUND(AVG(CAST(weighted_score AS DECIMAL)), 2)`,
          totalRatings: sql<number>`COUNT(*)`,
          avgSatisfaction: sql<number>`ROUND(AVG(satisfaction), 1)`,
          avgQuality: sql<number>`ROUND(AVG(quality), 1)`,
          avgFeel: sql<number>`ROUND(AVG(feel), 1)`,
          avgTrendy: sql<number>`ROUND(AVG(trendy), 1)`,
          avgSpeculation: sql<number>`ROUND(AVG(speculation), 1)`,
        })
        .from(ratings)
        .groupBy(ratings.countryCode);
    }

    const countryData = await query;

    // Add country names
    const countryNames: Record<string, string> = {
      US: "United States",
      GB: "United Kingdom",
      DE: "Germany",
      JP: "Japan",
      FR: "France",
      CA: "Canada",
      AU: "Australia",
      BR: "Brazil",
      IN: "India",
      KR: "South Korea",
      NG: "Nigeria",
      MX: "Mexico",
      IT: "Italy",
      ES: "Spain",
      NL: "Netherlands",
    };

    const enrichedData = countryData.map((c) => ({
      ...c,
      countryName: countryNames[c.countryCode] || c.countryCode,
    }));

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error("Failed to fetch heatmap data:", error);
    return NextResponse.json(
      { error: "Failed to fetch global data" },
      { status: 500 }
    );
  }
}
