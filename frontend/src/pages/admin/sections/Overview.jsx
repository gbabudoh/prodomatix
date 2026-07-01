import { Link } from 'react-router-dom';
import { useFetch } from '../useFetch.js';
import { AdminHeader } from '../AdminLayout.jsx';
import { Icon } from '../../../components/AdminIcons.jsx';
import { money, moneyRound, fmtDate } from '../../../lib/format.js';

function StatCard({ icon, value, label, accent }) {
  return (
    <div className="xstat">
      <div className={'xstat__icon xstat__icon--' + accent}><Icon name={icon} /></div>
      <div>
        <div className="xstat__value">{value}</div>
        <div className="xstat__label">{label}</div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { data: stats } = useFetch('/admin/stats');
  const { data: orders } = useFetch('/admin/orders');
  const { data: users } = useFetch('/admin/users');

  const recentOrders = (orders || []).slice(0, 6);
  const recentUsers = (users || []).slice(0, 6);

  return (
    <>
      <AdminHeader title="Overview" subtitle="Platform activity at a glance." />

      <div className="xstats">
        <StatCard icon="users" accent="blue" value={stats?.users ?? '—'} label="Users" />
        <StatCard icon="building" accent="violet" value={stats?.businesses ?? '—'} label="Suppliers" />
        <StatCard icon="receipt" accent="amber" value={stats?.purchases ?? '—'} label="Orders" />
        <StatCard icon="dollar" accent="green" value={stats ? moneyRound(stats.revenue) : '—'} label="Revenue" />
      </div>

      <div className="xgrid2">
        <div className="xpanel">
          <div className="xpanel__head">
            <span>Recent orders</span>
            <Link to="/admin/orders" className="xpanel__link">View all</Link>
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
                  <div className="xrow__main">{o.isFree ? 'Free' : money(Number(o.total))}</div>
                  <div className="xrow__sub">{fmtDate(o.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xpanel">
          <div className="xpanel__head">
            <span>New users</span>
            <Link to="/admin/users" className="xpanel__link">View all</Link>
          </div>
          <div className="xpanel__body">
            {recentUsers.length === 0 && <div className="xempty">No users yet.</div>}
            {recentUsers.map((u) => (
              <div className="xrow" key={u.id}>
                <div>
                  <div className="xrow__main">{u.name}</div>
                  <div className="xrow__sub">{u.email}</div>
                </div>
                <div className="xrow__right">
                  <div className="xrow__main">{u.orders} orders</div>
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
