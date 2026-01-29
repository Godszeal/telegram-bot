'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function IntegrationDocsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Bot Integration Guide</h1>
          <p className="text-muted-foreground mt-2">
            Learn how to integrate your Telegram bot with the control panel
          </p>
        </div>

        {/* Quick Start */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Set Up Bot Configuration</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to Bot Setup page in the dashboard</li>
                <li>Enter your bot token from @BotFather</li>
                <li>Add your Telegram admin ID</li>
                <li>Click Save Configuration</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Connect Your Bot to Database</h3>
              <p className="text-muted-foreground mb-2">Update your bot's main.js file:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`const db = require('./database/dashboardDB');

// Load config on startup
async function loadBotConfig() {
  try {
    const result = await db.query('SELECT * FROM bot_config LIMIT 1');
    if (result.rows.length > 0) {
      const config = result.rows[0];
      global.botToken = config.bot_token;
      global.botPrefix = config.bot_prefix;
      global.botAdminId = config.admin_id;
      console.log('✓ Bot config loaded from dashboard');
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

loadBotConfig();`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Use Configuration in Your Bot</h3>
              <p className="text-muted-foreground mb-2">Reference global variables:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`bot.on('text', async (msg) => {
  // Your bot processing code
  const prefix = global.botPrefix;
  const adminId = global.botAdminId;
  
  if (msg.from.id === adminId) {
    // Admin commands
  }
});`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">Advanced Integration</h2>

          <div className="space-y-6">
            {/* Ban Check */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Check User Ban Status</h3>
              <p className="text-muted-foreground mb-3">Block banned users from using commands:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`async function isUserBanned(userId) {
  try {
    const result = await db.query(
      'SELECT is_banned FROM bot_users WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // Auto-create user
      await db.query(
        'INSERT INTO bot_users (user_id, username, created_at) VALUES ($1, $2, NOW())',
        [userId, msg.from.username || 'Unknown']
      );
      return false;
    }
    
    return result.rows[0].is_banned;
  } catch (error) {
    console.error('Error checking ban:', error);
    return false;
  }
}

// Use in your command
bot.on('text', async (msg) => {
  if (await isUserBanned(msg.from.id)) {
    return msg.reply.text('You are banned.');
  }
  // Process command
});`}</pre>
              </div>
            </div>

            {/* Command Status */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Check Command Status</h3>
              <p className="text-muted-foreground mb-3">Enable/disable commands from dashboard:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`async function isCommandEnabled(commandName) {
  try {
    const result = await db.query(
      'SELECT is_enabled FROM commands WHERE name = $1',
      [commandName]
    );
    
    if (result.rows.length === 0) {
      // Auto-create command
      await db.query(
        'INSERT INTO commands (name, is_enabled, created_at) VALUES ($1, true, NOW())',
        [commandName]
      );
      return true;
    }
    
    return result.rows[0].is_enabled;
  } catch (error) {
    console.error('Error checking command:', error);
    return true;
  }
}

// Use before executing
bot.on('text', async (msg) => {
  const command = extractCommand(msg.text);
  if (!await isCommandEnabled(command)) {
    return msg.reply.text(\`Command /\${command} is disabled.\`);
  }
  // Execute command
});`}</pre>
              </div>
            </div>

            {/* Log Usage */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Track Command Usage</h3>
              <p className="text-muted-foreground mb-3">Log command execution for analytics:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`async function logCommandUsage(commandName, userId) {
  try {
    // Update usage count
    await db.query(
      \`UPDATE commands 
       SET usage_count = usage_count + 1, last_used = NOW()
       WHERE name = $1\`,
      [commandName]
    );
    
    // Log execution
    await db.query(
      \`INSERT INTO command_logs (command_id, user_id, executed_at)
       SELECT id, $2, NOW() FROM commands WHERE name = $1\`,
      [commandName, userId]
    );
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

// Use after command execution
bot.on('text', async (msg) => {
  try {
    // Execute command...
    await logCommandUsage('mycommand', msg.from.id);
  } catch (error) {
    console.error('Command error:', error);
  }
});`}</pre>
              </div>
            </div>

            {/* Update User Info */}
            <div>
              <h3 className="font-semibold mb-3 text-lg">Update User Information</h3>
              <p className="text-muted-foreground mb-3">Track user details automatically:</p>
              <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
                <pre>{`async function updateUserInfo(userId, username, firstName, lastName) {
  try {
    await db.query(
      \`UPDATE bot_users 
       SET username = $2, first_name = $3, last_name = $4, updated_at = NOW()
       WHERE user_id = $1
       RETURNING *\`,
      [userId, username, firstName, lastName]
    );
    
    // Fallback: create if not exists
    if (result.rowCount === 0) {
      await db.query(
        \`INSERT INTO bot_users (user_id, username, first_name, last_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())\`,
        [userId, username, firstName, lastName]
      );
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

// Track all users
bot.on('text', async (msg) => {
  await updateUserInfo(
    msg.from.id,
    msg.from.username,
    msg.from.first_name,
    msg.from.last_name
  );
  // Process message
});`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Reload Config */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">Real-Time Configuration Updates</h2>
          <p className="text-muted-foreground mb-4">
            Reload configuration periodically to get dashboard updates without restarting the bot:
          </p>
          <div className="bg-background rounded p-4 overflow-auto text-sm font-mono">
            <pre>{`class BotConfig {
  constructor() {
    this.config = {};
    this.commandStatus = {};
    this.bannedUsers = new Set();
  }

  async load() {
    try {
      // Load config
      const configResult = await db.query('SELECT * FROM bot_config LIMIT 1');
      if (configResult.rows.length > 0) {
        this.config = configResult.rows[0];
      }

      // Cache command statuses
      const commandsResult = await db.query('SELECT name, is_enabled FROM commands');
      commandsResult.rows.forEach(cmd => {
        this.commandStatus[cmd.name] = cmd.is_enabled;
      });

      // Cache banned users
      const bannedResult = await db.query('SELECT user_id FROM bot_users WHERE is_banned = true');
      bannedResult.rows.forEach(user => {
        this.bannedUsers.add(user.user_id);
      });

      console.log('✓ Config reloaded from dashboard');
    } catch (error) {
      console.error('Config reload failed:', error);
    }
  }

  // Auto-reload every 5 minutes
  startAutoReload() {
    setInterval(() => this.load(), 5 * 60 * 1000);
  }

  isCommandEnabled(name) {
    return this.commandStatus[name] !== false;
  }

  isUserBanned(id) {
    return this.bannedUsers.has(id);
  }
}

const botConfig = new BotConfig();
botConfig.load();
botConfig.startAutoReload();

// Use in your bot
bot.on('text', async (msg) => {
  if (botConfig.isUserBanned(msg.from.id)) {
    return msg.reply.text('You are banned.');
  }
  // Process...
});`}</pre>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">API Endpoints</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono bg-background rounded p-2">
                  GET /api/config - Get bot configuration
                </div>
                <div className="font-mono bg-background rounded p-2">
                  POST /api/config - Update configuration
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Users</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono bg-background rounded p-2">
                  GET /api/users - List all users (paginated)
                </div>
                <div className="font-mono bg-background rounded p-2">
                  PUT /api/users - Ban/unban user
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Commands</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono bg-background rounded p-2">
                  GET /api/commands - List all commands
                </div>
                <div className="font-mono bg-background rounded p-2">
                  PUT /api/commands - Enable/disable command
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="font-mono bg-background rounded p-2">
                  GET /api/stats - Get dashboard statistics
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground">
            <li><strong className="text-foreground">Cache Configuration</strong> - Don't query the database on every message</li>
            <li><strong className="text-foreground">Periodic Reload</strong> - Update cache every 5-10 minutes</li>
            <li><strong className="text-foreground">Error Handling</strong> - Don't break the bot if database is down</li>
            <li><strong className="text-foreground">User Tracking</strong> - Update user info on first interaction</li>
            <li><strong className="text-foreground">Command Logging</strong> - Log usage for accurate analytics</li>
            <li><strong className="text-foreground">Connection Pooling</strong> - Use connection pools for better performance</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Configuration not loading?</h3>
              <p className="text-muted-foreground">Check that your DATABASE_URL environment variable is set correctly and the database connection is working.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ban changes not taking effect?</h3>
              <p className="text-muted-foreground">Reduce the auto-reload interval or restart your bot to load the latest banned users list.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Users not appearing in dashboard?</h3>
              <p className="text-muted-foreground">Ensure updateUserInfo() is being called for every user interaction in your bot.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Statistics not accurate?</h3>
              <p className="text-muted-foreground">Make sure logCommandUsage() is called after each successful command execution.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
