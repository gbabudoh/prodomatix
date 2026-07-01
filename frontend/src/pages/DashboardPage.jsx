import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../store/AuthContext.jsx';
import { money, fmtNum, fmtDate } from '../lib/format.js';

const IconBox = ({ color, children }) => (
  <div className={`stat-card__icon stat-card__icon--${color}`}>{children}</div>
);

const IconRecords = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
  </svg>
);

const IconOrders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
    <path d="M8 7h8M8 11h8M8 15h5"/>
  </svg>
);

const IconCredits = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconDownload = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    api
      .get('/purchases')
      .then(setPurchases)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const download = async (purchase, format) => {
    const key = `${purchase.id}-${format}`;
    setDownloading(key);
    try {
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      await api.download(
        `/downloads?format=${format}&purchaseId=${purchase.id}`,
        `prodomatix_${purchase.reference.toLowerCase()}.${ext}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async (format) => {
    const key = `all-${format}`;
    setDownloading(key);
    try {
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      await api.download(`/downloads?format=${format}`, `prodomatix_all_data.${ext}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const totalRecords = purchases.reduce((s, p) => s + p.items.length, 0);
  const firstName = user?.name?.split(' ')[0] || 'there';
  const freeCredits = user?.freeCredits ?? 0;

  return (
    <div className="dash">
      <div className="dash__inner">

        <div className="dash__header">
          <div>
            <h1>Welcome back, {firstName}</h1>
            <p className="dash__sub">
              {totalRecords > 0
                ? `${totalRecords} business record${totalRecords !== 1 ? 's' : ''} in your library — download anytime as Excel or PDF.`
                : 'Your purchased business records will appear here.'}
            </p>
          </div>
          {totalRecords > 0 && (
            <div className="dash__bulk">
              <button className="btn-soft" disabled={downloading === 'all-excel'} onClick={() => downloadAll('excel')}>
                {downloading === 'all-excel' ? 'Preparing…' : 'Export all · Excel'}
              </button>
              <button className="btn-soft" disabled={downloading === 'all-pdf'} onClick={() => downloadAll('pdf')}>
                {downloading === 'all-pdf' ? 'Preparing…' : 'Export all · PDF'}
              </button>
            </div>
          )}
        </div>

        <div className="dash__stats">
          <div className="stat-card">
            <IconBox color="blue"><IconRecords /></IconBox>
            <div className="stat-card__num">{loading ? '—' : totalRecords}</div>
            <div className="stat-card__label">Records owned</div>
          </div>
          <div className="stat-card">
            <IconBox color="violet"><IconOrders /></IconBox>
            <div className="stat-card__num">{loading ? '—' : purchases.length}</div>
            <div className="stat-card__label">Orders placed</div>
          </div>
          <div className={`stat-card${freeCredits > 0 ? ' stat-card--credits' : ''}`}>
            <IconBox color="green"><IconCredits /></IconBox>
            <div className="stat-card__num">{freeCredits}</div>
            <div className="stat-card__label">Free credits left</div>
            {freeCredits > 0 && (
              <Link to="/" className="stat-card__action">Use now →</Link>
            )}
          </div>
        </div>

        {error && <div className="auth__error" style={{ marginBottom: 20 }}>{error}</div>}

        {loading && (
          <div className="orders">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="order-card" key={i} style={{ padding: '20px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div className="skel skel-cell skel-cell--md" />
                  <div className="skel skel-cell skel-cell--sm" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-line)', paddingTop: 14 }}>
                  <div className="skel skel-cell skel-cell--lg" />
                  <div className="skel skel-cell" style={{ maxWidth: 200 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && purchases.length === 0 && (
          <div className="dash-empty">
            <div className="dash-empty__visual">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div className="dash-empty__text">
              <h3>No data purchased yet</h3>
              <p>
                {freeCredits > 0
                  ? `You have ${freeCredits} free credit${freeCredits !== 1 ? 's' : ''} ready to use — no card required.`
                  : 'Browse the marketplace to find and download B2B supplier records.'}
              </p>
            </div>
            {freeCredits > 0 && (
              <div className="dash-empty__credits">
                <span className="dash-empty__credit-badge">{freeCredits} free</span>
                <span>credits available with no commitment</span>
              </div>
            )}
            <Link to="/" className="btn btn--primary">
              Browse the marketplace →
            </Link>
          </div>
        )}

        {!loading && purchases.length > 0 && (
          <div className="orders">
            {purchases.map((p) => (
              <div className="order-card" key={p.id}>
                <div className="order-card__head">
                  <div>
                    <span className="order-ref mono">{p.reference}</span>
                    {p.isFree && <span className="badge badge--green">Free</span>}
                  </div>
                  <div className="order-meta">
                    {fmtDate(p.createdAt)} · {p.items.length} record{p.items.length !== 1 ? 's' : ''} ·{' '}
                    {p.isFree ? 'Free' : money(Number(p.total))}
                  </div>
                </div>

                <div className="order-card__items">
                  {p.items.map((it) => (
                    <div className="order-item" key={it.id}>
                      <span className="order-item__name">{it.business.businessName}</span>
                      <span className="order-item__meta">
                        {it.business.industry} · {it.business.location} · {fmtNum(it.business.contacts)} contacts
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card__actions">
                  <button className="file__btn" disabled={downloading === `${p.id}-excel`} onClick={() => download(p, 'excel')}>
                    <IconDownload /> {downloading === `${p.id}-excel` ? 'Preparing…' : 'Excel'}
                  </button>
                  <button className="file__btn" disabled={downloading === `${p.id}-pdf`} onClick={() => download(p, 'pdf')}>
                    <IconDownload /> {downloading === `${p.id}-pdf` ? 'Preparing…' : 'PDF'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
