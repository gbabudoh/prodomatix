import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="auth-page">
      <div className="auth">
        <div className="auth__card" style={{ textAlign: 'center' }}>
          <img src="/logo.png" alt="Prodomatix" className="brand-logo" style={{ margin: '0 auto 24px' }} />
          {status === 'verifying' && (
            <>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>Verifying your email…</h1>
              <p style={{ color: 'var(--sub)', fontSize: 14 }}>Please wait a moment.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>Email verified!</h1>
              <p style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 24 }}>
                Your account is fully verified. You can now use all features.
              </p>
              <Link to="/" className="btn btn--primary" style={{ display: 'inline-flex' }}>
                Go to marketplace →
              </Link>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
              <h1 style={{ fontSize: 22, marginBottom: 8 }}>Link invalid or expired</h1>
              <p style={{ color: 'var(--sub)', fontSize: 14, marginBottom: 24 }}>
                This verification link has expired or already been used. Log in and we'll resend a fresh one.
              </p>
              <Link to="/login" className="btn btn--primary" style={{ display: 'inline-flex' }}>
                Go to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
