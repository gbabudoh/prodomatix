/**
 * Prodomatix Alpha Score Logic
 * 
 * Alpha Score = Price Movement % * Scout Bonus * Accuracy Factor
 */

/**
 * Calculates the Alpha Score for a single rating event.
 * 
 * @param entryPrice - Price of the product when the rating was submitted
 * @param currentPrice - Current price of the product
 * @param raterPosition - The n-th person to rate this product (1-based)
 * @returns a rounded Alpha Score
 */
export function calculateAlphaScore(
  entryPrice: number,
  currentPrice: number,
  raterPosition: number
): number {
  if (entryPrice <= 0) return 0;

  // 1. Calculate Price Movement (Directional ROI)
  // Positive if price went up, negative if it went down.
  const priceMove = (currentPrice - entryPrice) / entryPrice;

  // 2. Scout Bonus (Exponential decay based on position)
  // Being the 1st person is much more valuable than the 1000th.
  // Using 1 / sqrt(position) as a robust decay function.
  const scoutBonus = 1 / Math.sqrt(Math.max(1, raterPosition));

  // 3. Final Score Calculation
  // Multiply by 1000 for a more readable "point" system.
  const alphaScore = priceMove * scoutBonus * 1000;

  return parseFloat(alphaScore.toFixed(2));
}

/**
 * Determines the tier of a user based on their total cumulative Alpha Score.
 */
export function getUserTier(totalAlpha: number): 'bronze' | 'silver' | 'gold' {
  if (totalAlpha >= 5000) return 'gold';
  if (totalAlpha >= 1000) return 'silver';
  return 'bronze';
}

/**
 * Calculates the voting weight multiplier for a user's role/tier.
 */
export function getVoteWeight(tier: 'bronze' | 'silver' | 'gold'): number {
  switch (tier) {
    case 'gold': return 3.0; // Market Maker
    case 'silver': return 1.5; // Analyst
    default: return 1.0; // Participant
  }
}

/**
 * Updates the alpha score for all ratings of a specific user.
 * This should be run periodically or when leaderboard is viewed.
 */
import { db } from "@/db";
import { ratings, products, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function updateAllUserAlphaScores(userId: number) {
  // Fetch all ratings for this user with current product prices
  const userRatings = await db
    .select({
      rating: ratings,
      product: products,
    })
    .from(ratings)
    .innerJoin(products, eq(ratings.productId, products.id))
    .where(eq(ratings.userId, userId));

  let totalAlpha = 0;
  let correctPredictions = 0;

  userRatings.forEach(({ rating, product }) => {
    const entryPrice = parseFloat(rating.entryPrice || "5.00");
    const currentPrice = parseFloat(product.currentPrice || "5.00");
    const position = rating.raterPosition || 1;

    const alpha = calculateAlphaScore(entryPrice, currentPrice, position);
    totalAlpha += alpha;

    // Accuracy Tracking
    const predictedUp = rating.satisfaction >= 3; // Basic bullish signal
    const isUp = currentPrice > entryPrice;
    if ((predictedUp && isUp) || (!predictedUp && !isUp)) {
      correctPredictions++;
    }
  });

  const accuracyRating = userRatings.length > 0 
    ? (correctPredictions / userRatings.length) * 100 
    : 50;

  const newTier = getUserTier(totalAlpha);

  // Update user profile
  await db
    .update(users)
    .set({
      totalAlpha: totalAlpha.toFixed(2),
      alphaScore: totalAlpha.toFixed(2), // Current active alpha
      accuracyRating: accuracyRating.toFixed(2),
      tier: newTier,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return { totalAlpha, accuracyRating, newTier };
}

