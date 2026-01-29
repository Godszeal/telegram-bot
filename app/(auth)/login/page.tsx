'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Handle redirect after login success
  useEffect(() => {
    if (shouldRedirect) {
      console.log('[v0] Performing redirect to dashboard');
      // Use window.location for more reliable redirect
      window.location.href = '/dashboard';
    }
  }, [shouldRedirect]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('[v0] Attempting login with:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      console.log('[v0] Response status:', response.status);
      const data = await response.json();
      console.log('[v0] Response data:', data);

      if (!response.ok) {
        setError(data.error || 'Login failed');
        console.log('[v0] Login failed:', data.error);
        setLoading(false);
        return;
      }

      console.log('[v0] Login successful, cookie should be set');
      setShouldRedirect(true);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred during login';
      setError(errorMsg);
      console.error('[v0] Login error:', err);
      setLoading(false);
    }
  }

  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md card-base text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Success!</h1>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent mx-auto mt-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md card-base">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bot Control Panel</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Sign in to manage your Telegram bot</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="input-base text-sm"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base text-sm"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-accent hover:underline font-medium">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
