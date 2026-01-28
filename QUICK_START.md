# Quick Start Guide - Telegram Bot Control Panel

Get your bot dashboard running in minutes.

## Step 1: Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended - free tier available)
- Telegram Bot Token (from @BotFather)

## Step 2: Clone and Install

```bash
# Install dependencies
npm install
```

## Step 3: Set Up Environment Variables

Create `.env.local` in the root directory:

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
JWT_SECRET=your-super-secret-key-that-is-at-least-32-characters-long
NODE_ENV=development
```

**Where to get DATABASE_URL:**
1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy the connection string
4. Replace password in the string

## Step 4: Initialize Database

```bash
# This runs the SQL migration to create all tables
npm run build  # This will execute the migration if needed
```

Or manually run the SQL commands from `scripts/init-db.sql` in your Neon console.

## Step 5: Run Development Server

```bash
npm run dev
```

The dashboard will be available at: **http://localhost:3000**

## Step 6: Create Your Admin Account

1. Go to http://localhost:3000
2. Click "Register here"
3. Create your admin account with email and password
4. Log in with your credentials

## Step 7: Configure Your Bot

1. In the dashboard, go to **Configuration**
2. Add your bot details:
   - **Bot Token**: Get from @BotFather
   - **Command Prefix**: Usually `/` 
   - **Bot Name**: Any name for your bot
   - **Admin ID**: Your Telegram user ID (message @userinfobot to get it)
3. Click **Save Configuration**

## Step 8: Integrate With Your Bot (Optional)

To connect your bot (`main.js`) to the dashboard:

1. Install PostgreSQL client:
```bash
npm install pg
```

2. Create `database/dashboardDB.js`:
```javascript
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();
module.exports = client;
```

3. Update `main.js` to query the dashboard database (see `BOT_INTEGRATION_GUIDE.md`)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
5. Deploy

### Deploy to Other Platforms

1. Run `npm run build`
2. Set environment variables on your server
3. Run `npm start`

## Common Tasks

### Access Dashboard
- URL: http://localhost:3000 (development)
- Log in with your admin account

### Update Bot Token Without Restarting
1. Go to Configuration in dashboard
2. Update the token
3. Save - no restart needed!

### Ban a User
1. Go to Users section
2. Find the user
3. Click Ban button

### Disable a Command
1. Go to Commands section
2. Find the command
3. Click Disable button

### View Bot Statistics
- Check the Dashboard overview
- See user counts, command usage, and activity

## Troubleshooting

### "Connection refused" error
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Check network connectivity

### "Unauthorized" on dashboard
- Clear browser cookies
- Log out and log back in
- Check JWT_SECRET hasn't changed

### Bot not picking up changes
- Ensure bot is querying the dashboard database
- Restart bot after configuration changes
- See BOT_INTEGRATION_GUIDE.md for integration code

### Deployment issues
- Check environment variables are set correctly
- Verify DATABASE_URL on your hosting platform
- Check logs for specific error messages

## File Structure

```
├── app/
│   ├── (auth)/          # Login & register pages
│   ├── dashboard/       # Dashboard pages
│   ├── api/            # API routes
│   ├── globals.css     # Styling
│   └── layout.tsx      # Root layout
├── components/
│   └── dashboard/      # Dashboard components
├── lib/
│   └── auth-middleware.ts  # Auth verification
├── scripts/
│   └── init-db.sql     # Database schema
├── .env.local          # Environment variables
├── package.json
└── tailwind.config.ts
```

## Next Steps

1. ✅ Dashboard is running
2. ✅ Bot is configured
3. 📖 Read `BOT_INTEGRATION_GUIDE.md` to connect your bot
4. 🚀 Deploy to production
5. 📊 Monitor statistics and manage bot from dashboard

## Support

- Check `DASHBOARD_README.md` for detailed documentation
- Review `BOT_INTEGRATION_GUIDE.md` for bot integration
- See `scripts/init-db.sql` for database schema

## Key Features at a Glance

| Feature | Location |
|---------|----------|
| Update Bot Token | Configuration |
| Ban/Unban Users | Users |
| Enable/Disable Commands | Commands |
| View Statistics | Dashboard |
| Admin Account | Auth (Register/Login) |
| Bot Configuration | Configuration |

---

**You're all set!** Your Telegram bot dashboard is ready to use. Start by configuring your bot token in the Configuration section.
