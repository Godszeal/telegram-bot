# Quick Start Guide - Telegram Bot Control Panel

Get your bot management system running in 5 minutes!

## Prerequisites

✓ Telegram Bot Token (from @BotFather)
✓ Your Telegram User ID (from @userinfobot)
✓ Neon PostgreSQL database (free at neon.tech)

## Option 1: Deploy to Vercel (Recommended - 2 minutes)

### 1. Prepare Your Code
```bash
# Clone/fork the repository
git clone <your-repo-url>
cd telegram-bot
git push origin main
```

### 2. Deploy to Vercel
1. Go to vercel.com and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   JWT_SECRET=generate-a-random-secret-string-here
   ```
5. Click Deploy ✓

### 3. Run Database Setup
1. After deployment succeeds, you'll get a URL (e.g., `mybot.vercel.app`)
2. The database tables are created automatically on first run
3. Visit your URL and you're ready to go!

## Option 2: Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-super-secret-key-32-chars-minimum
JWT_SECRET=jwt_secret_key_here
```

**Get DATABASE_URL from Neon:**
1. Go to neon.tech and create account
2. Create new project
3. Copy connection string

### 3. Run Setup Script
```bash
# This creates all database tables
npx tsx scripts/setup-db.sql
```

### 4. Start Development
```bash
npm run dev
```
Visit: http://localhost:3000

## Step 1: Register Admin Account (30 seconds)

1. Visit your dashboard URL
2. Click **"Sign Up"** button
3. Enter email and password
4. Click **"Create Account"**
5. You're registered! ✓

## Step 2: Login (30 seconds)

1. Click **"Login"** button
2. Enter your email and password
3. Click **"Sign In"**
4. You're in the dashboard! ✓

**Troubleshooting Login**:
- Check browser console (F12) for error details
- Make sure email is registered
- Check password is exactly correct
- Try clearing cache: Ctrl+Shift+Del

## Step 3: Connect Your Bot (1 minute)

### Get Bot Token
1. Open Telegram, message @BotFather
2. Click `/start` → `/mybots` → select your bot
3. Click **"API Token"**
4. Copy the token (looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Get Admin ID
1. Message @userinfobot on Telegram
2. It replies with your user ID (a number, e.g., `987654321`)
3. Copy the ID

### Configure in Dashboard
1. Click **"Bot Setup"** in sidebar
2. Paste bot token in "Bot Token" field
3. Paste admin ID in "Admin ID" field
4. Click **"Connect Bot"**
5. Wait 10 seconds... you should see ✓ **"Connected"**

## Step 4: Integrate Your Bot (1 minute)

### Add Integration Code
1. Go to **"Bot Integration"** page
2. Copy the integration code
3. Open your bot's `main.js`
4. Paste code after bot connection (look for comments showing where)
5. Update `ADMIN_PANEL_URL` in the code to your dashboard URL

### Update Environment
In your bot's `.env`:
```env
ADMIN_PANEL_URL=https://your-deployment.vercel.app
```

### Restart Bot
```bash
node main.js
```

Wait 10-20 seconds. Check dashboard - bot status should show **"Active"** ✓

## You're Done! 🎉

Your bot is now controlled from the dashboard:

| Feature | Location |
|---------|----------|
| **Ban Users** | Users → Select User → Ban |
| **Control Commands** | Commands Manager → Toggle on/off |
| **View Stats** | Analytics → See charts |
| **Update Config** | Configuration → Change settings |
| **Track Activity** | Dashboard → See recent activity |

**No redeployment needed! Changes happen instantly!**

## Dashboard Pages Overview

- **Dashboard** - Overview and quick stats
- **Bot Setup** - Connect/configure your bot
- **Bot Integration** - Get integration code for your bot
- **Configuration** - Update bot settings
- **Users** - Manage and ban users
- **Commands** - View all commands
- **Commands Manager** - Visual command toggle interface
- **Analytics** - Performance metrics and charts
- **Settings** - Account preferences
- **Guide** - Getting started tutorial
- **Integration Guide** - Developer documentation

## Common Issues & Fixes

### Q: Login shows "Fatal error during initialization"
**A**: This is from your bot's main.js, not the dashboard. The web panel should still work. Try refreshing the page.

### Q: "Sign In" button doesn't work
**A**: Check browser console (F12 → Console tab) for error details. See `TROUBLESHOOTING_FAQ.md` for solutions.

### Q: Bot won't connect
**A**: Double-check token and admin ID:
- Bot token should start with numbers: `123456:ABC...`
- Admin ID should be just numbers: `987654321`
- No extra spaces or quotes
- Copy directly from Telegram apps

### Q: Bot connected but dashboard shows "Not connected"
**A**: Add integration code to bot and restart it. Check browser console for API errors.

### Q: Commands aren't toggling on/off
**A**: Restart your bot after integration code is added. Bot needs to sync with dashboard.

## Detailed Documentation

- **`BOT_ADMIN_SYSTEM_README.md`** - Complete system guide with all features
- **`TROUBLESHOOTING_FAQ.md`** - Common problems and detailed solutions
- **`SYSTEM_OVERVIEW.md`** - Architecture and how everything works together
- **`BOT_INTEGRATION.md`** - Detailed bot integration instructions

## Environment Variables Checklist

### Web Dashboard (.env.local or Vercel)
```
DATABASE_URL=        ✓ Required - PostgreSQL connection
JWT_SECRET=          ✓ Required - Any random string (32+ chars)
NODE_ENV=production  ✓ For Vercel
```

### Your Bot (.env)
```
BOT_TOKEN=           ✓ Your bot token
ADMIN_ID=            ✓ Your Telegram user ID
ADMIN_PANEL_URL=     ✓ Your dashboard URL
```

## Testing Checklist

Before going live, verify:

- [ ] Dashboard loads without errors
- [ ] Can register and login successfully
- [ ] Bot token and admin ID saved correctly
- [ ] Bot shows "Connected" status
- [ ] Bot's integration code added to main.js
- [ ] Bot restarted after adding code
- [ ] Dashboard shows bot as "Active"
- [ ] Can toggle commands on/off
- [ ] Can ban/unban users
- [ ] Analytics page shows data
- [ ] Mobile menu works on small screens

## What Happens After Setup?

1. **No Downtime**: Update config without restarting bot
2. **Instant Changes**: Ban users, disable commands, right now
3. **Full Control**: Manage everything from web dashboard
4. **Live Analytics**: See command usage and user activity
5. **Scalability**: Grow your bot management without complexity

## Next Steps

1. ✅ Dashboard deployed
2. ✅ Bot configured and connected
3. ✅ Integration code added
4. 📊 Monitor analytics in dashboard
5. 🚀 Update settings anytime without redeployment

## Support

**Problem?** Check these files:
1. `TROUBLESHOOTING_FAQ.md` - 20+ common issues with solutions
2. `BOT_ADMIN_SYSTEM_README.md` - Complete documentation
3. Browser console (F12) - Detailed error messages
4. Deployment logs (Vercel dashboard) - Server-side errors

## Quick Commands

```bash
# Local development
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server

# Database
npx tsx scripts/setup-db.sql    # Create/recreate all tables

# Deployment
git push origin main    # Deploy to Vercel automatically
```

---

**Your Telegram bot is now manageable from the web without any redeployment!** 🤖✨

**Questions?** Check the detailed documentation files or browser console for error details.

