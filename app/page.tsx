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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-accent flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold truncate">Bot Manager</h1>
          </div>
          <nav className="flex gap-2 sm:gap-4 flex-shrink-0">
            <button
              onClick={() => router.push('/login')}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base text-foreground hover:text-accent transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-accent text-white rounded-lg hover:bg-accent/90 transition"
            >
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
              Manage Your Telegram Bot<br className="hidden sm:block" />
              <span className="text-accent">Without Redeployment</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              Control your bot from a modern dashboard. Update configuration, manage users, monitor commands, and track statistics in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Get Started
              </button>
              <button
                onClick={() => router.push('/login')}
                className="px-6 sm:px-8 py-2.5 sm:py-3 border border-border rounded-lg hover:bg-secondary transition font-medium text-sm sm:text-base w-full sm:w-auto"
              >
                Login
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: '⚙️', title: 'Live Configuration', desc: 'Update bot settings instantly without redeployment' },
              { icon: '👥', title: 'User Management', desc: 'View users, track activity, ban/unban, monitor metrics' },
              { icon: '📊', title: 'Analytics & Stats', desc: 'Real-time insights into bot performance and usage' },
              { icon: '🔐', title: 'Secure Admin Panel', desc: 'JWT authentication with bcrypt password hashing' },
              { icon: '⚡', title: 'Command Control', desc: 'Enable, disable, monitor commands dynamically' },
              { icon: '🚀', title: 'Easy Integration', desc: 'Simple API endpoints for your existing bot' },
            ].map((feature, idx) => (
              <div key={idx} className="p-4 sm:p-6 rounded-lg border border-border/40 bg-card hover:border-accent/50 transition">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-xl sm:text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">How to Connect Your Bot</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { num: '1', title: 'Create Account', desc: 'Sign up for an admin account' },
              { num: '2', title: 'Add Bot Token', desc: 'Enter your Telegram bot token' },
              { num: '3', title: 'Configure', desc: 'Set up bot preferences and settings' },
              { num: '4', title: 'Start Managing', desc: 'Control everything from dashboard' },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 font-bold text-lg sm:text-xl">
                  {step.num}
                </div>
                <h4 className="font-semibold mb-2 text-base sm:text-lg">{step.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-16 sm:pb-20">
          <div className="py-8 sm:py-12 px-4 sm:px-8 rounded-2xl border border-accent/30 bg-accent/5 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto">
              Start managing your Telegram bot smarter and faster. No more redeployments needed.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium text-sm sm:text-base w-full sm:w-auto"
            >
              Create Free Account
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            © 2026 Telegram Bot Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
