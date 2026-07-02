import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';
import GoogleSignIn, { googleEnabled } from '../components/GoogleSignIn.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await login(email, password);
      navigate(location.state?.from || '/browse', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  const onGoogle = async (credential) => {
    setError(null); setBusy(true);
    try {
      await loginWithGoogle(credential);
      navigate(location.state?.from || '/browse', { replace: true });
    } catch (err) {
      setError(err.message); setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__topbar">
        <Link to="/" className="auth-back">← Back to home</Link>
      </div>
      <div className="auth">
        <div className="auth__card">
          <div className="auth__brand">
            <img src="/logo.png" alt="Prodomatix" className="brand-logo" />
          </div>
          <h1>Welcome back</h1>
          <p className="auth__sub">Log in to access and download B2B business data.</p>

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
              {busy ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {googleEnabled && <div className="auth__divider"><span>or</span></div>}
          <GoogleSignIn onCredential={onGoogle} onError={setError} text="signin_with" />

          <p className="auth__switch">
            New to Prodomatix? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
