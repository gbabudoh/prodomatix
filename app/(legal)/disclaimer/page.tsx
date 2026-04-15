'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, TrendingUp, Scale, MessageSquare, DollarSign, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DisclaimerPage() {
  const disclaimers = [
    {
      icon: TrendingUp,
      title: 'Not Financial Advice',
      color: 'red',
      content: `The Prodo Score and all related metrics on Prodomatix are for INFORMATIONAL AND ENTERTAINMENT PURPOSES ONLY.

• Prodo Scores are NOT investment recommendations
• We do NOT provide financial, investment, or trading advice
• The "stock market" terminology is metaphorical only
• No actual securities or financial instruments are traded
• Past performance does not indicate future results

Always consult qualified professionals for financial decisions.`
    },
    {
      icon: MessageSquare,
      title: 'User-Generated Content',
      color: 'amber',
      content: `Ratings, statements, and reviews on Prodomatix are submitted by users and reflect their personal opinions.

• We do NOT verify the accuracy of user submissions
• Ratings may be biased, incomplete, or incorrect
• We are NOT responsible for user-generated content
• Views expressed by users do not represent our views
• We reserve the right to remove content without notice

Use your own judgment when evaluating products based on user ratings.`
    },
    {
      icon: Scale,
      title: 'No Warranties',
      color: 'blue',
      content: `THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES.

We make NO warranties regarding:
• Accuracy, completeness, or reliability of content
• Availability or uninterrupted operation
• Fitness for any particular purpose
• Non-infringement of third-party rights
• Security of data transmission

Your use of the Platform is at your own risk.`
    },
    {
      icon: DollarSign,
      title: 'Third-Party Products',
      color: 'emerald',
      content: `Products and services rated on Prodomatix are owned and operated by third parties.

• We do NOT endorse any products or services
• We have NO affiliation with rated products (unless disclosed)
• We are NOT responsible for product quality or performance
• Purchasing decisions are your sole responsibility
• We do NOT guarantee any outcomes from product use

Always research products independently before purchasing.`
    },
    {
      icon: Zap,
      title: 'Limitation of Liability',
      color: 'purple',
      content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW:

Prodomatix shall NOT be liable for:
• Direct, indirect, incidental, or consequential damages
• Loss of profits, data, or business opportunities
• Damages arising from use or inability to use the Platform
• Damages from user-generated content
• Damages from third-party products or services

Our total liability shall not exceed the amount you paid us in the past 12 months.`
    }
  ];

  const colorClasses = {
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400' },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Disclaimer</h1>
            <p className="text-sm text-[var(--text-muted)]">Last updated: April 15, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Important Notice</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Please read this disclaimer carefully before using Prodomatix. By accessing or using our 
                  platform, you acknowledge that you have read, understood, and agree to be bound by this 
                  disclaimer. If you do not agree, please do not use our services.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer Sections */}
        <div className="space-y-8">
          {disclaimers.map((item, index) => {
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            return (
              <motion.section
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl ${colors.bg} border ${colors.border}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <item.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] pt-2">
                    {item.title}
                  </h2>
                </div>
                <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line pl-16">
                  {item.content}
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Acknowledgment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Acknowledgment</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            By using Prodomatix, you acknowledge that:
          </p>
          <ul className="mt-4 space-y-2 text-[var(--text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              You have read and understood this disclaimer
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              You accept all risks associated with using the Platform
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              You will not rely solely on Prodo Scores for any decisions
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 mt-1">✓</span>
              You understand the Platform is for informational purposes only
            </li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center text-[var(--text-muted)]"
        >
          <p>
            Questions about this disclaimer? Contact us at{' '}
            <Link href="mailto:legal@prodomatix.com" className="text-emerald-400 hover:underline cursor-pointer">
              legal@prodomatix.com
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
