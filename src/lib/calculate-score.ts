/**
 * Prodo Score Calculator
 *
 * The "Price" of a product is calculated using a weighted average of 5 indicators:
 * - Satisfaction (25%): Overall user satisfaction
 * - Quality (25%): Perceived product quality
 * - Feel (20%): Emotional connection/brand feel
 * - Trendy (15%): Market trend alignment
 * - Speculation (15%): Future potential/hype
 *
 * The score ranges from 1.00 to 10.00, mimicking stock prices.
 */

export interface RatingIndicators {
  satisfaction: number; // 1-10
  quality: number; // 1-10
  feel: number; // 1-10
  trendy: number; // 1-10
  speculation: number; // 1-10
}

export interface ScoreWeights {
  satisfaction: number;
  quality: number;
  feel: number;
  trendy: number;
  speculation: number;
}

// Default weights for the Prodo Score
export const DEFAULT_WEIGHTS: ScoreWeights = {
  satisfaction: 0.25,
  quality: 0.25,
  feel: 0.2,
  trendy: 0.15,
  speculation: 0.15,
};

/**
 * Calculate the weighted score for a single rating
 */
export function calculateWeightedScore(
  indicators: RatingIndicators,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const score =
    indicators.satisfaction * weights.satisfaction +
    indicators.quality * weights.quality +
    indicators.feel * weights.feel +
    indicators.trendy * weights.trendy +
    indicators.speculation * weights.speculation;

  // Round to 2 decimal places
  return Math.round(score * 100) / 100;
}

/**
 * Calculate the new product price based on existing price and new rating
 * Uses exponential moving average for smooth price transitions
 */
export function calculateNewPrice(
  currentPrice: number,
  newRatingScore: number,
  totalRatings: number,
  smoothingFactor: number = 0.1, // Higher = more reactive to new ratings
  scoutWeight: number = 1.0 // Multiplier for senior scouts
): number {
  // For products with few ratings, weight new ratings more heavily
  // We also multiply the smoothing factor by the scout weight to increase impact
  const adjustedSmoothing = Math.min(
    smoothingFactor * (1 + 10 / (totalRatings + 1)) * scoutWeight,
    0.8 // Clamp higher for senior scouts
  );

  // Exponential moving average
  const newPrice =
    currentPrice * (1 - adjustedSmoothing) + newRatingScore * adjustedSmoothing;

  // Clamp between 1.00 and 10.00
  return Math.round(Math.max(1, Math.min(10, newPrice)) * 100) / 100;
}

/**
 * Calculate price change and percentage
 */
export function calculatePriceChange(
  currentPrice: number,
  previousPrice: number
): { change: number; changePercent: number } {
  const change = Math.round((currentPrice - previousPrice) * 100) / 100;
  const changePercent =
    previousPrice > 0
      ? Math.round(((currentPrice - previousPrice) / previousPrice) * 10000) /
        100
      : 0;

  return { change, changePercent };
}

/**
 * Determine market sentiment based on price movement
 */
export type MarketSentiment = "bullish" | "bearish" | "neutral";

export function getMarketSentiment(priceChange: number): MarketSentiment {
  if (priceChange > 0.05) return "bullish";
  if (priceChange < -0.05) return "bearish";
  return "neutral";
}

/**
 * Calculate volatility index (how much the price fluctuates)
 */
export function calculateVolatility(priceHistory: number[]): number {
  if (priceHistory.length < 2) return 0;

  const mean = priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;
  const squaredDiffs = priceHistory.map((price) => Math.pow(price - mean, 2));
  const variance =
    squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;

  return Math.round(Math.sqrt(variance) * 100) / 100;
}

/**
 * Check if product qualifies for Dividend Badge
 * Requires score > 8.0 for 30 consecutive days
 */
export function checkDividendEligibility(
  currentScore: number,
  streakDays: number
): { eligible: boolean; newStreakDays: number } {
  if (currentScore >= 8.0) {
    const newStreakDays = streakDays + 1;
    return {
      eligible: newStreakDays >= 30,
      newStreakDays,
    };
  }
  return { eligible: false, newStreakDays: 0 };
}

/**
 * Format price for display (like stock tickers)
 */
export function formatPrice(price: number): string {
  return price.toFixed(2);
}

/**
 * Format price change with arrow indicator
 */
export function formatPriceChange(change: number): string {
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "→";
  const sign = change > 0 ? "+" : "";
  return `${arrow} ${sign}${change.toFixed(2)}`;
}

/**
 * Get color class based on price movement
 */
export function getPriceColor(change: number): string {
  if (change > 0) return "text-green-500";
  if (change < 0) return "text-red-500";
  return "text-gray-500";
}
