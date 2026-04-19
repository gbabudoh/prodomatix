/**
 * Client-side tracking utility for Prodomatix Algorithms
 */

export type TrackActionType = 'view' | 'click' | 'rate' | 'hover';

interface TrackOptions {
  duration?: number;
  metadata?: Record<string, unknown>;
}

export async function trackAction(productId: number, actionType: TrackActionType, options?: TrackOptions) {
  try {
    // Only track in production/real use to avoid cluttering DB during dev? 
    // No, we need it for development of algorithms too.
    
    // Fire and forget tracking call
    fetch('/api/consumer/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId,
        actionType,
        duration: options?.duration,
        metadata: options?.metadata,
      }),
    }).catch(err => console.error('Silent tracking failure:', err));
  } catch (error) {
    // Fail silently
  }
}
