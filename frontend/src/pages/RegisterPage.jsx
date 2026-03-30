import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 24 24" fill="#1DB954" width="48" height="48"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.65 14.42c-.2.32-.63.43-.95.23-2.6-1.59-5.87-1.95-9.73-1.07-.37.09-.74-.14-.83-.51-.09-.37.14-.74.51-.83 4.22-.96 7.84-.55 10.77 1.23.32.2.43.63.23.95zm1.24-2.76c-.25.4-.78.52-1.17.27-2.97-1.83-7.5-2.36-11.02-1.29-.46.14-.94-.12-1.08-.58-.13-.46.12-.94.58-1.08 4.01-1.22 8.98-.63 12.41 1.47.4.25.52.78.28 1.21zm.11-2.87C14.66 8.99 8.89 8.8 5.36 9.87c-.55.17-1.13-.14-1.3-.69-.17-.55.14-1.13.69-1.3 4.05-1.23 10.79-1 15.03 1.52.5.29.66.93.37 1.42-.29.49-.93.66-1.15.97z"/></svg>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Spotify Clone</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" placeholder="Your username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Account Type</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">Listener</option>
              <option value="artist">Artist</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}
