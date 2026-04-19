import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { products, userShares, shareTransactions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "consumer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user's share holdings with product details
    const holdings = await db
      .select({
        id: userShares.id,
        productId: userShares.productId,
        quantity: userShares.quantity,
        avgPurchasePrice: userShares.avgPurchasePrice,
        ticker: products.ticker,
        name: products.name,
        currentPrice: products.currentPrice,
        priceChange: products.priceChange,
        priceChangePercent: products.priceChangePercent,
        status: products.status,
      })
      .from(userShares)
      .innerJoin(products, eq(userShares.productId, products.id))
      .where(eq(userShares.userId, user.id))
      .orderBy(desc(userShares.updatedAt));

    // 2. Calculate Portfolio Stats
    let totalValue = 0;
    let totalCostBasis = 0;
    let totalProfitLoss = 0;

    const formattedHoldings = holdings.map(h => {
      const qty = parseFloat(h.quantity || "0");
      const currentPrice = parseFloat(h.currentPrice || "0");
      const avgPrice = parseFloat(h.avgPurchasePrice || "0");
      
      const currentValue = qty * currentPrice;
      const costBasis = qty * avgPrice;
      const profitLoss = currentValue - costBasis;
      const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

      totalValue += currentValue;
      totalCostBasis += costBasis;
      totalProfitLoss += profitLoss;

      return {
        ...h,
        quantity: qty,
        currentValue,
        costBasis,
        profitLoss,
        profitLossPercent,
      };
    });

    // 3. Fetch Recent Transactions
    const recentTx = await db
      .select()
      .from(shareTransactions)
      .where(eq(shareTransactions.userId, user.id))
      .orderBy(desc(shareTransactions.timestamp))
      .limit(10);

    return NextResponse.json({
      holdings: formattedHoldings,
      stats: {
        totalValue,
        totalProfitLoss,
        profitLossPercent: totalCostBasis > 0 ? (totalProfitLoss / totalCostBasis) * 100 : 0,
        holdingCount: holdings.length
      },
      recentTransactions: recentTx
    });
  } catch (error) {
    console.error("Failed to fetch portfolio:", error);
    return NextResponse.json({ error: "Failed to load portfolio" }, { status: 500 });
  }
}
