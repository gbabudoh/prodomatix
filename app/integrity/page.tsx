
import Link from 'next/link';
import { Shield, CheckCircle, Search, AlertTriangle } from 'lucide-react';

export default function IntegrityPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Back to Home
        </Link>
        <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Shield className="h-7 w-7" />
            </div>
            <div>
                <h1 className="text-4xl font-black tracking-tight">Review Integrity Policy</h1>
                <p className="text-zinc-500">How we protect the authenticity of consumer feedback.</p>
            </div>
        </div>

        <div className="grid gap-12 mt-16">
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="text-emerald-500 h-6 w-6" />
                <h2 className="text-2xl font-bold">The Prodomatix Standard</h2>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              Our mission is to provide a &quot;True North&quot; for e-commerce. To maintain the trust of 
              consumers and major retail partners, we adhere to a zero-tolerance policy for 
              fraudulent or incentivized reviews that are not explicitly disclosed.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <h4 className="font-bold mb-2">Verified Buyer Badging</h4>
                    <p className="text-xs text-zinc-500">We cross-reference submissions with purchase data via secure API integrations with POS systems.</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                    <h4 className="font-bold mb-2">Anti-Incentive Controls</h4>
                    <p className="text-xs text-zinc-500">We strictly monitor for bulk uploads and bot-like behavior that mimic &quot;Review Farming&quot;.</p>
                </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <Search className="h-8 w-8 text-indigo-600 mb-6" />
                <h3 className="text-xl font-bold mb-4 italic">Algorithmic Moderation</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                    Every review passes through our AI-native engine. We detect rating mismatches 
                    (e.g., 5-star rating with negative text), duplicate patterns across SKUs, 
                    and toxic language before a review ever reaches the moderation queue.
                </p>
            </div>
            <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-6" />
                <h3 className="text-xl font-bold mb-4 italic">Fraud Prevention</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                    We use fingerprinting technology to ensure that multiple reviews for the 
                    same product cannot be submitted from the same device or IP address 
                    within a short window, preventing artificial rating inflation.
                </p>
            </div>
          </section>

          <section className="text-center py-12 border-t border-zinc-200 dark:border-zinc-800">
             <h2 className="text-2xl font-bold mb-4">Retailer Acceptance</h2>
             <p className="text-zinc-500 max-w-2xl mx-auto mb-8">
                Retail partners like Amazon, Walmart, and Target require proof of data integrity. 
                Our backend provides a &quot;Trust Certificate&quot; for every syndicated batch, 
                auditable back to the source submission.
             </p>
             <button className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                Contact for Audit Access
             </button>
          </section>
        </div>
      </div>
    </div>
  );
}
