import { useState } from 'react';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { fmtDate } from '../../../lib/format.js';

const ACTION_COLOUR = {
  'auth.login':        '#16a34a',
  'auth.register':     '#2563eb',
  'auth.login_failed': '#dc2626',
  'auth.login_locked': '#dc2626',
  'auth.logout':       '#64748b',
  'auth.google':       '#2563eb',
  'auth.verify_email': '#16a34a',
  'purchase.checkout': '#d97706',
  'download.file':     '#7c3aed',
  'mfa.setup':         '#0891b2',
};

function ActionBadge({ action }) {
  const colour = ACTION_COLOUR[action] || '#475569';
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'monospace',
      background: colour + '18',
      color: colour,
      border: `1px solid ${colour}30`,
      whiteSpace: 'nowrap',
    }}>
      {action}
    </span>
  );
}

export default function Audit() {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(`/admin/audit?page=${page}`);

  const logs  = data?.logs  ?? [];
  const pages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <>
      <AdminHeader
        title="Audit Log"
        subtitle={total ? `${total} event${total !== 1 ? 's' : ''} recorded.` : 'Security event trail.'}
      />

      <div className="xpanel" style={{ marginBottom: 0 }}>
        <div className="xpanel__head">
          <span>Security events</span>
          <span style={{ fontSize: 12, color: 'var(--sub)' }}>Page {page} of {pages}</span>
        </div>

        {loading && <div className="xempty" style={{ padding: 32 }}>Loading…</div>}

        {!loading && logs.length === 0 && (
          <div className="xempty" style={{ padding: 32 }}>No audit events yet.</div>
        )}

        {!loading && logs.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', textAlign: 'left' }}>
                  <th style={th}>Action</th>
                  <th style={th}>User</th>
                  <th style={th}>Resource</th>
                  <th style={th}>IP</th>
                  <th style={th}>When</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={td}><ActionBadge action={l.action} /></td>
                    <td style={td}>
                      {l.userEmail
                        ? <span title={l.userName ?? ''}>{l.userEmail}</span>
                        : <span style={{ color: 'var(--sub)' }}>—</span>}
                    </td>
                    <td style={td}>
                      {l.resource
                        ? <span className="mono" style={{ fontSize: 12 }}>{l.resource}{l.resourceId ? ` #${l.resourceId}` : ''}</span>
                        : <span style={{ color: 'var(--sub)' }}>—</span>}
                    </td>
                    <td style={td}>
                      <span className="mono" style={{ fontSize: 12 }}>{l.ip ?? '—'}</span>
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap', color: 'var(--sub)' }}>
                      {fmtDate(l.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, padding: '12px 16px', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button className="btn-soft btn-soft--sm" disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <span style={{ fontSize: 12, color: 'var(--sub)' }}>{page} / {pages}</span>
            <button className="btn-soft btn-soft--sm" disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const th = {
  padding: '10px 14px',
  fontWeight: 600,
  fontSize: 12,
  color: 'var(--sub)',
  borderBottom: '1px solid var(--border)',
};

const td = {
  padding: '10px 14px',
  verticalAlign: 'middle',
};
