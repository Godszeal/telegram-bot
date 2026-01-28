# System Architecture

Complete technical architecture of the Telegram Bot Control Panel.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Browser (React/Next.js Frontend)            │   │
│  │  - Login/Register Pages                             │   │
│  │  - Dashboard (Stats, Status)                         │   │
│  │  - Configuration Page                               │   │
│  │  - Users Management                                 │   │
│  │  - Commands Management                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Next.js)                        │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Next.js API Routes                        │    │
│  │  /api/auth/* - Authentication                      │    │
│  │  /api/config - Bot Configuration                   │    │
│  │  /api/users - User Management                      │    │
│  │  /api/commands - Command Management                │    │
│  │  /api/stats - Statistics                           │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Middleware (Authentication, Authorization)         │    │
│  │  - JWT Token Verification                          │    │
│  │  - Route Protection                                │    │
│  │  - Error Handling                                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓ Secure Connection
┌─────────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL)                     │
│  ┌────────────────────────────────────────────────────┐    │
│  │           Database Tables                          │    │
│  │  - admins (User accounts)                          │    │
│  │  - bot_config (Configuration)                      │    │
│  │  - bot_users (User management)                     │    │
│  │  - commands (Command status)                       │    │
│  │  - command_logs (Usage tracking)                   │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓ Queries
┌─────────────────────────────────────────────────────────────┐
│              Bot Layer (Your Telegram Bot)                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │      main.js - Bot Implementation                  │    │
│  │  - Query bot_config for settings                   │    │
│  │  - Check user bans                                 │    │
│  │  - Verify command status                           │    │
│  │  - Log command usage                               │    │
│  │  - Update user information                         │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Authentication Flow

```
User Registration/Login
        │
        ↓
   ┌─────────────────┐
   │ Frontend Form   │
   │ (email, pass)   │
   └────────┬────────┘
            ↓
   ┌─────────────────────────┐
   │ API Route               │
   │ /api/auth/register      │
   │ /api/auth/login         │
   └────────┬────────────────┘
            ↓
   ┌─────────────────────────┐
   │ Verify Credentials      │
   │ Hash Password (bcrypt)  │
   │ Compare with DB         │
   └────────┬────────────────┘
            ↓
   ┌─────────────────────────┐
   │ Generate JWT Token      │
   │ Set Secure Cookie       │
   └────────┬────────────────┘
            ↓
   ┌─────────────────────────┐
   │ Redirect to Dashboard   │
   │ User Can Now Use Panel  │
   └─────────────────────────┘
```

### 2. Bot Configuration Update Flow

```
Admin in Dashboard
        │
        ↓
   ┌──────────────────────┐
   │ Configuration Form   │
   │ - Bot Token          │
   │ - Prefix             │
   │ - Name               │
   │ - Admin ID           │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────┐
   │ POST /api/config     │
   │ (with auth token)    │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────────────┐
   │ Verify Authentication         │
   │ Validate Input                │
   │ Update Database Record        │
   └──────────┬───────────────────┘
              ↓
   ┌──────────────────────────────┐
   │ bot_config Table Updated      │
   │ New config available          │
   └──────────┬───────────────────┘
              ↓
   ┌──────────────────────────────┐
   │ Bot Queries Database          │
   │ Loads Latest Configuration    │
   │ (polling or on-demand)        │
   └──────────┬───────────────────┘
              ↓
   ┌──────────────────────────────┐
   │ Bot Uses New Config           │
   │ No Restart Needed!            │
   └──────────────────────────────┘
```

### 3. User Ban Management Flow

```
Admin Clicks Ban on User
        │
        ↓
   ┌──────────────────────┐
   │ UsersList Component  │
   │ Click Ban Button     │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────┐
   │ PUT /api/users       │
   │ {user_id, is_banned} │
   └──────────┬───────────┘
              ↓
   ┌──────────────────────────────┐
   │ Verify Authentication         │
   │ Update bot_users.is_banned    │
   └──────────┬───────────────────┘
              ↓
   ┌──────────────────────────────┐
   │ Database Updated              │
   │ User marked as banned         │
   └──────────┬───────────────────┘
              ↓
   ┌──────────────────────────────┐
   │ Next User Interaction         │
   │ Bot Checks Ban Status         │
   │ Rejects Command/Message       │
   └──────────────────────────────┘
```

### 4. Command Status & Statistics Flow

```
User Uses Command in Telegram
        │
        ↓
   ┌───────────────────────┐
   │ Bot Receives Message  │
   │ Extracts Command      │
   └───────────┬───────────┘
               ↓
   ┌───────────────────────────────┐
   │ Query Database:               │
   │ SELECT is_enabled FROM        │
   │ commands WHERE name = 'cmd'   │
   └───────────┬───────────────────┘
               ↓
   ┌───────────────────────┐
   │ Command Enabled?      │
   └───────────┬───────────┘
      Yes ↓         ↓ No
        │        Reject
        │        Return
        │
   ┌────────────────────────────┐
   │ Execute Command            │
   │ Update Usage Statistics    │
   │ Log Execution              │
   └────────────┬───────────────┘
                ↓
   ┌───────────────────────────┐
   │ Database Update:          │
   │ commands.usage_count++    │
   │ command_logs INSERT       │
   └────────────┬──────────────┘
                ↓
   ┌───────────────────────────┐
   │ Dashboard Shows:          │
   │ Updated Statistics        │
   │ Usage Trends              │
   │ Command Popularity        │
   └───────────────────────────┘
```

## Database Schema

```
┌──────────────────────────────────┐
│          admins                   │
├──────────────────────────────────┤
│ id (UUID, PK)                    │
│ email (VARCHAR, UNIQUE)          │
│ password_hash (VARCHAR)          │
│ created_at (TIMESTAMP)           │
│ updated_at (TIMESTAMP)           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│       bot_config                  │
├──────────────────────────────────┤
│ id (UUID, PK)                    │
│ bot_token (VARCHAR)              │
│ bot_prefix (VARCHAR)             │
│ bot_name (VARCHAR)               │
│ admin_id (VARCHAR)               │
│ created_at (TIMESTAMP)           │
│ updated_at (TIMESTAMP)           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│       bot_users                   │
├──────────────────────────────────┤
│ id (UUID, PK)                    │
│ user_id (BIGINT, UNIQUE)         │
│ username (VARCHAR, NULLABLE)     │
│ first_name (VARCHAR, NULLABLE)   │
│ last_name (VARCHAR, NULLABLE)    │
│ is_banned (BOOLEAN, DEFAULT: f)  │
│ created_at (TIMESTAMP)           │
│ updated_at (TIMESTAMP)           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│        commands                   │
├──────────────────────────────────┤
│ id (UUID, PK)                    │
│ name (VARCHAR, UNIQUE)           │
│ description (TEXT, NULLABLE)     │
│ is_enabled (BOOLEAN, DEFAULT: t) │
│ usage_count (INTEGER, DEFAULT: 0)│
│ last_used (TIMESTAMP, NULLABLE)  │
│ created_at (TIMESTAMP)           │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│      command_logs                 │
├──────────────────────────────────┤
│ id (UUID, PK)                    │
│ command_id (UUID, FK)            │
│ user_id (BIGINT)                 │
│ executed_at (TIMESTAMP)          │
│ status (VARCHAR, NULLABLE)       │
│ error_message (TEXT, NULLABLE)   │
└──────────────────────────────────┘
```

## Authentication & Authorization

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": "admin-uuid",
  "email": "admin@example.com",
  "iat": 1234567890,
  "exp": 1234654290  // 7 days
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

### Authorization Flow

```
Request → Check auth_token Cookie
    │
    ├─ No Token → 401 Unauthorized
    │
    ├─ Invalid Token → 401 Unauthorized
    │
    └─ Valid Token
        │
        ├─ Verify Signature
        │
        ├─ Check Expiration
        │
        └─ Allow Request → Process API Call
```

## File Organization

```
Frontend Layer:
├── app/(auth)/ - Authentication pages
├── app/dashboard/ - Main dashboard
├── components/dashboard/ - UI components
└── lib/ - Utilities & middleware

Backend Layer:
├── app/api/auth/ - Auth endpoints
├── app/api/config/ - Config endpoint
├── app/api/users/ - Users endpoint
├── app/api/commands/ - Commands endpoint
├── app/api/stats/ - Stats endpoint
└── lib/auth-middleware.ts - Auth verification

Data Layer:
├── PostgreSQL (Neon)
└── scripts/init-db.sql - Schema

Configuration:
├── .env.local - Secrets
├── next.config.mjs - Next.js config
├── tailwind.config.ts - Styling
└── tsconfig.json - TypeScript

Documentation:
├── README.md - Project overview
├── QUICK_START.md - Getting started
├── DOCUMENTATION_INDEX.md - Doc guide
├── API_DOCUMENTATION.md - API reference
├── BOT_INTEGRATION_GUIDE.md - Bot setup
└── DEPLOYMENT_CHECKLIST.md - Deployment
```

## Component Tree

```
RootLayout
├── page.tsx (Redirect)
└── (auth) Group
    ├── login/page.tsx
    │   └── LoginPage Component
    └── register/page.tsx
        └── RegisterPage Component

Dashboard Group
└── DashboardLayout
    ├── Sidebar Navigation
    ├── Mobile Header
    └── Main Content
        ├── page.tsx (Dashboard)
        │   ├── StatsOverview
        │   │   ├── StatCard x5
        │   │   └── Activity Chart
        │   └── BotStatus
        ├── config/page.tsx
        │   └── BotConfigForm
        ├── users/page.tsx
        │   └── UsersList
        │       └── UserRow x Many
        └── commands/page.tsx
            └── CommandsList
                └── CommandCard x Many
```

## Middleware Chain

```
Request
    ↓
nextjs Middleware (middleware.ts)
    ├─ Public Route? → Allow
    ├─ Auth Route? → Allow
    ├─ Protected Route? → Check Token
    │   ├─ Valid? → Allow
    │   └─ Invalid? → 401 Unauthorized
    └─ API Route? → Check Token
        ├─ Valid? → Allow
        └─ Invalid? → 401 Unauthorized
```

## Performance Optimization

```
Frontend Optimization:
├── Code Splitting (per page)
├── Image Optimization (Next.js Image)
├── CSS Minification (Tailwind)
└── JavaScript Bundling (Turbopack)

Backend Optimization:
├── Parameterized Queries (prevent SQL injection)
├── Connection Pooling (Neon)
├── Indexed Queries (on frequently searched columns)
└── Pagination (for large datasets)

Caching Strategy:
├── Browser Cache (static assets)
├── API Cache (responses)
└── Database Query Cache (within request)
```

## Scaling Strategy

For high-traffic deployments:

```
Current Architecture:
Client → Next.js Server → PostgreSQL

Scaled Architecture:
Clients → CDN (static assets)
    ↓
Vercel Edge Functions
    ↓
Multiple Next.js Instances
    ↓
Load Balancer
    ↓
PostgreSQL with Read Replicas
    ↓
Cache Layer (Redis, optional)
```

## Security Layers

```
Layer 1: Network Level
├── HTTPS/TLS
├── Secure Cookies
└── CORS Headers

Layer 2: Application Level
├── Input Validation
├── JWT Authentication
├── SQL Injection Prevention
└── XSS Protection

Layer 3: Data Level
├── Password Hashing (bcrypt)
├── Parameterized Queries
├── Environment Variables
└── Field-Level Encryption (optional)
```

## Error Handling

```
Error Occurrence
    ↓
Error Type Detection
├─ 4xx Errors (Client)
│   ├─ 400 Bad Request
│   ├─ 401 Unauthorized
│   └─ 404 Not Found
├─ 5xx Errors (Server)
│   ├─ 500 Server Error
│   └─ 503 Service Unavailable
└─ Network Errors
    ├─ Timeout
    └─ Connection Lost
    ↓
Log Error
    ↓
Return Error Response
    ↓
Display in Frontend
```

---

**Note**: This architecture supports horizontal scaling by deploying multiple instances behind a load balancer, with PostgreSQL as the central data store.
