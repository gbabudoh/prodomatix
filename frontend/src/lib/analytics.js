// Google Analytics (GA4) — loaded dynamically, and only once the visitor has
// granted analytics consent via the cookie banner. Nothing is loaded at all
// if VITE_GA_MEASUREMENT_ID isn't set.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const analyticsEnabled = !!MEASUREMENT_ID;

let loaded = false;

function loadScript() {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Google Analytics.'));
    document.head.appendChild(s);
  });
}

// Loads gtag.js and sends the first page_view. Safe to call multiple times —
// only initializes once. `send_page_view: false` because we send page_view
// manually on every route change (this is a client-side-routed SPA).
export async function initAnalytics() {
  if (!analyticsEnabled || loaded) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false, anonymize_ip: true });

  try {
    await loadScript();
  } catch {
    loaded = false;
  }
}

// GA's documented opt-out mechanism: setting this flag stops the loaded
// snippet from sending any further hits, without needing to remove the script.
export function disableAnalytics() {
  if (!analyticsEnabled) return;
  window[`ga-disable-${MEASUREMENT_ID}`] = true;
}

export function enableAnalytics() {
  if (!analyticsEnabled) return;
  window[`ga-disable-${MEASUREMENT_ID}`] = false;
}

export function trackPageView(path) {
  if (!analyticsEnabled || !loaded || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
