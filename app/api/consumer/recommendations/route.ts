import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, userCategoryPreferences, userBrandPreferences, locationRecommendations, type Product } from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "general"; // 'preference', 'location', 'brand', 'general'
    const limit = parseInt(searchParams.get("limit") || "5");

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    const session = token ? await validateSession(token) : null;
    const userId = session?.id;

    let recommendedProducts: Product[] = [];

    // 1. Preference Algorithm (Category based)
    if (type === 'preference' && userId) {
      const topCategories = await db
        .select({ category: userCategoryPreferences.category })
        .from(userCategoryPreferences)
        .where(eq(userCategoryPreferences.userId, userId))
        .orderBy(desc(userCategoryPreferences.interactionCount))
        .limit(3);

      if (topCategories.length > 0) {
        const categoryList = topCategories
          .map(c => c.category)
          .filter((c): c is string => c !== null);
          
        if (categoryList.length > 0) {
          recommendedProducts = await db
            .select()
            .from(products)
            .where(inArray(products.category, categoryList))
            .orderBy(desc(products.currentPrice))
            .limit(limit);
        }
      }
    }

    // 2. Location Algorithm (Geo-based trends)
    if (type === 'location') {
      const countryCode = session?.countryCode || 'US';
      
      // Get trending products for this location
      const rows = await db
        .select({
          product: products
        })
        .from(locationRecommendations)
        .innerJoin(products, eq(locationRecommendations.productId, products.id))
        .where(eq(locationRecommendations.countryCode, countryCode))
        .orderBy(desc(locationRecommendations.popularityScore))
        .limit(limit);

      recommendedProducts = rows.map(r => r.product);
        
      // Fallback: If no location data, show global top rated
      if (recommendedProducts.length === 0) {
        recommendedProducts = await db
          .select()
          .from(products)
          .orderBy(desc(products.currentPrice))
          .limit(limit);
      }
    }

    // 3. Brand Algorithm (Affinity based)
    if (type === 'brand' && userId) {
      const topBrands = await db
        .select({ brand: userBrandPreferences.brandName })
        .from(userBrandPreferences)
        .where(eq(userBrandPreferences.userId, userId))
        .orderBy(desc(userBrandPreferences.interactionCount))
        .limit(2);

      if (topBrands.length > 0) {
        const brandList = topBrands
          .map(b => b.brand)
          .filter((b): b is string => b !== null);

        if (brandList.length > 0) {
          recommendedProducts = await db
            .select()
            .from(products)
            .where(inArray(products.brandName, brandList))
            .limit(limit);
        }
      }
    }

    // 4. Choice Algorithm / General Trending (Default)
    if (recommendedProducts.length === 0 || type === 'general') {
      recommendedProducts = await db
        .select()
        .from(products)
        .where(eq(products.status, 'active'))
        .orderBy(desc(products.totalRatings))
        .limit(limit);
    }

    return NextResponse.json({
      type,
      products: recommendedProducts
    });
  } catch (error) {
    console.error("Recommendations API Error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
