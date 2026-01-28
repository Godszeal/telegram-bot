'use client';

import { useEffect, useState } from 'react';

interface BotConfig {
  bot_token: string;
  bot_prefix: string;
  bot_name: string;
  admin_id: string;
}

export default function BotStatus() {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent"></div>;
  }

  const isConfigured = config && config.bot_token && config.admin_id;

  return (
    <div className="card-base space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Bot Status</h2>
          <p className="text-muted-foreground text-sm mt-1">Current configuration status</p>
        </div>
        <div className={`w-4 h-4 rounded-full ${isConfigured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-muted-foreground text-sm">Bot Name</p>
          <p className="font-semibold mt-1">{config?.bot_name || 'Not set'}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Prefix</p>
          <p className="font-semibold mt-1">{config?.bot_prefix || 'Not set'}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Token Status</p>
          <p className="font-semibold mt-1 text-green-500">{config?.bot_token ? '✓ Set' : '✗ Not set'}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">Admin ID</p>
          <p className="font-semibold mt-1">{config?.admin_id || 'Not set'}</p>
        </div>
      </div>

      {!isConfigured && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 px-4 py-3 rounded-md text-sm">
          ⚠️ Bot is not fully configured. Please set the token and admin ID in Configuration.
        </div>
      )}
    </div>
  );
}
