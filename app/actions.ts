
"use server";

import { db } from "@/lib/db";
import { reviews, products, brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateDraftResponse } from "@/lib/services/auto-reply";
import { revalidatePath } from "next/cache";

export async function generateReplyAction(content: string, rating: number, reviewerName: string): Promise<string> {
  const draft = await generateDraftResponse(content, rating, reviewerName);
  return draft || "I'm sorry, I couldn't generate a reply at this time. Please try again or draft a response manually.";
}

export async function saveResponseAction(reviewId: string, response: string) {
  try {
    await db.update(reviews)
      .set({ 
        manufacturerResponse: response,
        manufacturerResponseDate: new Date()
      })
      .where(eq(reviews.id, reviewId));
    
    revalidatePath("/dashboard/reviews");
    return { success: true };
  } catch (error) {
    console.error("Failed to save response:", error);
    return { success: false, error: "Failed to save response" };
  }
}

export async function createProductAction(data: { name: string; sku: string; description: string; imageUrl: string }) {
  try {
    // For demo/prototype, we'll fetch the first brand if brandId isn't provided
    const [firstBrand] = await db.select().from(brands).limit(1);
    
    if (!firstBrand) {
      return { success: false, error: "No brand found to associate with product." };
    }

    await db.insert(products).values({
      name: data.name,
      sku: data.sku,
      description: data.description,
      imageUrl: data.imageUrl,
      brandId: firstBrand.id,
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProductAction(productId: string, data: { name: string; sku: string; description: string; imageUrl: string }) {
  try {
    await db.update(products)
      .set({
        name: data.name,
        sku: data.sku,
        description: data.description,
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function requestProductSummaryAction(productId: string) {
  try {
    const { generateProductSummary } = await import("@/lib/services/summary");
    const summary = await generateProductSummary(productId);
    
    if (!summary) {
      return { success: false, error: "Not enough review data to generate a summary yet." };
    }

    revalidatePath("/dashboard/products");
    return { success: true, data: summary };
  } catch (error) {
    console.error("Summary Action Error:", error);
    return { success: false, error: "AI Synthesis failed." };
  }
}
