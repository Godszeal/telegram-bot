# Quick Reference: Bot Connection Setup

## For End Users

### Step 1: Create Account
- Visit your deployed application
- Click "Sign Up"
- Create admin account with secure password

### Step 2: Get Bot Credentials
- **Bot Token**: Message @BotFather on Telegram, use `/newbot` or `/mybots`
- **Admin ID**: Message @userinfobot on Telegram, it will show your ID

### Step 3: Connect Bot
- Go to Dashboard → Bot Setup
- Paste bot token
- Enter admin ID
- Click "Save Configuration"

### Step 4: Start Managing
- Dashboard now shows bot is connected
- Manage users, commands, configuration
- All changes are instant - no redeployment needed!

---

## For Developers (Bot Integration)

### Install PostgreSQL Client
```bash
npm install pg
```

### Create Database Connection File
`database/dashboardDB.js`:
```javascript
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();
module.exports = client;
```

### Load Config on Startup
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
      console.log('✓ Config loaded from dashboard');
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

loadBotConfig();
```

### Check User Ban Status
```javascript
async function isUserBanned(userId) {
  const result = await db.query(
    'SELECT is_banned FROM bot_users WHERE user_id = $1',
    [userId]
  );
  
  return result.rows.length > 0 && result.rows[0].is_banned;
}

// Use in bot
bot.on('text', async (msg) => {
  if (await isUserBanned(msg.from.id)) {
    return msg.reply.text('You are banned.');
  }
  // Process...
});
```

### Check Command Status
```javascript
async function isCommandEnabled(commandName) {
  const result = await db.query(
    'SELECT is_enabled FROM commands WHERE name = $1',
    [commandName]
  );
  
  return result.rows.length === 0 || result.rows[0].is_enabled;
}

bot.on('text', async (msg) => {
  const cmd = extractCommand(msg.text);
  if (!await isCommandEnabled(cmd)) {
    return msg.reply.text(`Command /${cmd} is disabled.`);
  }
  // Execute...
});
```

### Log Command Usage
```javascript
async function logCommandUsage(commandName, userId) {
  await db.query(
    'UPDATE commands SET usage_count = usage_count + 1, last_used = NOW() WHERE name = $1',
    [commandName]
  );
  
  await db.query(
    'INSERT INTO command_logs (command_id, user_id, executed_at) SELECT id, $2, NOW() FROM commands WHERE name = $1',
    [commandName, userId]
  );
}
```

### Auto-Reload Config (Every 5 Minutes)
```javascript
setInterval(async () => {
  await loadBotConfig();
  console.log('✓ Config reloaded from dashboard');
}, 5 * 60 * 1000);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to install packages" | ✅ Fixed! Removed heavy dependencies |
| Config not loading | Check DATABASE_URL is set and database is connected |
| Ban changes not working | Restart bot or reduce reload interval |
| Stats not updating | Call logCommandUsage() after each command |
| New users not in dashboard | Call updateUserInfo() for each user interaction |

---

## Dashboard URLs

- **Homepage**: `/`
- **Login**: `/login`
- **Register**: `/register`
- **Dashboard**: `/dashboard`
- **Bot Setup**: `/dashboard/bot-setup`
- **Configuration**: `/dashboard/config`
- **Users**: `/dashboard/users`
- **Commands**: `/dashboard/commands`
- **Integration Guide**: `/dashboard/integration-docs`

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@neon.tech/database_name

# Security
JWT_SECRET=your-min-32-character-secret-key-for-jwt

# Environment
NODE_ENV=production
```

---

## Support

- 📚 Read Integration Guide at `/dashboard/integration-docs`
- 📖 Check README.md for full documentation
- 🐛 Review troubleshooting section
- 💬 Check BOT_INTEGRATION_GUIDE.md for examples

---

**Everything is ready to go!** 🚀
