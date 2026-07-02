import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from './CookieBanner.jsx';
import { analyticsEnabled, initAnalytics, enableAnalytics, disableAnalytics, trackPageView as trackGaPageView } from '../lib/analytics.js';
import { clarityEnabled, initClarity, enableClarity, disableClarity } from '../lib/clarity.js';
import { matomoEnabled, initMatomo, enableMatomo, disableMatomo, trackPageView as trackMatomoPageView } from '../lib/matomo.js';

// Admin activity shouldn't be mixed into public-site analytics, regardless
// of whatever consent decision was made on the marketing pages.
const EXCLUDED_PATHS = ['/admin'];

// Mounted once near the app root. Loads Google Analytics, Microsoft Clarity,
// and Matomo only after the visitor has granted analytics consent (see
// CookieBanner), and keeps them in sync live if the visitor changes their
// choice — no page reload required.
export default function Analytics() {
  const { pathname } = useLocation();
  const { analytics } = useCookieConsent();
  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  const active = analytics && !isExcluded;
  const initedRef = useRef(false);

  useEffect(() => {
    if (!analyticsEnabled && !clarityEnabled && !matomoEnabled) return;
    if (active) {
      initAnalytics().then(() => enableAnalytics());
      initClarity();
      enableClarity();
      initMatomo().then(() => enableMatomo());
      initedRef.current = true;
    } else if (initedRef.current) {
      disableAnalytics();
      disableClarity();
      disableMatomo();
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    trackGaPageView(pathname);
    trackMatomoPageView(pathname);
  }, [pathname, active]);

  return null;
}
