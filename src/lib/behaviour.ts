/**
 * Prodomatix Behavioural Processing Engine
 * 
 * Transforms raw user interactions into Intent Scores and Interest Profiles.
 */

export type IntentClass = 'explorer' | 'shopper' | 'buyer' | 'scout';

export interface BehaviourRecord {
  actionType: string;
  duration?: number | null;
  metadata?: string | null;
}

const ACTION_WEIGHTS: Record<string, number> = {
  'view': 0.5,
  'click': 1.5,
  'rate': 4.0,
  'watchlist_add': 8.0,
  'share': 3.0,
  'purchase_click': 10.0,
};

/**
 * Calculate the Intensity Score for a single behavioral interaction.
 * Higher score = higher interest/value to the brand owner.
 */
export function calculateIntensityScore(actionType: string, duration?: number | null): number {
  const weight = ACTION_WEIGHTS[actionType] || 0.5;
  
  // Dwell time bonus for views (logarithmic scaling to avoid spikes from hung tabs)
  let intensity = weight;
  if (actionType === 'view' && duration) {
    // 60 seconds (1 min) is a strong signal, 300s (5 min) is very high.
    const dwellBonus = Math.log1p(duration) * 0.8;
    intensity += dwellBonus;
  }
  
  return Math.round(intensity * 100) / 100;
}

/**
 * Classify user intent based on their recent history for a specific product or brand.
 */
export function classifyUserIntent(history: BehaviourRecord[]): IntentClass {
  const counts = history.reduce((acc, rec) => {
    acc[rec.actionType] = (acc[rec.actionType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hasHighPurchaseIntent = (counts['purchase_click'] || 0) > 0 || (counts['watchlist_add'] || 0) > 0;
  const isRatingFocused = (counts['rate'] || 0) > 1;
  const isHeavyViewer = (counts['view'] || 0) > 5;

  if (hasHighPurchaseIntent) return 'buyer';
  if (isRatingFocused) return 'scout';
  if (isHeavyViewer) return 'shopper';
  
  return 'explorer';
}

/**
 * Calculate churn risk (0.00 to 100.00)
 * Higher score = user is losing interest (e.g., sessions getting shorter, less frequency)
 */
export function calculateChurnRisk(history: BehaviourRecord[]): number {
  if (history.length < 5) return 0; // Not enough data for risk analysis
  
  // Simple heuristic: If last 3 actions are all low-duration views or bounces
  const recentActions = history.slice(-3);
  const lowEngagement = recentActions.every(a => 
    a.actionType === 'view' && (a.duration || 0) < 5
  );
  
  return lowEngagement ? 65.00 : 15.00;
}
