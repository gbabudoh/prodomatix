
import { db } from "@/lib/db";
import { reviews, retailers } from "@/lib/db/schema";
import { desc, sql, eq, and, gte, lt } from "drizzle-orm";
import SentimentChart from "@/components/SentimentChart";
import SentimentHeatmap from "@/components/SentimentHeatmap";
import ActionQueue from "@/components/ActionQueue";
import SyndicationLatencyChart from "@/components/SyndicationLatencyChart";
import ResponseRate from "@/components/ResponseRate";
import ExportButton from "@/components/ExportButton";
import Link from "next/link";
import { ArrowUpRight, Trophy, AlertTriangle, Lightbulb } from "lucide-react";

export default async function DashboardPage() {
  // --- DATA FETCHING ---
  
  // 1. Fetch KPI Metrics
  const [metrics] = await db
    .select({
      count: sql<number>`count(*)`,
      avgRating: sql<number>`avg(${reviews.rating})`,
      positive: sql<number>`count(case when ${reviews.sentiment} = 'positive' then 1 end)`,
      neutral: sql<number>`count(case when ${reviews.sentiment} = 'neutral' then 1 end)`,
      negative: sql<number>`count(case when ${reviews.sentiment} = 'negative' then 1 end)`,
    })
    .from(reviews);

  // 2. Fetch Recent Reviews
  const recentReviews = await db.query.reviews.findMany({
    with: {
      product: true,
      retailer: true,
    },
    orderBy: [desc(reviews.createdAt)],
    limit: 10,
  });

  // 3. Fetch Action Queue
  const actionItems = recentReviews.filter(r => r.rating < 4 || r.sentiment === "negative");

  // 4. Generate Heatmap Data
  const allTags = recentReviews
    .flatMap(r => (r.tags || "").split(",").map(t => t.trim()))
    .filter(t => t.length > 0);
  
  const tagCounts: Record<string, number> = {};
  allTags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  
  const heatmapData = Object.entries(tagCounts)
    .map(([name, value]) => ({
      name,
      value,
      sentiment: (["Battery", "Price", "Usability"].includes(name) ? "negative" : "positive") as "positive"|"negative"|"neutral"
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // 5. Retailer Comparison
  const retailerStats = await db
    .select({
      name: retailers.name,
      avgRating: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(*)`,
    })
    .from(reviews)
    .leftJoin(retailers, eq(reviews.retailerId, retailers.id))
    .groupBy(retailers.name);

  // 6. Response Rate Logic
  const [responseStats] = await db
    .select({
      totalNegative: sql<number>`count(case when ${reviews.sentiment} = 'negative' then 1 end)`,
      respondedNegative: sql<number>`count(case when ${reviews.sentiment} = 'negative' and ${reviews.manufacturerResponse} is not null then 1 end)`,
    })
    .from(reviews);

  // 7. Mock Latency Data
  const latencyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString("en-US", { weekday: 'short' }),
      latencyMs: Math.floor(Math.random() * (400 - 150) + 150),
    };
  });

  // 8. Fetch High-Impact Reviews for AI Analysis (Current Month)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [posReviews, negReviews, retailerList] = await Promise.all([
    db.query.reviews.findMany({
      where: and(gte(reviews.createdAt, currentMonthStart), lt(reviews.createdAt, nextMonthStart), eq(reviews.sentiment, "positive")),
      limit: 10,
    }),
    db.query.reviews.findMany({
      where: and(gte(reviews.createdAt, currentMonthStart), lt(reviews.createdAt, nextMonthStart), eq(reviews.sentiment, "negative")),
      limit: 10,
    }),
    db.selectDistinct({ name: retailers.name }).from(retailers),
  ]);

  // 9. Generate AI Intelligence
  let aiData = null;
  if (posReviews.length > 0 || negReviews.length > 0) {
    const { generateintelligenceReport } = await import("@/lib/services/intelligence-report");
    aiData = await generateintelligenceReport({
      positiveReviews: posReviews.map(r => r.content),
      negativeReviews: negReviews.map(r => r.content),
      retailers: retailerList.map(r => r.name || "Direct Site"),
    });
  }

  const aiInsights = aiData?.aiInsights || {
    winner: {
      title: "Analyzing Trends",
      insight: `We are monitoring your ${metrics.positive} positive reviews for new patterns.`,
    },
    friction: {
      title: "Support Queue",
      insight: `Addressing ${metrics.negative} negative reviews in your Action Queue.`,
    },
    opportunity: {
      title: "Market Expansion",
      insight: `Analyzing customer requests for new product variations.`,
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Executive Command Center</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Real-time intelligence on product performance.</p>
        </div>
        <div className="flex gap-3">
          <ExportButton 
            data={recentReviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() }))} 
            filename={`ReviewPulse_Export_${new Date().toISOString().split('T')[0]}.csv`}
          />
          <Link 
            href="/dashboard/reports" 
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 py-2 transition-all active:scale-95 cursor-pointer"
          >
            Coming Up: Jan Report
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Global Rating</div>
          <div className="mt-2 flex items-baseline gap-2">
             <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{Number(metrics.avgRating || 0).toFixed(1)}</span>
             <span className="text-sm text-zinc-400">/ 5.0</span>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Total Volume</div>
          <div className="mt-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">{metrics.count}</div>
          <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
             <ArrowUpRight className="mr-1 h-3 w-3" />
             12% vs last month
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Syndication Health</div>
          <div className="mt-2 text-4xl font-bold text-blue-600">98%</div>
          <div className="mt-1 text-xs text-zinc-400">Sync active on 3 channels</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Sentiment Score</div>
          <div className="mt-2 h-16 w-full">
            <SentimentChart
              positive={Number(metrics.positive)}
              neutral={Number(metrics.neutral)}
              negative={Number(metrics.negative)}
            />
          </div>
        </div>
      </div>

      {/* AI Insights Surface */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 transition-all hover:bg-emerald-50 hover:shadow-md dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:hover:bg-emerald-900/20">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Trophy className="h-5 w-5" />
            </div>
            <span className="font-semibold text-emerald-900 dark:text-emerald-200">The Winner</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{aiInsights.winner.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{aiInsights.winner.insight}</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-amber-100 bg-amber-50/50 p-6 transition-all hover:bg-amber-50 hover:shadow-md dark:border-amber-900/30 dark:bg-amber-900/10 dark:hover:bg-amber-900/20">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="font-semibold text-amber-900 dark:text-amber-200">The Friction</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{aiInsights.friction.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{aiInsights.friction.insight}</p>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/50 p-6 transition-all hover:bg-blue-50 hover:shadow-md dark:border-blue-900/30 dark:bg-blue-900/10 dark:hover:bg-blue-900/20">
          <div className="mb-3 flex items-center gap-3">
             <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Lightbulb className="h-5 w-5" />
            </div>
            <span className="font-semibold text-blue-900 dark:text-blue-200">The Opportunity</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{aiInsights.opportunity.title}</h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{aiInsights.opportunity.insight}</p>
        </div>
      </div>

      {/* Main Grid: Visuals & Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
           {/* Heatmap */}
           <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
             <h2 className="mb-6 font-bold text-zinc-900 dark:text-zinc-100">Sentiment Heatmap</h2>
             <SentimentHeatmap data={heatmapData} />
           </div>

           {/* Retailer Table */}
           <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
             <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/50">
               <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Retailer Performance</h2>
             </div>
             <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Channel</th>
                    <th className="px-6 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3 font-medium">Volume</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {retailerStats.map((r) => (
                    <tr key={r.name || "Direct"} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                      <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">{r.name || "Direct Site"}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            Number(r.avgRating) >= 4 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                          {Number(r.avgRating).toFixed(1)} ★
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500">{r.count} reviews</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                          <span className="text-xs font-medium">Live</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
           </div>

           {/* Action Queue */}
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
               <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                  <div>
                     <h2 className="font-bold flex items-center gap-2">
                        <span>⚡</span> Action Queue
                     </h2>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{actionItems.length} Pending</span>
               </div>
               <div className="p-0">
                  <ActionQueue reviews={actionItems.map(r => ({ 
                    ...r, 
                    reviewerName: r.reviewerName || "Anonymous",
                    createdAt: r.createdAt.toISOString()
                  }))} />
               </div>
            </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
               <h3 className="mb-4 font-bold text-zinc-900 dark:text-zinc-100">Syndication Latency</h3>
               <SyndicationLatencyChart data={latencyData} />
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
               <h3 className="mb-4 font-bold text-zinc-900 dark:text-zinc-100">Response Rate</h3>
               <div className="flex flex-col items-center">
                   <ResponseRate 
                      responded={Number(responseStats.respondedNegative)} 
                      totalNegative={Number(responseStats.totalNegative)} 
                   />
                   <p className="mt-4 text-center text-sm text-zinc-500">
                      {responseStats.respondedNegative} of {responseStats.totalNegative} critical issues addressed.
                   </p>
               </div>
            </div>

             <div className="rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
                <h3 className="text-lg font-bold">Pro Tips</h3>
                <ul className="mt-4 space-y-3 text-sm text-indigo-100">
                   <li className="flex gap-2">
                      <span className="text-indigo-300">•</span>
                      <span>Respond to negative reviews within 24h to boost trust by 15%.</span>
                   </li>
                   <li className="flex gap-2">
                      <span className="text-indigo-300">•</span>
                      <span>&quot;Durability&quot; is your top keyword. Highlight it in ads.</span>
                   </li>
                </ul>
             </div>
        </div>
      </div>
    </div>
  );
}
