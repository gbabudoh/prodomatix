
import { db } from "@/lib/db";
import { reviews, products, retailers } from "@/lib/db/schema";
import { sql, and, gte, lt, eq } from "drizzle-orm";
import ReviewPulseReport from "@/components/ReviewPulseReport";

export default async function ReportsPage() {
  // 1. Determine Date Ranges
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = currentMonthStart;

  // 2. Fetch Helper
  async function getMetrics(start: Date, end: Date) {
    const [stats] = await db
      .select({
        count: sql<number>`count(*)`,
        avgRating: sql<number>`avg(${reviews.rating})`,
        avgSentiment: sql<number>`avg(
          case 
            when ${reviews.sentiment} = 'positive' then 1 
            when ${reviews.sentiment} = 'negative' then -1 
            else 0 
          end
        )`,
        negCount: sql<number>`count(case when ${reviews.sentiment} = 'negative' then 1 end)`,
        respondedNeg: sql<number>`count(case when ${reviews.sentiment} = 'negative' and ${reviews.manufacturerResponse} is not null then 1 end)`,
      })
      .from(reviews)
      .where(and(gte(reviews.createdAt, start), lt(reviews.createdAt, end)));
      
    return stats;
  }

  const currentStats = await getMetrics(currentMonthStart, nextMonthStart);
  const prevStats = await getMetrics(prevMonthStart, prevMonthEnd);

  // 3. Count SKUs
  const [skuStats] = await db.select({ count: sql<number>`count(*)` }).from(products);
  
  // 4. Calculate Changes
  // Handle /0 for percent change
  const calcChange = (curr: number, prev: number) => {
    if (!prev) return curr ? 100 : 0;
    return Number(((curr - prev) / prev * 100).toFixed(1));
  };

  const getResponseRate = (stats: { negCount: number | null; respondedNeg: number | null }) => {
    const total = Number(stats.negCount || 0);
    if (total === 0) return 100;
    return Math.round((Number(stats.respondedNeg || 0) / total) * 100);
  };

  const currentRespRate = getResponseRate(currentStats);
  const prevRespRate = getResponseRate(prevStats);

  // 5. Fetch High-Impact Reviews for AI Analysis
  const [posReviews, negReviews, retailerList] = await Promise.all([
    db.query.reviews.findMany({
      where: and(gte(reviews.createdAt, currentMonthStart), lt(reviews.createdAt, nextMonthStart), eq(reviews.sentiment, "positive")),
      limit: 15,
    }),
    db.query.reviews.findMany({
      where: and(gte(reviews.createdAt, currentMonthStart), lt(reviews.createdAt, nextMonthStart), eq(reviews.sentiment, "negative")),
      limit: 15,
    }),
    db.selectDistinct({ name: retailers.name }).from(retailers),
  ]);

  // 6. Generate AI Intelligence
  let aiData = null;
  if (posReviews.length > 0 || negReviews.length > 0) {
    const { generateintelligenceReport } = await import("@/lib/services/intelligence-report");
    aiData = await generateintelligenceReport({
      positiveReviews: posReviews.map(r => r.content),
      negativeReviews: negReviews.map(r => r.content),
      retailers: retailerList.map(r => r.name || "Direct Site"),
    });
  }

  // 7. Mock Top Keywords
  const keywords = [
    { word: "Build Quality", sentiment: "positive" as const, score: 85 },
    { word: "Battery Life", sentiment: "negative" as const, score: 30 },
    { word: "Shipping", sentiment: "positive" as const, score: 15 },
  ];

  // 8. Generate Summary Text (Dynamic)
  const sentimentTrend = Number(currentStats.avgSentiment || 0) > Number(prevStats.avgSentiment || 0) ? "increased" : "stabilized";
  const ratingText = Number(currentStats.avgRating || 0) >= 4 ? "remains strong" : "requires attention";
  
  const summaryLine = `Your global brand sentiment ${sentimentTrend} this month, with an average rating of ${Number(currentStats.avgRating || 0).toFixed(1)} which ${ratingText}. Review volume is ${currentStats.count > prevStats.count ? 'up' : 'consistent'}.`

  const reportData = {
    period: `${currentMonthStart.toLocaleDateString("en-US", { month: 'long', day: 'numeric' })} – ${now.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}`,
    skuCount: Number(skuStats.count),
    totalReviews: Number(currentStats.count || 0),
    metrics: {
      avgRating: { 
        current: Number(currentStats.avgRating || 0), 
        change: Number(currentStats.avgRating || 0) - Number(prevStats.avgRating || 0) 
      },
      sentiment: { 
        current: Number(currentStats.avgSentiment || 0), 
        change: Number(currentStats.avgSentiment || 0) - Number(prevStats.avgSentiment || 0) 
      },
      velocity: { 
        current: Number(currentStats.count || 0), 
        change: calcChange(Number(currentStats.count || 0), Number(prevStats.count || 0)) 
      },
      responseRate: { 
        current: currentRespRate, 
        change: currentRespRate - prevRespRate 
      },
    },
    summary: summaryLine,
    topKeywords: keywords,
    aiInsights: aiData?.aiInsights || {
      winner: { title: "Durability", insight: "Awaiting more positive data signals.", recommendation: "Monitor 'Build Quality' mentions." },
      friction: { title: "Packaging", insight: "Occasional reports of shipping damage.", recommendation: "Review 3PL logistics." },
      opportunity: { title: "Niche Variants", insight: "Customers asking for more colors.", recommendation: "A/B test product images." },
    },
    retailerTable: retailerList.map(r => ({
      name: r.name || "Direct Site",
      rating: 4.5, // Ideally average per retailer
      insight: aiData?.retailerInsights?.[r.name || "Direct Site"] || "Consistent performance across metrics."
    })),
    benchmarks: aiData?.benchmarks || [
      { metric: "Price Satisfaction", value: "0%", status: "higher" as const },
      { metric: "Customer Service", value: "0%", status: "higher" as const },
      { metric: "Reliability", value: "0%", status: "higher" as const },
    ],
    actionItems: aiData?.actionItems || [
      { title: "Increase Volume", desc: "Encourage more reviews to unlock AI deepening." },
    ],
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-8 dark:bg-black">
      <div className="mb-6 flex items-center justify-between mx-auto max-w-4xl">
        <a href="/dashboard" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
          ← Back to Dashboard
        </a>
      </div>
      <ReviewPulseReport data={reportData} />
    </div>
  );
}
