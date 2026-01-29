'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Settings {
  bot_name: string;
  bot_prefix: string;
  enable_stats: boolean;
  enable_logging: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    bot_name: 'MyBot',
    bot_prefix: '/',
    enable_stats: true,
    enable_logging: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSave() {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');
      setSuccess('Settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error('[v0] Settings error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your bot settings and preferences</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-500 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="card-base space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bot Name</label>
            <input
              type="text"
              value={settings.bot_name}
              onChange={(e) => setSettings({ ...settings, bot_name: e.target.value })}
              placeholder="Enter bot name"
              className="input-base"
            />
            <p className="text-xs text-muted-foreground mt-1">The display name for your bot</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bot Prefix</label>
            <input
              type="text"
              value={settings.bot_prefix}
              onChange={(e) => setSettings({ ...settings, bot_prefix: e.target.value })}
              placeholder="/"
              className="input-base"
              maxLength={3}
            />
            <p className="text-xs text-muted-foreground mt-1">Character used to prefix commands</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_stats}
                onChange={(e) => setSettings({ ...settings, enable_stats: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Enable Statistics Tracking</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_logging}
                onChange={(e) => setSettings({ ...settings, enable_logging: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Enable Activity Logging</span>
            </label>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary disabled:opacity-50 w-full"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
