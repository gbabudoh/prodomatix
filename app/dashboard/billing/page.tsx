import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const session = await auth();
  
  // Protect route in production
  if (!session?.user && process.env.NODE_ENV !== "development") redirect("/");

  // Fetch brand subscription details
  // Note: For demo purposes, we fallback to a mock brand if session brandId is missing
  let subscription = { tier: "free", status: "active" };
  
  // In real app: session.user.brandId
  // In dev demo: fallback to "free"
  if (session?.user?.brandId) {
    const brand = await db.query.brands.findFirst({
      where: eq(brands.id, session.user.brandId),
    });
    if (brand) {
      subscription = { tier: brand.subscriptionTier, status: brand.subscriptionStatus };
    }
  }

  const plans = [
    {
      name: "Starter",
      id: "free",
      price: "$0",
      features: ["50 Products", "1,000 Monthly Reviews", "Basic Analytics"],
    },
    {
      name: "Professional",
      id: "pro",
      price: "$299",
      features: ["Unlimited Products", "Syndication API", "AI Summaries", "Priority Support"],
    },
    {
      name: "Enterprise",
      id: "enterprise",
      price: "Custom",
      features: ["Verified Buyer Badges", "Competitor Insights", "Dedicated Account Manager"],
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="text-3xl font-bold">Subscription & Billing</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Manage your Prodomatix plan and payment methods.</p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Current Plan</h2>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold capitalize text-indigo-600">{subscription.tier}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700'
                }`}>
                  {subscription.status}
                </span>
              </div>
            </div>
            <button className="rounded-lg bg-zinc-900 px-6 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-300">
              Manage Billing
            </button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:shadow-lg ${
                subscription.tier === plan.id 
                  ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-black' 
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="my-4 text-3xl font-extrabold">{plan.price}<span className="text-sm font-normal text-zinc-500">/mo</span></div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-indigo-600">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <button 
                className={`w-full rounded-lg py-2 font-bold transition-colors ${
                  subscription.tier === plan.id
                    ? 'cursor-default bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {subscription.tier === plan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
