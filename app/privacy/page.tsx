
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:hover:white transition-colors text-sm mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-black tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-zinc-500 mb-12 italic">Last Updated: January 5, 2026</p>

        <div className="space-y-12 prose dark:prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
              1. Our Role as a Data Processor
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Under global data protection laws (including GDPR and CCPA), Prodomatix acts 
              primarily as a <strong>Data Processor</strong>. Our clients (Manufacturers) are the 
              Data Controllers. We process personal data solely on behalf of and according 
              to the instructions of our clients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
              2. Data We Collect
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When a consumer submits a review through our widget, we collect:
            </p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2 mt-4">
              <li>Review Content & Ratings</li>
              <li>Reviewer Name or Alias</li>
              <li>Reviewer Email Address (for verification)</li>
              <li>Technical identifiers (IP address, Browser metadata) for fraud prevention</li>
              <li>Visual media (if the consumer uploads photos or videos)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
              3. Purpose of Processing
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We process this data to display reviews on the Manufacturer&apos;s site, syndicate 
              approved content to retail partners, provide AI-driven sentiment analysis to the 
              Manufacturer, and detect/prevent fraudulent submissions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
              4. Data Retention & Security
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We retain review data as long as the Manufacturer maintains an active subscription 
              or as required by law. All data is encrypted at rest and in transit using 
              industry-standard protocols (AES-256 and TLS 1.3).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="h-6 w-1 bg-emerald-600 rounded-full"></span>
              5. Your Rights (Consumers)
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Consumers wishing to exercise their rights (access, deletion, correction) should 
              reach out to the Manufacturer directly. As a Processor, Prodomatix will assist 
              Manufacturers in fulfilling these requests promptly.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
                Privacy concerns? Contact <a href="mailto:privacy@prodomatix.ui" className="text-emerald-600 hover:underline">privacy@prodomatix.ui</a>
            </p>
        </div>
      </div>
    </div>
  );
}
