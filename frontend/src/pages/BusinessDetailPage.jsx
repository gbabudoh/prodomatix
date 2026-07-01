import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { moneyRound, priceOf, fmtNum } from '../lib/format.js';
import IndustryDot from '../components/IndustryDot.jsx';
import TypeBadge from '../components/TypeBadge.jsx';
import CountryFlag from '../components/CountryFlag.jsx';

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

function LockedField({ label }) {
  return (
    <div className="detail-field detail-field--locked">
      <span className="detail-field__label">{label}</span>
      <span className="detail-field__lock-val">
        <LockIcon /> Unlock to reveal
      </span>
    </div>
  );
}

function Field({ label, value, full }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className={'detail-field' + (full ? ' detail-field--full' : '')}>
      <span className="detail-field__label">{label}</span>
      <span className="detail-field__value">{value}</span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="detail">
      <div className="detail__inner">
        <div className="skel skel-cell" style={{ width: 60, height: 13, marginBottom: 28 }} />
        <div className="detail__head" style={{ marginBottom: 28 }}>
          <div className="skel" style={{ width: 12, height: 12, borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <div className="skel skel-cell" style={{ width: 260, height: 22, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {[80, 110, 100, 90].map((w, i) => (
                <div key={i} className="skel skel-cell" style={{ width: w, height: 22, borderRadius: 20 }} />
              ))}
            </div>
          </div>
        </div>
        <div className="detail__grid">
          <div className="detail-card">
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-soft)' }}>
              <div className="skel skel-cell" style={{ width: 80, height: 12 }} />
            </div>
            <div className="detail-fields">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="detail-field">
                  <div className="skel skel-cell" style={{ width: 80, height: 11 }} />
                  <div className="skel skel-cell" style={{ width: 140, height: 13 }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="detail-card" style={{ padding: 20 }}>
              <div className="skel skel-cell" style={{ width: 60, height: 11, marginBottom: 10 }} />
              <div className="skel skel-cell" style={{ width: 100, height: 32, marginBottom: 16 }} />
              {[120, 140, 110, 100].map((w, i) => (
                <div key={i} className="skel skel-cell" style={{ width: w, height: 12, marginBottom: 10 }} />
              ))}
              <div className="skel skel-cell" style={{ width: '100%', height: 44, marginTop: 8, borderRadius: 9 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BusinessDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, toggleRow } = useMarketplace();
  const [biz, setBiz] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setBiz(null); setError(null);
    api.get(`/businesses/${id}`).then(setBiz).catch((e) => setError(e.message));
  }, [id]);

  if (error) return (
    <div className="detail"><div className="detail__inner">
      <div className="detail-error">
        <div className="detail-error__icon">!</div>
        <div className="detail-error__msg">{error}</div>
        <button className="btn-soft" onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div></div>
  );
  if (!biz) return <DetailSkeleton />;

  const owned = biz.owned;
  const isSelected = !!state.selected[biz.id];

  const buyNow = () => {
    if (!isSelected) toggleRow(biz);
    navigate('/checkout');
  };

  return (
    <div className="detail">
      <div className="detail__inner">

        <button className="detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft /> Back to results
        </button>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="detail__head">
          <IndustryDot industry={biz.industry} />
          <div className="detail__title">
            <h1>{biz.businessName}</h1>
            <div className="detail__tags">
              <TypeBadge type={biz.businessType} />
              <span className="detail__chip">{biz.industry}</span>
              <span className="detail__chip"><CountryFlag country={biz.country} /></span>
              <span className="detail__chip detail__chip--green">{biz.verified}% verified</span>
              {owned && <span className="badge badge--green">Owned</span>}
            </div>
          </div>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="detail__grid">

          {/* Left: fields */}
          <div>
            <div className="detail-card">
              <div className="card__head">{owned ? 'Full business record' : 'Preview — unlock for full details'}</div>
              <div className="detail-fields">
                <Field label="Supplier type"  value={biz.businessType} />
                <Field label="Industry"       value={biz.industry} />
                <Field label="Country"        value={<CountryFlag country={biz.country} />} />
                <Field label="Region"         value={biz.region} />
                {owned ? (
                  <>
                    <Field label="Location"         value={biz.location} />
                    <Field label="Product / service" value={biz.productOrService} />
                    <Field label="Website"          value={biz.website} />
                    <Field label="Email"            value={biz.email} />
                    <Field label="Phone"            value={biz.phone} />
                    <Field label="Staff capacity"   value={fmtNum(biz.staffCapacity)} />
                    <Field label="Revenue ($M)"     value={fmtNum(biz.revenue)} />
                    <Field label="Verified contacts" value={fmtNum(biz.contacts)} />
                    <Field label="About"            value={biz.description} full />
                  </>
                ) : (
                  <>
                    <LockedField label="Location" />
                    <LockedField label="Product / service" />
                    <LockedField label="Website" />
                    <LockedField label="Email" />
                    <LockedField label="Phone" />
                    <LockedField label="Staff capacity" />
                    <LockedField label="Verified contacts" />
                  </>
                )}
              </div>
            </div>

            {/* Contact persons */}
            {owned && biz.contactPersons?.length > 0 && (
              <div className="detail-card" style={{ marginTop: 16 }}>
                <div className="card__head">Contact persons ({biz.contactPersons.length})</div>
                <div className="detail-contacts">
                  {biz.contactPersons.map((c) => (
                    <div className="contact-card" key={c.id}>
                      <div className="contact-card__avatar">
                        {(c.name?.[0] || '?').toUpperCase()}
                      </div>
                      <div className="contact-card__body">
                        <div className="contact-card__name">{c.name}
                          {c.title && <span className="contact-card__title">{c.title}</span>}
                        </div>
                        <div className="contact-card__meta">
                          {c.email && <a href={`mailto:${c.email}`} className="contact-card__link">{c.email}</a>}
                          {c.email && c.phone && <span className="contact-card__sep">·</span>}
                          {c.phone && <span>{c.phone}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: CTA sidebar */}
          <div className="detail-side">
            {owned ? (
              <div className="detail-cta detail-cta--owned">
                <div className="detail-cta__owned-badge">
                  <CheckIcon /> Owned
                </div>
                <p className="detail-cta__owned-msg">
                  You own this record. Download it anytime as Excel or PDF from your dashboard.
                </p>
                <button className="btn btn--primary btn--full" onClick={() => navigate('/dashboard')}>
                  Go to my data →
                </button>
              </div>
            ) : (
              <div className="detail-cta">
                <div className="detail-cta__label">Unlock full record</div>
                <div className="detail-cta__price">{moneyRound(priceOf(biz))}</div>

                <ul className="detail-cta__list">
                  {['Exact location & address', 'Website, email & phone', 'Verified contact persons', 'Excel + PDF download'].map((item) => (
                    <li key={item}><CheckIcon />{item}</li>
                  ))}
                </ul>

                <button className="btn btn--primary btn--full" onClick={buyNow}>
                  {isSelected ? 'Go to checkout →' : 'Purchase to unlock'}
                </button>

                <button
                  className={'detail-cta__secondary' + (isSelected ? ' is-selected' : '')}
                  onClick={() => toggleRow(biz)}
                >
                  {isSelected ? '✓ Added to selection' : '+ Add to selection'}
                </button>

                <div className="detail-cta__note">
                  <LockIcon /> Secure checkout · GDPR compliant
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
