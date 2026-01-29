'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function BotSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bot_token: '',
    bot_name: '',
    bot_prefix: '/',
    admin_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        setFormData(config);
        setIsEditing(!!config.bot_token);
      }
    } catch (err) {
      console.error('Failed to load config');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Failed to save configuration');
      }
    } catch (err) {
      setError('An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Bot Configuration</h1>
          <p className="text-muted-foreground mt-2">
            {isEditing ? 'Update your bot settings' : 'Connect your Telegram bot to start managing it'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Setup Guide */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Setup Guide</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-accent mb-1">Step 1: Get Bot Token</h4>
                  <p className="text-muted-foreground">
                    Talk to @BotFather on Telegram to create a new bot and get your token
                  </p>
                </div>
                <div className="border-t border-border pt-3">
                  <h4 className="font-medium text-accent mb-1">Step 2: Get Admin ID</h4>
                  <p className="text-muted-foreground">
                    Message @userinfobot on Telegram to get your user ID
                  </p>
                </div>
                <div className="border-t border-border pt-3">
                  <h4 className="font-medium text-accent mb-1">Step 3: Configure Below</h4>
                  <p className="text-muted-foreground">
                    Fill in all required fields and save your configuration
                  </p>
                </div>
                <div className="border-t border-border pt-3">
                  <h4 className="font-medium text-accent mb-1">Step 4: Update Bot</h4>
                  <p className="text-muted-foreground">
                    Update your bot code to read config from the database
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span>📚</span> Quick Integration
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Check our documentation for step-by-step integration code examples.
              </p>
              <a
                href="https://github.com/yourusername/telegram-bot#bot-integration"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent/80 font-medium text-sm"
              >
                View Integration Guide →
              </a>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
                  Configuration saved successfully! Redirecting to dashboard...
                </div>
              )}

              <div>
                <label htmlFor="bot_token" className="block text-sm font-medium mb-2">
                  Bot Token <span className="text-red-500">*</span>
                </label>
                <input
                  id="bot_token"
                  name="bot_token"
                  type="password"
                  placeholder="1234567890:ABCDefGhIjKlMnOpQrStUvWxYz"
                  value={formData.bot_token}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your secret bot token from @BotFather
                </p>
              </div>

              <div>
                <label htmlFor="bot_name" className="block text-sm font-medium mb-2">
                  Bot Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="bot_name"
                  name="bot_name"
                  type="text"
                  placeholder="My Awesome Bot"
                  value={formData.bot_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Display name for your bot
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bot_prefix" className="block text-sm font-medium mb-2">
                    Command Prefix
                  </label>
                  <input
                    id="bot_prefix"
                    name="bot_prefix"
                    type="text"
                    placeholder="/"
                    value={formData.bot_prefix}
                    onChange={handleChange}
                    maxLength={1}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Single character (default: /)
                  </p>
                </div>

                <div>
                  <label htmlFor="admin_id" className="block text-sm font-medium mb-2">
                    Admin Telegram ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="admin_id"
                    name="admin_id"
                    type="number"
                    placeholder="123456789"
                    value={formData.admin_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Telegram user ID
                  </p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-600">
                  💡 <strong>Tip:</strong> After saving, your bot can query this configuration from the database. Check the documentation for integration examples.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Configuration'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-secondary transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Sample Integration Code */}
            <div className="mt-6 rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold mb-4">Sample Bot Integration Code</h3>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono text-muted-foreground">
                <pre>{`// Load config from dashboard on bot startup
const db = require('./database/dashboardDB');

async function loadBotConfig() {
  try {
    const result = await db.query(
      'SELECT * FROM bot_config LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      const config = result.rows[0];
      global.botToken = config.bot_token;
      global.botPrefix = config.bot_prefix;
      global.botAdminId = config.admin_id;
      
      console.log('✓ Config loaded from dashboard');
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// Call this on startup
loadBotConfig();`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
