'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Eye, Database, Share2, Shield, Clock, Globe, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: '1. Information We Collect',
      content: `We collect information you provide directly and information collected automatically:

**Information You Provide:**
• Account information (name, email, password)
• Profile data (business name, role type)
• Ratings and statements you submit
• Communications with our support team

**Automatically Collected:**
• Device information (browser type, operating system)
• Usage data (pages visited, features used)
• IP address and approximate location
• Cookies and similar tracking technologies`
    },
    {
      icon: Database,
      title: '2. How We Use Your Information',
      content: `We use collected information to:

• Provide, maintain, and improve the Platform
• Calculate and display Prodo Scores
• Process transactions and send related information
• Send technical notices and support messages
• Respond to your comments and questions
• Analyze usage patterns to improve user experience
• Detect, prevent, and address fraud and abuse
• Comply with legal obligations

We do NOT sell your personal information to third parties.`
    },
    {
      icon: Share2,
      title: '3. Information Sharing',
      content: `We may share your information in these circumstances:

**Public Information:**
• Ratings and statements are publicly visible
• Business profiles are publicly displayed
• Prodo Scores are aggregated from public ratings

**Service Providers:**
• Hosting and infrastructure providers
• Email delivery services
• Analytics providers
• Payment processors (for paid features)

**Legal Requirements:**
• To comply with applicable laws
• To respond to legal process
• To protect our rights and safety`
    },
    {
      icon: Shield,
      title: '4. Data Security',
      content: `We implement industry-standard security measures:

• Encryption of data in transit (TLS/SSL)
• Secure password hashing (bcrypt)
• Regular security assessments
• Access controls and authentication
• Secure session management

However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.`
    },
    {
      icon: Clock,
      title: '5. Data Retention',
      content: `We retain your information for as long as necessary to:

• Provide our services to you
• Comply with legal obligations
• Resolve disputes and enforce agreements
• Maintain business records

**Retention Periods:**
• Account data: Until account deletion + 30 days
• Ratings: Indefinitely (anonymized after account deletion)
• Session data: 7 days
• Email verification tokens: 24 hours
• Password reset tokens: 1 hour

You may request deletion of your account at any time.`
    },
    {
      icon: Globe,
      title: '6. International Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws.

We ensure appropriate safeguards are in place:
• Standard contractual clauses
• Data processing agreements
• Compliance with applicable transfer mechanisms

By using the Platform, you consent to the transfer of your information to these countries.`
    },
    {
      icon: UserCheck,
      title: '7. Your Rights & Choices',
      content: `Depending on your location, you may have the following rights:

**Access & Portability:**
• Request a copy of your personal data
• Receive data in a portable format

**Correction & Deletion:**
• Update inaccurate information
• Request deletion of your data

**Opt-Out:**
• Unsubscribe from marketing emails
• Disable non-essential cookies
• Withdraw consent where applicable

**GDPR Rights (EU/EEA):**
• Right to erasure ("right to be forgotten")
• Right to restrict processing
• Right to object to processing
• Right to lodge a complaint with a supervisory authority

To exercise these rights, contact us at privacy@prodomatix.com`
    },
    {
      icon: Mail,
      title: '8. Contact & Updates',
      content: `**Data Protection Officer:**
Email: privacy@prodomatix.com

**Policy Updates:**
We may update this Privacy Policy from time to time. We will notify you of material changes by:
• Posting the new policy on this page
• Updating the "Last updated" date
• Sending an email notification (for significant changes)

Your continued use of the Platform after changes constitutes acceptance of the updated policy.`
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
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Privacy Policy</h1>
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
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              At Prodomatix, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this 
              policy carefully to understand our practices regarding your personal data.
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
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] pt-2">
                  {section.title}
                </h2>
              </div>
              <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line pl-16 prose-strong:text-[var(--text-primary)]">
                {section.content.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i} className="text-[var(--text-primary)]">{part}</strong> : part
                )}
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
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Privacy Concerns?</h3>
          <p className="text-[var(--text-secondary)] mb-4">
            If you have questions about your data or wish to exercise your rights, contact our privacy team.
          </p>
          <Link
            href="mailto:privacy@prodomatix.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
          >
            Contact Privacy Team
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
