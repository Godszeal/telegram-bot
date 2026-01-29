'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BotStatus {
  is_connected: boolean;
  bot_name: string;
  bot_token: string;
  admin_id: string;
  bot_prefix: string;
}

export default function BotConnectionStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        setStatus({
          is_connected: !!config.bot_token,
          bot_name: config.bot_name || 'Not configured',
          bot_token: config.bot_token || '',
          admin_id: config.admin_id || '',
          bot_prefix: config.bot_prefix || '/',
        });
      } else {
        // Set default status if API fails
        setStatus({
          is_connected: false,
          bot_name: 'Not configured',
          bot_token: '',
          admin_id: '',
          bot_prefix: '/',
        });
      }
    } catch (err) {
      console.error('Failed to load bot status:', err);
      // Set default status on error
      setStatus({
        is_connected: false,
        bot_name: 'Not configured',
        bot_token: '',
        admin_id: '',
        bot_prefix: '/',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${status?.is_connected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            Bot Connection
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            {status?.is_connected ? `Connected to ${status.bot_name}` : 'No bot configured yet'}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/bot-setup')}
          className="px-4 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition font-medium text-sm"
        >
          {status?.is_connected ? 'Reconfigure' : 'Connect Bot'}
        </button>
      </div>

      {status?.is_connected && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bot Name:</span>
            <span className="font-medium">{status.bot_name}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Command Prefix:</span>
            <span className="font-mono font-medium">{status.bot_prefix}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Admin ID:</span>
            <span className="font-mono font-medium">{status.admin_id}</span>
          </div>
        </div>
      )}

      {!status?.is_connected && (
        <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-sm text-yellow-600">
            <strong>⚠️ Note:</strong> Connect your bot to start managing it from this dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
