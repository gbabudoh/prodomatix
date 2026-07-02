import { useState } from 'react';
import { api } from '../../../api/client.js';
import { AdminHeader } from '../AdminLayout.jsx';

export default function Security() {
  const [step, setStep]       = useState('idle'); // idle | qr | confirm | disabling
  const [qrCode, setQrCode]   = useState(null);
  const [secret, setSecret]   = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [password, setPassword] = useState('');
  const [mfaOn, setMfaOn]     = useState(null); // null = unknown; updated after action
  const [busy, setBusy]       = useState(false);
  const [msg, setMsg]         = useState(null);
  const [err, setErr]         = useState(null);

  const clearFeedback = () => { setMsg(null); setErr(null); };

  const startSetup = async () => {
    clearFeedback();
    setBusy(true);
    try {
      const res = await api.post('/auth/mfa/setup', {});
      setQrCode(res.qrCode);
      setSecret(res.secret);
      setStep('qr');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const confirmSetup = async (ev) => {
    ev.preventDefault();
    clearFeedback();
    setBusy(true);
    try {
      await api.post('/auth/mfa/confirm', { totp: totpCode });
      setMfaOn(true);
      setStep('idle');
      setMsg('MFA is now enabled on your account.');
      setTotpCode('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const disableMfa = async (ev) => {
    ev.preventDefault();
    clearFeedback();
    setBusy(true);
    try {
      await api.post('/auth/mfa/disable', { password });
      setMfaOn(false);
      setStep('idle');
      setMsg('MFA has been disabled.');
      setPassword('');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AdminHeader title="Security" subtitle="Manage two-factor authentication for your admin account." />

      <div style={{ maxWidth: 540, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Status / feedback */}
        {msg && (
          <div className="auth__success" style={{ padding: '12px 16px', borderRadius: 8, background: '#dcfce7', color: '#166534', fontSize: 14 }}>
            ✅ {msg}
          </div>
        )}
        {err && (
          <div className="auth__error" style={{ borderRadius: 8 }}>
            {err}
          </div>
        )}

        {/* MFA card */}
        <div className="xpanel">
          <div className="xpanel__head">
            <span>Two-Factor Authentication (TOTP)</span>
            {mfaOn === true && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>● ENABLED</span>}
            {mfaOn === false && <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>● DISABLED</span>}
          </div>
          <div className="xpanel__body" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {step === 'idle' && (
              <>
                <p style={{ fontSize: 14, color: 'var(--sub)', margin: 0 }}>
                  Protect your admin account with an authenticator app (Google Authenticator, Authy, 1Password, etc.).
                  Each login will require a time-based one-time code in addition to your password.
                </p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn btn--primary" onClick={startSetup} disabled={busy}>
                    {busy ? 'Loading…' : 'Set up MFA'}
                  </button>
                  {mfaOn !== false && (
                    <button className="btn btn--ghost" onClick={() => { clearFeedback(); setStep('disabling'); }}>
                      Disable MFA
                    </button>
                  )}
                </div>
              </>
            )}

            {step === 'qr' && (
              <>
                <p style={{ fontSize: 14, color: 'var(--sub)', margin: 0 }}>
                  Scan this QR code with your authenticator app, then enter the 6-digit code below to confirm setup.
                </p>
                {qrCode && (
                  <div style={{ textAlign: 'center' }}>
                    <img src={qrCode} alt="MFA QR code" style={{ width: 200, height: 200, border: '1px solid var(--border)', borderRadius: 8 }} />
                  </div>
                )}
                {secret && (
                  <div style={{ background: 'var(--bg2)', borderRadius: 6, padding: '8px 12px', fontSize: 13, wordBreak: 'break-all' }}>
                    <span style={{ color: 'var(--sub)' }}>Manual key: </span>
                    <span className="mono">{secret}</span>
                  </div>
                )}
                <form onSubmit={confirmSetup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label className="field" style={{ margin: 0 }}>
                    <span>Authenticator code</span>
                    <input
                      className="input"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder="000000"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      autoFocus
                      required
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn--primary" disabled={busy || totpCode.length !== 6}>
                      {busy ? 'Confirming…' : 'Confirm & enable'}
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={() => { setStep('idle'); setTotpCode(''); clearFeedback(); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}

            {step === 'disabling' && (
              <>
                <p style={{ fontSize: 14, color: 'var(--sub)', margin: 0 }}>
                  Enter your account password to confirm disabling MFA.
                </p>
                <form onSubmit={disableMfa} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label className="field" style={{ margin: 0 }}>
                    <span>Current password</span>
                    <input
                      className="input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button className="btn btn--danger" disabled={busy || !password}>
                      {busy ? 'Disabling…' : 'Disable MFA'}
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={() => { setStep('idle'); setPassword(''); clearFeedback(); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
