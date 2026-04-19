import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const ALPHA_THRESHOLDS = {
  SILVER: 1000,
  GOLD: 5000,
};

export type ScoutTier = 'bronze' | 'silver' | 'gold';

/**
 * Calculates the Alpha gain for a specific interaction.
 * Alpha = ROI of sentiment.
 */
export function calculateAlphaGain(action: string, intensity: number = 1.0): number {
  const baseRates: Record<string, number> = {
    'rate': 25,
    'watchlist_add': 15,
    'share': 50,
    'first_scout': 100, // Bonus for being first to rate
  };

  const rate = baseRates[action] || 10;
  return Math.round(rate * intensity);
}

/**
 * Evaluates if a user qualifies for a tier upgrade.
 */
export function evaluateTier(alphaScore: number): ScoutTier {
  if (alphaScore >= ALPHA_THRESHOLDS.GOLD) return 'gold';
  if (alphaScore >= ALPHA_THRESHOLDS.SILVER) return 'silver';
  return 'bronze';
}

/**
 * Processes scout progress, updates tier if necessary, and returns rewards info.
 */
export async function processScoutProgress(userId: number, alphaGain: number) {
  // 1. Get current user stats
  const [user] = await db
    .select({
      id: users.id,
      alphaScore: users.alphaScore,
      totalAlpha: users.totalAlpha,
      claimableAlpha: users.claimableAlpha,
      tier: users.tier,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  const currentAlpha = parseFloat(user.alphaScore || '0');
  const currentClaimable = parseFloat(user.claimableAlpha || '0');
  
  const newAlpha = currentAlpha + alphaGain;
  const newClaimable = currentClaimable + alphaGain;
  const newTotalAlpha = parseFloat(user.totalAlpha || '0') + alphaGain;
  
  const currentTier = user.tier as ScoutTier;
  const newTier = evaluateTier(newAlpha);
  
  const isTierUpgrade = newTier !== currentTier;
  let bonusAlpha = 0;

  // 2. Handle specific milestone rewards
  if (isTierUpgrade && newTier === 'gold') {
    bonusAlpha = 500; // "Founding Scout" Bonus
  }

  // 3. Update database
  await db
    .update(users)
    .set({
      alphaScore: (newAlpha + bonusAlpha).toFixed(2),
      totalAlpha: (newTotalAlpha + bonusAlpha).toFixed(2),
      claimableAlpha: (newClaimable + bonusAlpha).toFixed(2),
      tier: newTier,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return {
    success: true,
    newAlpha: newAlpha + bonusAlpha,
    newTier,
    isTierUpgrade,
    bonusAlpha,
  };
}
