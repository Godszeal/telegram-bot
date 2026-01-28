# Control Panel API Documentation

Complete reference for all dashboard API endpoints.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## Authentication

All protected endpoints require a valid JWT token in the `auth_token` cookie (set automatically after login).

## Auth Endpoints

### Register Admin Account
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "admin@example.com",
  "password": "securepassword"
}

Response (201):
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@example.com",
  "password": "securepassword"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}

Sets: auth_token cookie (httpOnly, secure)
```

### Check Authentication
```
GET /auth/check

Response (200):
{
  "authenticated": true
}

Response (401):
{
  "authenticated": false
}
```

### Logout
```
POST /auth/logout

Response (200):
{
  "message": "Logout successful"
}

Clears: auth_token cookie
```

---

## Configuration Endpoints

### Get Bot Configuration
```
GET /config
Authorization: Required

Response (200):
{
  "bot_token": "123456:ABC-DEF...",
  "bot_prefix": "/",
  "bot_name": "MyAwesomeBot",
  "admin_id": "123456789",
  "updated_at": "2024-01-20T10:30:00Z"
}

Response (401):
{
  "error": "Unauthorized"
}
```

### Update Bot Configuration
```
POST /config
Authorization: Required
Content-Type: application/json

Request Body:
{
  "bot_token": "123456:ABC-DEF...",
  "bot_prefix": "/",
  "bot_name": "MyAwesomeBot",
  "admin_id": "123456789"
}

Response (200):
{
  "message": "Config updated successfully",
  "config": {
    "id": "uuid",
    "bot_token": "123456:ABC-DEF...",
    "bot_prefix": "/",
    "bot_name": "MyAwesomeBot",
    "admin_id": "123456789",
    "created_at": "2024-01-15T08:00:00Z",
    "updated_at": "2024-01-20T10:30:00Z"
  }
}

Response (400):
{
  "error": "Missing required fields"
}
```

---

## User Management Endpoints

### Get Bot Users (Paginated)
```
GET /users?page=1&limit=20
Authorization: Required

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 20)

Response (200):
{
  "users": [
    {
      "id": "uuid",
      "user_id": "123456789",
      "username": "john_doe",
      "is_banned": false,
      "created_at": "2024-01-15T08:00:00Z"
    },
    {
      "id": "uuid",
      "user_id": "987654321",
      "username": "jane_doe",
      "is_banned": true,
      "created_at": "2024-01-16T09:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Ban/Unban User
```
PUT /users
Authorization: Required
Content-Type: application/json

Request Body:
{
  "user_id": "123456789",
  "is_banned": true
}

Response (200):
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "user_id": "123456789",
    "username": "john_doe",
    "is_banned": true,
    "created_at": "2024-01-15T08:00:00Z"
  }
}
```

---

## Command Management Endpoints

### Get All Commands
```
GET /commands
Authorization: Required

Response (200):
{
  "commands": [
    {
      "id": "uuid",
      "name": "help",
      "description": "Show help menu",
      "is_enabled": true,
      "usage_count": 145,
      "last_used": "2024-01-20T15:30:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "start",
      "description": "Start the bot",
      "is_enabled": true,
      "usage_count": 892,
      "last_used": "2024-01-20T16:15:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    },
    {
      "id": "uuid",
      "name": "admin",
      "description": "Admin commands",
      "is_enabled": false,
      "usage_count": 23,
      "last_used": "2024-01-19T10:00:00Z",
      "created_at": "2024-01-05T12:30:00Z"
    }
  ]
}
```

### Enable/Disable Command
```
PUT /commands
Authorization: Required
Content-Type: application/json

Request Body:
{
  "command_id": "uuid",
  "is_enabled": false
}

Response (200):
{
  "message": "Command updated successfully",
  "command": {
    "id": "uuid",
    "name": "admin",
    "description": "Admin commands",
    "is_enabled": false,
    "usage_count": 23,
    "last_used": "2024-01-19T10:00:00Z",
    "created_at": "2024-01-05T12:30:00Z"
  }
}
```

---

## Statistics Endpoints

### Get Bot Statistics
```
GET /stats
Authorization: Required

Response (200):
{
  "users": {
    "total": 245,
    "banned": 5,
    "active": 240
  },
  "commands": {
    "total": 35,
    "enabled": 32,
    "disabled": 3
  },
  "topCommands": [
    {
      "name": "help",
      "usage_count": 145
    },
    {
      "name": "start",
      "usage_count": 892
    },
    {
      "name": "weather",
      "usage_count": 67
    },
    {
      "name": "ping",
      "usage_count": 234
    },
    {
      "name": "about",
      "usage_count": 89
    }
  ],
  "activity": [
    {
      "date": "2024-01-14",
      "count": 156
    },
    {
      "date": "2024-01-15",
      "count": 203
    },
    {
      "date": "2024-01-16",
      "count": 189
    },
    {
      "date": "2024-01-17",
      "count": 267
    },
    {
      "date": "2024-01-18",
      "count": 245
    },
    {
      "date": "2024-01-19",
      "count": 198
    },
    {
      "date": "2024-01-20",
      "count": 212
    }
  ]
}
```

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production using tools like:
- express-rate-limit
- Redis-based rate limiting
- API Gateway rate limiting

---

## Webhook Integration (Future)

For real-time updates, consider implementing webhooks:

```
POST /webhooks
Authorization: Required
Content-Type: application/json

Request Body:
{
  "event": "command_disabled",
  "webhook_url": "https://your-server.com/webhooks/commands",
  "events": [
    "command_enabled",
    "command_disabled",
    "user_banned",
    "user_unbanned",
    "config_updated"
  ]
}
```

---

## Integration Examples

### JavaScript/Node.js
```javascript
// Get config
const response = await fetch('/api/config', {
  method: 'GET',
  credentials: 'include' // Include cookies for auth
});
const config = await response.json();

// Update config
await fetch('/api/config', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    bot_token: 'new-token',
    bot_prefix: '/',
    bot_name: 'MyBot',
    admin_id: '123456'
  })
});

// Get users
const usersResponse = await fetch('/api/users?page=1&limit=20', {
  credentials: 'include'
});
const usersData = await usersResponse.json();
```

### cURL
```bash
# Get config
curl -H "Cookie: auth_token=YOUR_TOKEN" \
  http://localhost:3000/api/config

# Update config
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -d '{
    "bot_token": "new-token",
    "bot_prefix": "/",
    "bot_name": "MyBot",
    "admin_id": "123456"
  }' \
  http://localhost:3000/api/config

# Get statistics
curl -H "Cookie: auth_token=YOUR_TOKEN" \
  http://localhost:3000/api/stats
```

### Python
```python
import requests

session = requests.Session()

# Login
login_response = session.post('http://localhost:3000/api/auth/login', json={
    'email': 'admin@example.com',
    'password': 'password'
})

# Get config
config = session.get('http://localhost:3000/api/config').json()

# Update config
session.post('http://localhost:3000/api/config', json={
    'bot_token': 'new-token',
    'bot_prefix': '/',
    'bot_name': 'MyBot',
    'admin_id': '123456'
})

# Get stats
stats = session.get('http://localhost:3000/api/stats').json()
```

---

## Best Practices

1. **Always use HTTPS in production** - Protect authentication tokens
2. **Validate input** - Check for required fields and data types
3. **Handle errors gracefully** - Implement proper error handling
4. **Cache responses** - Reduce database load with caching
5. **Rate limit** - Prevent abuse and DoS attacks
6. **Log requests** - Track API usage for debugging
7. **Use environment variables** - Never hardcode credentials
8. **Test thoroughly** - Test all endpoints before deployment

---

## Versioning

Current API Version: **1.0.0**

Future versions will maintain backward compatibility or include a version prefix (e.g., `/api/v2/...`)
