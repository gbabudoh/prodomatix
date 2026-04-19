import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userBehavior, userCategoryPreferences, userBrandPreferences, products } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { calculateIntensityScore } from "@/lib/behaviour";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, actionType, duration, metadata } = body;

    if (!productId || !actionType) {
      return NextResponse.json(
        { error: "Product ID and action type are required" },
        { status: 400 }
      );
    }

    // Get user from session if available
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const session = token ? await validateSession(token) : null;
    const userId = session?.id;

    // 1. Log the raw behavior with Intensity Score
    if (userId) {
      const intensityScore = calculateIntensityScore(actionType, duration);
      
      await db.insert(userBehavior).values({
        userId,
        productId,
        actionType,
        duration: duration || null,
        intensityScore: intensityScore.toString(),
        metadata: metadata ? JSON.stringify(metadata) : null,
      });

      // 2. Update preference scores using Intensity Weighting
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (product) {
        // Update Category Preferences
        if (product.category) {
          const [existing] = await db
            .select()
            .from(userCategoryPreferences)
            .where(
              and(
                eq(userCategoryPreferences.userId, userId),
                eq(userCategoryPreferences.category, product.category)
              )
            )
            .limit(1);

          if (existing) {
            await db
              .update(userCategoryPreferences)
              .set({
                interactionCount: sql`${userCategoryPreferences.interactionCount} + 1`,
                updatedAt: new Date(),
              })
              .where(eq(userCategoryPreferences.id, existing.id));
          } else {
            await db.insert(userCategoryPreferences).values({
              userId,
              category: product.category,
              interactionCount: 1,
            });
          }
        }

        // Update Brand Preferences
        if (product.brandName) {
          const [existingBrand] = await db
            .select()
            .from(userBrandPreferences)
            .where(
              and(
                eq(userBrandPreferences.userId, userId),
                eq(userBrandPreferences.brandName, product.brandName)
              )
            )
            .limit(1);

          if (existingBrand) {
            await db
              .update(userBrandPreferences)
              .set({
                interactionCount: sql`${userBrandPreferences.interactionCount} + 1`,
                updatedAt: new Date(),
              })
              .where(eq(userBrandPreferences.id, existingBrand.id));
          } else {
            await db.insert(userBrandPreferences).values({
              userId,
              brandName: product.brandName,
              interactionCount: 1,
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking API Error:", error);
    // Silent fail for analytics so it doesn't break UI
    return NextResponse.json({ success: true });
  }
}
