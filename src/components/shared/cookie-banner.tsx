'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Shield, BarChart3, Target, ChevronDown, ChevronUp, Check } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie_consent', 'all');
    localStorage.setItem('cookie_preferences', JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie_consent', 'necessary');
    localStorage.setItem('cookie_preferences', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', 'custom');
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't disable necessary
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieTypes = [
    {
      key: 'necessary' as const,
      icon: Shield,
      title: 'Strictly Necessary',
      description: 'Essential for the website to function. Cannot be disabled.',
      required: true,
    },
    {
      key: 'functional' as const,
      icon: Settings,
      title: 'Functional',
      description: 'Remember your preferences like theme and language.',
      required: false,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: 'Analytics',
      description: 'Help us understand how visitors use our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: 'Marketing',
      description: 'Used to deliver relevant advertisements.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={() => setShowDetails(false)}
          />

          {/* Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
                {/* Main Content */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Cookie Icon */}
                    <motion.div
                      initial={{ rotate: -20 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex-shrink-0"
                    >
                      <Cookie className="w-8 h-8 text-amber-400" />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                        🍪 We value your privacy
                      </h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                        By clicking "Accept All", you consent to our use of cookies.{' '}
                        <Link href="/cookies" className="text-emerald-400 hover:underline cursor-pointer">
                          Learn more
                        </Link>
                      </p>
                    </div>

                    {/* Close Button (Mobile) */}
                    <button
                      onClick={handleRejectAll}
                      className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors md:hidden cursor-pointer"
                    >
                      <X className="w-5 h-5 text-[var(--text-muted)]" />
                    </button>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 pt-6 border-t border-[var(--border-primary)]">
                          <div className="grid gap-3">
                            {cookieTypes.map((type) => (
                              <div
                                key={type.key}
                                className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <type.icon className="w-5 h-5 text-[var(--text-muted)]" />
                                  <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">
                                      {type.title}
                                      {type.required && (
                                        <span className="ml-2 text-xs text-emerald-400">(Required)</span>
                                      )}
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)]">{type.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => togglePreference(type.key)}
                                  disabled={type.required}
                                  className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                                    preferences[type.key] ? 'bg-emerald-500' : 'bg-gray-600'
                                  } ${type.required ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                  <motion.div
                                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                                    animate={{ left: preferences[type.key] ? '1.5rem' : '0.25rem' }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  >
                                    {preferences[type.key] && (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    )}
                                  </motion.div>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-xl transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                      {showDetails ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleRejectAll}
                        className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-primary)] hover:border-[var(--border-secondary)] rounded-xl transition-colors cursor-pointer"
                      >
                        Reject All
                      </button>

                      {showDetails ? (
                        <button
                          onClick={handleSavePreferences}
                          className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors cursor-pointer"
                        >
                          Save Preferences
                        </button>
                      ) : (
                        <button
                          onClick={handleAcceptAll}
                          className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-colors cursor-pointer"
                        >
                          Accept All
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Links */}
                <div className="px-6 py-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-primary)] flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
                  <Link href="/privacy" className="hover:text-[var(--text-secondary)] cursor-pointer">
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="/cookies" className="hover:text-[var(--text-secondary)] cursor-pointer">
                    Cookie Policy
                  </Link>
                  <span>•</span>
                  <Link href="/terms" className="hover:text-[var(--text-secondary)] cursor-pointer">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to check cookie consent
export function useCookieConsent() {
  const [consent, setConsent] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie_consent');
    const storedPreferences = localStorage.getItem('cookie_preferences');
    
    setConsent(storedConsent);
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  return { consent, preferences };
}
