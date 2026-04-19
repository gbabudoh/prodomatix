import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, npbNsbListings, users } from "@/db/schema";
import { eq, and, desc, gte } from "drizzle-orm";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";

// GET - Fetch NPB/NSB listings for consumers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'npb', 'nsb', or 'all'
    const scope = searchParams.get("scope"); // 'owner' for current user's listings
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const now = new Date();

    // Build query conditions
    const conditions = [];

    // If scope is owner, we need authentication
    if (scope === 'owner') {
      const cookieStore = await cookies();
      const token = cookieStore.get("session")?.value;
      if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      const session = await validateSession(token);
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      
      conditions.push(eq(npbNsbListings.ownerId, session.id));
    } else {
      // For consumers, only show active listings
      conditions.push(eq(npbNsbListings.isActive, true));
      
      if (type && type !== "all") {
        conditions.push(eq(npbNsbListings.listingType, type));
      }
    }

    // Fetch active listings with product details
    const listings = await db
      .select({
        listing: npbNsbListings,
        product: products,
        owner: {
          id: users.id,
          name: users.name,
        },
      })
      .from(npbNsbListings)
      .innerJoin(products, eq(npbNsbListings.productId, products.id))
      .innerJoin(users, eq(npbNsbListings.ownerId, users.id))
      .where(and(...conditions))
      .orderBy(desc(npbNsbListings.createdAt))
      .limit(limit);

    // Filter by category if specified
    const filteredListings = category
      ? listings.filter((l) => l.product.category === category)
      : listings;

    // Format response
    const formattedListings = filteredListings.map((item) => ({
      id: item.listing.id,
      listingType: item.listing.listingType,
      featuredImage: item.listing.featuredImage || item.product.imageUrl,
      shortDescription: item.listing.shortDescription || item.product.description,
      purchaseLocation: item.listing.purchaseLocation,
      sentimentDiscount: item.listing.sentimentDiscount,
      discountCode: item.listing.discountCode,
      discountExpiresAt: item.listing.discountExpiresAt,
      externalUrl: item.listing.externalUrl,
      impressions: item.listing.impressions,
      clicks: item.listing.clicks,
      product: {
        id: item.product.id,
        name: item.product.name,
        ticker: item.product.ticker,
        category: item.product.category,
        currentPrice: item.product.currentPrice,
        priceChange: item.product.priceChange,
        totalRatings: item.product.totalRatings,
        itemType: item.product.itemType,
        brandName: item.product.brandName,
      },
      owner: item.owner,
      createdAt: item.listing.createdAt,
    }));

    return NextResponse.json({
      listings: formattedListings,
      total: formattedListings.length,
    });
  } catch (error) {
    console.error("Failed to fetch NPB/NSB listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST - Create a new NPB/NSB listing (business owners only)
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await validateSession(token);
    
    if (!session || session.role !== "owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId, // Optional if creating a new product
      name,      // New Product name
      ticker: customTicker,
      description,
      imageUrl,
      listingType, // 'npb' or 'nsb'
      featuredImage,
      shortDescription,
      purchaseLocation,
      sentimentDiscount,
      discountCode,
      discountExpiresAt,
      externalUrl,
      durationDays = 30,
    } = body;

    // Validate listing type and discount
    if (!listingType || !sentimentDiscount) {
      return NextResponse.json(
        { error: "Listing type and sentiment discount are required" },
        { status: 400 }
      );
    }

    let targetProductId = productId;

    // 1. Create product if not provided
    if (!targetProductId) {
      if (!name) {
        return NextResponse.json({ error: "Product name is required for new listings" }, { status: 400 });
      }

      // Generate a ticker
      const baseTicker = customTicker || name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
      const uniqueSuffix = Math.floor(Math.random() * 1000);
      const finalTicker = `${baseTicker}${uniqueSuffix}`;

      const [newProduct] = await db
        .insert(products)
        .values({
          name,
          ticker: finalTicker,
          description: description || shortDescription,
          imageUrl: imageUrl || featuredImage,
          ownerId: session.id,
          category: "General",
          itemType: listingType === "nsb" ? "service" : "product",
          status: "active",
          isInNpbNsb: true,
          purchaseUrl: purchaseLocation,
          externalPageUrl: externalUrl,
          sentimentDiscount,
          sentimentDiscountCode: discountCode,
        })
        .returning();
      
      targetProductId = newProduct.id;
    } else {
      // 2. Verify existing product ownership
      const existingProduct = await db
        .select()
        .from(products)
        .where(
          and(eq(products.id, targetProductId), eq(products.ownerId, session.id))
        )
        .limit(1);

      if (existingProduct.length === 0) {
        return NextResponse.json(
          { error: "Product not found or you don't own it" },
          { status: 404 }
        );
      }
    }

    // 3. Create the listing
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + durationDays);

    const [newListing] = await db
      .insert(npbNsbListings)
      .values({
        productId: targetProductId,
        ownerId: session.id,
        listingType,
        featuredImage: featuredImage || imageUrl,
        shortDescription: shortDescription || description,
        purchaseLocation,
        sentimentDiscount,
        discountCode,
        discountExpiresAt: discountExpiresAt ? new Date(discountExpiresAt) : null,
        externalUrl,
        endsAt,
      })
      .returning();

    // 4. Final sync to product record
    await db
      .update(products)
      .set({
        isInNpbNsb: true,
        npbNsbExpiresAt: endsAt,
        purchaseUrl: purchaseLocation,
        externalPageUrl: externalUrl,
        sentimentDiscount,
        sentimentDiscountCode: discountCode,
      })
      .where(eq(products.id, targetProductId));

    return NextResponse.json({
      message: "Listing created successfully",
      listing: newListing,
      productId: targetProductId
    });
  } catch (error) {
    console.error("Failed to create NPB/NSB listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
