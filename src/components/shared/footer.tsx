'use client';

import Link from 'next/link';
import { TrendingUp, Mail, Globe, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/disclaimer', label: 'Disclaimer' },
    { href: '/acceptable-use', label: 'Acceptable Use' },
  ];

  const productLinks = [
    { href: '/', label: 'Trading Floor' },
    { href: '/login', label: 'Sign In' },
    { href: '/register', label: 'Create Account' },
  ];

  const socialLinks = [
    { href: 'https://twitter.com/prodomatix', label: 'Twitter' },
    { href: 'https://linkedin.com/company/prodomatix', label: 'LinkedIn' },
    { href: 'https://github.com/prodomatix', label: 'GitHub' },
  ];

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[var(--text-primary)]">Prodomatix</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md mb-4">
              The Stock Market of Sentiment. Rate products, track trends, and watch Prodo Scores 
              rise and fall based on collective consumer feedback.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-sm flex items-center gap-1"
                  aria-label={social.label}
                >
                  {social.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border-primary)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-muted)]">
              © {currentYear} Prodomatix. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <Link href="/terms" className="hover:text-[var(--text-secondary)] cursor-pointer">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-[var(--text-secondary)] cursor-pointer">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-[var(--text-secondary)] cursor-pointer">
                Cookies
              </Link>
              <a 
                href="mailto:support@prodomatix.com" 
                className="hover:text-[var(--text-secondary)] flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
