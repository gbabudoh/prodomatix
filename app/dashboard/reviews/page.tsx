
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import ReviewList from "@/components/ReviewList";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const { productId } = await searchParams;

  const allReviews = await db.query.reviews.findMany({
    where: productId ? eq(reviews.productId, productId) : undefined,
    with: {
      product: true,
      retailer: true,
    },
    orderBy: [desc(reviews.createdAt)],
  });

  // Convert dates to strings for serializability
  const serializedReviews = allReviews.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return <ReviewList initialReviews={serializedReviews} />;
}
