
import { db } from "@/lib/db";
import { retailers, reviews, products } from "@/lib/db/schema";
import { isNotNull, type InferSelectModel } from "drizzle-orm";
import { signReviewPayload } from "./crypto";

type Review = InferSelectModel<typeof reviews>;
type Product = InferSelectModel<typeof products>;

export async function dispatchWebhooks(review: Review, product: Product) {
  try {
    // 1. Fetch all retailers with a webhook URL configured
    const subscribedRetailers = await db.query.retailers.findMany({
      where: isNotNull(retailers.webhookUrl),
    });

    if (subscribedRetailers.length === 0) return;

    // 2. Prepare Payload
    const payload = {
      event: "review.created",
      data: {
        reviewId: review.id,
        productId: product.id,
        productSku: product.sku,
        rating: review.rating,
        content: review.content,
        sentiment: review.sentiment,
        isVerified: review.isVerified,
        createdAt: review.createdAt,
      },
    };

    // 3. Dispatch to each retailer
    await Promise.all(
      subscribedRetailers.map(async (retailer) => {
        if (!retailer.webhookUrl) return;

        // Sign payload with system secret (or specific retailer secret if implemented)
        const signature = await signReviewPayload(payload.data);

        try {
          await fetch(retailer.webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Prodomatix-Signature": signature,
              "X-Prodomatix-Event": "review.created",
            },
            body: JSON.stringify(payload),
          });
          console.log(`Webhook sent to ${retailer.name}`);
        } catch (err) {
          console.error(`Failed to send webhook to ${retailer.name}:`, err);
        }
      })
    );
  } catch (error) {
    console.error("Webhook Dispatch Error:", error);
  }
}
