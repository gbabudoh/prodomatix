import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';
import GoogleSignIn, { googleEnabled } from '../components/GoogleSignIn.jsx';
import SiteFooter from '../components/SiteFooter.jsx';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setBusy(true);
    try {
      await register(form.email, form.password, form.name);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  const onGoogle = async (credential) => {
    setError(null); setBusy(true);
    try {
      await loginWithGoogle(credential);
      navigate('/', { replace: true });
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
          <h1>Create your account</h1>
          <p className="auth__sub">Get 3 free downloads to test the data — no card required.</p>

          <form onSubmit={onSubmit} className="auth__form">
            {error && <div className="auth__error">{error}</div>}
            <label className="field">
              <span>Full name</span>
              <input className="input" value={form.name} onChange={set('name')} required />
            </label>
            <label className="field">
              <span>Email</span>
              <input className="input" type="email" value={form.email} onChange={set('email')} required />
            </label>
            <label className="field">
              <span>Password</span>
              <input className="input" type="password" value={form.password} onChange={set('password')} placeholder="At least 8 characters" required />
            </label>
            <button className="btn btn--primary btn--full" disabled={busy}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {googleEnabled && <div className="auth__divider"><span>or</span></div>}
          <GoogleSignIn onCredential={onGoogle} onError={setError} text="signup_with" />

          <p className="auth__switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
