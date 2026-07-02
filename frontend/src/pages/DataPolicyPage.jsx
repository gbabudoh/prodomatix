import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

const YEAR = new Date().getFullYear();
const EFFECTIVE = 'July 1, 2026';

function Section({ id, title, children }) {
  return (
    <section className="policy-section" id={id}>
      <h2 className="policy-section__title">{title}</h2>
      <div className="policy-section__body">{children}</div>
    </section>
  );
}

export default function DataPolicyPage() {
  return (
    <div className="policy-page">
      <Seo
        title="Data Policy"
        description="How Prodomatix sources, verifies, and lets you use B2B supplier data — accuracy standards, licensing, and usage terms."
        path="/data-policy"
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
          <div className="policy-header__label">Legal</div>
          <h1 className="policy-header__title">Data Policy</h1>
          <p className="policy-header__meta">
            Effective date: <strong>{EFFECTIVE}</strong> · Prodomatix is a subsidiary of Egobas Limited
          </p>
          <p className="policy-header__intro">
            This Data Policy explains what business data Prodomatix holds, where it comes from,
            how it is verified, how it is used when purchased, and what rights you have in relation
            to that data. Please read this alongside our <Link to="/privacy-policy">Privacy Policy</Link>, which covers personal
            data we collect about you as a user of this platform.
          </p>
        </div>

        {/* TOC */}
        <nav className="policy-toc">
          <div className="policy-toc__title">Contents</div>
          {[
            ['#what-data',     '1. What business data we hold'],
            ['#sources',       '2. Data sources and collection'],
            ['#verification',  '3. How data is verified'],
            ['#use',           '4. How purchased data may be used'],
            ['#restrictions',  '5. Prohibited uses'],
            ['#accuracy',      '6. Accuracy and updates'],
            ['#retention',     '7. Data retention'],
            ['#gdpr',          '8. GDPR & your rights'],
            ['#ccpa',          '9. CCPA (California) rights'],
            ['#contact',       '10. Contact us'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="policy-toc__link">{label}</a>
          ))}
        </nav>

        {/* Sections */}
        <div className="policy-sections">

          <Section id="what-data" title="1. What business data we hold">
            <p>Prodomatix maintains a database of B2B supplier records. Each record may contain some or all of the following fields:</p>
            <ul>
              <li><strong>Business name</strong> — the registered or trading name of the company</li>
              <li><strong>Supplier type</strong> — Manufacturer, Distributor, or Wholesaler</li>
              <li><strong>Industry</strong> — the primary sector the business operates in</li>
              <li><strong>Country &amp; region</strong> — public geographic location</li>
              <li><strong>Location / address</strong> — precise city, address (unlocked on purchase)</li>
              <li><strong>Product or service</strong> — a description of what the business provides</li>
              <li><strong>Website</strong> — the company's public web address</li>
              <li><strong>Email address</strong> — business contact email</li>
              <li><strong>Phone number</strong> — business contact phone</li>
              <li><strong>Staff capacity</strong> — approximate number of employees</li>
              <li><strong>Revenue</strong> — approximate annual revenue in USD millions</li>
              <li><strong>Contact persons</strong> — name, job title, email, and phone of key individuals at the business</li>
            </ul>
            <p>
              A subset of fields (business name, supplier type, industry, country, region) is visible
              to all authenticated users as a <strong>free teaser</strong>. The full record, including contact
              details and precise location, is unlocked only upon purchase.
            </p>
          </Section>

          <Section id="sources" title="2. Data sources and collection">
            <p>Business data in the Prodomatix database is collected from the following sources:</p>
            <ul>
              <li><strong>Public business directories</strong> — publicly available company registries, trade directories, and government databases</li>
              <li><strong>Company websites</strong> — publicly published information on corporate websites including contact pages, about pages, and product listings</li>
              <li><strong>Trade publications and exhibitions</strong> — industry events, catalogues, and sector-specific publications where businesses advertise their services</li>
              <li><strong>Directly submitted data</strong> — businesses may submit or update their own records through our platform</li>
              <li><strong>Third-party data partners</strong> — select licensed commercial data providers who supply B2B contact information in compliance with applicable law</li>
            </ul>
            <p>
              All data collection is performed in accordance with applicable laws in the jurisdictions
              where the source data originates, including the EU General Data Protection Regulation (GDPR)
              where contact persons are individuals in the European Economic Area.
            </p>
          </Section>

          <Section id="verification" title="3. How data is verified">
            <p>Each record carries a <strong>verification percentage</strong> that reflects the proportion of fields that have been confirmed accurate through our verification process, which includes:</p>
            <ul>
              <li>Automated cross-referencing against public registries and domain records</li>
              <li>Email deliverability checks on business email addresses</li>
              <li>Phone number reachability checks</li>
              <li>Periodic manual review by our data team</li>
            </ul>
            <p>
              A record showing <strong>90% verified</strong> means 9 in 10 data points have been independently confirmed.
              No data set is guaranteed to be 100% accurate or current at all times — business information
              changes, and we make no warranty as to the completeness or real-time accuracy of any record.
            </p>
          </Section>

          <Section id="use" title="4. How purchased data may be used">
            <p>When you purchase a record or set of records on Prodomatix, you are granted a <strong>non-exclusive, non-transferable licence</strong> to use that data for legitimate B2B commercial purposes, including:</p>
            <ul>
              <li>Contacting businesses to discuss commercial partnerships, procurement, or supply agreements</li>
              <li>Internal market research, supplier evaluation, and due diligence</li>
              <li>Integrating into your own CRM or business systems for the purposes above</li>
            </ul>
            <p>
              Downloaded records are available in your dashboard at any time and do not expire.
              You may re-download your purchases in Excel or PDF format whenever needed.
            </p>
          </Section>

          <Section id="restrictions" title="5. Prohibited uses">
            <p>The following uses of purchased data are <strong>strictly prohibited</strong> and constitute a material breach of our Terms of Service:</p>
            <ul>
              <li>Reselling, sublicensing, or redistribution of records to any third party</li>
              <li>Using contact data for unsolicited mass-marketing, spam, or automated cold-calling campaigns that violate applicable anti-spam laws (CAN-SPAM, CASL, ePrivacy Directive)</li>
              <li>Using data for any unlawful purpose including fraud, identity theft, or harassment</li>
              <li>Combining our data with other sources to build a competing data product</li>
              <li>Scraping or automated bulk extraction beyond what is available through the platform</li>
            </ul>
          </Section>

          <Section id="accuracy" title="6. Accuracy and updates">
            <p>
              We update our database on a rolling basis. If you discover that a record contains
              inaccurate or outdated information, please contact us at{' '}
              <a href="mailto:data@prodomatix.com">data@prodomatix.com</a> and we will
              investigate and correct the record where possible.
            </p>
            <p>
              If you are the subject of a record (i.e. your business or personal contact details
              appear in our database) and you wish to update or remove your information,
              please email <a href="mailto:data@prodomatix.com">data@prodomatix.com</a> with
              "Data Removal Request" in the subject line.
            </p>
          </Section>

          <Section id="retention" title="7. Data retention">
            <ul>
              <li><strong>Business records</strong> — retained indefinitely unless a removal request is upheld or the data becomes unverifiable</li>
              <li><strong>Your purchase history</strong> — retained for 7 years for accounting and legal compliance purposes</li>
              <li><strong>Your account data</strong> — retained for the duration of your account and deleted within 90 days of account closure on request</li>
              <li><strong>Downloaded files</strong> — stored in our system and available to you in your dashboard; you may delete them from your account at any time</li>
            </ul>
          </Section>

          <Section id="gdpr" title="8. GDPR & your rights (EEA / UK)">
            <p>
              If you are located in the European Economic Area or the United Kingdom, you have the
              following rights under the General Data Protection Regulation (GDPR) in relation to
              personal data we hold about you:
            </p>
            <ul>
              <li><strong>Right of access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Right to rectification</strong> — request correction of inaccurate data</li>
              <li><strong>Right to erasure</strong> — request deletion of your personal data ("right to be forgotten")</li>
              <li><strong>Right to restrict processing</strong> — request that we limit how we use your data</li>
              <li><strong>Right to data portability</strong> — receive your data in a structured, machine-readable format</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interests</li>
            </ul>
            <p>
              The lawful basis for processing contact data of business individuals is <strong>legitimate interest</strong>
              — enabling B2B commercial communication that the data subject can reasonably expect
              given the nature of their role. To exercise any of these rights, contact us at{' '}
              <a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a>.
            </p>
          </Section>

          <Section id="ccpa" title="9. CCPA rights (California residents)">
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) grants you
              the following rights in relation to personal information:
            </p>
            <ul>
              <li><strong>Right to know</strong> — what personal information is collected, used, shared, or sold</li>
              <li><strong>Right to delete</strong> — request deletion of personal information we hold</li>
              <li><strong>Right to opt out</strong> — opt out of the sale of personal information (we do not sell your personal account data)</li>
              <li><strong>Right to non-discrimination</strong> — equal service regardless of whether you exercise your CCPA rights</li>
            </ul>
            <p>
              To submit a CCPA request, email <a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a>{' '}
              with "CCPA Request" in the subject line. We will respond within 45 days.
            </p>
          </Section>

          <Section id="contact" title="10. Contact us">
            <p>For any questions, requests, or concerns about this Data Policy or how your data is handled:</p>
            <div className="policy-contact">
              <div><strong>Data enquiries</strong><br /><a href="mailto:data@prodomatix.com">data@prodomatix.com</a></div>
              <div><strong>Privacy &amp; GDPR / CCPA</strong><br /><a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a></div>
              <div><strong>Registered operator</strong><br />Egobas Limited</div>
            </div>
            <p>We aim to respond to all data-related requests within <strong>14 business days</strong>.</p>
          </Section>

        </div>

        {/* Footer */}
        <footer className="policy-footer">
          <span>© {YEAR} Prodomatix · A subsidiary of Egobas Limited</span>
          <span className="policy-footer__sep">·</span>
          <Link to="/about" className="policy-footer__link">About</Link>
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
