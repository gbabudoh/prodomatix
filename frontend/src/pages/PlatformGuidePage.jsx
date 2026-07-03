import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import MarketingNav from '../components/MarketingNav.jsx';
import './HowItWorksPage.css';

const ROWS = [
  { name: 'Andes Coffee Works', ind: 'Food & Beverage', country: 'Colombia',      price: '$0.50' },
  { name: 'Atlas Steelworks',   ind: 'Construction',    country: 'United States', price: '$0.75' },
  { name: 'AutoParts Direct',   ind: 'Automotive',      country: 'United States', price: '$1.00' },
  { name: 'Nordic Timber Co.',  ind: 'Manufacturing',   country: 'Sweden',        price: '$1.20' },
];

function DemoSearch() {
  return (
    <div className="hiw-demo">
      <div className="hiw-demo__bar">
        <span className="hiw-demo__bar-dot" style={{ background: '#ff5f57' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#febc2e' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#28c840' }} />
        <span className="hiw-demo__bar-url">prodomatix.com/browse</span>
      </div>
      <div className="hiw-demo__body">
        <div className="hiw-demo__search">
          <span className="hiw-demo__search-icon">⌕</span>
          <span className="hiw-demo__typing">coffee suppliers South America</span>
        </div>
        <div className="hiw-demo__filters">
          {['Food & Beverage', 'Colombia', 'Manufacturer'].map((f, i) => (
            <span key={f} className="hiw-demo__filter" style={{ animationDelay: `${0.6 + i * 0.15}s` }}>{f} ×</span>
          ))}
        </div>
        <div className="hiw-demo__count"><strong>2,840</strong> suppliers match</div>
        <div className="hiw-demo__table-head">
          <span>Supplier</span><span>Industry</span><span>Country</span><span style={{ textAlign:'right' }}>Price</span>
        </div>
        {ROWS.map((r, i) => (
          <div key={r.name} className="hiw-demo__row" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
            <div className="hiw-demo__row-name">
              <span className="hiw-demo__dot" />
              <div>
                <div className="hiw-demo__row-biz">{r.name}</div>
                <div className="hiw-demo__row-sub">Locked · click to preview</div>
              </div>
            </div>
            <span className="hiw-demo__row-cell">{r.ind}</span>
            <span className="hiw-demo__row-cell">{r.country}</span>
            <span className="hiw-demo__row-price">{r.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DemoSelect() {
  return (
    <div className="hiw-demo">
      <div className="hiw-demo__bar">
        <span className="hiw-demo__bar-dot" style={{ background: '#ff5f57' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#febc2e' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#28c840' }} />
        <span className="hiw-demo__bar-url">prodomatix.com/browse</span>
      </div>
      <div className="hiw-demo__body">
        <div className="hiw-demo__toolbar">
          <span><strong>2,840</strong> suppliers found</span>
          <span className="hiw-demo__select-btn">Select page (4)</span>
        </div>
        {ROWS.map((r, i) => (
          <div key={r.name} className={'hiw-demo__row hiw-demo__row--sel' + (i < 3 ? ' is-checked' : '')}
            style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
            <span className={'hiw-demo__chk' + (i < 3 ? ' is-on' : '')}
              style={{ animationDelay: `${0.3 + i * 0.25}s` }}>{i < 3 ? '✓' : ''}</span>
            <div className="hiw-demo__row-name">
              <span className="hiw-demo__dot" />
              <div>
                <div className="hiw-demo__row-biz">{r.name}</div>
                <div className="hiw-demo__row-sub">{r.ind} · {r.country}</div>
              </div>
            </div>
            <span className="hiw-demo__row-price">{r.price}</span>
          </div>
        ))}
        <div className="hiw-demo__selbar">
          <div className="hiw-demo__selbar-l">
            <div><span className="hiw-demo__selnum">3</span> <span className="hiw-demo__sellbl">selected</span></div>
            <div className="hiw-demo__seltotal">$2.25 estimated total</div>
          </div>
          <span className="hiw-demo__checkout-btn">Continue to checkout →</span>
        </div>
      </div>
    </div>
  );
}

function DemoDownload() {
  return (
    <div className="hiw-demo">
      <div className="hiw-demo__bar">
        <span className="hiw-demo__bar-dot" style={{ background: '#ff5f57' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#febc2e' }} />
        <span className="hiw-demo__bar-dot" style={{ background: '#28c840' }} />
        <span className="hiw-demo__bar-url">prodomatix.com/success</span>
      </div>
      <div className="hiw-demo__body">
        <div className="hiw-demo__success">
          <div className="hiw-demo__success-icon">✓</div>
          <div>
            <div className="hiw-demo__success-title">Order confirmed</div>
            <div className="hiw-demo__success-ref">PD-874683 · 3 records unlocked</div>
          </div>
        </div>
        <div className="hiw-demo__files">
          {[
            { type:'XLS', label:'Excel workbook', desc:'Filterable spreadsheet · .xlsx', bg:'#e7f4ee', tc:'#1f8f5b' },
            { type:'PDF', label:'PDF document',   desc:'Print-ready sheet · .pdf',       bg:'#fde8e8', tc:'#b42525' },
          ].map((f, i) => (
            <div key={f.type} className="hiw-demo__file" style={{ animationDelay: `${0.3 + i * 0.2}s` }}>
              <div className="hiw-demo__file-icon" style={{ background: f.bg, color: f.tc }}>{f.type}</div>
              <div className="hiw-demo__file-info">
                <div className="hiw-demo__file-name">{f.label}</div>
                <div className="hiw-demo__file-desc">{f.desc}</div>
              </div>
              <button className="hiw-demo__dl-btn">↓ Download</button>
            </div>
          ))}
        </div>
        <div className="hiw-demo__progress-wrap">
          <div className="hiw-demo__progress-lbl"><span>Generating files…</span><span>100%</span></div>
          <div className="hiw-demo__progress-track"><div className="hiw-demo__progress-fill" /></div>
        </div>
        <div className="hiw-demo__dl-note">Available anytime from your dashboard · no expiry</div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    num: '01', label: 'Search & Filter', Demo: DemoSearch,
    heading: 'Find exactly the suppliers you need',
    guide: [
      { title: 'Use the search bar',   body: 'Type a product, company name, or keyword. Results update instantly as you type.' },
      { title: 'Apply filters',         body: 'Narrow down by industry, country, region, supplier type, revenue, or staff size using the left sidebar or top dropdowns.' },
      { title: 'Review the results',    body: 'Each row shows the supplier name, industry, country, and price. Click any row to preview the full record before buying.' },
    ],
  },
  {
    num: '02', label: 'Select & Review', Demo: DemoSelect,
    heading: 'Pick what you need — pricing shown upfront',
    guide: [
      { title: 'Tick the checkbox',     body: 'Click any row\'s checkbox to add it to your selection. The price per record is shown on every row — no surprises at checkout.' },
      { title: 'Review your basket',    body: 'The bar at the bottom shows your total in real time. Remove any item before proceeding — there\'s no commitment until you confirm.' },
      { title: 'Use your free credits', body: 'If you have free credits, the checkout page auto-applies them — your total drops to $0. No card required for free orders.' },
    ],
  },
  {
    num: '03', label: 'Download & Use', Demo: DemoDownload,
    heading: 'Your data is ready the moment you check out',
    guide: [
      { title: 'Instant delivery',              body: 'Both an Excel workbook and a PDF are generated immediately after checkout. No email queue, no waiting at all.' },
      { title: 'Download from the order screen', body: 'Click "Download" next to each format on the confirmation screen to save your files directly to your device.' },
      { title: 'Access anytime from My data',   body: 'Every purchase is permanently saved to your dashboard. Re-download your Excel or PDF files whenever you need them — they never expire.' },
    ],
  },
];

export default function PlatformGuidePage() {
  const [active, setActive] = useState(0);
  const [fade, setFade]     = useState(true);

  const go = (i) => {
    setFade(false);
    setTimeout(() => { setActive(i); setFade(true); }, 260);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setActive(s => (s + 1) % 3); setFade(true); }, 260);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[active];
  const Demo = step.Demo;

  return (
    <div className="hiw">
      <Seo
        title="How It Works"
        description="From first search to downloaded file — see exactly what happens at each step of buying B2B supplier data on Prodomatix."
        path="/how-it-works"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to find and download B2B supplier data on Prodomatix',
          step: STEPS.map((s) => ({
            '@type': 'HowToStep',
            name: s.heading,
            text: s.guide.map((g) => g.body).join(' '),
          })),
        }}
      />

      {/* Nav */}
      <MarketingNav showBack showHowItWorks={false} />

      {/* Header */}
      <div className="hiw-guide-header">
        <div className="hiw-section-label">Platform walkthrough</div>
        <h1 className="hiw-guide-h1">How Prodomatix works</h1>
        <p className="hiw-guide-sub">
          From first search to downloaded file — here's exactly what happens at each step.
        </p>
      </div>

      {/* Tabs */}
      <div className="hiw-guide-tabs">
        {STEPS.map((s, i) => (
          <button key={i} className={'hiw-steps__tab' + (i === active ? ' is-active' : '')} onClick={() => go(i)}>
            <span className="hiw-steps__tab-num">{s.num}</span>
            <span className="hiw-steps__tab-label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={'hiw-guide-content' + (fade ? ' is-in' : ' is-out')}>
        <div className="hiw-guide-left">
          <h2 className="hiw-guide-heading">{step.heading}</h2>
          <div className="hiw-guide-steps">
            {step.guide.map((g, i) => (
              <div key={g.title} className="hiw-guide-step">
                <div className="hiw-guide-step__num">{i + 1}</div>
                <div className="hiw-guide-step__body">
                  <div className="hiw-guide-step__title">{g.title}</div>
                  <div className="hiw-guide-step__text">{g.body}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hiw-guide-nav">
            {active > 0 && (
              <button className="hiw-steps__navbtn hiw-steps__navbtn--prev" onClick={() => go(active - 1)}>
                ← {STEPS[active - 1].label}
              </button>
            )}
            {active < 2 ? (
              <button className="hiw-steps__navbtn hiw-steps__navbtn--next" onClick={() => go(active + 1)}>
                {STEPS[active + 1].label} →
              </button>
            ) : (
              <Link to="/register" className="hiw-steps__navbtn hiw-steps__navbtn--next">
                Get started free →
              </Link>
            )}
          </div>
        </div>
        <div className="hiw-guide-right">
          <Demo />
          <div className="hiw-guide-dots">
            {STEPS.map((_, i) => (
              <button key={i} className={'hiw-steps__dot' + (i === active ? ' is-active' : '')} onClick={() => go(i)} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA strip */}
      <div className="hiw-guide-cta">
        <p className="hiw-guide-cta__msg">
          Ready to try it? Start with <strong>3 free downloads</strong> — no card required.
        </p>
        <div className="hiw-guide-cta__actions">
          <Link to="/register" className="btn btn--primary">Create free account →</Link>
          <Link to="/login"    className="hiw-nav__link">Sign in</Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="hiw-foot">
        <div className="hiw-foot__inner">
          <img src="/logo.png" alt="Prodomatix" className="hiw-foot__logo" />
          <div className="hiw-foot__links">
            <Link to="/about" className="hiw-foot__link">About</Link>
            <span className="hiw-foot__sep">·</span>
            <Link to="/privacy-policy" className="hiw-foot__link">Privacy Policy</Link>
            <span className="hiw-foot__sep">·</span>
            <Link to="/data-policy" className="hiw-foot__link">Data Policy</Link>
          </div>
          <p className="hiw-foot__copy">© {new Date().getFullYear()} Prodomatix · A subsidiary of Egobas Limited</p>
        </div>
      </footer>
    </div>
  );
}
