# SPARTA DBKL - Deployment Guide

## Production Build Status
Build completed successfully on $(date '+%Y-%m-%d %H:%M:%S')

## Quick Start

### 1. Install Dependencies
```bash
cd asset-management-system
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Build Application
```bash
npm run build
```

### 4. Start Production Server
```bash
npm start
```

Application will be available at: **http://localhost:3000**

## Production Deployment Options

### Option A: PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "sparta-dbkl" -- start

# Save configuration
pm2 save

# Setup auto-start
pm2 startup
```

### Option B: Custom Port
```bash
PORT=8080 npm start
```

### Option C: Background Process
```bash
nohup npm start > app.log 2>&1 &
```

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Memory**: Minimum 512MB RAM
- **Storage**: Minimum 1GB free space

## Build Output

The build creates the following structure:
```
.next/
├── static/          # Static assets
├── server/          # Server-side code
├── cache/           # Build cache
└── ...
```

## Routes Summary

### Static Pages (Pre-rendered)
- `/` - Dashboard
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/spartav2` - SPARTA V2 Landing
- `/sparta` - SPARTA Records
- `/sparta/da5` - DA5 Form
- `/sparta/da6` - DA6 Form
- `/assets/new` - New Asset Form
- `/buildings/new` - New Building Form

### Dynamic Pages (Server-rendered)
- `/assets` - Assets list with filters
- `/assets/[id]` - Asset detail
- `/buildings` - Buildings list
- `/buildings/[id]` - Building detail
- `/sparta/da5record/[id]` - DA5 Record detail
- `/sparta/da6record/[id]` - DA6 Record detail

## Database Requirements

Ensure these Supabase tables are created:
- `assets` - Asset inventory
- `buildings` - Building information
- `building_floors` - Floor details
- `building_blocks` - Block details
- `da5_registrations` - DA5 form submissions
- `da6_registrations` - DA6 form submissions
- `users` - User accounts
- `officers` - Authorizing officers
- `finish_types` - Building finish types

## Security Features Implemented

- Security headers (XSS, CSRF, Clickjacking protection)
- Content Security Policy
- HTTPS enforcement ready
- Input validation
- SQL injection prevention via Supabase RLS

## Performance Optimizations

- Static page generation where possible
- Image optimization
- Code splitting
- React Compiler enabled
- Package optimization for lucide-react

## Troubleshooting

### Build fails
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port already in use
```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>
```

### Environment variables not loading
- Ensure `.env.local` is in the project root
- Restart the server after changes
- Check file permissions

## Support

For deployment issues:
- Email: support@dbkl.gov.my
- Check logs: `npm start 2>&1 | tee app.log`

---
Generated: $(date '+%Y-%m-%d %H:%M:%S')
Version: 2.0
