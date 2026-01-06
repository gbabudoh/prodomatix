
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black tracking-tight mb-4">Terms of Service</h1>
        <p className="text-zinc-500 mb-12 italic">Last Updated: January 5, 2026</p>

        <div className="space-y-12 prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              1. Agreement to Terms
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              By accessing or using the Prodomatix platform, you (&quot;Manufacturer&quot; or &quot;Client&quot;) agree to be bound 
              by these Terms of Service. Prodomatix provides a headless review engine designed to collect, 
              moderate, and syndicate user-generated content (&quot;UGC&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              2. Data Ownership & Syndication Rights
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed font-semibold">
              The Manufacturer maintains primary ownership of all customer review content collected through the Prodomatix widget.
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              However, by using our services, the Manufacturer grants Prodomatix a perpetual, worldwide, 
              non-exclusive, royalty-free license to host, store, use, display, reproduce, modify, 
              adapt, publish, and syndicate said content to authorized third-party retail partners. 
              This license is essential for the functionality of the syndication network.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              3. Manufacturer Responsibilities
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The Manufacturer is responsible for ensuring that all products listed comply with local 
              laws and that review collection does not violate any consumer protection regulations. 
              Prodomatix reserves the right to suspend accounts engaged in deceptive review practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              4. Service Availability & Security
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              While we strive for 99.9% uptime, Prodomatix is provided &quot;as is&quot;. We implement 
              industry-standard security measures to protect review data, but the Manufacturer 
              acknowledges the inherent risks of cloud-based data processing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-indigo-600 rounded-full"></span>
              5. Limitation of Liability
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Prodomatix shall not be liable for any indirect, incidental, or consequential damages 
              arising out of the use or inability to use the syndication network, including but not 
              limited to loss of retail partner placement or consumer trust.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
                Questions about our terms? Contact <a href="mailto:legal@prodomatix.ui" className="text-indigo-600 hover:underline">legal@prodomatix.ui</a>
            </p>
        </div>
      </div>
    </div>
  );
}
