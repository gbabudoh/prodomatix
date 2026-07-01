import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';

const initials = (name = '') =>
  name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'U';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img src="/logo.png" alt="Prodomatix" className="brand-logo" />
        <span className="brand-tag">B2B Data</span>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}>
          Browse
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}>
          My data
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => 'nav__link' + (isActive ? ' is-active' : '')}>
            Admin
          </NavLink>
        )}
      </nav>

      <div className="header__account">
        {user && (
          <span className="credits-pill" title="Free download credits remaining">
            {user.freeCredits} free left
          </span>
        )}
        <span className="account-name">{user?.name}</span>
        <div className="avatar">{initials(user?.name)}</div>
        <button className="logout-btn" onClick={onLogout}>Log out</button>
      </div>
    </header>
  );
}
