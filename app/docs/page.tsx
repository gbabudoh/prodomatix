
import { Metadata } from "next";
import ApiSection from "@/components/docs/ApiSection";
import { Shield, Zap, AlertCircle, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Prodomatix API Documentation",
  description: "Enterprise-grade developer documentation for Prodomatix API",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-20 space-y-16">
        {/* Hero Section */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
            <BookOpen className="h-3 w-3" />
            Developer Center
          </div>
          <h1 className="text-5xl font-black tracking-tight lg:text-6xl">
            API Reference
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
            Everything you need to integrate Prodomatix reviews into your commerce stack. 
            Built for performance, security, and retail-grade syndication.
          </p>
        </header>

        {/* Global Configuration */}
        <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Shield className="h-8 w-8 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold mb-3">Authentication</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    All secure requests must include your Primary API Key in the headers. 
                    You can manage your keys in the dashboard under settings.
                </p>
                <div className="rounded-xl bg-zinc-950 p-4 text-xs font-mono text-zinc-400">
                    x-api-key: sk_prod_your_key_here
                </div>
            </div>
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <Zap className="h-8 w-8 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold mb-3">Rate Limiting</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                    We enforce strict rate limits to ensure platform stability. 
                    Exceeding these limits will return a <code className="text-rose-600">429 Too Many Requests</code> status.
                </p>
                <ul className="text-xs font-bold uppercase tracking-widest text-zinc-400 space-y-2">
                    <li className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                        <span>Production Tier</span>
                        <span className="text-zinc-900 dark:text-zinc-50">1,000 req/min</span>
                    </li>
                    <li className="flex justify-between pt-1">
                        <span>Burst Limit</span>
                        <span className="text-zinc-900 dark:text-zinc-50">100 req/sec</span>
                    </li>
                </ul>
            </div>
        </section>

        {/* Endpoints */}
        <div className="space-y-12">
            <div className="space-y-2">
                <h2 className="text-3xl font-bold">Endpoints</h2>
                <div className="h-1 w-20 bg-indigo-600 rounded-full"></div>
            </div>

            <div className="space-y-8">
                <ApiSection 
                    method="POST"
                    endpoint="/api/reviews"
                    description="Submit a new consumer review directly to the moderation pipeline."
                    bodyJson={`{
  "productId": "5ca6dd48-7359-4221-9065-aba57099f696",
  "rating": 5,
  "content": "Absolutely love this widget! Integration was seamless.",
  "reviewerName": "Alice Johnson",
  "reviewerEmail": "alice@example.com",
  "title": "Five Stars!"
}`}
                    responseJson={`{
  "success": true,
  "reviewId": "uuid-123-456",
  "status": "pending_moderation"
}`}
                />

                <ApiSection 
                    method="GET"
                    endpoint="/api/syndication"
                    description="Retrieve approved reviews for retail syndication and partner displays."
                    headers={[{ key: "x-api-key", value: "REQUIRED" }]}
                    queryParams={[
                        { key: "since", description: "Filter reviews created after this ISO date string." },
                        { key: "productId", description: "Filter reviews for a specific product SKU." }
                    ]}
                    responseJson={`{
  "retailer": "Retailer Name",
  "count": 1,
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "content": "...",
      "sentiment": "positive",
      "product": { "name": "...", "sku": "..." }
    }
  ]
}`}
                />
            </div>
        </div>

        {/* Error Schema */}
        <section className="rounded-3xl border border-rose-100 bg-rose-50/20 p-8 dark:border-rose-900/20 dark:bg-zinc-900">
            <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-6 w-6 text-rose-600" />
                <h3 className="text-2xl font-bold italic">Standard Error Schema</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { code: "400", label: "Bad Request", desc: "Invalid payload or missing fields" },
                    { code: "401", label: "Unauthorized", desc: "Missing or malformed API key" },
                    { code: "429", label: "Too Many Requests", desc: "Rate limit exceeded" },
                    { code: "500", label: "Server Error", desc: "Internal failure" }
                ].map((err) => (
                    <div key={err.code} className="space-y-1">
                        <span className="text-lg font-black text-rose-600 font-mono">{err.code}</span>
                        <h4 className="font-bold text-sm">{err.label}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">{err.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        <footer className="pt-20 text-center border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">
                Need help with your integration? Reach out to <a href="mailto:support@prodomatix.ui" className="text-indigo-600 font-bold hover:underline">Support</a>
            </p>
        </footer>
      </div>
    </div>
  );
}
