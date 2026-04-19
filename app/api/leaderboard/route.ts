import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // For Sector Experts
    const limit = parseInt(searchParams.get("limit") || "10");

    // For now, simple descending rank by alphaScore
    // In a prod environment, we would use the category or time-period filtering
    // and potentially a cache table.
    
    const topScouts = await db
      .select({
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
        alphaScore: users.alphaScore,
        accuracyRating: users.accuracyRating,
        tier: users.tier,
      })
      .from(users)
      .where(eq(users.role, "consumer"))
      .orderBy(desc(users.alphaScore))
      .limit(limit);

    return NextResponse.json({
      success: true,
      scouts: topScouts,
    });
  } catch (error) {
    console.error("Leaderboard fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
