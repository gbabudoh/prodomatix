import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMarketplace } from '../store/MarketplaceContext.jsx';
import { api } from '../api/client.js';
import { money } from '../lib/format.js';

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const DashboardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

export default function SuccessPage() {
  const navigate = useNavigate();
  const { purchaseId } = useParams();
  const { state } = useMarketplace();
  const order = state.lastOrder;
  const [downloading, setDownloading] = useState(null);
  const [error, setError] = useState(null);

  const ref   = order?.reference || `#${purchaseId}`;
  const total = order?.totals?.total ?? 0;
  const count = order?.count ?? 0;

  const onDownload = async (format) => {
    setDownloading(format); setError(null);
    try {
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      await api.download(
        `/downloads?format=${format}&purchaseId=${purchaseId}`,
        `prodomatix_${ref.toLowerCase()}.${ext}`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="success">
      <div className="success__inner">

        {/* Animated check */}
        <div className="success__check-wrap">
          <div className="success__check">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>

        <h1>Your data is ready</h1>

        <div className="success__meta">
          <span className="success__ref mono">{ref}</span>
          {count > 0 && <span className="success__pill">{count} record{count !== 1 ? 's' : ''}</span>}
          {order?.isFree
            ? <span className="success__pill success__pill--green">Paid with free credits</span>
            : total > 0 && <span className="success__pill">{money(total)}</span>}
        </div>

        {/* Download cards */}
        <div className="success__files">
          <div className="success__file">
            <div className="success__file-icon success__file-icon--xls">XLS</div>
            <div className="success__file-info">
              <div className="success__file-name">Excel workbook</div>
              <div className="success__file-desc">Filterable spreadsheet · .xlsx</div>
            </div>
            <button className="success__dl-btn" disabled={downloading === 'excel'}
              onClick={() => onDownload('excel')}>
              {downloading === 'excel'
                ? <><span className="success__dl-spinner" /> Preparing…</>
                : <><DownloadIcon /> Download</>}
            </button>
          </div>

          <div className="success__file">
            <div className="success__file-icon success__file-icon--pdf">PDF</div>
            <div className="success__file-info">
              <div className="success__file-name">PDF document</div>
              <div className="success__file-desc">Print-ready record sheet · .pdf</div>
            </div>
            <button className="success__dl-btn" disabled={downloading === 'pdf'}
              onClick={() => onDownload('pdf')}>
              {downloading === 'pdf'
                ? <><span className="success__dl-spinner" /> Preparing…</>
                : <><DownloadIcon /> Download</>}
            </button>
          </div>
        </div>

        {error && <div className="auth__error" style={{ marginBottom: 16 }}>{error}</div>}

        <p className="success__note">
          These files are saved to <strong>My data</strong> — re-download them anytime, no expiry.
        </p>

        <div className="success__actions">
          <button className="btn btn--primary success__action-btn" onClick={() => navigate('/dashboard')}>
            <DashboardIcon /> Go to my data
          </button>
          <button className="link-muted" onClick={() => navigate('/')}>
            Back to marketplace
          </button>
        </div>
      </div>
    </div>
  );
}
