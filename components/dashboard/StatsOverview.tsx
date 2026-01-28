'use client';

import { useEffect, useState } from 'react';

interface StatsData {
  users: { total: number; banned: number; active: number };
  commands: { total: number; enabled: number; disabled: number };
  topCommands: Array<{ name: string; usage_count: number }>;
  activity: Array<{ date: string; count: number }>;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>;
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Total Users', value: stats.users.total, icon: '👥' },
    { label: 'Active Users', value: stats.users.active, icon: '✅' },
    { label: 'Banned Users', value: stats.users.banned, icon: '🚫' },
    { label: 'Total Commands', value: stats.commands.total, icon: '⚙️' },
    { label: 'Enabled Commands', value: stats.commands.enabled, icon: '✨' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, idx) => (
        <div key={idx} className="card-base">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <span className="text-4xl">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
