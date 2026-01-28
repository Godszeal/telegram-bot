'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsOverview from '@/components/dashboard/StatsOverview';
import BotStatus from '@/components/dashboard/BotStatus';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setAuthorized(true);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
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

  if (!authorized) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your bot control panel</p>
        </div>

        <StatsOverview />
        <BotStatus />
      </div>
    </DashboardLayout>
  );
}
