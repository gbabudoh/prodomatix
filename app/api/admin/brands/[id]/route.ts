import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { brands, products, reviews } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get all products for this brand to delete their reviews
    const brandProducts = await db.query.products.findMany({
      where: eq(products.brandId, id),
    });

    // Delete reviews for all products
    for (const product of brandProducts) {
      await db.delete(reviews).where(eq(reviews.productId, product.id));
    }

    // Delete all products for this brand
    await db.delete(products).where(eq(products.brandId, id));

    // Delete the brand
    await db.delete(brands).where(eq(brands.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete brand:", error);
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 });
  }
}
