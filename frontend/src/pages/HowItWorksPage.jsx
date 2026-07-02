import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorksPage.css';

// ── Hooks ────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.18) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let n = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      n = Math.min(n + step, target);
      setVal(Math.floor(n));
      if (n >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}

// ── Demo rows ─────────────────────────────────────────────────────────────────
const ROWS = [
  { name: 'Andes Coffee Works', ind: 'Food & Beverage', country: 'Colombia',      price: '$79'  },
  { name: 'Atlas Steelworks',   ind: 'Construction',    country: 'United States', price: '$139' },
  { name: 'AutoParts Direct',   ind: 'Automotive',      country: 'United States', price: '$59'  },
  { name: 'Nordic Timber Co.',  ind: 'Manufacturing',   country: 'Sweden',        price: '$89'  },
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
        <div className="hiw-demo__count"><strong>2,840</strong> suppliers match · sorted by best match</div>
        <div className="hiw-demo__table-head">
          <span>Supplier</span><span>Industry</span><span>Country</span><span style={{ textAlign: 'right' }}>Price</span>
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
            <div className="hiw-demo__seltotal">$277 estimated total</div>
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
            { type: 'XLS', label: 'Excel workbook', desc: 'Filterable spreadsheet · .xlsx', bg: '#e7f4ee', tc: '#1f8f5b' },
            { type: 'PDF', label: 'PDF document',   desc: 'Print-ready sheet · .pdf',       bg: '#fde8e8', tc: '#b42525' },
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
    num: '01', label: 'Search & Filter',
    heading: 'Find exactly the suppliers you need',
    body: 'Search across 28,000+ verified B2B supplier records by name, keyword, industry, country, or region. Apply multiple filters simultaneously to narrow down to the exact profiles that match your sourcing criteria.',
    bullets: ['Full-text keyword search', 'Filter by industry, country, region', 'Sort by price, verification %, or newest', 'Real-time result count as you filter'],
    Demo: DemoSearch,
  },
  {
    num: '02', label: 'Select Records',
    heading: 'Pick exactly what you need — pay per record',
    body: 'Select individual suppliers or entire pages at once. Review pricing upfront before you commit — no subscriptions, no hidden fees, no minimum spend. Use your 3 free credits to try it with zero risk.',
    bullets: ['Per-record transparent pricing', '3 free credits — no card required', 'Volume discounts from $300+', 'Remove items before checkout'],
    Demo: DemoSelect,
  },
  {
    num: '03', label: 'Download Instantly',
    heading: 'Your data delivered immediately',
    body: 'The moment you check out, both file formats are generated and ready to download. No waiting, no queue. Every purchase is saved to your dashboard so you can re-download anytime, forever.',
    bullets: ['Formatted Excel workbook (.xlsx)', 'Print-ready PDF with contacts', 'Instant — no waiting', 'Re-download anytime from dashboard'],
    Demo: DemoDownload,
  },
];

const DATA_FIELDS = [
  { label: 'Business name',      public: true },
  { label: 'Supplier type',      public: true },
  { label: 'Industry',           public: true },
  { label: 'Country',            public: true },
  { label: 'Region',             public: true },
  { label: 'Location / address', public: false },
  { label: 'Product / service',  public: false },
  { label: 'Website',            public: false },
  { label: 'Email address',      public: false },
  { label: 'Phone number',       public: false },
  { label: 'Staff capacity',     public: false },
  { label: 'Revenue ($M)',       public: false },
  { label: 'Verified contacts',  public: false },
  { label: 'Contact persons',    public: false },
];

const STATS = [
  { num: 28000, suffix: '+', label: 'Verified B2B records' },
  { num: 150,   suffix: '+', label: 'Countries covered' },
  { num: 40,    suffix: '+', label: 'Industries' },
  { num: 3,     suffix: '',  label: 'Free downloads to start' },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [stepFade, setStepFade] = useState(true);

  const [heroRef,  heroIn]  = useInView(0.1);
  const [stepsRef, stepsIn] = useInView(0.1);
  const [dataRef,  dataIn]  = useInView(0.15);
  const [statsRef, statsIn] = useInView(0.2);
  const [ctaRef,   ctaIn]   = useInView(0.2);

  const c1 = useCounter(STATS[0].num, statsIn, 2000);
  const c2 = useCounter(STATS[1].num, statsIn, 1600);
  const c3 = useCounter(STATS[2].num, statsIn, 1200);
  const c4 = useCounter(STATS[3].num, statsIn, 800);
  const counts = [c1, c2, c3, c4];

  const goStep = (i) => {
    setStepFade(false);
    setTimeout(() => { setActiveStep(i); setStepFade(true); }, 280);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setStepFade(false);
      setTimeout(() => { setActiveStep(s => (s + 1) % 3); setStepFade(true); }, 280);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const step = STEPS[activeStep];
  const Demo = step.Demo;

  return (
    <div className="hiw">

      {/* Nav */}
      <nav className="hiw-nav">
        <a href="/" className="hiw-nav__brand">
          <img src="/logo.png" alt="Prodomatix" className="hiw-nav__logo" />
        </a>
        <div className="hiw-nav__links">
          <Link to="/how-it-works" className="hiw-nav__link">How it works</Link>
          <Link to="/login"        className="hiw-nav__link">Sign in</Link>
          <Link to="/register"     className="hiw-nav__cta">Get started free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={'hiw-hero' + (heroIn ? ' is-visible' : '')} ref={heroRef}>
        <div className="hiw-hero__left">
          <div className="hiw-hero__badge">B2B Data Marketplace</div>
          <h1 className="hiw-hero__h1">
            Find, select &amp; download <span className="hiw-hero__accent">B2B supplier data</span> in minutes
          </h1>
          <p className="hiw-hero__sub">
            Search 28,000+ verified supplier records globally. Filter by industry, country, and type.
            Pay per record — no subscription, no commitment. 3 free downloads to get started.
          </p>
          <div className="hiw-hero__actions">
            <Link to="/register" className="btn btn--primary hiw-hero__btn">Start free — 3 downloads →</Link>
            <Link to="/login" className="hiw-hero__signin">Already have an account? Sign in</Link>
          </div>
          <div className="hiw-hero__pills">
            <span className="hiw-hero__pill">✓ No credit card required</span>
            <span className="hiw-hero__pill">✓ Instant download</span>
            <span className="hiw-hero__pill">✓ GDPR compliant</span>
          </div>
        </div>
        <div className="hiw-hero__right"><DemoSearch /></div>
      </section>

      {/* How it works steps */}
      <section className={'hiw-steps' + (stepsIn ? ' is-visible' : '')} ref={stepsRef}>
        <h2 className="hiw-h2">Three steps to your data</h2>
        <p className="hiw-section-sub" style={{ margin: '0 auto 40px' }}>From search to download in under 5 minutes.</p>

        <div className="hiw-steps__tabs">
          {STEPS.map((s, i) => (
            <button key={i} className={'hiw-steps__tab' + (i === activeStep ? ' is-active' : '')} onClick={() => goStep(i)}>
              <span className="hiw-steps__tab-num">{s.num}</span>
              <span className="hiw-steps__tab-label">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="hiw-steps__content">
          <div className={'hiw-steps__left' + (stepFade ? ' is-in' : ' is-out')}>
            <h3 className="hiw-steps__heading">{step.heading}</h3>
            <p className="hiw-steps__body">{step.body}</p>
            <ul className="hiw-steps__bullets">
              {step.bullets.map(b => (
                <li key={b}>
                  <span className="hiw-steps__check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="hiw-steps__nav">
              {activeStep > 0 && <button className="hiw-steps__navbtn hiw-steps__navbtn--prev" onClick={() => goStep(activeStep - 1)}>← Previous</button>}
              {activeStep < 2 && <button className="hiw-steps__navbtn hiw-steps__navbtn--next" onClick={() => goStep(activeStep + 1)}>Next: {STEPS[activeStep + 1].label} →</button>}
            </div>
          </div>
          <div className={'hiw-steps__right' + (stepFade ? ' is-in' : ' is-out')}>
            <Demo />
          </div>
        </div>

        <div className="hiw-steps__dots">
          {STEPS.map((_, i) => (
            <button key={i} className={'hiw-steps__dot' + (i === activeStep ? ' is-active' : '')} onClick={() => goStep(i)} />
          ))}
        </div>
      </section>

      {/* Data fields */}
      <section className={'hiw-data' + (dataIn ? ' is-visible' : '')} ref={dataRef}>
        <div className="hiw-section-label">Data included</div>
        <h2 className="hiw-h2">Everything you need on every supplier</h2>
        <p className="hiw-section-sub" style={{ marginBottom: 40 }}>Public teaser fields visible before purchase. Full details unlock instantly after checkout.</p>
        <div className="hiw-data__grid">
          <div className="hiw-data__card">
            <div className="hiw-data__card-head"><span className="hiw-data__card-badge hiw-data__card-badge--green">Free preview</span>Fields visible before purchase</div>
            {DATA_FIELDS.filter(f => f.public).map(f => (
              <div key={f.label} className="hiw-data__field"><span className="hiw-data__field-icon hiw-data__field-icon--green">✓</span>{f.label}</div>
            ))}
          </div>
          <div className="hiw-data__card">
            <div className="hiw-data__card-head"><span className="hiw-data__card-badge hiw-data__card-badge--blue">Unlocked on purchase</span>Full contact &amp; business details</div>
            {DATA_FIELDS.filter(f => !f.public).map(f => (
              <div key={f.label} className="hiw-data__field">
                <span className="hiw-data__field-icon hiw-data__field-icon--blue">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                {f.label}
              </div>
            ))}
          </div>
          <div className="hiw-data__sample">
            <div className="hiw-data__sample-head">Sample record — Andes Coffee Works</div>
            <div className="hiw-data__sample-fields">
              {[['Industry','Food & Beverage'],['Country','Colombia'],['Location','Medellín, Colombia'],['Website','andescoffeeworks.co'],['Email','sales@andescoffeeworks.co'],['Phone','+1-555-1046'],['Staff','310 employees'],['Revenue','$42M annual']].map(([k,v]) => (
                <div key={k} className="hiw-data__sample-row">
                  <span className="hiw-data__sample-label">{k}</span>
                  <span className="hiw-data__sample-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="hiw-data__sample-contacts">
              <div className="hiw-data__sample-head" style={{ borderTop: '1px solid var(--border-soft)', marginTop: 0 }}>Contact persons (2)</div>
              {[{ name:'Sam Garcia', title:'Procurement Lead', email:'sam.garcia@andescoffeeworks.co' },{ name:'Taylor Walsh', title:'Export Manager', email:'taylor.walsh@andescoffeeworks.co' }].map(c => (
                <div key={c.name} className="hiw-data__contact">
                  <div className="hiw-data__contact-avatar">{c.name[0]}</div>
                  <div>
                    <div className="hiw-data__contact-name">{c.name} <span className="hiw-data__contact-title">{c.title}</span></div>
                    <div className="hiw-data__contact-email">{c.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="hiw-formats">
        <div className="hiw-section-label">Output formats</div>
        <h2 className="hiw-h2">Both formats included with every purchase</h2>
        <div className="hiw-formats__grid">
          {[
            { type:'XLS', cls:'xls', name:'Excel workbook (.xlsx)', desc:'A fully formatted spreadsheet with auto-filter, frozen header row, and zebra-striped rows.', bullets:['All 14 data fields as columns','Auto-filter on every column','Branded header with download date','Contact persons in final column'] },
            { type:'PDF', cls:'pdf', name:'PDF document (.pdf)',    desc:'A clean, print-ready record sheet with each supplier in a structured card layout.',           bullets:['Prodomatix branded header','Two-column field layout per record','Contact persons as a mini table','Footer with page numbers on every page'] },
          ].map(f => (
            <div key={f.type} className="hiw-formats__card">
              <div className={`hiw-formats__icon hiw-formats__icon--${f.cls}`}>{f.type}</div>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
              <ul className="hiw-formats__list">{f.bullets.map(b => <li key={b}>{b}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className={'hiw-stats' + (statsIn ? ' is-visible' : '')} ref={statsRef}>
        {STATS.map((s, i) => (
          <div key={s.label} className="hiw-stat">
            <div className="hiw-stat__num">{counts[i].toLocaleString()}{s.suffix}</div>
            <div className="hiw-stat__label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="hiw-pricing">
        <div className="hiw-section-label">Pricing</div>
        <h2 className="hiw-h2">Simple, transparent per-record pricing</h2>
        <p className="hiw-section-sub" style={{ margin: '0 auto 40px' }}>No subscription. No monthly minimum. Pay only for what you download.</p>
        <div className="hiw-pricing__cards">
          <div className="hiw-pricing__card hiw-pricing__card--free">
            <div className="hiw-pricing__card-badge">Start here</div>
            <div className="hiw-pricing__card-price">Free</div>
            <div className="hiw-pricing__card-label">3 download credits</div>
            <p className="hiw-pricing__card-desc">Download 3 full supplier records with no payment. No credit card needed.</p>
            <Link to="/register" className="btn btn--primary btn--full hiw-pricing__cta">Get started free →</Link>
          </div>
          <div className="hiw-pricing__card hiw-pricing__card--paid">
            <div className="hiw-pricing__card-badge hiw-pricing__card-badge--blue">Pay as you go</div>
            <div className="hiw-pricing__card-price">$49–$199</div>
            <div className="hiw-pricing__card-label">per record</div>
            <p className="hiw-pricing__card-desc">Price shown per record before you select. Volume discounts applied automatically.</p>
            <div className="hiw-pricing__discounts">
              <div className="hiw-pricing__discount"><strong>5% off</strong> orders over $300</div>
              <div className="hiw-pricing__discount"><strong>10% off</strong> orders over $600</div>
              <div className="hiw-pricing__discount"><strong>15% off</strong> orders over $1,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={'hiw-cta' + (ctaIn ? ' is-visible' : '')} ref={ctaRef}>
        <h2 className="hiw-cta__h2">Ready to find your suppliers?</h2>
        <p className="hiw-cta__sub">Start with 3 free downloads — no credit card, no commitment.</p>
        <div className="hiw-cta__actions">
          <Link to="/register" className="btn btn--primary hiw-cta__btn">Create free account →</Link>
          <Link to="/login" className="hiw-cta__link">Already have an account? Sign in</Link>
        </div>
        <div className="hiw-cta__trust">
          <span>✓ GDPR compliant</span><span>✓ CCPA compliant</span>
          <span>✓ No subscription</span><span>✓ Cancel anytime</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="hiw-foot">
        <div className="hiw-foot__inner">
          <img src="/logo.png" alt="Prodomatix" className="hiw-foot__logo" />
          <div className="hiw-foot__links">
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
