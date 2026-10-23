import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStayManager } from '../context/StayManagerContext.jsx';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@staymanager.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, apiEnabled } = useStayManager();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isSetup) await register(name, email, password);
      else await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="login-screen"><div className="login-decoration decoration-one" /><div className="login-decoration decoration-two" />
    <section className="login-panel">
      <div className="login-brand"><span className="brand-mark">S</span><div><strong>StayManager</strong><small>PROPERTY OPERATIONS</small></div></div>
      <span className="eyebrow">{isSetup ? 'INITIAL ADMIN SETUP' : 'WELCOME BACK'}</span>
      <h1>{isSetup ? <>Set up your<br /><span>workspace.</span></> : <>Your property.<br /><span>Under control.</span></>}</h1>
      <p className="login-subtitle">{isSetup ? 'Create the first administrator account for your StayManager API. Use a strong password you have not used elsewhere.' : 'Sign in to manage rooms, residents, rent and day-to-day operations from one workspace.'}</p>
      <form className="login-form" onSubmit={submit}>
        {isSetup && <div className="form-field"><label htmlFor="login-name">Administrator name</label><input id="login-name" autoComplete="name" required value={name} onChange={event => setName(event.target.value)} placeholder="Your full name" /></div>}
        <div className="form-field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} /></div>
        <div className="form-field"><label htmlFor="login-password">Password {isSetup && <span>(at least 10 characters)</span>}</label><div className="password-wrap"><input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete={isSetup ? 'new-password' : 'current-password'} minLength={isSetup ? 10 : 1} required value={password} onChange={event => setPassword(event.target.value)} /><button type="button" onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button></div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="login-submit" type="submit" disabled={submitting}>{submitting ? 'Please wait…' : isSetup ? 'Create administrator account' : 'Continue to dashboard'} <span>→</span></button>
      </form>
      {apiEnabled && <button className="setup-toggle" type="button" onClick={() => { setIsSetup(value => !value); setError(''); }}>{isSetup ? 'Already set up? Sign in' : 'First time here? Set up administrator'}</button>}
      <div className="demo-note"><span>ⓘ</span><div><strong>{apiEnabled ? 'Connected API mode' : 'Demo mode'}</strong><p>{apiEnabled ? 'Sign in uses the configured backend. Your records are read from and saved to MongoDB through the API.' : 'Any non-empty email and password opens this frontend demo. Records stay in this browser until you clear its local storage.'}</p></div></div>
      <p className="login-footer">© 2026 StayManager · Built for simpler property operations</p>
    </section>
    <aside className="login-visual"><div className="visual-grid" /><div className="visual-content"><span className="visual-kicker">ONE CLEAR VIEW</span><h2>Less chasing.<br />More managing.</h2><p>A practical workspace for the details that keep a property running.</p><div className="visual-stat-row"><div><strong>Rooms</strong><span>Availability at a glance</span></div><div><strong>Payments</strong><span>Stay on top of rent</span></div></div><div className="floating-card float-top"><span className="float-icon">✓</span><div><strong>Everything in one place</strong><small>Rooms · Guests · Team</small></div></div><div className="floating-card float-bottom"><div className="mini-bars"><span /><span /><span /><span /><span /></div><div><strong>Daily operations</strong><small>Made a little simpler</small></div></div></div></aside>
  </main>;
}