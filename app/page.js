'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      // Hardcoded credentials
      if (username === 'analyst' && password === 'demo123') {
        // Store in localStorage
        localStorage.setItem(
          'user',
          JSON.stringify({
            username: 'analyst',
            name: 'John Doe',
            role: 'SOC Analyst Trainee',
            loggedIn: true,
            loginTime: new Date().toISOString(),
          })
        );

        // Initialize progress if not exists
        const existingProgress = localStorage.getItem('progress');
        if (!existingProgress) {
          localStorage.setItem(
            'progress',
            JSON.stringify({
              phishing: { status: 'not_started' },
              ransomware: { status: 'not_started' },
              exfiltration: { status: 'not_started' },
            })
          );
        }

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Use analyst / demo123');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🛡️ SecureOps</h1>
        <p>SOC Analyst Training Platform</p>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="demo-creds">
          <strong>Demo Credentials:</strong>
          <br />
          Username: <strong>analyst</strong>
          <br />
          Password: <strong>demo123</strong>
        </p>
      </div>
    </div>
  );
}
