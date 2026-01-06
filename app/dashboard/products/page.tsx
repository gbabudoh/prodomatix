
import { db } from "@/lib/db";
import { products, reviews } from "@/lib/db/schema";
import { desc, sql, eq } from "drizzle-orm";
import ProductList from "@/components/ProductList";

export default async function ProductsPage() {
  // Fetch products with aggregated stats
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      description: products.description,
      imageUrl: products.imageUrl,
      aiSummary: products.aiSummary,
      avgRating: sql<number>`COALESCE(avg(${reviews.rating}), 0)`,
      reviewCount: sql<number>`count(${reviews.id})`,
    })
    .from(products)
    .leftJoin(reviews, eq(reviews.productId, products.id))
    .groupBy(
      products.id, 
      products.name, 
      products.sku, 
      products.description, 
      products.imageUrl, 
      products.aiSummary
    )
    .orderBy(desc(products.name));

  // Serialize values for the client component
  const serializedProducts = allProducts.map(p => ({
    ...p,
    avgRating: Number(p.avgRating).toFixed(1),
    reviewCount: Number(p.reviewCount)
  }));

  return <ProductList initialProducts={serializedProducts} />;
}
