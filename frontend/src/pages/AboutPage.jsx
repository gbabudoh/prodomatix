import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const YEAR = new Date().getFullYear();

function Section({ id, title, children }) {
  return (
    <section className="policy-section" id={id}>
      <h2 className="policy-section__title">{title}</h2>
      <div className="policy-section__body">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="policy-page">
      <Seo
        title="About"
        description="Prodomatix is a B2B data marketplace operated by Egobas Limited. Learn how we source, verify, and price supplier data — and what we do (and don't) do with it."
        path="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Prodomatix',
          url: 'https://prodomatix.com/about',
          mainEntity: {
            '@type': 'Organization',
            name: 'Prodomatix',
            url: 'https://prodomatix.com',
            parentOrganization: { '@type': 'Organization', name: 'Egobas Limited' },
          },
        }}
      />

      {/* Nav */}
      <nav className="policy-nav">
        <Link to="/">
          <img src="/logo.png" alt="Prodomatix" className="policy-nav__logo" />
        </Link>
        <Link to="/" className="policy-nav__back">← Back to home</Link>
      </nav>

      <div className="policy-wrap">

        {/* Header */}
        <div className="policy-header">
          <div className="policy-header__label">Company</div>
          <h1 className="policy-header__title">About Prodomatix</h1>
          <p className="policy-header__meta">
            A subsidiary of <strong>Egobas Limited</strong>
          </p>
          <p className="policy-header__intro">
            Prodomatix is a B2B data marketplace. Businesses search, filter, and download verified
            supplier records — pay per record, with no subscription or commitment.
          </p>
        </div>

        {/* Sections */}
        <div className="policy-sections">

          <Section id="what-we-do" title="What we do">
            <p>
              Prodomatix gives businesses a straightforward way to find suppliers: search across
              28,000+ verified B2B records covering 150+ countries and 40+ industries, filter by
              supplier type, industry, country, region, revenue, or staff size, and download exactly
              the records you need — as a formatted Excel workbook and a print-ready PDF, generated
              instantly at checkout.
            </p>
            <p>
              There's no subscription and no monthly minimum. Pricing is per record ($0.50–$1.20),
              shown upfront before you buy, with automatic volume discounts on larger orders. New
              accounts get 3 free download credits with no credit card required, so you can try the
              platform with zero risk.
            </p>
          </Section>

          <Section id="how-data-works" title="How our data works">
            <p>
              Every supplier record carries a <strong>verification percentage</strong>, reflecting
              how many of its fields have been independently confirmed accurate. Verification
              includes automated cross-referencing against public registries and domain records,
              email and phone deliverability checks, and periodic manual review by our data team.
            </p>
            <p>
              Data is collected from public business directories and registries, company websites,
              trade publications and exhibitions, direct submissions from businesses themselves,
              and select licensed commercial data partners. Full detail on sourcing and accuracy
              is in our <Link to="/data-policy">Data Policy</Link>.
            </p>
          </Section>

          <Section id="commitments" title="Our commitments">
            <ul>
              <li><strong>Transparent pricing</strong> — the price of every record is shown before you select it. No hidden fees, no surprise charges at checkout.</li>
              <li><strong>No dark patterns on cancellation</strong> — there's no subscription to cancel in the first place.</li>
              <li><strong>Data protection compliance</strong> — we operate in compliance with GDPR, the UK GDPR, and the CCPA. Details are in our <Link to="/privacy-policy">Privacy Policy</Link>.</li>
              <li><strong>Your downloads don't expire</strong> — every purchase is saved to your dashboard, re-downloadable anytime.</li>
            </ul>
          </Section>

          <Section id="operator" title="Who operates Prodomatix">
            <p>
              Prodomatix is operated by <strong>Egobas Limited</strong>, which acts as the data
              controller for personal data collected through the platform (see our{' '}
              <Link to="/privacy-policy">Privacy Policy</Link> for details on what that means for you).
            </p>
            <div className="policy-contact">
              <div><strong>Operator</strong><br />Egobas Limited</div>
              <div><strong>Platform</strong><br />prodomatix.com</div>
              <div><strong>General enquiries</strong><br /><a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a></div>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <footer className="policy-footer">
          <span>© {YEAR} Prodomatix · A subsidiary of Egobas Limited</span>
          <span className="policy-footer__sep">·</span>
          <Link to="/privacy-policy" className="policy-footer__link">Privacy Policy</Link>
          <span className="policy-footer__sep">·</span>
          <Link to="/data-policy" className="policy-footer__link">Data Policy</Link>
          <span className="policy-footer__sep">·</span>
          <Link to="/" className="policy-footer__link">Home</Link>
        </footer>
      </div>
    </div>
  );
}
