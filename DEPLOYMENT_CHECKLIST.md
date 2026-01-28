# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved (`npm run build` passes)
- [ ] No console.log debug statements left
- [ ] Comments added for complex logic
- [ ] Unused imports removed
- [ ] No hardcoded values (use environment variables)

### Security
- [ ] JWT_SECRET is at least 32 characters long
- [ ] DATABASE_URL uses secure connection (postgresql:// or postgresqls://)
- [ ] No sensitive data in code or comments
- [ ] CORS headers properly configured
- [ ] Rate limiting considered for API routes
- [ ] Input validation on all endpoints

### Database
- [ ] PostgreSQL database created and accessible
- [ ] Migration script (`scripts/init-db.sql`) executed
- [ ] All tables created successfully
- [ ] Database backups configured (especially important on Neon)
- [ ] Connection string tested locally

### Environment Variables
- [ ] `.env.local` file created with all required variables
- [ ] DATABASE_URL verified to work
- [ ] JWT_SECRET is secure and unique
- [ ] NODE_ENV set to production
- [ ] No credentials committed to Git

### Testing
- [ ] Admin registration works
- [ ] Login/logout works
- [ ] Dashboard loads without errors
- [ ] Can update bot configuration
- [ ] Users list displays correctly
- [ ] Commands can be enabled/disabled
- [ ] Statistics display correctly
- [ ] All API endpoints tested with authentication
- [ ] Error handling works properly

## Local Deployment

### Final Build
```bash
# Clear cache
rm -rf .next node_modules package-lock.json

# Reinstall dependencies
npm install

# Build the project
npm run build

# Test the build locally
npm start
```

- [ ] Build completes without warnings
- [ ] No errors during build process
- [ ] Application starts successfully
- [ ] Dashboard accessible at http://localhost:3000
- [ ] All features work in production mode

## Vercel Deployment

### GitHub Setup
- [ ] Repository is public or configured on GitHub
- [ ] All code is committed and pushed
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] Main branch is stable

### Vercel Configuration
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "Add New..." > "Project"
4. Select your repository
5. Configure project settings:
   - [ ] Framework: Next.js (auto-detected)
   - [ ] Build command: `npm run build`
   - [ ] Start command: `npm start`
   - [ ] Install command: `npm ci`

### Environment Variables in Vercel
- [ ] Go to Project Settings > Environment Variables
- [ ] Add `DATABASE_URL` (PostgreSQL connection string)
- [ ] Add `JWT_SECRET` (unique, 32+ characters)
- [ ] Add `NODE_ENV` = `production`
- [ ] Variables are set for Production environment

### Pre-Deployment Preview
- [ ] Deploy to Preview first (automatic on PR)
- [ ] Test login/registration
- [ ] Test configuration update
- [ ] Test user management
- [ ] Check for errors in logs

### Production Deployment
- [ ] Merge to main branch
- [ ] Vercel auto-deploys
- [ ] Check Vercel dashboard for successful build
- [ ] Visit production URL and verify functionality

## Post-Deployment

### Verification
- [ ] Website loads without errors
- [ ] Admin registration still works
- [ ] Login with credentials works
- [ ] Dashboard displays correctly
- [ ] All pages load properly
- [ ] API endpoints respond correctly
- [ ] Database connection works

### User-Facing
- [ ] Create a test admin account
- [ ] Test the complete user flow
- [ ] Update bot token in configuration
- [ ] Ban a test user
- [ ] Disable a test command
- [ ] Check statistics display

### Monitoring
- [ ] Check Vercel logs for errors
- [ ] Monitor error rate
- [ ] Check database connection status
- [ ] Review API response times

### Security Post-Deploy
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Secure cookies are being set
- [ ] No sensitive data in error messages
- [ ] Rate limiting is in place (if implemented)

## Domain Setup

If using a custom domain:
- [ ] Domain DNS configured
- [ ] SSL certificate active
- [ ] HTTPS enforced
- [ ] Redirect www to non-www (or vice versa)

## Bot Integration

After dashboard is live:
- [ ] Update bot `main.js` to connect to dashboard database
- [ ] Test bot can read configuration from database
- [ ] Test bot respects ban list from dashboard
- [ ] Test bot respects command enable/disable
- [ ] Deploy updated bot to production

## Monitoring & Maintenance

### Daily Checks
- [ ] Dashboard is responding
- [ ] No error emails/notifications
- [ ] Database is responsive
- [ ] No unusual traffic patterns

### Weekly Checks
- [ ] Review logs for errors
- [ ] Check database size
- [ ] Verify backups are running
- [ ] Check user activity

### Monthly Checks
- [ ] Review usage statistics
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Optimize database if needed

## Rollback Plan

If something goes wrong:
1. Check Vercel logs for error details
2. Check database connectivity
3. Verify environment variables are correct
4. Review recent code changes
5. Rollback to previous deployment if needed

```bash
# Rollback on Vercel
# In Vercel dashboard: Deployments > Select previous > Click "..." > Promote to Production
```

## Disaster Recovery

### Database Backup
- [ ] Neon automatic backups enabled
- [ ] Manual backup schedule configured
- [ ] Test restore procedure

### Code Backup
- [ ] Repository mirrored to GitHub
- [ ] Regular commits with meaningful messages
- [ ] Version tags for releases

## Scaling Considerations

For high-traffic deployments:
- [ ] Database read replicas considered
- [ ] API response caching implemented
- [ ] CDN for static assets
- [ ] Rate limiting implemented
- [ ] Load testing performed

## Documentation

Before going live:
- [ ] Update QUICK_START.md with production URL
- [ ] Document custom configurations
- [ ] Create admin account documentation
- [ ] Document bot integration steps
- [ ] Create monitoring alert thresholds

## Team Communication

- [ ] Notify team of deployment schedule
- [ ] Document deployment procedure
- [ ] Create incident response plan
- [ ] Document rollback procedure
- [ ] Share login credentials securely

## Final Checklist

```
Production Deployment Readiness:
[ ] Code reviewed and tested
[ ] Environment variables set
[ ] Database verified and backed up
[ ] HTTPS enabled
[ ] Monitoring configured
[ ] Team notified
[ ] Rollback plan ready
[ ] Documentation complete
[ ] Go-live approval obtained
```

---

## Common Issues & Solutions

### Issue: "Database connection refused"
**Solution:** Verify DATABASE_URL in environment variables, check Neon dashboard

### Issue: "JWT_SECRET is invalid"
**Solution:** Regenerate JWT_SECRET (32+ random characters), update in Vercel

### Issue: "Login fails but registration works"
**Solution:** Check database has admins table, verify bcrypt is installed

### Issue: "Static assets not loading"
**Solution:** Check public folder permissions, verify Next.js build

### Issue: "API returns 401 Unauthorized"
**Solution:** Check auth token cookie is being set, verify JWT_SECRET matches

---

## Deployment Success!

Once all checks pass:
1. Your dashboard is live in production
2. Announce the deployment to your team
3. Monitor for the first 24 hours
4. Begin integrating your bot if not done
5. Celebrate! 🎉

**Deployment Date:** ___________

**Deployed By:** ___________

**Notes:** ___________________________________________________________

---

For questions, refer back to:
- QUICK_START.md
- DASHBOARD_README.md
- BOT_INTEGRATION_GUIDE.md
- API_DOCUMENTATION.md
