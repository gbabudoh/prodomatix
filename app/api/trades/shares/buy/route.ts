import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { products, users, userShares, shareTransactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "consumer") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity || parseFloat(quantity) <= 0) {
      return NextResponse.json({ error: "Invalid purchase request" }, { status: 400 });
    }

    const buyQuantity = parseFloat(quantity);

    // Run everything in a transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // 1. Fetch latest state of product and user
      const [product] = await tx
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      const [dbUser] = await tx
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!product) throw new Error("Product not found");
      if (!dbUser) throw new Error("User not found");

      // 2. Validate IPS Status
      if (product.status !== 'ipo' && product.status !== 'active') {
        throw new Error("This product is not available for public share purchase.");
      }

      // 3. Check Supply
      const available = parseFloat(product.availableShares || "0");
      if (available < buyQuantity) {
        throw new Error(`Insufficient share supply. only ${available} shares remaining.`);
      }

      // 4. Check Balance
      const pricePerShare = parseFloat(product.currentPrice || "5.00");
      const totalCost = buyQuantity * pricePerShare;
      const userCredits = parseFloat(dbUser.siteCredits || "0");

      if (userCredits < totalCost) {
        throw new Error(`Insufficient credits. You need ${totalCost.toFixed(2)} but have ${userCredits.toFixed(2)}.`);
      }

      // 5. Execute Deductions
      await tx
        .update(users)
        .set({
          siteCredits: (userCredits - totalCost).toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      await tx
        .update(products)
        .set({
          availableShares: (available - buyQuantity).toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      // 6. Update Ownership
      const [existingHoldings] = await tx
        .select()
        .from(userShares)
        .where(and(eq(userShares.userId, user.id), eq(userShares.productId, productId)))
        .limit(1);

      if (existingHoldings) {
        const currentQty = parseFloat(existingHoldings.quantity || "0");
        const currentAvg = parseFloat(existingHoldings.avgPurchasePrice || "0");
        const newQty = currentQty + buyQuantity;
        const newAvg = ((currentQty * currentAvg) + (buyQuantity * pricePerShare)) / newQty;

        await tx
          .update(userShares)
          .set({
            quantity: newQty.toFixed(2),
            avgPurchasePrice: newAvg.toFixed(4),
            updatedAt: new Date(),
          })
          .where(eq(userShares.id, existingHoldings.id));
      } else {
        await tx.insert(userShares).values({
          userId: user.id,
          productId,
          quantity: buyQuantity.toFixed(2),
          avgPurchasePrice: pricePerShare.toFixed(4),
        });
      }

      // 7. Record Transaction
      const [txRecord] = await tx.insert(shareTransactions).values({
        userId: user.id,
        productId,
        type: 'BUY',
        quantity: buyQuantity.toFixed(2),
        pricePerShare: pricePerShare.toFixed(4),
        totalValue: totalCost.toFixed(2),
        performanceAtTime: pricePerShare.toFixed(2),
      }).returning();

      return {
        totalCost,
        txId: txRecord.id,
        remainingCredits: userCredits - totalCost
      };
    });

    return NextResponse.json({
      success: true,
      message: "Shares purchased successfully!",
      result
    });
  } catch (error) {
    console.error("Purchase failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Purchase failed" },
      { status: 400 }
    );
  }
}
