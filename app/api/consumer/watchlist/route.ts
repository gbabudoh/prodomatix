import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { watchlist, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

// GET - Fetch user's watchlist
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userWatchlist = await db
      .select({
        id: watchlist.id,
        createdAt: watchlist.createdAt,
        product: {
          id: products.id,
          name: products.name,
          ticker: products.ticker,
          currentPrice: products.currentPrice,
          priceChange: products.priceChange,
          priceChangePercent: products.priceChangePercent,
          totalRatings: products.totalRatings,
          hasDividendBadge: products.hasDividendBadge,
          category: products.category,
        },
      })
      .from(watchlist)
      .innerJoin(products, eq(watchlist.productId, products.id))
      .where(eq(watchlist.userId, user.id))
      .orderBy(watchlist.createdAt);

    return NextResponse.json({ watchlist: userWatchlist });
  } catch (error) {
    console.error("Failed to fetch watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

// POST - Add product to watchlist
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if already in watchlist
    const [existing] = await db
      .select()
      .from(watchlist)
      .where(
        and(eq(watchlist.userId, user.id), eq(watchlist.productId, productId))
      )
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Product already in watchlist" },
        { status: 400 }
      );
    }

    // Add to watchlist
    const [newItem] = await db
      .insert(watchlist)
      .values({
        userId: user.id,
        productId,
      })
      .returning();

    return NextResponse.json({ watchlistItem: newItem }, { status: 201 });
  } catch (error) {
    console.error("Failed to add to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

// DELETE - Remove product from watchlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await db
      .delete(watchlist)
      .where(
        and(
          eq(watchlist.userId, user.id),
          eq(watchlist.productId, parseInt(productId))
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
