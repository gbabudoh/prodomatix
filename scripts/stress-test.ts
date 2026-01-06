
/**
 * Prodomatix Scalability Stress Test
 * Simulates a "Review Bomb" scenario by submitting high volumes of reviews.
 * 
 * Usage: node scripts/stress-test.ts
 */

const API_URL = "http://localhost:3000/api/reviews";
const TOTAL_REVIEWS = 100; // Adjusted for demo, increase to 5000 for actual stress test
const CONCURRENCY = 10;
const PRODUCT_ID = "5ca6dd48-7359-4221-9065-aba57099f696";

async function submitReview(i: number) {
  const payload = {
    productId: PRODUCT_ID,
    rating: Math.floor(Math.random() * 5) + 1,
    content: `Stress test review #${i}: The Hyperion v2 is ${Math.random() > 0.5 ? 'astonishingly good' : 'a bit overpriced but solid'}. Automating this to test system limits.`,
    reviewerName: `StressBot_${i}`,
    reviewerEmail: `bot_${i}@stress-test.prodomatix.ui`,
    title: `Automated Load Test #${i}`
  };

  try {
    const start = Date.now();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const duration = Date.now() - start;

    if (res.ok) {
      return { success: true, duration };
    } else {
      const error = await res.text();
      return { success: false, duration, error };
    }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return { success: false, error };
  }
}

async function runTest() {
  console.log(`\n🚀 Starting Prodomatix Stress Test...`);
  console.log(`📍 Target: ${API_URL}`);
  console.log(`📦 Payload: Concurrent submissions (${CONCURRENCY} at a time)\n`);

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_REVIEWS; i += CONCURRENCY) {
    const batch = Array.from({ length: Math.min(CONCURRENCY, TOTAL_REVIEWS - i) }, (_, index) => 
      submitReview(i + index)
    );
    
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    
    process.stdout.write(`Progress: ${Math.round(((i + batch.length) / TOTAL_REVIEWS) * 100)}% (${i + batch.length}/${TOTAL_REVIEWS})\r`);

    // Add a small delay between batches to respect rate limits
    if (i + batch.length < TOTAL_REVIEWS) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const totalTime = Date.now() - startTime;
  const successes = results.filter(r => r.success).length;
  const failures = results.length - successes;
  const avgDuration = results.reduce((acc, r) => acc + (r.duration || 0), 0) / results.length;

  console.log(`\n\n📊 Stress Test Complete!`);
  console.log(`-----------------------------------`);
  console.log(`Total Reviews:    ${results.length}`);
  console.log(`Successes:        ${successes} ✅`);
  console.log(`Failures:         ${failures} ❌`);
  console.log(`Total Time:       ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`Avg Latency:      ${avgDuration.toFixed(2)}ms`);
  console.log(`Throughput:       ${(results.length / (totalTime / 1000)).toFixed(2)} reviews/sec`);
  console.log(`-----------------------------------\n`);

  if (failures > 0) {
    console.log(`🚨 Warning: ${failures} requests failed. Check server logs for details.`);
  } else {
    console.log(`💎 System Stable: All requests processed successfully under load.`);
  }
}

runTest().catch(console.error);
