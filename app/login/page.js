"use client";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="brand-hero">
          <h1 className="logo-text">JARVIBIZ</h1>
          <p className="slogan">The Future of Shopping is Here.</p>
        </div>

        <div className="login-card glass">
          <h2>Sign In</h2>
          <p className="subtitle">Access your exclusive dashboard</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Jarvibiz'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, hsl(var(--secondary)), hsl(var(--background)));
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100; /* Cover everything including header */
        }
        .welcome-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3rem;
            width: 100%;
            max-width: 450px;
            padding: 2rem;
        }
        .brand-hero {
            text-align: center;
        }
        .logo-text {
            font-size: 4rem;
            font-weight: 900;
            letter-spacing: -0.05em;
            background: linear-gradient(to right, #fff, #bbb);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            line-height: 1;
        }
        .slogan {
            font-size: 1.25rem;
            color: hsl(var(--muted-foreground));
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }
        .login-card {
          width: 100%;
          padding: 2.5rem;
          border-radius: 1.5rem;
        }
        h2 {
           font-size: 1.5rem;
           margin-bottom: 0.5rem;
           text-align: center;
        }
        .subtitle {
            text-align: center;
            color: hsl(var(--muted-foreground));
            margin-bottom: 2rem;
            font-size: 0.9rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        label {
          font-size: 0.875rem;
          font-weight: 500;
          color: hsl(var(--muted-foreground));
        }
        input {
          background: hsl(var(--background) / 0.5);
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 1rem;
          color: hsl(var(--foreground));
          outline: none;
          transition: 0.2s;
        }
        input:focus {
          border-color: hsl(var(--primary));
          background: hsl(var(--background) / 0.8);
        }
        .error-msg {
          background: hsl(var(--destructive) / 0.1);
          color: hsl(var(--destructive));
          padding: 0.75rem;
          border-radius: var(--radius);
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          text-align: center;
        }
        .btn-block {
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          font-size: 1rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
