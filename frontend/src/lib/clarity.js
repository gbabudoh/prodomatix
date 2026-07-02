// Microsoft Clarity — session recording / heatmaps. Loaded dynamically, and
// only once the visitor has granted analytics consent via the cookie banner.
// Nothing is loaded at all if VITE_CLARITY_PROJECT_ID isn't set.
const PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID;

export const clarityEnabled = !!PROJECT_ID;

let loaded = false;

// Official Clarity tag, unchanged apart from reading the project ID from env.
function inject() {
  (function (c, l, a, r, i) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', PROJECT_ID);
}

export function initClarity() {
  if (!clarityEnabled || loaded) return;
  loaded = true;
  inject();
  // Explicit consent grant — see https://learn.microsoft.com/clarity/setup-and-installation/cookie-consent
  window.clarity('consent');
}

export function enableClarity() {
  if (!clarityEnabled || typeof window.clarity !== 'function') return;
  window.clarity('consent');
}

export function disableClarity() {
  if (!clarityEnabled || typeof window.clarity !== 'function') return;
  window.clarity('consent', false);
}
