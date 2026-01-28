# Telegram Bot Control Panel

A modern web-based dashboard to manage your Telegram bot without redeployment. Features include bot configuration, user management, command controls, and statistics.

## Features

- 🔐 **Admin Authentication** - Secure login system with JWT tokens
- ⚙️ **Bot Configuration** - Update bot token, prefix, name, and admin ID without redeployment
- 👥 **User Management** - View users, ban/unban functionality
- 🎮 **Command Management** - Enable/disable commands, view usage statistics
- 📊 **Statistics Dashboard** - Real-time stats on users, commands, and bot activity
- 🎨 **Modern UI** - Clean, dark-themed dashboard built with Next.js and Tailwind CSS

## Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (using Neon)
- Telegram Bot Token (from @BotFather)

## Installation

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file with your database URL and JWT secret:

```env
DATABASE_URL=postgresql://user:password@neon.tech/dbname
JWT_SECRET=your-super-secret-key-min-32-chars
NODE_ENV=development
```

### 3. Initialize Database

The database migration script (`scripts/init-db.sql`) creates all necessary tables:
- `admins` - Admin users for dashboard access
- `bot_config` - Bot configuration (token, prefix, etc.)
- `bot_users` - Bot users with ban status
- `commands` - Available commands and their status
- `command_logs` - Command usage tracking

Ensure the migration is executed before running the application.

### 4. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm run start
```

**Run Both Bot and Dashboard:**
```bash
npm run dev:all
```

## Usage

### First Time Setup

1. Navigate to `http://localhost:3000` (development) or your deployed URL
2. You'll be redirected to the login page
3. Click "Register here" to create your admin account
4. Log in with your credentials
5. Go to Configuration and add your bot token, prefix, and admin ID

### Dashboard Sections

#### Dashboard (Overview)
- View quick statistics about users and commands
- Check bot configuration status
- Monitor total active users and commands

#### Configuration
- Set/update bot token
- Change command prefix
- Update bot name
- Set admin user ID

#### Users
- View all bot users with join dates
- Ban/unban users as needed
- Paginated user list

#### Commands
- View all available commands
- Enable/disable commands
- Check usage statistics per command
- Filter by enabled/disabled status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new admin account
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/check` - Verify authentication status
- `POST /api/auth/logout` - Logout

### Bot Management
- `GET /api/config` - Get current bot configuration
- `POST /api/config` - Update bot configuration
- `GET /api/stats` - Get bot statistics
- `GET /api/users` - Get bot users (paginated)
- `PUT /api/users` - Ban/unban user
- `GET /api/commands` - Get all commands
- `PUT /api/commands` - Enable/disable command

## Security Considerations

1. **JWT Secret** - Change the default JWT secret in production
2. **HTTPS** - Always use HTTPS in production
3. **Bot Token** - Never commit bot tokens to version control
4. **Admin Accounts** - Create strong passwords for admin accounts
5. **Database** - Use environment variables for database credentials

## Integrating with Your Bot

Your bot (`main.js`) can now query the dashboard database for:
- Bot configuration (token, prefix, admin ID)
- Enabled/disabled commands
- User ban status
- Command usage statistics

Example integration:
```javascript
const config = await db.query('SELECT * FROM bot_config LIMIT 1');
const isBanned = await db.query('SELECT is_banned FROM bot_users WHERE user_id = $1', [userId]);
const commandStatus = await db.query('SELECT is_enabled FROM commands WHERE name = $1', [commandName]);
```

## Deployment

### Deploy to Vercel

1. Push your repository to GitHub
2. Go to vercel.com and import your repository
3. Add environment variables: `DATABASE_URL` and `JWT_SECRET`
4. Deploy

### Deploy Elsewhere

1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Set environment variables on your server
4. Run: `npm start`

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check if Neon PostgreSQL is running
- Ensure migrations have been executed

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET matches production environment
- Verify email exists in `admins` table

### Commands Not Updating
- Ensure your bot queries the `commands` table
- Check command cache in your bot
- Restart bot after enabling/disabling commands

## Support & Contributing

For issues or feature requests, please open an issue in the repository.

## License

ISC
