import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { useAuth } from '../store/AuthContext.jsx';
import { priceOf, money, moneyRound } from '../lib/format.js';
import IndustryDot from '../components/IndustryDot.jsx';
import { api } from '../api/client.js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const CARD_STYLE = {
  style: {
    base: {
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      fontSize: '14px',
      color: '#181b22',
      '::placeholder': { color: '#9aa2ae' },
    },
    invalid: { color: '#b42525' },
  },
};

// ── Inner checkout form (must be inside <Elements>) ───────────────────────────
function CheckoutForm({ selectedBusinesses, totals, useFree, setUseFree, freeEligible, user }) {
  const navigate = useNavigate();
  const { checkout } = useMarketplace();
  const { refresh } = useAuth();
  const stripe   = useStripe();
  const elements = useElements();
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState(null);
  const { toggleRow } = useMarketplace();

  const charged = useFree
    ? { subtotal: totals.subtotal, discount: 0, tax: 0, total: 0 }
    : totals;

  const onPay = async () => {
    setBusy(true); setError(null);
    try {
      if (useFree) {
        // Free-credit path — no Stripe involved.
        const order = await checkout(true);
        await refresh();
        navigate(`/success/${order.purchaseId}`);
        return;
      }

      // Paid path — create PaymentIntent then confirm with card.
      if (!stripe || !elements) throw new Error('Stripe not loaded.');
      const cardEl = elements.getElement(CardElement);
      if (!cardEl) throw new Error('Card element not found.');

      const businessIds = selectedBusinesses.map(b => b.id);
      const { clientSecret } = await api.post('/payments/create-intent', { businessIds });

      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardEl },
      });

      if (stripeErr) throw new Error(stripeErr.message);
      if (paymentIntent?.status !== 'succeeded') throw new Error('Payment not confirmed.');

      // Payment succeeded — record the purchase.
      const order = await checkout(false);
      await refresh();
      navigate(`/success/${order.purchaseId}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="checkout__grid">
      {/* Left: records + includes */}
      <div className="checkout__col">
        <div className="card">
          <div className="card__head">
            Selected records
            <span className="checkout__count">{totals.count}</span>
          </div>
          <div className="sel-list">
            {selectedBusinesses.map(b => (
              <div className="sel-item" key={b.id}>
                <IndustryDot industry={b.industry} />
                <div className="sel-item__main">
                  <div className="sel-item__name">{b.businessName}</div>
                  <div className="sel-item__meta">{b.businessType} · {b.industry} · {b.country}</div>
                </div>
                <div className="sel-item__price">{moneyRound(priceOf(b))}</div>
                <button className="remove-btn" onClick={() => toggleRow(b)} title="Remove">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout__includes">
          <div className="checkout__includes-title">What's included</div>
          {[
            'Formatted Excel workbook (.xlsx) with auto-filter',
            'Print-ready PDF with contact persons',
            'Immediate download — no waiting',
            'Re-download anytime from your dashboard',
          ].map(item => (
            <div key={item} className="checkout__include-item">
              <span className="checkout__include-check"><CheckIcon /></span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Right: summary + payment */}
      <div className="card summary">
        <div className="summary__title">Order summary</div>

        <div className="summary__rows">
          <div className="summary__row">
            <span className="label">Subtotal ({totals.count} records)</span>
            <span className="mono">{money(totals.subtotal)}</span>
          </div>
          {!useFree && totals.discountPct > 0 && (
            <div className="summary__row discount">
              <span className="label">Volume discount ({Math.round(totals.discountPct * 100)}%)</span>
              <span className="mono val">−{money(totals.discount)}</span>
            </div>
          )}
          {!useFree && (
            <div className="summary__row">
              <span className="label">Tax (8.25%)</span>
              <span className="mono">{money(totals.tax)}</span>
            </div>
          )}
        </div>

        <div className="summary__total">
          <span className="label">Total</span>
          <span className={'mono val' + (useFree ? ' summary__total-free' : '')}>{money(charged.total)}</span>
        </div>

        {freeEligible && (
          <label className="free-toggle">
            <input type="checkbox" checked={useFree} onChange={e => setUseFree(e.target.checked)} />
            <span>
              Use {totals.count} free {totals.count === 1 ? 'credit' : 'credits'}
              <span className="free-toggle__avail">{user.freeCredits} available</span>
            </span>
          </label>
        )}

        {!useFree && (
          <div className="pay-form">
            <div className="pay-form__label">Card details</div>
            <div className="stripe-card-wrap">
              <CardElement options={CARD_STYLE} />
            </div>
          </div>
        )}

        {error && <div className="auth__error" style={{ marginTop: 12 }}>{error}</div>}

        <button className="btn btn--primary btn--full" onClick={onPay}
          disabled={busy || (!useFree && !stripe)} style={{ marginTop: 16 }}>
          {busy ? 'Processing…'
            : useFree
              ? `Get ${totals.count} ${totals.count === 1 ? 'record' : 'records'} free →`
              : `Pay ${money(charged.total)} →`}
        </button>

        <div className="secure-note">
          <LockIcon /> Secured by Stripe · GDPR &amp; CCPA compliant
        </div>
      </div>
    </div>
  );
}

// ── Page wrapper ──────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedBusinesses, totals } = useMarketplace();
  const [useFree, setUseFree] = useState(false);

  const freeEligible = user && user.freeCredits >= totals.count && totals.count > 0;

  useEffect(() => { if (freeEligible) setUseFree(true); }, [freeEligible]);
  useEffect(() => { if (totals.count === 0) navigate('/', { replace: true }); }, [totals.count, navigate]);
  if (totals.count === 0) return null;

  return (
    <div className="checkout">
      <div className="checkout__inner">
        <button className="detail-back" onClick={() => navigate('/')}>
          <ArrowLeft /> Back to selection
        </button>
        <div className="checkout__header">
          <div>
            <h1>Review your order</h1>
            <p className="checkout__sub">
              {totals.count} supplier {totals.count === 1 ? 'record' : 'records'} · Excel &amp; PDF included
            </p>
          </div>
          {useFree && (
            <div className="checkout__free-badge">
              <StarIcon /> Free with credits
            </div>
          )}
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            selectedBusinesses={selectedBusinesses}
            totals={totals}
            useFree={useFree}
            setUseFree={setUseFree}
            freeEligible={freeEligible}
            user={user}
          />
        </Elements>
      </div>
    </div>
  );
}
