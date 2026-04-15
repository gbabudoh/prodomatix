'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Cookie, Settings, BarChart3, Target, Shield, ToggleLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CookiePolicyPage() {
  const [preferences, setPreferences] = useState({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const cookieTypes = [
    {
      icon: Shield,
      key: 'necessary',
      title: 'Strictly Necessary Cookies',
      required: true,
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      cookies: [
        { name: 'session_token', purpose: 'User authentication', duration: '7 days' },
        { name: 'csrf_token', purpose: 'Security protection', duration: 'Session' },
        { name: 'cookie_consent', purpose: 'Store cookie preferences', duration: '1 year' },
      ]
    },
    {
      icon: Settings,
      key: 'functional',
      title: 'Functional Cookies',
      required: false,
      description: 'These cookies enable personalized features and remember your preferences to enhance your experience.',
      cookies: [
        { name: 'theme_preference', purpose: 'Remember dark/light mode', duration: '1 year' },
        { name: 'language', purpose: 'Store language preference', duration: '1 year' },
        { name: 'recent_products', purpose: 'Recently viewed products', duration: '30 days' },
      ]
    },
    {
      icon: BarChart3,
      key: 'analytics',
      title: 'Analytics Cookies',
      required: false,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      cookies: [
        { name: '_ga', purpose: 'Google Analytics tracking', duration: '2 years' },
        { name: '_gid', purpose: 'Distinguish users', duration: '24 hours' },
        { name: 'plausible_*', purpose: 'Privacy-friendly analytics', duration: '1 year' },
      ]
    },
    {
      icon: Target,
      key: 'marketing',
      title: 'Marketing Cookies',
      required: false,
      description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
      cookies: [
        { name: '_fbp', purpose: 'Facebook pixel tracking', duration: '3 months' },
        { name: 'ads_session', purpose: 'Ad campaign attribution', duration: '30 days' },
      ]
    },
  ];

  const handleToggle = (key: string) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    alert('Cookie preferences saved!');
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
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Cookie Policy</h1>
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
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-4">
              <Cookie className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">What are cookies?</h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Cookies are small text files stored on your device when you visit a website. They help 
                  websites remember your preferences, understand how you use the site, and provide a 
                  personalized experience. This policy explains what cookies we use and how you can control them.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cookie Types */}
        <div className="space-y-6 mb-12">
          {cookieTypes.map((type, index) => (
            <motion.div
              key={type.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <type.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {type.title}
                      {type.required && (
                        <span className="ml-2 text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                          Required
                        </span>
                      )}
                    </h3>
                    <p className="text-[var(--text-secondary)] mt-1">{type.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(type.key)}
                  disabled={type.required}
                  className={`relative w-14 h-8 rounded-full transition-colors cursor-pointer ${
                    preferences[type.key as keyof typeof preferences]
                      ? 'bg-emerald-500'
                      : 'bg-gray-600'
                  } ${type.required ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    animate={{ left: preferences[type.key as keyof typeof preferences] ? '1.75rem' : '0.25rem' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Cookie Table */}
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--border-primary)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-tertiary)]">
                    <tr>
                      <th className="px-4 py-3 text-left text-[var(--text-secondary)] font-medium">Cookie Name</th>
                      <th className="px-4 py-3 text-left text-[var(--text-secondary)] font-medium">Purpose</th>
                      <th className="px-4 py-3 text-left text-[var(--text-secondary)] font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-primary)]">
                    {type.cookies.map((cookie) => (
                      <tr key={cookie.name}>
                        <td className="px-4 py-3 text-[var(--text-primary)] font-mono text-xs">{cookie.name}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{cookie.purpose}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)]">{cookie.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Save Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Save Your Preferences</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Your choices will be saved and applied across the platform.
              </p>
            </div>
            <button
              onClick={savePreferences}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>

        {/* How to Manage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            <ToggleLeft className="w-5 h-5 inline mr-2" />
            Managing Cookies in Your Browser
          </h3>
          <p className="text-[var(--text-secondary)] mb-4">
            You can also control cookies through your browser settings. Here's how:
          </p>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            <li>• <strong className="text-[var(--text-primary)]">Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li>• <strong className="text-[var(--text-primary)]">Firefox:</strong> Settings → Privacy & Security → Cookies</li>
            <li>• <strong className="text-[var(--text-primary)]">Safari:</strong> Preferences → Privacy → Cookies</li>
            <li>• <strong className="text-[var(--text-primary)]">Edge:</strong> Settings → Cookies and Site Permissions</li>
          </ul>
          <p className="text-[var(--text-muted)] text-sm mt-4">
            Note: Blocking all cookies may affect the functionality of this website.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
