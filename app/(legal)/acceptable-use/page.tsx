'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, AlertOctagon, Users, Bot, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AcceptableUsePage() {
  const allowedUses = [
    'Submit honest ratings based on genuine product experiences',
    'Share constructive feedback in your rating statements',
    'Follow products and build watchlists for personal tracking',
    'Use the platform for research and market sentiment analysis',
    'Promote your products through official AdFlow campaigns',
    'Engage respectfully with the community',
    'Report violations and suspicious activity',
    'Access the platform through supported browsers and devices',
  ];

  const prohibitedUses = [
    'Submit fake, fraudulent, or misleading ratings',
    'Coordinate with others to artificially inflate or deflate Prodo Scores',
    'Create multiple accounts to manipulate ratings',
    'Use automated tools, bots, or scripts to submit ratings',
    'Harass, threaten, or abuse other users',
    'Post defamatory, obscene, or illegal content',
    'Impersonate other users, businesses, or entities',
    'Attempt to hack, exploit, or compromise platform security',
    'Scrape or harvest data without authorization',
    'Use the platform for spam or unsolicited advertising',
    'Violate intellectual property rights of others',
    'Engage in any activity that violates applicable laws',
  ];

  const consequences = [
    {
      severity: 'Warning',
      color: 'amber',
      description: 'First-time minor violations may result in a warning and content removal.',
    },
    {
      severity: 'Temporary Suspension',
      color: 'orange',
      description: 'Repeated violations or moderate offenses may result in temporary account suspension.',
    },
    {
      severity: 'Permanent Ban',
      color: 'red',
      description: 'Severe violations, fraud, or repeated offenses will result in permanent account termination.',
    },
    {
      severity: 'Legal Action',
      color: 'red',
      description: 'Illegal activities may be reported to law enforcement and pursued legally.',
    },
  ];

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
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Acceptable Use Policy</h1>
            <p className="text-sm text-[var(--text-muted)]">Last updated: April 15, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              This Acceptable Use Policy outlines the rules and guidelines for using Prodomatix. 
              By using our platform, you agree to comply with this policy. Violations may result 
              in content removal, account suspension, or termination.
            </p>
          </div>
        </motion.div>

        {/* Allowed Uses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Allowed Uses</h2>
          </div>
          <ul className="space-y-3">
            {allowedUses.map((use, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">{use}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Prohibited Uses */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-red-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-red-500/10">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Prohibited Uses</h2>
          </div>
          <ul className="space-y-3">
            {prohibitedUses.map((use, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">{use}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Rating Integrity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Rating Integrity</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p>
              The integrity of Prodo Scores depends on honest, authentic ratings. We take rating 
              manipulation seriously and employ various detection methods:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Automated detection of suspicious rating patterns
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Analysis of account behavior and rating history
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                IP and device fingerprinting to detect multi-accounting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                Community reporting and manual review processes
              </li>
            </ul>
            <p className="text-amber-400/80 text-sm mt-4">
              ⚠️ Ratings found to be fraudulent will be removed and may not be reflected in Prodo Scores.
            </p>
          </div>
        </motion.section>

        {/* Automated Access */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Automated Access</h2>
          </div>
          <div className="space-y-4 text-[var(--text-secondary)]">
            <p>
              Automated access to Prodomatix is restricted. The following are NOT permitted without 
              explicit written authorization:
            </p>
            <ul className="space-y-2 pl-4">
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                Web scraping or data harvesting
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                Automated rating submission
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                Bot accounts or automated interactions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                API access beyond documented public endpoints
              </li>
            </ul>
            <p className="text-sm mt-4">
              For API access or partnership inquiries, contact{' '}
              <Link href="mailto:api@prodomatix.com" className="text-purple-400 hover:underline cursor-pointer">
                api@prodomatix.com
              </Link>
            </p>
          </div>
        </motion.section>

        {/* Consequences */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <AlertOctagon className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Consequences of Violations</h2>
          </div>
          <div className="grid gap-4">
            {consequences.map((item, index) => (
              <motion.div
                key={item.severity}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  item.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20' :
                  item.color === 'orange' ? 'bg-orange-500/5 border-orange-500/20' :
                  'bg-red-500/5 border-red-500/20'
                }`}
              >
                <h4 className={`font-medium mb-1 ${
                  item.color === 'amber' ? 'text-amber-400' :
                  item.color === 'orange' ? 'text-orange-400' :
                  'text-red-400'
                }`}>
                  {item.severity}
                </h4>
                <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Reporting */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-teal-500/10">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Reporting Violations</h2>
          </div>
          <div className="text-[var(--text-secondary)]">
            <p className="mb-4">
              If you encounter content or behavior that violates this policy, please report it:
            </p>
            <ul className="space-y-2 pl-4 mb-4">
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                Use the "Report" button on ratings and profiles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                Email{' '}
                <Link href="mailto:abuse@prodomatix.com" className="text-teal-400 hover:underline cursor-pointer">
                  abuse@prodomatix.com
                </Link>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-400">•</span>
                Include relevant details and evidence when reporting
              </li>
            </ul>
            <p className="text-sm text-[var(--text-muted)]">
              All reports are reviewed by our Trust & Safety team. We may not be able to disclose 
              the outcome of investigations due to privacy considerations.
            </p>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-center text-[var(--text-muted)]"
        >
          <p>
            Questions about this policy? Contact us at{' '}
            <Link href="mailto:legal@prodomatix.com" className="text-emerald-400 hover:underline cursor-pointer">
              legal@prodomatix.com
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
