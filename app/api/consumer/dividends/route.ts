import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { dividendClaims, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "consumer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Refresh user data from DB to get latest credits/alpha
    const [dbUser] = await db
      .select({
        id: users.id,
        tier: users.tier,
        alphaScore: users.alphaScore,
        claimableAlpha: users.claimableAlpha,
        siteCredits: users.siteCredits,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get claim history
    const history = await db
      .select()
      .from(dividendClaims)
      .where(eq(dividendClaims.userId, user.id))
      .orderBy(desc(dividendClaims.claimedAt))
      .limit(10);

    return NextResponse.json({
      success: true,
      wallet: {
        tier: dbUser.tier,
        alphaScore: dbUser.alphaScore,
        claimableAlpha: dbUser.claimableAlpha,
        siteCredits: dbUser.siteCredits,
        conversionRate: 0.10, // 10 Alpha = 1 Credit
        isEligible: dbUser.tier === 'gold',
      },
      history,
    });
  } catch (error) {
    console.error("Failed to fetch dividends:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
