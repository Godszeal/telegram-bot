# Bot Integration Guide

This guide explains how to integrate your Telegram bot (`main.js`) with the control panel dashboard.

## Overview

The dashboard stores bot configuration and state in a PostgreSQL database. Your bot can query this database to:
- Fetch the latest bot configuration
- Check user ban status
- Verify command availability
- Update command usage statistics

## Database Connection

Add PostgreSQL client to your dependencies:

```bash
npm install pg
```

Create a database connection file (`database/dashboardDB.js`):

```javascript
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

module.exports = client;
```

## Integration Examples

### 1. Load Bot Configuration on Startup

```javascript
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
      console.log('[Dashboard] Config loaded:', {
        prefix: global.botPrefix,
        adminId: global.botAdminId
      });
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// Call on bot startup
loadBotConfig();
```

### 2. Check If User Is Banned

```javascript
async function isUserBanned(userId) {
  try {
    const result = await db.query(
      'SELECT is_banned FROM bot_users WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      // User not in database, create entry
      await db.query(
        'INSERT INTO bot_users (user_id, username, created_at) VALUES ($1, $2, NOW())',
        [userId, msg.from.username || 'Unknown']
      );
      return false;
    }
    
    return result.rows[0].is_banned;
  } catch (error) {
    console.error('Error checking ban status:', error);
    return false;
  }
}

// Use in command handler
bot.on('text', async (msg) => {
  if (await isUserBanned(msg.from.id)) {
    msg.reply.text('You are banned from using this bot.');
    return;
  }
  
  // Process command...
});
```

### 3. Check If Command Is Enabled

```javascript
async function isCommandEnabled(commandName) {
  try {
    const result = await db.query(
      'SELECT is_enabled FROM commands WHERE name = $1',
      [commandName]
    );
    
    if (result.rows.length === 0) {
      // Command not in database, create entry
      await db.query(
        'INSERT INTO commands (name, description, is_enabled, created_at) VALUES ($1, $2, true, NOW())',
        [commandName, `${commandName} command`]
      );
      return true;
    }
    
    return result.rows[0].is_enabled;
  } catch (error) {
    console.error('Error checking command status:', error);
    return true; // Allow by default if error
  }
}

// Use when processing commands
bot.on('text', async (msg) => {
  const command = extractCommand(msg.text);
  
  if (!await isCommandEnabled(command)) {
    msg.reply.text(`Command /${command} is currently disabled.`);
    return;
  }
  
  // Process command...
});
```

### 4. Log Command Usage

```javascript
async function logCommandUsage(commandName, userId) {
  try {
    // Increment command usage count
    await db.query(
      `UPDATE commands 
       SET usage_count = usage_count + 1, last_used = NOW()
       WHERE name = $1`,
      [commandName]
    );
    
    // Log the command execution
    await db.query(
      `INSERT INTO command_logs (command_id, user_id, executed_at)
       SELECT id, $2, NOW() FROM commands WHERE name = $1`,
      [commandName, userId]
    );
  } catch (error) {
    console.error('Error logging command usage:', error);
  }
}

// Use after executing command
bot.on('text', async (msg) => {
  try {
    // Execute command...
    await logCommandUsage('mycommand', msg.from.id);
  } catch (error) {
    console.error('Command error:', error);
  }
});
```

### 5. Update User Information

```javascript
async function updateUserInfo(userId, username, firstName, lastName) {
  try {
    const result = await db.query(
      `UPDATE bot_users 
       SET username = $2, first_name = $3, last_name = $4, updated_at = NOW()
       WHERE user_id = $1
       RETURNING *`,
      [userId, username, firstName, lastName]
    );
    
    if (result.rows.length === 0) {
      // Create new user if doesn't exist
      await db.query(
        `INSERT INTO bot_users (user_id, username, first_name, last_name, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())`,
        [userId, username, firstName, lastName]
      );
    }
  } catch (error) {
    console.error('Error updating user info:', error);
  }
}

// Track all new users
bot.on('text', async (msg) => {
  await updateUserInfo(
    msg.from.id,
    msg.from.username,
    msg.from.first_name,
    msg.from.last_name
  );
  // Process message...
});
```

## Complete Integration Example

```javascript
// bot-config.js
const db = require('./database/dashboardDB');

class BotConfig {
  constructor() {
    this.config = {};
    this.commandStatus = {};
    this.bannedUsers = new Set();
  }

  async load() {
    try {
      // Load main config
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

      console.log('[BotConfig] Configuration loaded from dashboard');
    } catch (error) {
      console.error('[BotConfig] Failed to load configuration:', error);
    }
  }

  // Reload periodically (every 5 minutes)
  startAutoReload() {
    setInterval(() => this.load(), 5 * 60 * 1000);
  }

  isCommandEnabled(name) {
    return this.commandStatus[name] !== false;
  }

  isUserBanned(id) {
    return this.bannedUsers.has(id);
  }

  getPrefix() {
    return this.config.bot_prefix || '/';
  }

  getAdminId() {
    return this.config.admin_id;
  }
}

module.exports = new BotConfig();
```

Usage in main bot file:

```javascript
const botConfig = require('./bot-config');

// Load config on startup
botConfig.load();
botConfig.startAutoReload();

// Check before processing
bot.on('text', async (msg) => {
  if (botConfig.isUserBanned(msg.from.id)) {
    return msg.reply.text('You are banned.');
  }

  const command = extractCommand(msg.text);
  if (!botConfig.isCommandEnabled(command)) {
    return msg.reply.text(`Command /${command} is disabled.`);
  }

  // Process command...
});
```

## Sync Issues & Solutions

### Issue: Commands don't disable immediately
**Solution:** Reduce auto-reload interval or implement WebSocket for real-time updates.

### Issue: New users not appearing in dashboard
**Solution:** Ensure `updateUserInfo()` is called for every user interaction.

### Issue: Ban changes not taking effect
**Solution:** Clear banned users cache or restart bot after changes.

### Issue: Statistics not accurate
**Solution:** Ensure `logCommandUsage()` is called after each successful command.

## Best Practices

1. **Cache Configuration** - Don't query database on every message
2. **Periodic Reload** - Update cache every 5-10 minutes
3. **Error Handling** - Don't break bot if database is down
4. **User Tracking** - Update user info on first interaction
5. **Logging** - Log command usage for analytics
6. **Transaction Safety** - Use transactions for critical updates

## Environment Variables

Add to your `.env` file:

```env
DATABASE_URL=postgresql://user:password@neon.tech/dbname
```

Then reference in your bot:

```javascript
const connectionString = process.env.DATABASE_URL;
```
