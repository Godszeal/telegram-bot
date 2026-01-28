'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import BotConfigForm from '@/components/dashboard/BotConfigForm';

interface BotConfig {
  bot_token: string;
  bot_prefix: string;
  bot_name: string;
  admin_id: string;
}

export default function ConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const response = await fetch('/api/config');
      if (!response.ok) throw new Error('Failed to fetch config');
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      console.error('Error fetching config:', err);
      setError('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }

  if (!config && loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bot Configuration</h1>
          <p className="text-muted-foreground mt-1">Manage your bot settings</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {config && <BotConfigForm initialConfig={config} onUpdate={fetchConfig} />}
      </div>
    </DashboardLayout>
  );
}
