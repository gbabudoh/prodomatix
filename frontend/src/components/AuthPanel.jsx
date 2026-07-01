import { useState, useEffect } from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Search & Filter',
    desc: 'Browse thousands of verified B2B suppliers by industry, country, type and more.',
  },
  {
    num: '02',
    title: 'Select Records',
    desc: 'Pick the exact suppliers you need. Transparent pricing — no subscriptions.',
  },
  {
    num: '03',
    title: 'Download Instantly',
    desc: 'Get your data as Excel or PDF the moment you check out. No waiting.',
  },
];

const DEMO_ROWS = [
  { name: 'Andes Coffee Works',  tag: 'Food & Beverage',       country: 'Colombia',       price: '$79' },
  { name: 'Atlas Steelworks',    tag: 'Construction',           country: 'United States',  price: '$139' },
  { name: 'AutoParts Direct',    tag: 'Automotive',             country: 'United States',  price: '$59' },
];

// ── Step demos ──────────────────────────────────────────────────────────────

function SearchDemo() {
  return (
    <div className="ademo">
      <div className="ademo__search-bar">
        <span className="ademo__search-icon">⌕</span>
        <span className="ademo__typing">coffee suppliers Colombia</span>
      </div>
      <div className="ademo__filter-row">
        {['Food & Beverage', 'Colombia', 'Manufacturer'].map((c, i) => (
          <span key={c} className="ademo__chip" style={{ animationDelay: `${0.6 + i * 0.18}s` }}>{c} ×</span>
        ))}
      </div>
      <div className="ademo__result-count">
        <span className="ademo__count-num">2,840</span> suppliers match your criteria
      </div>
      <div className="ademo__rows">
        {DEMO_ROWS.map((r, i) => (
          <div key={r.name} className="ademo__row" style={{ animationDelay: `${1 + i * 0.12}s` }}>
            <div className="ademo__row-dot" />
            <div className="ademo__row-info">
              <span className="ademo__row-name">{r.name}</span>
              <span className="ademo__row-tag">{r.tag}</span>
            </div>
            <span className="ademo__row-country">{r.country}</span>
            <span className="ademo__row-price">{r.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectDemo() {
  return (
    <div className="ademo">
      <div className="ademo__rows">
        {DEMO_ROWS.map((r, i) => (
          <div key={r.name} className="ademo__row ademo__row--sel" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
            <div className="ademo__checkbox" style={{ animationDelay: `${0.3 + i * 0.25}s` }}>✓</div>
            <div className="ademo__row-info">
              <span className="ademo__row-name">{r.name}</span>
              <span className="ademo__row-tag">{r.country}</span>
            </div>
            <span className="ademo__row-price">{r.price}</span>
          </div>
        ))}
      </div>
      <div className="ademo__selbar">
        <div className="ademo__selbar-left">
          <div className="ademo__selnum">3</div>
          <div className="ademo__sellabel">suppliers selected</div>
          <div className="ademo__divider" />
          <div className="ademo__seltotal">$277 total</div>
        </div>
        <div className="ademo__checkout">Checkout →</div>
      </div>
    </div>
  );
}

function DownloadDemo() {
  return (
    <div className="ademo">
      <div className="ademo__confirm">
        <div className="ademo__confirm-icon">✓</div>
        <div>
          <div className="ademo__confirm-title">Order confirmed</div>
          <div className="ademo__confirm-ref">PD-874683 · 3 records</div>
        </div>
      </div>
      <div className="ademo__dl-formats">
        <div className="ademo__dl-btn ademo__dl-btn--xl">
          <span className="ademo__dl-icon">↓</span> Excel
        </div>
        <div className="ademo__dl-btn ademo__dl-btn--pdf">
          <span className="ademo__dl-icon">↓</span> PDF
        </div>
      </div>
      <div className="ademo__progress-wrap">
        <div className="ademo__progress-label">
          <span>Generating Excel…</span>
          <span className="ademo__progress-pct">100%</span>
        </div>
        <div className="ademo__progress-track">
          <div className="ademo__progress-fill" />
        </div>
      </div>
      <div className="ademo__dl-note">Available anytime from your dashboard</div>
    </div>
  );
}

const DEMOS = [SearchDemo, SelectDemo, DownloadDemo];

// ── Main panel ──────────────────────────────────────────────────────────────

export default function AuthPanel() {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setStep((s) => (s + 1) % 3);
        setFade(true);
      }, 700);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i) => {
    if (i === step) return;
    setFade(false);
    setTimeout(() => { setStep(i); setFade(true); }, 300);
  };

  const Demo = DEMOS[step];
  const { num, title, desc } = STEPS[step];

  return (
    <div className="auth-panel">
      {/* Brand */}
      <div className="auth-panel__brand">
        <img src="/logo.png" alt="Prodomatix" className="auth-panel__logo" />
        <p className="auth-panel__tagline">The B2B supplier data marketplace</p>
      </div>

      {/* Feature cards */}
      <div className="auth-panel__features">
        <div className="auth-panel__feature">
          <div className="auth-panel__feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <div className="auth-panel__feature-text">
            <span className="auth-panel__feature-title">Global supplier database</span>
            <span className="auth-panel__feature-desc">28,000+ verified B2B records across 150+ countries</span>
          </div>
        </div>
        <div className="auth-panel__feature">
          <div className="auth-panel__feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
          </div>
          <div className="auth-panel__feature-text">
            <span className="auth-panel__feature-title">Powerful filters</span>
            <span className="auth-panel__feature-desc">Filter by industry, country, type, revenue and more</span>
          </div>
        </div>
        <div className="auth-panel__feature">
          <div className="auth-panel__feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>
          <div className="auth-panel__feature-text">
            <span className="auth-panel__feature-title">Instant downloads</span>
            <span className="auth-panel__feature-desc">Export as formatted Excel or PDF — no waiting</span>
          </div>
        </div>
        <div className="auth-panel__feature">
          <div className="auth-panel__feature-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="auth-panel__feature-text">
            <span className="auth-panel__feature-title">3 free downloads</span>
            <span className="auth-panel__feature-desc">Start immediately — no credit card required</span>
          </div>
        </div>
      </div>

      {/* Animated demo card */}
      <div className={'auth-panel__demo' + (fade ? ' is-visible' : ' is-hidden')} key={step}>
        <div className="auth-panel__demo-label">
          <span className="auth-panel__step-num">{num}</span>
          <span className="auth-panel__step-title">{title}</span>
        </div>
        <Demo />
      </div>

      {/* Step description + dots */}
      <div className="auth-panel__footer">
        <p className="auth-panel__step-desc">{desc}</p>
        <div className="auth-panel__dots">
          {STEPS.map((_, i) => (
            <button key={i} className={'auth-panel__dot' + (i === step ? ' is-active' : '')}
              onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
