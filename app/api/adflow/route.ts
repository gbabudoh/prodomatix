import { db } from "@/db";
import { adflowCampaigns, products } from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active campaigns for this owner
    const campaigns = await db
      .select({
        campaign: adflowCampaigns,
        product: products,
      })
      .from(adflowCampaigns)
      .innerJoin(products, eq(adflowCampaigns.productId, products.id))
      .where(
        and(
          eq(adflowCampaigns.ownerId, user.id),
          eq(adflowCampaigns.isActive, true),
          gte(adflowCampaigns.endsAt, new Date())
        )
      )
      .orderBy(desc(adflowCampaigns.createdAt));

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch AdFlow campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, campaignType, durationDays, budget } = body;

    // Validate
    if (!productId || !campaignType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validTypes = ["hot_ipo", "market_alert", "trending"];
    if (!validTypes.includes(campaignType)) {
      return NextResponse.json(
        { error: "Invalid campaign type" },
        { status: 400 }
      );
    }

    // Calculate dates
    const startsAt = new Date();
    const endsAt = new Date(
      Date.now() + (durationDays || 7) * 24 * 60 * 60 * 1000
    );

    // Create campaign
    const [campaign] = await db
      .insert(adflowCampaigns)
      .values({
        productId,
        ownerId: user.id,
        campaignType,
        budget: budget?.toString() || "0",
        startsAt,
        endsAt,
        isActive: true,
      })
      .returning();

    // Update product to show as promoted
    await db
      .update(products)
      .set({
        isAdflowPromoted: true,
        adflowExpiresAt: endsAt,
        status: campaignType === "hot_ipo" ? "ipo" : "active",
      })
      .where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: "AdFlow campaign launched",
      campaign,
    });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      { error: "Failed to launch AdFlow campaign" },
      { status: 500 }
    );
  }
}
