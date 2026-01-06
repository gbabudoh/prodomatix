import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { 
  CreditCard, 
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

export default async function SubscriptionsPage() {
  // Fetch subscription statistics
  const allBrands = await db.select().from(brands).orderBy(desc(brands.createdAt));
  
  const stats = {
    total: allBrands.length,
    active: allBrands.filter(b => b.subscriptionStatus === "active").length,
    pastDue: allBrands.filter(b => b.subscriptionStatus === "past_due").length,
    free: allBrands.filter(b => b.subscriptionTier === "free").length,
    pro: allBrands.filter(b => b.subscriptionTier === "pro").length,
    enterprise: allBrands.filter(b => b.subscriptionTier === "enterprise").length,
  };

  const kpis = [
    { name: "Total Subscriptions", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Active", value: stats.active, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Past Due", value: stats.pastDue, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "MRR Estimate", value: `$${(stats.pro * 99 + stats.enterprise * 299).toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Subscription Management</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Monitor and manage all platform subscriptions.</p>
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

      {/* Subscriptions Table */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/50 px-8 py-6 dark:border-zinc-800 dark:bg-zinc-800/50">
          <h2 className="text-lg font-bold">All Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-zinc-500">Brand</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-zinc-500">Tier</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-zinc-500">Stripe ID</th>
                <th className="px-8 py-4 text-left text-xs font-black uppercase tracking-widest text-zinc-500">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {allBrands.map((brand) => (
                <tr key={brand.id} className="transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center dark:bg-indigo-900/20">
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{brand.name}</p>
                        <p className="text-xs text-zinc-500">{brand.website || "No website"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      brand.subscriptionTier === 'enterprise' ? 'bg-purple-100 text-purple-700' :
                      brand.subscriptionTier === 'pro' ? 'bg-blue-100 text-blue-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {brand.subscriptionTier}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                      brand.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      brand.subscriptionStatus === 'past_due' ? 'bg-amber-100 text-amber-700' :
                      'bg-zinc-100 text-zinc-700'
                    }`}>
                      {brand.subscriptionStatus === 'active' && <CheckCircle2 className="h-3 w-3" />}
                      {brand.subscriptionStatus === 'past_due' && <Clock className="h-3 w-3" />}
                      {brand.subscriptionStatus}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs font-mono text-zinc-500">{brand.stripeCustomerId || "—"}</p>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs text-zinc-500">{brand.createdAt ? new Date(brand.createdAt).toLocaleDateString() : "—"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
