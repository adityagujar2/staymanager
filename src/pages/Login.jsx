import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStayManager } from '../context/StayManagerContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('admin@staymanager.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useStayManager();
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter an email and password to continue.');
      return;
    }
    // Demo-only frontend access. Replace with a real server-side auth flow before production.
    login();
    navigate('/dashboard', { replace: true });
  }

  return <main className="login-screen"><div className="login-decoration decoration-one" /><div className="login-decoration decoration-two" />
    <section className="login-panel">
      <div className="login-brand"><span className="brand-mark">S</span><div><strong>StayManager</strong><small>PROPERTY OPERATIONS</small></div></div>
      <span className="eyebrow">WELCOME BACK</span>
      <h1>Your property.<br /><span>Under control.</span></h1>
      <p className="login-subtitle">Sign in to manage rooms, residents, rent and day-to-day operations from one workspace.</p>
      <form className="login-form" onSubmit={submit}>
        <div className="form-field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} /></div>
        <div className="form-field"><label htmlFor="login-password">Password</label><div className="password-wrap"><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></div>
        {error && <p className="form-error">{error}</p>}
        <button className="login-submit" type="submit">Continue to dashboard <span>→</span></button>
      </form>
      <div className="demo-note"><span>ⓘ</span><div><strong>Demo sign-in</strong><p>Any non-empty email and password will open this frontend demo. This is not production authentication.</p></div></div>
      <p className="login-footer">© 2026 StayManager · Built for simpler property operations</p>
    </section>
    <aside className="login-visual"><div className="visual-grid" /><div className="visual-content"><span className="visual-kicker">ONE CLEAR VIEW</span><h2>Less chasing.<br />More managing.</h2><p>A practical workspace for the details that keep a property running.</p><div className="visual-stat-row"><div><strong>Rooms</strong><span>Availability at a glance</span></div><div><strong>Payments</strong><span>Stay on top of rent</span></div></div><div className="floating-card float-top"><span className="float-icon">✓</span><div><strong>Everything in one place</strong><small>Rooms · Guests · Team</small></div></div><div className="floating-card float-bottom"><div className="mini-bars"><span /><span /><span /><span /><span /></div><div><strong>Daily operations</strong><small>Made a little simpler</small></div></div></div></aside>
  </main>;
}