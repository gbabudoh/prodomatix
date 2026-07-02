import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { Icon } from '../../components/AdminIcons.jsx';

const NAV_MAIN = [
  { to: '/admin', end: true, icon: 'grid', label: 'Overview' },
  { to: '/admin/businesses', icon: 'building', label: 'Suppliers' },
  { to: '/admin/users', icon: 'users', label: 'Users' },
  { to: '/admin/orders', icon: 'receipt', label: 'Orders' },
];

const NAV_SYSTEM = [
  { to: '/admin/insights', icon: 'insights', label: 'Insights' },
  { to: '/admin/audit',    icon: 'audit',    label: 'Audit Log' },
  { to: '/admin/security', icon: 'lock',     label: 'Security' },
];

const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'A';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="adminx">
      <aside className="adminx__side">
        <div className="adminx__brand">
          <img src="/logo.png" alt="Prodomatix" className="brand-logo" style={{ height: 24 }} />
          <span className="adminx__brandtag">Admin Console</span>
        </div>

        <nav className="adminx__nav">
          <div className="adminx__nav-label">Main</div>
          {NAV_MAIN.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => 'adminx__navitem' + (isActive ? ' is-active' : '')}>
              <Icon name={n.icon} size={16} />
              <span>{n.label}</span>
            </NavLink>
          ))}

          <div className="adminx__nav-label" style={{ marginTop: 12 }}>System</div>
          {NAV_SYSTEM.map((n) => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => 'adminx__navitem' + (isActive ? ' is-active' : '')}>
              <Icon name={n.icon} size={16} />
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="adminx__sidefoot">
          <div className="adminx__user">
            <div className="avatar adminx__avatar">{initials(user?.name)}</div>
            <div className="adminx__userinfo">
              <div className="adminx__username">{user?.name}</div>
              <div className="adminx__useremail">{user?.email}</div>
            </div>
          </div>
          <div className="adminx__footbtns">
            <button className="adminx__footbtn adminx__footbtn--logout" onClick={onLogout}>
              <Icon name="logout" size={15} /><span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="adminx__main">
        <Outlet />
      </main>
    </div>
  );
}

// Shared section header (title + optional actions).
export function AdminHeader({ title, subtitle, children }) {
  return (
    <header className="adminx__topbar">
      <div>
        <h1 className="adminx__title">{title}</h1>
        {subtitle && <p className="adminx__subtitle">{subtitle}</p>}
      </div>
      {children && <div className="adminx__actions">{children}</div>}
    </header>
  );
}
