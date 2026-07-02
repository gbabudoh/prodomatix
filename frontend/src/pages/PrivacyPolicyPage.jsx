import { Link } from 'react-router-dom';

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

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">

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
          <h1 className="policy-header__title">Privacy Policy</h1>
          <p className="policy-header__meta">
            Effective date: <strong>{EFFECTIVE}</strong> · Prodomatix is a subsidiary of Egobas Limited
          </p>
          <p className="policy-header__intro">
            This Privacy Policy describes how Prodomatix ("we", "us", "our") collects, uses, stores,
            and protects personal information about you when you use our platform at prodomatix.com.
            We are committed to handling your personal data responsibly and in compliance with the
            General Data Protection Regulation (GDPR), the UK GDPR, and the California Consumer
            Privacy Act (CCPA).
          </p>
        </div>

        {/* TOC */}
        <nav className="policy-toc">
          <div className="policy-toc__title">Contents</div>
          {[
            ['#who-we-are',       '1. Who we are'],
            ['#what-we-collect',  '2. What personal data we collect'],
            ['#how-we-use',       '3. How we use your data'],
            ['#legal-basis',      '4. Legal basis for processing'],
            ['#sharing',          '5. Who we share your data with'],
            ['#cookies',          '6. Cookies and tracking'],
            ['#transfers',        '7. International data transfers'],
            ['#retention',        '8. How long we keep your data'],
            ['#security',         '9. How we protect your data'],
            ['#your-rights',      '10. Your rights'],
            ['#children',         '11. Children\'s privacy'],
            ['#changes',          '12. Changes to this policy'],
            ['#contact',          '13. Contact us'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="policy-toc__link">{label}</a>
          ))}
        </nav>

        {/* Sections */}
        <div className="policy-sections">

          <Section id="who-we-are" title="1. Who we are">
            <p>
              Prodomatix is a B2B supplier data marketplace operated by <strong>Egobas Limited</strong>.
              We provide a platform where registered users can search, select, and download verified
              business records for commercial sourcing and procurement purposes.
            </p>
            <p>
              For the purposes of data protection law, Egobas Limited is the <strong>data controller</strong>{' '}
              responsible for your personal data collected through this platform.
            </p>
            <div className="policy-contact">
              <div><strong>Operator</strong><br />Egobas Limited</div>
              <div><strong>Platform</strong><br />prodomatix.com</div>
              <div><strong>Privacy contact</strong><br /><a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a></div>
            </div>
          </Section>

          <Section id="what-we-collect" title="2. What personal data we collect">
            <p>We collect the following categories of personal data:</p>
            <ul>
              <li>
                <strong>Account data</strong> — your full name, email address, and password hash
                when you register for an account. If you sign in with Google, we receive your name
                and email address from Google.
              </li>
              <li>
                <strong>Transaction data</strong> — records of purchases you make, including order
                references, items purchased, amounts paid, and timestamps.
              </li>
              <li>
                <strong>Payment data</strong> — card payments are processed by <strong>Stripe</strong>.
                We do not store your card number, CVV, or expiry date on our servers. Stripe
                handles all payment data under their own privacy policy and PCI-DSS compliance.
              </li>
              <li>
                <strong>Usage data</strong> — information about how you interact with the platform,
                including pages viewed, search queries, filters applied, and download history.
                This is collected through server logs and may include your IP address and browser
                user agent.
              </li>
              <li>
                <strong>Communications</strong> — if you contact us by email, we retain those
                communications to respond to your enquiry and for record-keeping.
              </li>
            </ul>
            <p>We do <strong>not</strong> collect sensitive personal data (special category data) such as health, ethnicity, religion, or political opinions.</p>
          </Section>

          <Section id="how-we-use" title="3. How we use your data">
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li><strong>To provide the service</strong> — creating and managing your account, processing orders, generating downloadable files, and maintaining your purchase history.</li>
              <li><strong>Authentication</strong> — verifying your identity when you log in, via email/password or Google OAuth.</li>
              <li><strong>Payment processing</strong> — passing transaction details to Stripe to charge your card and receive payment confirmation.</li>
              <li><strong>Customer support</strong> — responding to questions, requests, or complaints you send us.</li>
              <li><strong>Platform improvement</strong> — analysing usage patterns to improve search, filtering, and the overall user experience.</li>
              <li><strong>Legal and compliance</strong> — retaining purchase records for tax, accounting, and legal obligation purposes.</li>
              <li><strong>Security</strong> — detecting and preventing fraud, abuse, and unauthorised access to accounts.</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data to third parties. We do not use your data for automated decision-making or profiling that produces legal or significant effects.</p>
          </Section>

          <Section id="legal-basis" title="4. Legal basis for processing (GDPR)">
            <p>For users in the EEA or UK, our legal bases for processing your personal data are:</p>
            <ul>
              <li><strong>Contract performance (Art. 6(1)(b))</strong> — processing your account data and transaction data is necessary to deliver the service you signed up for.</li>
              <li><strong>Legitimate interests (Art. 6(1)(f))</strong> — processing usage data for fraud prevention, platform security, and product improvement, where these interests are not overridden by your rights.</li>
              <li><strong>Legal obligation (Art. 6(1)(c))</strong> — retaining transaction records to comply with tax and accounting laws.</li>
              <li><strong>Consent (Art. 6(1)(a))</strong> — where we ask for your consent for specific optional processing (e.g. marketing communications), which you may withdraw at any time.</li>
            </ul>
          </Section>

          <Section id="sharing" title="5. Who we share your data with">
            <p>We share your personal data only with trusted third parties necessary to operate the platform:</p>
            <ul>
              <li>
                <strong>Stripe</strong> — payment processing. Stripe receives your card details
                and transaction amount directly. Their privacy policy is available at stripe.com/privacy.
              </li>
              <li>
                <strong>Google</strong> — if you use "Sign in with Google", Google authenticates
                your identity and shares your name and email with us. Google's privacy policy is
                available at policies.google.com/privacy.
              </li>
              <li>
                <strong>Hosting and infrastructure providers</strong> — our servers are hosted on
                Contabo GmbH infrastructure. Data is stored on servers within the EU.
              </li>
              <li>
                <strong>Law enforcement / legal process</strong> — we may disclose personal data
                if required by law, court order, or to protect the rights and safety of our users
                or the public.
              </li>
            </ul>
            <p>We do not share your data with advertisers, data brokers, or marketing platforms.</p>
          </Section>

          <Section id="cookies" title="6. Cookies and tracking">
            <p>
              Prodomatix uses the following types of storage on your device:
            </p>
            <ul>
              <li>
                <strong>Authentication token</strong> — a JWT (JSON Web Token) is stored in your
                browser's <code>localStorage</code> to keep you logged in between sessions. This
                is strictly necessary for the service to function and does not require consent.
              </li>
              <li>
                <strong>Session data</strong> — your current search filters and selections are
                held in memory for the duration of your browser session only.
              </li>
            </ul>
            <p>
              We do <strong>not</strong> use third-party advertising cookies, tracking pixels,
              analytics platforms (such as Google Analytics), or social media trackers.
            </p>
          </Section>

          <Section id="transfers" title="7. International data transfers">
            <p>
              Our primary infrastructure is hosted within the EU. If any processing involves
              transfers to countries outside the EEA (for example, via Stripe or Google services
              hosted in the United States), those transfers are made under appropriate safeguards
              including Standard Contractual Clauses (SCCs) approved by the European Commission,
              or the EU-US Data Privacy Framework where applicable.
            </p>
          </Section>

          <Section id="retention" title="8. How long we keep your data">
            <ul>
              <li><strong>Account data</strong> — retained for the life of your account. Deleted within 90 days of a verified account closure request.</li>
              <li><strong>Purchase and transaction records</strong> — retained for 7 years to comply with financial and tax regulations.</li>
              <li><strong>Usage logs</strong> — retained for up to 90 days for security and debugging purposes, then deleted.</li>
              <li><strong>Support communications</strong> — retained for up to 3 years after the conversation is closed.</li>
            </ul>
          </Section>

          <Section id="security" title="9. How we protect your data">
            <ul>
              <li><strong>Passwords</strong> — stored as bcrypt hashes with a salt factor of 10. We never store plaintext passwords.</li>
              <li><strong>Data in transit</strong> — all connections to the platform are encrypted via HTTPS/TLS.</li>
              <li><strong>Payment data</strong> — handled entirely by Stripe. We never store, log, or transmit raw card details.</li>
              <li><strong>Access control</strong> — your data is accessible only to your account. Admin access is restricted and logged.</li>
              <li><strong>Authentication tokens</strong> — JWT tokens expire after 7 days and are signed with a server-side secret key.</li>
            </ul>
            <p>
              No system is 100% secure. In the unlikely event of a personal data breach that poses
              a risk to your rights, we will notify you and the relevant supervisory authority within
              72 hours as required by GDPR.
            </p>
          </Section>

          <Section id="your-rights" title="10. Your rights">
            <p>Depending on your location, you have the following rights regarding your personal data. To exercise any of them, email <a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a>.</p>
            <ul>
              <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure</strong> — request deletion of your account and personal data, subject to legal retention obligations.</li>
              <li><strong>Restriction</strong> — request that we pause processing of your data in certain circumstances.</li>
              <li><strong>Portability</strong> — receive your account data in a structured, machine-readable format.</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests.</li>
              <li><strong>Withdraw consent</strong> — where processing is based on consent, withdraw it at any time without affecting prior processing.</li>
              <li><strong>Lodge a complaint</strong> — you have the right to complain to your national data protection authority if you believe we have mishandled your data.</li>
            </ul>
            <p>We will respond to all requests within <strong>30 days</strong>. Complex requests may take up to 90 days with notice.</p>
          </Section>

          <Section id="children" title="11. Children's privacy">
            <p>
              Prodomatix is a business-to-business platform intended for use by adults in a
              professional capacity. We do not knowingly collect personal data from anyone under
              the age of 18. If you believe a minor has created an account, please contact us
              at <a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a> and we will
              delete the account promptly.
            </p>
          </Section>

          <Section id="changes" title="12. Changes to this policy">
            <p>
              We may update this Privacy Policy from time to time. When we make material changes,
              we will update the effective date at the top of this page and, where appropriate,
              notify you by email. Your continued use of the platform after any changes constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section id="contact" title="13. Contact us">
            <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</p>
            <div className="policy-contact">
              <div><strong>Privacy enquiries</strong><br /><a href="mailto:privacy@prodomatix.com">privacy@prodomatix.com</a></div>
              <div><strong>Data removal</strong><br /><a href="mailto:data@prodomatix.com">data@prodomatix.com</a></div>
              <div><strong>Registered operator</strong><br />Egobas Limited</div>
            </div>
            <p>We aim to respond to all privacy-related requests within <strong>14 business days</strong>.</p>
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
