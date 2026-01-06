
import { db } from "@/lib/db";
import { brands, retailers, reviews, users } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";
import { 
  Building2, 
  Store, 
  MessageSquare, 
  CreditCard, 
  TrendingUp,
  Activity
} from "lucide-react";

export default async function AdminDashboardPage() {
  // 1. Fetch Global Stats
  const [brandCount] = await db.select({ count: sql<number>`count(*)` }).from(brands);
  const [retailerCount] = await db.select({ count: sql<number>`count(*)` }).from(retailers);
  const [reviewCount] = await db.select({ count: sql<number>`count(*)` }).from(reviews);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  // 2. Mock Trend Data
  const kpis = [
    { name: "Global Brands", value: brandCount.count, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Syndication Partners", value: retailerCount.count, icon: Store, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Total Review volume", value: reviewCount.count, icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Active Users", value: userCount.count, icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  // 3. Recent Activity (Latest Reviews)
  const recentReviews = await db.query.reviews.findMany({
    with: { product: true },
    orderBy: [desc(reviews.createdAt)],
    limit: 5
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Platform Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Master controls for the Prodomatix network.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl ${kpi.bg} p-2 ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-zinc-500">{kpi.name}</p>
            <h2 className="text-3xl font-black mt-1">{kpi.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
                <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <h2 className="text-lg font-bold">Global Activity Feed</h2>
                </div>
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentReviews.map((review) => (
                        <div key={review.id} className="p-6 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                                        <Activity className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">New Review for &quot;{review.product?.name}&quot;</p>
                                        <p className="text-xs text-zinc-500">Submitted by {review.reviewerName || "Anonymous"}</p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                                    review.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {review.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-zinc-50/50 text-center dark:bg-zinc-800/50">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar Mini stats */}
        <aside className="space-y-6">
            <div className="rounded-3xl bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">Revenue Pulse</h3>
                    <p className="text-indigo-100 text-sm mb-6">Upcoming Stripe Integration will populate real-time MRR here.</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                             <span>Estimated MRR</span>
                             <span className="font-bold">$12,450</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                             <span>Churn (30d)</span>
                             <span className="font-bold">2.1%</span>
                        </div>
                    </div>
                </div>
                <CreditCard className="absolute -bottom-6 -right-6 h-32 w-32 text-white/10 -rotate-12" />
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                        <Building2 className="h-5 w-5" />
                        Add Brand
                    </button>
                    <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                        <Store className="h-5 w-5" />
                        Add Retail
                    </button>
                </div>
            </div>
        </aside>
      </div>
    </div>
  );
}
