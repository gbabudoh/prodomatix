import { useState } from 'react';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { money, fmtDate } from '../../../lib/format.js';

// ── Shared ────────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="ins-tabs">
      {tabs.map(t => (
        <button key={t.id} className={'ins-tab' + (active === t.id ? ' is-active' : '')} onClick={() => onChange(t.id)}>
          {t.label}
          {t.count != null && <span className="ins-tab__badge">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

function ScoreBar({ value }) {
  const colour = value >= 80 ? '#16a34a' : value >= 55 ? '#d97706' : '#dc2626';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 90 }}>
      <div style={{ flex: 1, height: 6, background: '#e9ecf0', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: colour, borderRadius: 4, transition: 'width .4s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: colour, minWidth: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

const SEG_COLOUR = { Champions: '#16a34a', Loyal: '#2e54d4', 'At Risk': '#d97706', Hibernating: '#9333ea', Lost: '#dc2626' };

function SegBadge({ segment }) {
  const c = SEG_COLOUR[segment] || '#64748b';
  return (
    <span style={{ display: 'inline-block', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 700, background: c + '18', color: c, border: `1px solid ${c}30` }}>
      {segment}
    </span>
  );
}

// ── 1. Data Quality ───────────────────────────────────────────────────────────

function QualityTab() {
  const { data, loading } = useFetch('/admin/quality');
  const rows = data || [];
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;

  return (
    <div>
      <div className="ins-summary">
        <div className="ins-kpi"><span className="ins-kpi__val">{avg}%</span><span className="ins-kpi__label">Avg completeness</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val" style={{ color: '#dc2626' }}>{rows.filter(r => r.score < 55).length}</span><span className="ins-kpi__label">Low quality records</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val" style={{ color: '#16a34a' }}>{rows.filter(r => r.score >= 80).length}</span><span className="ins-kpi__label">High quality records</span></div>
      </div>
      <div className="xpanel">
        <div className="xpanel__head"><span>Supplier quality scores</span><span style={{ fontSize: 12, color: 'var(--sub)' }}>Lowest first — fix these</span></div>
        {loading && <div className="xempty">Computing…</div>}
        <div style={{ overflowX: 'auto' }}>
          <table className="ins-table">
            <thead><tr><th>Supplier</th><th>Industry</th><th>Country</th><th style={{ width: 200 }}>Completeness</th></tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="ins-td--strong">{r.businessName}</td>
                  <td data-label="Industry">{r.industry}</td>
                  <td data-label="Country">{r.country}</td>
                  <td data-label="Completeness"><ScoreBar value={r.score} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 2. Duplicates ─────────────────────────────────────────────────────────────

function DuplicatesTab() {
  const { data, loading } = useFetch('/admin/duplicates');
  const pairs = data || [];

  return (
    <div>
      <div className="ins-summary">
        <div className="ins-kpi"><span className="ins-kpi__val" style={{ color: pairs.length ? '#dc2626' : '#16a34a' }}>{pairs.length}</span><span className="ins-kpi__label">Potential duplicates</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val">{pairs.filter(p => p.emailMatch).length}</span><span className="ins-kpi__label">Email matches</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val">{pairs.filter(p => p.confidence >= 0.7).length}</span><span className="ins-kpi__label">High confidence</span></div>
      </div>
      <div className="xpanel">
        <div className="xpanel__head"><span>Duplicate candidates</span><span style={{ fontSize: 12, color: 'var(--sub)' }}>Jaccard name similarity ≥ 40%</span></div>
        {loading && <div className="xempty">Scanning…</div>}
        {!loading && pairs.length === 0 && <div className="xempty">No duplicates detected. Catalogue looks clean.</div>}
        <div style={{ overflowX: 'auto' }}>
          <table className="ins-table">
            <thead><tr><th>Record A</th><th>Record B</th><th>Name similarity</th><th>Email match</th><th>Confidence</th></tr></thead>
            <tbody>
              {pairs.map((p, i) => (
                <tr key={i}>
                  <td data-label="Record A"><div className="ins-td--strong">{p.a.businessName}</div><div className="ins-td--sub">{p.a.country}</div></td>
                  <td data-label="Record B"><div className="ins-td--strong">{p.b.businessName}</div><div className="ins-td--sub">{p.b.country}</div></td>
                  <td data-label="Name similarity"><span className="mono">{(p.nameScore * 100).toFixed(0)}%</span></td>
                  <td data-label="Email match">{p.emailMatch ? <span style={{ color: '#dc2626', fontWeight: 700 }}>Yes</span> : '—'}</td>
                  <td data-label="Confidence">
                    <span style={{ fontWeight: 700, color: p.confidence >= 0.7 ? '#dc2626' : '#d97706' }}>
                      {(p.confidence * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 3. RFM ────────────────────────────────────────────────────────────────────

function RFMTab() {
  const { data, loading } = useFetch('/admin/rfm');
  const users = data || [];
  const segments = ['Champions', 'Loyal', 'At Risk', 'Hibernating', 'Lost'];
  const counts = Object.fromEntries(segments.map(s => [s, users.filter(u => u.segment === s).length]));

  return (
    <div>
      <div className="ins-summary">
        {segments.map(s => (
          <div className="ins-kpi" key={s}>
            <span className="ins-kpi__val" style={{ color: SEG_COLOUR[s] }}>{counts[s]}</span>
            <span className="ins-kpi__label">{s}</span>
          </div>
        ))}
      </div>
      <div className="xpanel">
        <div className="xpanel__head"><span>User RFM scores</span><span style={{ fontSize: 12, color: 'var(--sub)' }}>Recency · Frequency · Monetary (1–5 each)</span></div>
        {loading && <div className="xempty">Scoring…</div>}
        <div style={{ overflowX: 'auto' }}>
          <table className="ins-table">
            <thead><tr><th>User</th><th>Segment</th><th>R</th><th>F</th><th>M</th><th>RFM</th><th>Last purchase</th><th>Orders</th><th className="ins-td--right">Spent</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId}>
                  <td><div className="ins-td--strong">{u.name}</div><div className="ins-td--sub">{u.email}</div></td>
                  <td data-label="Segment"><SegBadge segment={u.segment} /></td>
                  <td className="mono" data-label="R">{u.r}</td>
                  <td className="mono" data-label="F">{u.f}</td>
                  <td className="mono" data-label="M">{u.m}</td>
                  <td data-label="RFM"><span className="mono" style={{ fontWeight: 700 }}>{u.rfm}</span></td>
                  <td style={{ color: 'var(--sub)', fontSize: 12 }} data-label="Last purchase">{u.lastPurchase ? fmtDate(u.lastPurchase) : '—'}</td>
                  <td className="mono" data-label="Orders">{u.purchaseCount}</td>
                  <td className="ins-td--right" data-label="Spent">{money(u.totalSpend)}</td>
                </tr>
              ))}
              {!loading && users.length === 0 && <tr><td colSpan={9}><div className="xempty">No user purchase data yet.</div></td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── 4. Anomalies ──────────────────────────────────────────────────────────────

function AnomaliesTab() {
  const { data, loading } = useFetch('/admin/anomalies');
  const users = data || [];
  const flagged = users.filter(u => u.flagged);

  return (
    <div>
      <div className="ins-summary">
        <div className="ins-kpi"><span className="ins-kpi__val" style={{ color: flagged.length ? '#dc2626' : '#16a34a' }}>{flagged.length}</span><span className="ins-kpi__label">Flagged users</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val">{users.length}</span><span className="ins-kpi__label">Total analysed</span></div>
        <div className="ins-kpi"><span className="ins-kpi__val">{users.filter(u => u.purchaseZ > 3).length}</span><span className="ins-kpi__label">Extreme outliers (3σ+)</span></div>
      </div>
      <div className="xpanel">
        <div className="xpanel__head"><span>Anomaly detection</span><span style={{ fontSize: 12, color: 'var(--sub)' }}>Z-score ≥ 2σ above mean rate</span></div>
        {loading && <div className="xempty">Analysing…</div>}
        {!loading && users.length === 0 && <div className="xempty">No user activity to analyse yet.</div>}
        <div style={{ overflowX: 'auto' }}>
          <table className="ins-table">
            <thead><tr><th>User</th><th>Status</th><th>Purchases/day</th><th>Purchase Z</th><th>Downloads/day</th><th>Download Z</th><th>Flags</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId} style={{ background: u.flagged ? '#fff5f5' : undefined }}>
                  <td><div className="ins-td--strong">{u.name}</div><div className="ins-td--sub">{u.email}</div></td>
                  <td data-label="Status">{u.flagged
                    ? <span style={{ color: '#dc2626', fontWeight: 700, fontSize: 12 }}>⚠ Flagged</span>
                    : <span style={{ color: '#16a34a', fontSize: 12 }}>Normal</span>}
                  </td>
                  <td className="mono" data-label="Purchases/day">{u.purchasesPerDay}</td>
                  <td className="mono" style={{ color: u.purchaseZ > 2 ? '#dc2626' : 'inherit' }} data-label="Purchase Z">{u.purchaseZ}σ</td>
                  <td className="mono" data-label="Downloads/day">{u.downloadsPerDay}</td>
                  <td className="mono" style={{ color: u.downloadZ > 2 ? '#dc2626' : 'inherit' }} data-label="Download Z">{u.downloadZ}σ</td>
                  <td style={{ fontSize: 12, color: '#dc2626' }} data-label="Flags">{u.reasons?.join('; ') || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function Insights() {
  const [tab, setTab] = useState('quality');

  const { data: dupData }  = useFetch('/admin/duplicates');
  const { data: anomData } = useFetch('/admin/anomalies');
  const dupCount  = dupData?.length ?? null;
  const anomCount = anomData ? anomData.filter(u => u.flagged).length : null;

  const tabs = [
    { id: 'quality',    label: 'Data Quality' },
    { id: 'duplicates', label: 'Duplicates',   count: dupCount },
    { id: 'rfm',        label: 'RFM / Churn' },
    { id: 'anomalies',  label: 'Anomalies',    count: anomCount || undefined },
  ];

  return (
    <>
      <AdminHeader title="Insights" subtitle="Algorithm-powered intelligence across your platform." />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <div style={{ marginTop: 20 }}>
        {tab === 'quality'    && <QualityTab />}
        {tab === 'duplicates' && <DuplicatesTab />}
        {tab === 'rfm'        && <RFMTab />}
        {tab === 'anomalies'  && <AnomaliesTab />}
      </div>
    </>
  );
}
