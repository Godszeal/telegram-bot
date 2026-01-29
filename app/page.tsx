'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          router.push('/dashboard');
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <h1 className="text-2xl font-bold">Telegram Bot Manager</h1>
          </div>
          <nav className="flex gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 text-foreground hover:text-accent transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="py-20 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
              Manage Your Telegram Bot<br />
              <span className="text-accent">Without Redeployment</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Control your Telegram bot from a modern dashboard. Update configuration, manage users, enable/disable commands, and track statistics in real-time.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 border border-border rounded-lg hover:bg-secondary transition font-medium"
              >
                Login
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Live Configuration</h3>
              <p className="text-muted-foreground">
                Update bot settings instantly without restarting or redeploying your application.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">User Management</h3>
              <p className="text-muted-foreground">
                View all users, track activity, ban/unban users, and monitor engagement metrics.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Stats</h3>
              <p className="text-muted-foreground">
                Get real-time insights into bot performance, command usage, and user statistics.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Admin Panel</h3>
              <p className="text-muted-foreground">
                JWT-based authentication with bcrypt password hashing for maximum security.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Command Control</h3>
              <p className="text-muted-foreground">
                Enable, disable, and monitor commands dynamically. Track usage and performance.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
              <p className="text-muted-foreground">
                Simple API endpoints and database queries to integrate with your existing bot.
              </p>
            </div>
          </div>

          {/* Bot Connection Steps */}
          <div className="py-16 mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">How to Connect Your Bot</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
                <h4 className="font-semibold mb-2">Create Account</h4>
                <p className="text-muted-foreground text-sm">Sign up for an admin account to manage your bot</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
                <h4 className="font-semibold mb-2">Add Bot Token</h4>
                <p className="text-muted-foreground text-sm">Enter your Telegram bot token in the configuration page</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
                <h4 className="font-semibold mb-2">Integrate Database</h4>
                <p className="text-muted-foreground text-sm">Connect your bot to read config from the database</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
                <h4 className="font-semibold mb-2">Start Managing</h4>
                <p className="text-muted-foreground text-sm">Control everything from the dashboard instantly</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="py-16 px-8 rounded-2xl border border-accent/30 bg-accent/5 text-center mb-20">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Bot Management?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Start managing your Telegram bot smarter and faster. No more redeployments needed.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            © 2024 Telegram Bot Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
