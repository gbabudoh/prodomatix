import { db } from "@/lib/db";
import { reviews, reviewMedia } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { verifyPurchase } from "@/lib/services/verification";
import { moderateReview } from "@/lib/services/moderation";
import { generateProductSummary } from "@/lib/services/summary";
import { dispatchWebhooks } from "@/lib/services/webhook";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(5),
  reviewerName: z.string().optional(),
  reviewerEmail: z.string().email().optional(),
  mediaUrls: z.array(z.string().url()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = reviewSchema.parse(body);

    const productId = validatedData.productId;
    const email = validatedData.reviewerEmail;

    // Verify product exists using query API
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 1. Check for "Verified Buyer" status
    let isVerified = false;
    if (email) {
      isVerified = await verifyPurchase(email, productId);
    }

    // 2. Perform AI Moderation (Sentiment, Profanity, Spam)
    const moderation = await moderateReview(
      validatedData.title || "",
      validatedData.content,
      validatedData.rating // Pass rating for mismatch check
    );

    // Insert review
    const [newReview] = await db
      .insert(reviews)
      .values({
        productId,
        rating: validatedData.rating,
        title: validatedData.title || null,
        content: validatedData.content,
        reviewerName: validatedData.reviewerName || null,
        reviewerEmail: email || null,
        isVerified,
        status: moderation.status || "pending",
        sentiment: moderation.sentiment || "neutral",
        tags: moderation.tags ? moderation.tags.join(",") : null,
      })
      .returning();

    if (!newReview) {
      throw new Error("Failed to create review");
    }

    // Insert media if provided
    if (validatedData.mediaUrls && validatedData.mediaUrls.length > 0) {
      const mediaItems = validatedData.mediaUrls.map((url) => ({
        reviewId: newReview.id,
        url,
        type: url.match(/\.(mp4|webm|ogg)$/i) ? "video" : ("image" as const),
      }));
      await db.insert(reviewMedia).values(mediaItems);
    }

    // 3. Trigger AI Summary Update (Async - Fire & Forget)
    generateProductSummary(productId).catch(err => console.error("Background Summary Error:", err));

    // 4. Trigger Webhooks (Async - Fire & Forget)
    // Only dispatch if approved to reduce noise, or always dispatch if "created" is the event
    if (moderation.status === "approved") {
        dispatchWebhooks(newReview, product).catch(err => console.error("Webhook Dispatch Error:", err));
    }

    // 5. Check for Incentives
    let incentiveCode: string | null = null;
    const activeIncentive = await db.query.incentives.findFirst({
      where: (i, { and, eq, or, isNull }) => 
        and(
          eq(i.isActive, true),
          or(eq(i.productId, productId), isNull(i.productId))
        )
    });

    if (activeIncentive) {
      incentiveCode = activeIncentive.code;
    }

    return NextResponse.json(
      { 
        message: "Review submitted successfully", 
        reviewId: newReview.id,
        moderationStatus: moderation.status,
        isVerified,
        incentiveCode
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    // Log error for debugging
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Review submission error:", errorMessage);
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    // Fetch product name and aggregate stats
    const product = await db.query.products.findFirst({
      where: (p, { eq }) => eq(p.id, productId),
      columns: { name: true, sku: true, imageUrl: true }
    });

    if (!product) {
       return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const [stats] = await db
      .select({
        count: sql<number>`count(*)`,
        avgRating: sql<number>`avg(${reviews.rating})`
      })
      .from(reviews)
      .where(
         and(
            eq(reviews.productId, productId),
            eq(reviews.status, "approved") // Only use approved reviews for SEO
         )
      );

    return NextResponse.json({
       product,
       aggregates: {
          ratingValue: Number(stats?.avgRating || 0).toFixed(1),
          reviewCount: Number(stats?.count || 0)
       }
    });

  } catch (error) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
