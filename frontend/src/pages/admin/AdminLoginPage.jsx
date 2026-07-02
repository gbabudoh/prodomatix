import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp]       = useState('');
  const [step, setStep]       = useState('password'); // password | mfa
  const [error, setError]     = useState(null);
  const [busy, setBusy]       = useState(false);

  const attempt = async (e, p, t) => {
    setError(null);
    setBusy(true);
    try {
      const result = await login(e, p, t || undefined);

      // Server requires MFA — show TOTP step
      if (result?.mfaRequired) {
        setStep('mfa');
        setBusy(false);
        return;
      }

      if (result?.role !== 'admin') {
        await logout();
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

  const onSubmitPassword = (ev) => {
    ev.preventDefault();
    attempt(email, password, '');
  };

  const onSubmitTotp = (ev) => {
    ev.preventDefault();
    attempt(email, password, totp);
  };

  return (
    <div className="auth auth--admin">
      <div className="auth__card admin-card">
        <div className="admin-card__top">
          <img src="/logo.png" alt="Prodomatix" className="brand-logo" style={{ height: 26 }} />
          <span className="admin-tag">Admin Console</span>
        </div>

        {step === 'password' && (
          <>
            <div className="admin-card__lockmark">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="9" fill="#eef2fe"/>
                <rect x="10" y="15" width="12" height="9" rx="2" stroke="#2e54d4" strokeWidth="1.6"/>
                <path d="M12.5 15v-3a3.5 3.5 0 0 1 7 0v3" stroke="#2e54d4" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="16" cy="19.5" r="1.2" fill="#2e54d4"/>
              </svg>
            </div>
            <h1>Admin sign in</h1>
            <p className="auth__sub">Restricted area — administrator access only.</p>

            <form onSubmit={onSubmitPassword} className="auth__form">
              {error && <div className="auth__error">{error}</div>}
              <label className="field">
                <span>Email</span>
                <input className="input" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)} required autoFocus />
              </label>
              <label className="field">
                <span>Password</span>
                <input className="input" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required />
              </label>
              <button className="btn btn--primary btn--full" disabled={busy}>
                {busy ? 'Signing in…' : 'Continue'}
              </button>
            </form>

          </>
        )}

        {step === 'mfa' && (
          <>
            <h1>Two-factor authentication</h1>
            <p className="auth__sub">Enter the 6-digit code from your authenticator app.</p>

            <form onSubmit={onSubmitTotp} className="auth__form">
              {error && <div className="auth__error">{error}</div>}
              <label className="field">
                <span>Authenticator code</span>
                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                  required
                />
              </label>
              <button className="btn btn--primary btn--full" disabled={busy || totp.length !== 6}>
                {busy ? 'Verifying…' : 'Verify & sign in'}
              </button>
              <button type="button" className="btn btn--ghost btn--full"
                style={{ marginTop: 8 }}
                onClick={() => { setStep('password'); setTotp(''); setError(null); }}>
                ← Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
