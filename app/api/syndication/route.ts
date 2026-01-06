import { db } from "@/lib/db";
import { retailers, reviews } from "@/lib/db/schema";
import { and, eq, gte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  try {
    // 1. Authenticate Retailer via API Key
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const retailer = await db.query.retailers.findFirst({
      where: eq(retailers.apiKey, apiKey),
    });

    if (!retailer) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 403 });
    }

    // 2. Parse Query Parameters (e.g., ?since=2023-01-01)
    const { searchParams } = new URL(req.url);
    const strSince = searchParams.get("since");
    
    // Validate 'since' if provided
    let sinceDate: Date | null = null;
    if (strSince) {
      const parsedDate = new Date(strSince);
      if (!isNaN(parsedDate.getTime())) {
        sinceDate = parsedDate;
      }
    }

    // 3. Fetch Approved Reviews
    // We only want 'approved' reviews.
    // If 'since' is provided, fetch reviews created/updated after that date.
    const whereConditions = [eq(reviews.status, "approved")];
    
    if (sinceDate) {
      whereConditions.push(gte(reviews.createdAt, sinceDate));
    }

    const syndicatedReviews = await db.query.reviews.findMany({
      where: and(...whereConditions),
      with: {
        product: {
            columns: {
                name: true,
                sku: true,
                imageUrl: true
            }
        },
        media: true
      },
      orderBy: [desc(reviews.createdAt)],
      limit: 100, // Pagination can be added later
    });

    return NextResponse.json({
      retailer: retailer.name,
      count: syndicatedReviews.length,
      reviews: syndicatedReviews,
    });

  } catch (error) {
    console.error("Syndication API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
