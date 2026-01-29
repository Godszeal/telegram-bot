'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          router.push('/dashboard');
        } else {
          setIsChecking(false);
        }
      } catch (err) {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isChecking) {
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/40 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-bold text-xl">TeleBot Control</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-accent transition">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
                <span className="text-sm font-medium text-accent">Manage Your Telegram Bot</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
                Control Your Bot Without Redeploying
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                Powerful admin dashboard for managing Telegram bots. Update configurations, manage users, track commands, and monitor statistics in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition text-center">
                  Start Free
                </Link>
                <a href="#features" className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent/5 transition text-center">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative h-96 lg:h-full">
              <Image
                src="/hero-dashboard.jpg"
                alt="Dashboard Preview"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to manage your Telegram bot effectively</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Feature 1 */}
            <div>
              <div className="mb-6 h-64 relative">
                <Image
                  src="/feature-config.jpg"
                  alt="Bot Configuration"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">Bot Configuration</h3>
              <p className="text-muted-foreground">
                Update your bot token, prefix, and settings instantly without redeploying. Changes take effect immediately.
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="mb-6 h-64 relative">
                <Image
                  src="/feature-users.jpg"
                  alt="User Management"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">User Management</h3>
              <p className="text-muted-foreground">
                View all bot users, ban or unban users with one click, and manage user permissions effectively.
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="mb-6 h-64 relative">
                <Image
                  src="/feature-stats.jpg"
                  alt="Statistics Dashboard"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-time Statistics</h3>
              <p className="text-muted-foreground">
                Monitor bot performance with comprehensive analytics, command usage, and user activity tracking.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Command Management</h3>
              <p className="text-muted-foreground">
                Enable/disable commands, track command statistics, and manage bot functionality from the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Updates</h3>
              <p className="text-muted-foreground">
                No need to redeploy your bot. Changes are applied instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure</h3>
              <p className="text-muted-foreground">
                Admin authentication with JWT tokens and encrypted password storage.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Detailed insights into bot performance and user engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/10 to-accent/5 border border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Control Your Bot?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start managing your Telegram bot without redeployment. It takes less than 5 minutes to set up.
          </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/60 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <span className="font-bold">TeleBot Control</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 TeleBot Control. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
