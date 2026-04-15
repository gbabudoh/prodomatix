'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, Shield, AlertTriangle, Users, CreditCard, Ban, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptance of Terms',
      content: `By accessing or using Prodomatix ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Platform.

These Terms constitute a legally binding agreement between you and Prodomatix. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Platform constitutes acceptance of any modified Terms.`
    },
    {
      icon: Users,
      title: '2. User Accounts & Eligibility',
      content: `To use certain features of the Platform, you must register for an account. You must be at least 18 years old to create an account.

You agree to:
• Provide accurate, current, and complete information during registration
• Maintain the security of your password and account
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized use

We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.`
    },
    {
      icon: Scale,
      title: '3. Prodo Score & Ratings System',
      content: `The Prodo Score is a sentiment-based metric calculated from user ratings. It is NOT financial advice, investment guidance, or an objective measure of product quality.

You understand that:
• Prodo Scores reflect aggregated user opinions only
• Scores can fluctuate based on user activity
• We do not guarantee the accuracy of any ratings
• Manipulation of ratings is strictly prohibited
• We may adjust or remove ratings that violate our policies

The Platform simulates a "stock market" experience for entertainment and informational purposes only.`
    },
    {
      icon: Shield,
      title: '4. User Conduct & Content',
      content: `When using the Platform, you agree NOT to:
• Submit false, misleading, or fraudulent ratings
• Manipulate Prodo Scores through coordinated activity
• Harass, abuse, or harm other users
• Impersonate any person or entity
• Upload malicious code or interfere with Platform operations
• Use automated systems to submit ratings
• Violate any applicable laws or regulations

User-generated content (ratings, statements) remains your responsibility. We may remove content that violates these Terms.`
    },
    {
      icon: CreditCard,
      title: '5. AdFlow & Paid Services',
      content: `AdFlow campaigns and other paid services are subject to additional terms:

• All fees are non-refundable unless otherwise stated
• Campaign placement is subject to availability
• We reserve the right to reject campaigns that violate our policies
• Pricing may change with reasonable notice
• You are responsible for the accuracy of campaign content

Business accounts must comply with all applicable advertising laws and regulations.`
    },
    {
      icon: AlertTriangle,
      title: '6. Disclaimers & Limitations',
      content: `THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.

We disclaim all warranties, express or implied, including:
• Merchantability and fitness for a particular purpose
• Accuracy, reliability, or completeness of content
• Uninterrupted or error-free operation
• Security of data transmission

TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRODOMATIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.`
    },
    {
      icon: Ban,
      title: '7. Termination',
      content: `We may terminate or suspend your account at any time, with or without cause, with or without notice.

Upon termination:
• Your right to use the Platform ceases immediately
• We may delete your account data
• Provisions that should survive termination will remain in effect

You may terminate your account at any time through your account settings or by contacting support.`
    },
    {
      icon: RefreshCw,
      title: '8. Governing Law & Disputes',
      content: `These Terms are governed by the laws of the jurisdiction in which Prodomatix operates, without regard to conflict of law principles.

Any disputes arising from these Terms or your use of the Platform shall be resolved through:
1. Good faith negotiation
2. Mediation (if negotiation fails)
3. Binding arbitration (if mediation fails)

You waive any right to participate in class action lawsuits against Prodomatix.`
    }
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
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Terms of Service</h1>
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
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Welcome to Prodomatix. These Terms of Service govern your use of our platform, 
              which provides a sentiment-based rating system for products and services. 
              Please read these terms carefully before using our services.
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <section.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] pt-2">
                  {section.title}
                </h2>
              </div>
              <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line pl-16">
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-center"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Questions?</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            If you have any questions about these Terms, please contact us.
          </p>
          <Link
            href="mailto:legal@prodomatix.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Contact Legal Team
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
