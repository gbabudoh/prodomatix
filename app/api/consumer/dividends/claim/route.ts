import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { dividendClaims, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "consumer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch latest user state
    const [dbUser] = await db
      .select({
        id: users.id,
        tier: users.tier,
        claimableAlpha: users.claimableAlpha,
        siteCredits: users.siteCredits,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Eligibility Guard: Only Gold Scouts can claim dividends
    if (dbUser.tier !== 'gold') {
      return NextResponse.json({ 
        error: "Dividend eligibility restricted to Gold Scouts. Accumulate 5,000 Alpha to unlock." 
      }, { status: 403 });
    }

    const claimable = parseFloat(dbUser.claimableAlpha || '0');
    if (claimable <= 0) {
      return NextResponse.json({ error: "No dividends available to claim." }, { status: 400 });
    }

    // 3. Payout Calculation (10 Alpha = 1 Credit)
    const conversionRate = 0.10;
    const creditAmount = Math.floor(claimable * conversionRate * 100) / 100; // Round to 2 decimals

    // 4. Atomic Update
    await db.transaction(async (tx) => {
      // Create claim record
      await tx.insert(dividendClaims).values({
        userId: user.id,
        alphaAmount: claimable.toFixed(2),
        creditAmount: creditAmount.toFixed(2),
        conversionRate: conversionRate.toFixed(2),
      });

      // Update user wallet
      const currentCredits = parseFloat(dbUser.siteCredits || '0');
      await tx.update(users)
        .set({
          claimableAlpha: "0.00", // Reset claimable pool
          siteCredits: (currentCredits + creditAmount).toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    });

    return NextResponse.json({
      success: true,
      message: "Dividends Claimed!",
      creditsEarned: creditAmount,
      alphaConverted: claimable,
    });
  } catch (error) {
    console.error("Payout transaction failed:", error);
    return NextResponse.json({ error: "Market Close: Payout failed" }, { status: 500 });
  }
}
