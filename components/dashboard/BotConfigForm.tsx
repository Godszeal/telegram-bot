'use client';

import { useState } from 'react';

interface BotConfig {
  bot_token: string;
  bot_prefix: string;
  bot_name: string;
  admin_id: string;
}

interface BotConfigFormProps {
  initialConfig: BotConfig;
  onUpdate: () => void;
}

export default function BotConfigForm({ initialConfig, onUpdate }: BotConfigFormProps) {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update configuration');
        return;
      }

      setSuccess('Configuration updated successfully');
      onUpdate();
    } catch (err) {
      console.error('Error updating config:', err);
      setError('An error occurred while updating configuration');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-base space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bot Name</label>
          <input
            type="text"
            name="bot_name"
            value={config.bot_name}
            onChange={handleChange}
            placeholder="e.g., My Awesome Bot"
            className="input-base"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Command Prefix</label>
          <input
            type="text"
            name="bot_prefix"
            value={config.bot_prefix}
            onChange={handleChange}
            placeholder="e.g., /"
            className="input-base"
            disabled={loading}
            maxLength={1}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Bot Token</label>
          <input
            type="password"
            name="bot_token"
            value={config.bot_token}
            onChange={handleChange}
            placeholder="Your Telegram bot token"
            className="input-base"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Keep this secure. You can obtain it from @BotFather on Telegram.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Admin User ID</label>
          <input
            type="text"
            name="admin_id"
            value={config.admin_id}
            onChange={handleChange}
            placeholder="Your Telegram user ID"
            className="input-base"
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your Telegram user ID for admin commands.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
