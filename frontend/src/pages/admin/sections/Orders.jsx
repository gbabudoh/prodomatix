import { useState, useMemo } from 'react';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { Icon } from '../../../components/AdminIcons.jsx';
import { money, fmtNum, fmtDate } from '../../../lib/format.js';

export default function Orders() {
  const { data, error } = useFetch('/admin/orders');
  const [q, setQ] = useState('');

  const orders = data || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;
    return orders.filter((o) =>
      [o.reference, o.userEmail].some((v) => (v || '').toLowerCase().includes(s))
    );
  }, [orders, q]);

  return (
    <>
      <AdminHeader title="Orders" subtitle={`${orders.length} transactions`} />

      <div className="xtoolbar">
        <div className="xsearch">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by reference or user…" />
        </div>
        <span className="xtoolbar__count">{filtered.length} shown</span>
      </div>

      {error && <div className="auth__error">{error}</div>}

      <div className="xtable">
        <div className="xtable__head xtable__row--order">
          <div>Reference</div><div>User</div><div>Records</div><div>Type</div><div className="right">Total</div><div>Date</div>
        </div>
        {filtered.map((o) => (
          <div className="xtable__row xtable__row--order" key={o.id}>
            <div className="xcell-strong mono">{o.reference}</div>
            <div className="cell cell--mono">{o.userEmail}</div>
            <div className="cell cell--mono">{fmtNum(o.records)}</div>
            <div className="cell">{o.isFree ? <span className="badge badge--green">Free</span> : 'Paid'}</div>
            <div className="cell--price">{money(Number(o.total))}</div>
            <div className="cell">{fmtDate(o.createdAt)}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="xempty">No orders match.</div>}
      </div>
    </>
  );
}
