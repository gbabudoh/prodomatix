import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';

// Dedicated, separate admin sign-in at /admin/login.
// Non-admin accounts are rejected here even if their credentials are valid.
export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const attempt = async (e, p) => {
    setError(null);
    setBusy(true);
    try {
      const user = await login(e, p);
      if (user.role !== 'admin') {
        logout(); // don't keep a session created from the admin gate
        setError('This account does not have admin access.');
        setBusy(false);
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    attempt(email, password);
  };

  return (
    <div className="auth auth--admin">
      <div className="auth__card">
        <div className="auth__brand">
          <img src="/logo.png" alt="Prodomatix" className="brand-logo brand-logo--admin" />
          <span className="admin-tag">Admin</span>
        </div>
        <h1>Admin sign in</h1>
        <p className="auth__sub">Restricted area — administrator access only.</p>

        <form onSubmit={onSubmit} className="auth__form">
          {error && <div className="auth__error">{error}</div>}
          <label className="field">
            <span>Email</span>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn btn--primary btn--full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in to admin'}
          </button>
        </form>

        <div className="demo-box">
          <div className="demo-box__title">Demo admin</div>
          <div className="demo-box__row">
            <div>
              <div className="demo-box__role">Administrator</div>
              <div className="demo-box__cred mono">admin@prodomatix.com · admin12345</div>
            </div>
            <button type="button" className="btn-soft btn-soft--sm" disabled={busy}
              onClick={() => attempt('admin@prodomatix.com', 'admin12345')}>
              Use
            </button>
          </div>
        </div>

        <p className="auth__switch">
          Not an administrator? <Link to="/login">User login</Link>
        </p>
      </div>
    </div>
  );
}
