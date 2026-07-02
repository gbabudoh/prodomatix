import { Link } from 'react-router-dom';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { Icon } from '../../../components/AdminIcons.jsx';
import { money, moneyRound, fmtDate } from '../../../lib/format.js';

function StatCard({ icon, value, label, accent, hint }) {
  return (
    <div className="xstat">
      <div className={'xstat__icon xstat__icon--' + accent}>
        <Icon name={icon} size={20} />
      </div>
      <div className="xstat__body">
        <div className="xstat__value">{value}</div>
        <div className="xstat__label">{label}</div>
        {hint && <div className="xstat__hint">{hint}</div>}
      </div>
    </div>
  );
}

export default function Overview() {
  const { data: stats }  = useFetch('/admin/stats');
  const { data: orders } = useFetch('/admin/orders');
  const { data: users }  = useFetch('/admin/users');

  const recentOrders = (orders || []).slice(0, 6);
  const recentUsers  = (users  || []).slice(0, 6);

  return (
    <>
      <AdminHeader title="Overview" subtitle="Platform activity at a glance." />

      <div className="xstats">
        <StatCard icon="users"    accent="blue"   value={stats?.users      ?? '—'} label="Total users"     hint="Registered accounts" />
        <StatCard icon="building" accent="violet" value={stats?.businesses  ?? '—'} label="Suppliers"       hint="In catalogue" />
        <StatCard icon="receipt"  accent="amber"  value={stats?.purchases   ?? '—'} label="Orders"          hint="All time" />
        <StatCard icon="dollar"   accent="green"  value={stats ? moneyRound(stats.revenue) : '—'} label="Revenue" hint="Gross earnings" />
      </div>

      <div className="xgrid2">
        <div className="xpanel">
          <div className="xpanel__head">
            <div className="xpanel__head-left">
              <div className="xpanel__head-dot xpanel__head-dot--amber" />
              Recent orders
            </div>
            <Link to="/admin/orders" className="xpanel__link">View all →</Link>
          </div>
          <div className="xpanel__body">
            {recentOrders.length === 0 && <div className="xempty">No orders yet.</div>}
            {recentOrders.map((o) => (
              <div className="xrow" key={o.id}>
                <div>
                  <div className="xrow__main mono">{o.reference}</div>
                  <div className="xrow__sub">{o.userEmail}</div>
                </div>
                <div className="xrow__right">
                  <div className="xrow__main">{o.isFree ? <span className="xbadge xbadge--green">Free</span> : money(Number(o.total))}</div>
                  <div className="xrow__sub">{fmtDate(o.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xpanel">
          <div className="xpanel__head">
            <div className="xpanel__head-left">
              <div className="xpanel__head-dot xpanel__head-dot--blue" />
              New users
            </div>
            <Link to="/admin/users" className="xpanel__link">View all →</Link>
          </div>
          <div className="xpanel__body">
            {recentUsers.length === 0 && <div className="xempty">No users yet.</div>}
            {recentUsers.map((u) => (
              <div className="xrow" key={u.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="xrow__avatar">{(u.name?.[0] || '?').toUpperCase()}</div>
                  <div>
                    <div className="xrow__main">{u.name}</div>
                    <div className="xrow__sub">{u.email}</div>
                  </div>
                </div>
                <div className="xrow__right">
                  <div className="xrow__main">{u.orders} order{u.orders !== 1 ? 's' : ''}</div>
                  <div className="xrow__sub">{fmtDate(u.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
