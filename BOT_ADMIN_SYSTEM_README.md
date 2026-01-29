# Telegram Bot Admin Control Panel

A complete web-based dashboard to manage your Telegram bot without redeployment. Update configurations, manage users, control commands, and track analytics in real-time.

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [User Authentication](#user-authentication)
- [Bot Connection](#bot-connection)
- [Dashboard Features](#dashboard-features)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Features

- **Admin Panel**: Secure web interface with JWT authentication
- **Live Configuration**: Update bot settings without redeployment
- **User Management**: Ban/unban users, track activity
- **Command Control**: Enable/disable commands dynamically
- **Analytics**: Real-time bot performance metrics
- **Command Manager**: Visual interface to manage all bot commands
- **Mobile Responsive**: Fully responsive design for all devices
- **Bot Integration Guide**: Step-by-step integration instructions

## System Architecture

### Frontend (Next.js)
- Modern React-based dashboard
- Real-time updates with SWR
- Mobile-first responsive design
- JWT-based authentication
- Protected routes with middleware

### Backend (Node.js)
- Next.js API Routes
- Neon PostgreSQL Database
- Bcrypt password hashing
- JWT token management
- RESTful API endpoints

### Bot (Standalone Node.js)
- Telegram Bot API integration
- Config sync from admin panel
- Activity logging to panel
- User ban/command state management

## Getting Started

### Prerequisites

1. **Admin Panel Setup**
   - Node.js 16+
   - Neon PostgreSQL database
   - Vercel account (optional, for deployment)

2. **Telegram Bot Setup**
   - Bot Token from @BotFather
   - Your Telegram User ID (from @userinfobot)
   - Node.js application

### Registration

1. Go to `https://your-deployment.vercel.app/`
2. Click "Sign Up"
3. Enter email and password (min 8 characters)
4. Submit registration

### Login

1. Go to login page: `https://your-deployment.vercel.app/login`
2. Enter registered email and password
3. Click "Sign In"
4. You'll be redirected to dashboard

**Debug Tip**: If login fails, check browser console (F12) for detailed error messages.

## User Authentication

### JWT Token Flow

```
1. User submits credentials
2. Server verifies email and password (bcrypt)
3. JWT token created (7 day expiration)
4. Token stored in httpOnly cookie
5. User redirected to dashboard
```

### Cookie Security

- **httpOnly**: Cannot be accessed by JavaScript
- **Secure**: Only sent over HTTPS in production
- **SameSite**: Lax (prevents CSRF attacks)
- **Max Age**: 7 days

## Bot Connection

### Step 1: Create Admin Account
- Register on the admin panel
- Save your credentials

### Step 2: Configure Bot
- Go to "Bot Setup" page
- Enter your Telegram bot token
- Enter your admin Telegram ID
- Click "Connect Bot"

### Step 3: Integrate Your Bot Code
- Copy integration code from "Bot Integration" page
- Paste into your bot's main.js
- Update environment variables
- Restart your bot

### Step 4: Verify Connection
- Go to "Bot Setup" page
- You should see "Connected" status
- Bot is now managed from dashboard

## Dashboard Features

### Dashboard (Main)
- Bot connection status
- Quick statistics
- Recent activity
- Performance overview

### Bot Setup
- Connect bot token
- Configure admin ID
- Test connection
- View current settings

### Configuration
- Update bot prefix
- Change bot name
- Manage settings
- Save preferences

### Users
- View all users
- Ban/unban users
- Track user activity
- User statistics

### Commands
- View all commands
- Enable/disable commands
- Set command cooldowns
- Track command usage

### Commands Manager
- Interactive command interface
- Toggle commands on/off
- Adjust cooldowns
- Filter by category
- Search commands

### Analytics
- Command usage statistics
- User activity charts
- Bot performance metrics
- Daily/weekly/monthly views

### Settings
- Account preferences
- Security settings
- Notification preferences
- Theme customization

### Guide
- Getting started walkthrough
- Feature explanations
- Tips and tricks
- FAQs

### Bot Integration
- Copy-paste integration code
- Environment variables setup
- API endpoint reference
- Troubleshooting guide

## API Reference

### Authentication Endpoints

```
POST /api/auth/register
- body: { email, password }
- returns: { message, user }

POST /api/auth/login
- body: { email, password }
- returns: { message, user }

POST /api/auth/logout
- returns: { message }

GET /api/auth/check
- returns: { authenticated: boolean }
```

### Configuration Endpoints

```
GET /api/config
- returns: { bot_token, bot_prefix, bot_name, admin_id }

PUT /api/config
- body: { bot_token?, bot_prefix?, bot_name?, admin_id? }
- returns: { message, config }
```

### User Endpoints

```
GET /api/users
- returns: [{ id, user_id, banned, joined_at, last_active }]

GET /api/users/{userId}
- returns: { id, user_id, banned, activity }

POST /api/users/{userId}
- body: { banned?, status? }
- returns: { message }
```

### Command Endpoints

```
GET /api/commands
- returns: [{ name, enabled, cooldown, category }]

GET /api/commands/{commandName}
- returns: { name, enabled, cooldown }

PUT /api/commands/{commandName}
- body: { enabled?, cooldown? }
- returns: { message }
```

### Analytics Endpoints

```
GET /api/analytics
- returns: { commands, users, activity, timeline }

GET /api/stats
- returns: { total_users, banned_users, active_commands, total_commands }

GET /api/activity
- returns: [{ user_id, action, timestamp, details }]
```

## Troubleshooting

### Login Issues

**Problem**: "Fatal error during initialization"
- **Solution**: Ensure database tables are created by running the setup script

**Problem**: "Invalid email or password" when correct credentials
- **Solution**: Check browser console for detailed error messages
- Try registering a new account with different email

**Problem**: Login page keeps redirecting to dashboard
- **Solution**: Log out and try again, clear browser cache

### Bot Connection Issues

**Problem**: Bot won't connect
- **Solution**: Verify bot token is correct from @BotFather
- Ensure admin ID is your Telegram user ID (not bot ID)

**Problem**: Configuration not updating
- **Solution**: Check that bot is making API calls to admin panel
- Verify ADMIN_PANEL_URL in bot code
- Check network connectivity

**Problem**: Commands not responding
- **Solution**: Restart bot after adding integration code
- Verify command names match exactly
- Check cooldown settings

### Database Issues

**Problem**: "Cannot connect to database"
- **Solution**: Verify Neon connection string in environment variables
- Check database has tables created (run setup script)
- Ensure firewall allows database connections

**Problem**: Tables not found
- **Solution**: Run `/scripts/setup-db.sql` to create tables

## Environment Variables

```
# Database
DATABASE_URL=postgresql://user:password@host/dbname
POSTGRES_PRISMA_URL=your_neon_connection_string

# Authentication
JWT_SECRET=your-super-secret-key-change-this

# Bot Settings
NEXT_PUBLIC_BOT_NAME=YourBotName

# Deployment
NODE_ENV=production
VERCEL_URL=your-deployment-url.vercel.app
```

## Database Schema

### admins
- id (primary key)
- email (unique)
- password_hash
- created_at
- updated_at

### bot_config
- id (primary key)
- admin_id (foreign key)
- bot_token
- bot_name
- bot_prefix
- admin_id
- created_at
- updated_at

### users
- id (primary key)
- user_id (Telegram ID)
- banned
- joined_at
- last_active

### commands
- id (primary key)
- name
- enabled
- cooldown
- admin_id
- created_at
- updated_at

### activity_logs
- id (primary key)
- user_id
- action
- details
- timestamp

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** for all connections
3. **Strong Passwords** (min 8 characters, mix of types)
4. **Regular Updates** of dependencies
5. **Limit API Calls** with rate limiting
6. **Monitor Logs** for suspicious activity
7. **Backup Database** regularly

## Support & Feedback

For issues or feature requests, create an issue in the repository or contact support.

## License

MIT License - feel free to use for your projects!
