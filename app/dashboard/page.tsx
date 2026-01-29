'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import BotStatus from '@/components/dashboard/BotStatus';
import BotConnectionStatus from '@/components/dashboard/BotConnectionStatus';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        console.log('[v0] Checking dashboard auth');
        const response = await fetch('/api/auth/check', {
          credentials: 'include',
        });
        console.log('[v0] Auth check response:', response.status);
        
        if (response.ok) {
          console.log('[v0] User authorized, showing dashboard');
          setAuthorized(true);
        } else {
          console.log('[v0] Auth check failed, redirecting to login');
          router.push('/login');
        }
      } catch (err) {
        console.error('[v0] Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Redirecting to login...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your bot control panel</p>
        </div>

        <BotConnectionStatus />
        <StatsOverview />
        <BotStatus />
      </div>
    </DashboardLayout>
  );
}
