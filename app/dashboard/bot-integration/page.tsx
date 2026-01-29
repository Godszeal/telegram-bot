'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function BotIntegrationPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

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
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  }

  const integrationCode = `// Load this in your main.js AFTER bot connection
const http = require('http');
const axios = require('axios');

// Your admin panel API base URL
const ADMIN_PANEL_URL = 'https://your-deployment.vercel.app/api';

// Function to sync bot configuration from admin panel
async function syncBotConfigFromPanel() {
  try {
    const response = await axios.get(\`\${ADMIN_PANEL_URL}/config\`);
    const config = response.data;
    
    // Update bot settings
    bot.setPrefix(config.bot_prefix || '/');
    
    console.log('[BOT] Configuration synced from admin panel');
    return config;
  } catch (error) {
    console.error('[BOT] Failed to sync config from panel:', error.message);
    return null;
  }
}

// Function to log activity to admin panel
async function logActivity(userId, action, details) {
  try {
    await axios.post(\`\${ADMIN_PANEL_URL}/activity\`, {
      user_id: userId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[BOT] Failed to log activity:', error.message);
  }
}

// Function to update user status
async function updateUserStatus(userId, status) {
  try {
    await axios.post(\`\${ADMIN_PANEL_URL}/users/\${userId}\`, { status });
  } catch (error) {
    console.error('[BOT] Failed to update user status:', error.message);
  }
}

// Sync config on bot startup
syncBotConfigFromPanel();

// Re-sync config every 5 minutes
setInterval(syncBotConfigFromPanel, 5 * 60 * 1000);

// Log command usage
bot.on('text', async (msg) => {
  if (msg.text.startsWith(config.prefix)) {
    const args = msg.text.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args[0];
    
    await logActivity(msg.from.id, 'command_used', {
      command: commandName,
      chat_id: msg.chat.id,
    });
  }
});`;

  const checkBanCode = `// Check if user is banned via admin panel
async function isUserBanned(userId) {
  try {
    const response = await axios.get(\`\${ADMIN_PANEL_URL}/users/\${userId}\`);
    return response.data.banned || false;
  } catch (error) {
    console.error('Error checking user ban status:', error);
    return false;
  }
}

// Use in your command handler
if (msg.text.startsWith(config.prefix)) {
  const isBanned = await isUserBanned(msg.from.id);
  if (isBanned) {
    return bot.sendMessage(msg.chat.id, 'You are banned from using this bot!');
  }
  // Execute command...
}`;

  const commandStateCode = `// Get command enabled/disabled state from panel
async function isCommandEnabled(commandName) {
  try {
    const response = await axios.get(\`\${ADMIN_PANEL_URL}/commands/\${commandName}\`);
    return response.data.enabled !== false;
  } catch (error) {
    return true; // Default to enabled if check fails
  }
}

// Use in command execution
const command = commands.get(commandName);
if (!command) return;

const enabled = await isCommandEnabled(commandName);
if (!enabled) {
  return bot.sendMessage(msg.chat.id, 'This command is currently disabled.');
}

// Execute command...`;

  const envCode = `# .env file for your bot
BOT_TOKEN=your_bot_token_here
ADMIN_ID=your_telegram_id_here
MONGO_URI=your_mongodb_connection_string
BOT_PREFIX=/
BOT_NAME=MyAwesomeBot
ADMIN_PANEL_URL=https://your-deployment.vercel.app/api
JWT_SECRET=your-secret-key-for-admin-panel`;

  if (loading) return null;
  if (!authorized) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bot Integration Guide</h1>
          <p className="text-muted-foreground">Learn how to connect your Telegram bot to this admin panel</p>
        </div>

        {/* Prerequisites */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Prerequisites</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-2">Your Bot</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Telegram Bot Token from @BotFather</li>
                <li>✓ Node.js application (main.js)</li>
                <li>✓ Axios or HTTP client library</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-2">Admin Panel</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Admin account created</li>
                <li>✓ Bot configured in Bot Setup</li>
                <li>✓ Database connected (Neon)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Step 1: Environment Setup */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Step 1: Environment Setup</h2>
          <p className="text-muted-foreground">Add these variables to your bot's .env file:</p>
          <div className="bg-secondary p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">{envCode}</pre>
            <button
              onClick={() => copyToClipboard(envCode, 'env')}
              className="mt-3 px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90"
            >
              {copied === 'env' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Step 2: Main Integration */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Step 2: Add Integration Code</h2>
          <p className="text-muted-foreground">Add this to your main.js after the bot connection is established:</p>
          <div className="bg-secondary p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">{integrationCode}</pre>
            <button
              onClick={() => copyToClipboard(integrationCode, 'integration')}
              className="mt-3 px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90"
            >
              {copied === 'integration' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Step 3: User Ban Check */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Step 3: Check User Ban Status</h2>
          <p className="text-muted-foreground">In your command handler, check if user is banned:</p>
          <div className="bg-secondary p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">{checkBanCode}</pre>
            <button
              onClick={() => copyToClipboard(checkBanCode, 'ban')}
              className="mt-3 px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90"
            >
              {copied === 'ban' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Step 4: Command State Management */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Step 4: Enable/Disable Commands from Panel</h2>
          <p className="text-muted-foreground">Check if commands are enabled before executing:</p>
          <div className="bg-secondary p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-words">{commandStateCode}</pre>
            <button
              onClick={() => copyToClipboard(commandStateCode, 'command')}
              className="mt-3 px-3 py-1 text-xs bg-accent text-white rounded hover:bg-accent/90"
            >
              {copied === 'command' ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </section>

        {/* API Endpoints */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Available API Endpoints</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="font-mono text-sm text-accent mb-2">GET /api/config</div>
              <p className="text-sm text-muted-foreground">Get current bot configuration</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="font-mono text-sm text-accent mb-2">POST /api/activity</div>
              <p className="text-sm text-muted-foreground">Log activity events</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="font-mono text-sm text-accent mb-2">GET /api/users/{'{userId}'}</div>
              <p className="text-sm text-muted-foreground">Get user information and ban status</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="font-mono text-sm text-accent mb-2">POST /api/users/{'{userId}'}</div>
              <p className="text-sm text-muted-foreground">Update user status/ban</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="font-mono text-sm text-accent mb-2">GET /api/commands/{'{commandName}'}</div>
              <p className="text-sm text-muted-foreground">Check if command is enabled</p>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Troubleshooting</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <h3 className="font-semibold mb-2 text-amber-700">Bot not syncing configuration?</h3>
              <p className="text-sm text-muted-foreground">Make sure the ADMIN_PANEL_URL is correct and the bot has internet access.</p>
            </div>
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <h3 className="font-semibold mb-2 text-amber-700">Commands not updating?</h3>
              <p className="text-sm text-muted-foreground">The bot checks for command updates every 5 minutes. You can modify the sync interval in the integration code.</p>
            </div>
            <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <h3 className="font-semibold mb-2 text-amber-700">Activity not logging?</h3>
              <p className="text-sm text-muted-foreground">Ensure the bot's token has permission to make API calls and the admin panel is accessible.</p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="p-6 rounded-lg border border-accent/30 bg-accent/5">
          <h3 className="font-bold mb-2">What happens after integration?</h3>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>✓ Real-time bot configuration updates without redeployment</li>
            <li>✓ Ban/unban users instantly</li>
            <li>✓ Enable/disable commands dynamically</li>
            <li>✓ Track user activity and command usage</li>
            <li>✓ Manage all aspects from the admin dashboard</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
