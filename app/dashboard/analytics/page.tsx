'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Analytics {
  total_users: number;
  active_users_today: number;
  total_commands_executed: number;
  most_used_command: string;
  avg_response_time: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    total_users: 0,
    active_users_today: 0,
    total_commands_executed: 0,
    most_used_command: 'N/A',
    avg_response_time: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('[v0] Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">View bot performance and usage statistics</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Total Users', value: analytics.total_users, icon: '👥' },
              { label: 'Active Today', value: analytics.active_users_today, icon: '🟢' },
              { label: 'Commands Executed', value: analytics.total_commands_executed, icon: '⚡' },
              { label: 'Most Used Command', value: analytics.most_used_command, icon: '📊' },
              { label: 'Avg Response Time', value: `${analytics.avg_response_time}ms`, icon: '⏱️' },
            ].map((stat, idx) => (
              <div key={idx} className="card-base flex items-center gap-4">
                <div className="text-3xl">{stat.icon}</div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card-base">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm">Bot started</span>
              <span className="text-xs text-muted-foreground">Today at 10:30 AM</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-sm">Configuration updated</span>
              <span className="text-xs text-muted-foreground">Today at 09:15 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">2 new users joined</span>
              <span className="text-xs text-muted-foreground">Yesterday at 08:45 PM</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
