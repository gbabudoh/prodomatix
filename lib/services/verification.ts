import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Checks if a customer with the given email has purchased a specific product.
 * @param email - The email address of the reviewer.
 * @param productId - The unique identifier of the product.
 * @returns A boolean indicating if the buyer is verified.
 */
export async function verifyPurchase(email: string, productId: string): Promise<boolean> {
  const purchase = await db.query.orders.findFirst({
    where: and(
      eq(orders.customerEmail, email),
      eq(orders.productId, productId),
      eq(orders.status, "completed")
    ),
  });

  return !!purchase;
}
