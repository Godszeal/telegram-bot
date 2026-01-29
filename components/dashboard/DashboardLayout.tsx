'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Bot Setup', href: '/dashboard/bot-setup' },
  { name: 'Bot Integration', href: '/dashboard/bot-integration' },
  { name: 'Configuration', href: '/dashboard/config' },
  { name: 'Users', href: '/dashboard/users' },
  { name: 'Commands', href: '/dashboard/commands' },
  { name: 'Commands Manager', href: '/dashboard/commands-manager' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Settings', href: '/dashboard/settings' },
  { name: 'Guide', href: '/dashboard/guide' },
  { name: 'Integration Guide', href: '/dashboard/integration-docs' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform lg:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-accent">Bot Panel</h1>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-40">
          <h1 className="text-xl font-bold text-accent">Bot Panel</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground hover:text-accent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
