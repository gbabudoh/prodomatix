import { useState, useMemo } from 'react';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { Icon } from '../../../components/AdminIcons.jsx';
import { money, fmtNum, fmtDate } from '../../../lib/format.js';

export default function Users() {
  const { data, error } = useFetch('/admin/users');
  const [q, setQ] = useState('');

  const users = data || [];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.name, u.email, u.role].some((v) => (v || '').toLowerCase().includes(s))
    );
  }, [users, q]);

  return (
    <>
      <AdminHeader title="Users" subtitle={`${users.length} registered accounts`} />

      <div className="xtoolbar">
        <div className="xsearch">
          <Icon name="search" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name, email, role…" />
        </div>
        <span className="xtoolbar__count">{filtered.length} shown</span>
      </div>

      {error && <div className="auth__error">{error}</div>}

      <div className="xtable">
        <div className="xtable__head xtable__row--user">
          <div>Name</div><div>Email</div><div>Role</div><div>Credits</div><div>Orders</div><div className="right">Spent</div><div>Joined</div>
        </div>
        {filtered.map((u) => (
          <div className="xtable__row xtable__row--user" key={u.id}>
            <div className="xcell-strong">{u.name}</div>
            <div className="cell cell--mono" data-label="Email">{u.email}</div>
            <div className="cell" data-label="Role">{u.role === 'admin' ? <span className="badge badge--blue">admin</span> : 'user'}</div>
            <div className="cell cell--mono" data-label="Credits">{fmtNum(u.freeCredits)}</div>
            <div className="cell cell--mono" data-label="Orders">{fmtNum(u.orders)}</div>
            <div className="cell--price" data-label="Spent">{money(u.spent)}</div>
            <div className="cell" data-label="Joined">{fmtDate(u.createdAt)}</div>
          </div>
        ))}
        {filtered.length === 0 && <div className="xempty">No users match.</div>}
      </div>
    </>
  );
}
