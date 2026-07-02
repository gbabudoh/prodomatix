import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'pdx_cookie_consent';
export const CONSENT_CHANGED_EVENT = 'pdx:cookie-consent-changed';

const DEFAULT_PREFS = { essential: true, analytics: false, marketing: false };

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePrefs(prefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, savedAt: new Date().toISOString() }));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: prefs }));
}

export function getCookieConsent() {
  const prefs = loadPrefs();
  return {
    analytics: prefs?.analytics ?? false,
    marketing: prefs?.marketing ?? false,
    hasConsented: !!prefs,
  };
}

// React hook variant — re-reads consent whenever the banner (or another tab)
// changes it, so consumers like the analytics loader can react live instead
// of only picking up consent on the next full page load.
export function useCookieConsent() {
  const [consent, setConsent] = useState(getCookieConsent);

  useEffect(() => {
    const refresh = () => setConsent(getCookieConsent());
    window.addEventListener(CONSENT_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return consent;
}

const CATEGORIES = [
  {
    id: 'essential',
    label: 'Essential',
    always: true,
    description: 'Required for the platform to function. Includes your secure login session and security tokens. Cannot be disabled.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    always: false,
    description: 'Helps us understand how the platform is used so we can improve it. No personal data is sold or shared.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    always: false,
    description: 'Used to personalise content and measure the effectiveness of marketing campaigns.',
  },
];

const EXCLUDED_PATHS = ['/admin'];

export default function CookieBanner() {
  const { pathname } = useLocation();
  const [visible, setVisible]     = useState(false);
  const [expanded, setExpanded]   = useState(false);
  const [animOut, setAnimOut]     = useState(false);
  const [prefs, setPrefs]         = useState(DEFAULT_PREFS);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (!isExcluded && !loadPrefs()) setVisible(true);
  }, [pathname]);

  const dismiss = (finalPrefs) => {
    savePrefs(finalPrefs);
    setAnimOut(true);
    setTimeout(() => setVisible(false), 340);
  };

  const acceptAll = () => dismiss({ essential: true, analytics: true, marketing: true });
  const rejectAll = () => dismiss({ essential: true, analytics: false, marketing: false });
  const saveCustom = () => dismiss(prefs);

  const toggle = (id) =>
    setPrefs((p) => ({ ...p, [id]: !p[id] }));

  if (!visible || isExcluded) return null;

  return (
    <div className={'ck-backdrop' + (animOut ? ' ck-backdrop--out' : '')}>
      <div className={'ck' + (animOut ? ' ck--out' : '')}>

        {/* ── Compact view ──────────────────────────── */}
        {!expanded && (
          <div className="ck__compact">
            <div className="ck__icon" aria-hidden="true">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="10" fill="#eef2fe"/>
                {/* Shield body */}
                <path d="M19 8L9 12V19.5C9 24.75 13.4 29.7 19 31C24.6 29.7 29 24.75 29 19.5V12L19 8Z" fill="#2e54d4" fillOpacity="0.12" stroke="#2e54d4" strokeWidth="1.6" strokeLinejoin="round"/>
                {/* Checkmark */}
                <path d="M14.5 19.5L17.5 22.5L23.5 16.5" stroke="#2e54d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ck__copy">
              <p className="ck__title">We use cookies</p>
              <p className="ck__desc">
                We use essential cookies to keep you logged in and optional cookies to improve your experience.
                You can choose what to allow.{' '}
                <a href="/privacy-policy" className="ck__link" target="_blank" rel="noopener">
                  Privacy Policy
                </a>
              </p>
            </div>
            <div className="ck__actions">
              <button className="ck__btn ck__btn--ghost" onClick={() => setExpanded(true)}>
                Manage
              </button>
              <button className="ck__btn ck__btn--outline" onClick={rejectAll}>
                Reject all
              </button>
              <button className="ck__btn ck__btn--primary" onClick={acceptAll}>
                Accept all
              </button>
            </div>
          </div>
        )}

        {/* ── Expanded preferences view ─────────────── */}
        {expanded && (
          <div className="ck__expanded">
            <div className="ck__exp-head">
              <div>
                <p className="ck__title">Cookie preferences</p>
                <p className="ck__desc" style={{ marginBottom: 0 }}>
                  Choose which cookies you allow. Essential cookies are always active.
                </p>
              </div>
              <button className="ck__close" onClick={() => setExpanded(false)} aria-label="Close preferences">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="ck__categories">
              {CATEGORIES.map((cat) => (
                <div className="ck__cat" key={cat.id}>
                  <div className="ck__cat-info">
                    <span className="ck__cat-label">{cat.label}</span>
                    {cat.always && <span className="ck__cat-badge">Always on</span>}
                    <p className="ck__cat-desc">{cat.description}</p>
                  </div>
                  <label className={'ck__toggle' + (cat.always ? ' ck__toggle--disabled' : '')}>
                    <input
                      type="checkbox"
                      checked={cat.always ? true : prefs[cat.id]}
                      disabled={cat.always}
                      onChange={() => !cat.always && toggle(cat.id)}
                    />
                    <span className="ck__track">
                      <span className="ck__thumb" />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="ck__exp-foot">
              <button className="ck__btn ck__btn--outline" onClick={rejectAll}>
                Reject all
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="ck__btn ck__btn--ghost" onClick={acceptAll}>
                  Accept all
                </button>
                <button className="ck__btn ck__btn--primary" onClick={saveCustom}>
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
