# Troubleshooting & FAQ

## Common Issues & Solutions

### Authentication Issues

#### Q: "Fatal error during initialization" when opening app
**A:** This error is usually from the bot's main.js trying to connect, not the Next.js app.
- **Solution**: Ensure your bot token and database URL are correct
- Check if Neon database is accessible
- The web panel should still work - try refreshing

#### Q: Login page loads but "Sign In" button doesn't work
**A:** Check browser console (F12) for detailed errors.
- **Solution**: 
  - Verify email exists in database (register if not)
  - Check password is exactly correct
  - Try clearing cache and cookies
  - Check if database connection is working

#### Q: After login, redirected back to login page
**A:** JWT token is invalid or expired.
- **Solution**:
  - Sign out and sign in again
  - Clear browser cookies
  - Check JWT_SECRET environment variable matches
  - Try registering with a new account

#### Q: "Email already exists" when registering
**A:** Email is already registered in database.
- **Solution**:
  - Use different email
  - Reset password if you forgot it (use /api/auth/reset)
  - Contact admin if account locked

### Bot Connection Issues

#### Q: Bot won't connect - "failed to load bot status"
**A:** Bot token or admin ID is incorrect.
- **Solution**:
  1. Get bot token from @BotFather (should start with numbers:)
  2. Get admin ID from @userinfobot (should be a number)
  3. Re-enter both in Bot Setup page
  4. Click "Connect Bot" button
  5. Wait 10-15 seconds for connection

#### Q: Bot connected but configuration not updating
**A:** Bot code doesn't have integration code yet.
- **Solution**:
  - Go to "Bot Integration" page
  - Copy integration code
  - Paste into your main.js (after bot connection)
  - Restart bot
  - It should sync within 1-2 minutes

#### Q: Commands not being managed from panel
**A:** Bot might not be checking command state from API.
- **Solution**:
  - Copy command state check code from "Bot Integration"
  - Add to your command handler
  - Restart bot
  - Test by disabling command in Commands Manager

### Database Issues

#### Q: "Cannot connect to database" error
**A:** Database connection string is invalid or database is down.
- **Solution**:
  - Check DATABASE_URL in environment variables
  - Verify Neon database is running at neon.tech
  - Try reconnecting to Neon
  - Check firewall isn't blocking connection

#### Q: "Table not found" errors
**A:** Database tables haven't been created.
- **Solution**:
  1. Get your database connection string
  2. Connect to database via Neon console
  3. Run SQL script from `/scripts/setup-db.sql`
  4. Verify tables were created
  5. Refresh the app

#### Q: Admin account can't be created during registration
**A:** Database table structure issue.
- **Solution**:
  - Check if `admins` table exists
  - Run setup script to create all tables
  - Clear any corrupt entries
  - Try registering again with different email

### Performance Issues

#### Q: Dashboard loads slowly
**A:** Could be database or API response time.
- **Solution**:
  - Check internet connection
  - Try in incognito mode (clear cache)
  - Check database connection is stable
  - Reduce number of active users

#### Q: Commands Manager lags when filtering
**A:** Too many commands to render.
- **Solution**:
  - Clear browser cache
  - Close other tabs
  - Use search to narrow down commands
  - Commands are stored in localStorage

### Mobile Issues

#### Q: Mobile menu doesn't work
**A:** Touch events not properly handled.
- **Solution**:
  - Try refreshing page
  - Make sure device is in portrait mode
  - Clear cache and reload
  - Try landscape mode

#### Q: Text too small on mobile
**A:** Viewport settings might be wrong.
- **Solution**:
  - Try pinch to zoom
  - Rotate device
  - Check device zoom level (set to 100%)
  - Try different browser

## Setup Verification Checklist

- [ ] Neon database created and connected
- [ ] Database setup script executed
- [ ] JWT_SECRET environment variable set
- [ ] Admin account registered successfully
- [ ] Can login to dashboard
- [ ] Bot token added in "Bot Setup"
- [ ] Admin ID added in "Bot Setup"
- [ ] Bot connection status shows "Connected"
- [ ] Integration code added to bot's main.js
- [ ] Bot restarted after adding integration code
- [ ] Can see bot status in dashboard
- [ ] At least one command visible in Commands page
- [ ] Can toggle commands on/off
- [ ] User management page loads
- [ ] Analytics page shows data

## Debug Mode

To enable detailed logging:

### In Browser (Client-side):
1. Open DevTools (F12)
2. Go to Console tab
3. You'll see `[v0]` prefixed logs
4. Filter console by `[v0]` for v0 specific logs

### In Server (Server-side):
Check deployment logs:
- **Vercel**: Dashboard → Logs → Function logs
- **Local**: Terminal output from Next.js dev server
- **Server logs**: Look for `[v0]` prefixed messages

## Testing Commands

### Test Login/Registration API
```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Bot Connection API
```bash
# Test config get
curl -X GET http://localhost:3000/api/config \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"

# Test config update
curl -X PUT http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN" \
  -d '{"bot_prefix":"/","bot_name":"MyBot"}'
```

## Performance Tips

1. **Reduce API calls**: Cache data in localStorage when possible
2. **Lazy load pages**: Don't load all data on dashboard load
3. **Optimize queries**: Use indexes on frequently queried columns
4. **Compress assets**: Vercel does this automatically
5. **CDN cache**: Use Vercel Edge Functions for static content

## Security Tips

1. **Change JWT_SECRET** in production (NOT in code!)
2. **Use strong passwords**: Mix of upper, lower, numbers, symbols
3. **Update dependencies**: Run `npm update` regularly
4. **Monitor logs**: Check for unusual activity
5. **Rate limit API**: Prevent brute force attacks
6. **Use HTTPS**: Always use secure connections
7. **Backup data**: Regular database backups

## Contact Support

If issues persist:
1. Check browser console for errors (F12)
2. Check server logs (Vercel dashboard)
3. Review this troubleshooting guide
4. Check GitHub issues/discussions
5. Create new issue with error message and steps to reproduce

Remember: Most errors have clear messages! Read them carefully and check the solution above.
