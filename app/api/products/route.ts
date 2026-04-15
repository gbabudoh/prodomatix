import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sort") || "trending";
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = db.select().from(products).$dynamic();

    // Filter by category
    if (category && category !== "All") {
      query = query.where(eq(products.category, category));
    }

    // Search by name or ticker
    if (search) {
      query = query.where(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.ticker, `%${search}%`)
        )
      );
    }

    // Sort
    if (sortBy === "trending" || sortBy === "top-rated") {
      query = query.orderBy(desc(products.currentPrice));
    } else if (sortBy === "newest") {
      query = query.orderBy(desc(products.createdAt));
    } else if (sortBy === "most-rated") {
      query = query.orderBy(desc(products.totalRatings));
    } else {
      query = query.orderBy(desc(products.currentPrice));
    }

    const result = await query.limit(limit);

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user || (user.role !== "owner" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, ticker, description, category } = body;

    // Validate required fields
    if (!name || !ticker) {
      return NextResponse.json(
        { error: "Name and ticker are required" },
        { status: 400 }
      );
    }

    // Check if ticker already exists
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.ticker, ticker.toUpperCase()));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Ticker symbol already exists" },
        { status: 409 }
      );
    }

    // Create new product (IPO)
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        ticker: ticker.toUpperCase(),
        description,
        category,
        ownerId: user.id,
        currentPrice: "5.00", // Starting price
        previousPrice: "5.00",
        priceChange: "0.00",
        priceChangePercent: "0.00",
        status: "ipo",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Product IPO launched",
      product: newProduct,
    });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to launch product IPO" },
      { status: 500 }
    );
  }
}
