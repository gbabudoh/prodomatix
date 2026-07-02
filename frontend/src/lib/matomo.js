// Matomo — self-hosted analytics. Loaded dynamically, and only once the
// visitor has granted analytics consent via the cookie banner. Nothing is
// loaded at all if VITE_MATOMO_URL / VITE_MATOMO_SITE_ID aren't set.
const TRACKER_URL = import.meta.env.VITE_MATOMO_URL;
const SITE_ID = import.meta.env.VITE_MATOMO_SITE_ID;

export const matomoEnabled = !!(TRACKER_URL && SITE_ID);

let loaded = false;

function loadScript() {
  return new Promise((resolve, reject) => {
    const g = document.createElement('script');
    g.async = true;
    g.src = TRACKER_URL + 'matomo.js';
    g.onload = () => resolve();
    g.onerror = () => reject(new Error('Could not load Matomo.'));
    const first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(g, first);
  });
}

// Sets up the tracker config and injects matomo.js. Deliberately does NOT
// push an initial 'trackPageView' itself — the route-change effect in
// Analytics.jsx sends the first (and every subsequent) page view via
// trackPageView() below, same as the GA integration.
export async function initMatomo() {
  if (!matomoEnabled || loaded) return;
  loaded = true;

  window._paq = window._paq || [];
  window._paq.push(['enableLinkTracking']);
  window._paq.push(['setTrackerUrl', TRACKER_URL + 'matomo.php']);
  window._paq.push(['setSiteId', SITE_ID]);

  try {
    await loadScript();
  } catch {
    loaded = false;
  }
}

// Matomo's documented visitor opt-out API — the equivalent of GA's
// ga-disable-* flag. Works regardless of whether server-side consent mode
// is configured on the Matomo instance.
export function enableMatomo() {
  if (!matomoEnabled || !window._paq) return;
  window._paq.push(['forgetUserOptOut']);
}

export function disableMatomo() {
  if (!matomoEnabled || !window._paq) return;
  window._paq.push(['optUserOut']);
}

export function trackPageView(path) {
  if (!matomoEnabled || !loaded || !window._paq) return;
  window._paq.push(['setCustomUrl', window.location.origin + path]);
  window._paq.push(['setDocumentTitle', document.title]);
  window._paq.push(['trackPageView']);
}
