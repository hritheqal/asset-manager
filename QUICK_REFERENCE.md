# Quick Command Reference

## Initial Setup (Run Once)

```bash
# 1. Create Next.js app
npx create-next-app@latest asset-management-system --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint

# 2. Navigate to project
cd asset-management-system

# 3. Install dependencies
npm install @supabase/supabase-js @supabase/ssr lucide-react date-fns

# 4. Create environment file
cp .env.example .env.local
# Then edit .env.local with your Supabase credentials
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure to Create

```bash
# Create directories
mkdir -p lib/supabase
mkdir -p supabase
mkdir -p components
mkdir -p app/assets
mkdir -p app/buildings
```

## Files You Need to Create

1. **Environment Config**
   - `.env.local` (from .env.example)

2. **Supabase Setup**
   - `lib/supabase/client.ts`
   - `lib/supabase/server.ts`
   - `lib/types.ts`

3. **Database**
   - Run `database-schema.sql` in Supabase SQL Editor

4. **Next.js Config**
   - Update `next.config.js` with image domains

5. **Pages** (Next steps)
   - `app/page.tsx` (homepage - update)
   - `app/assets/page.tsx` (list assets)
   - `app/assets/new/page.tsx` (create asset)
   - `app/buildings/page.tsx` (list buildings)

## Supabase Quick Actions

### Get Credentials
1. Go to Supabase Dashboard
2. Settings > API
3. Copy Project URL and API Keys

### Run SQL
1. SQL Editor > New Query
2. Paste SQL
3. Click Run

### Create Storage Bucket
1. Storage > New Bucket
2. Name: `asset-images`
3. Public: YES
4. Create

### View Data
1. Table Editor
2. Select table
3. View/Edit rows

## Common Next.js Patterns

### Server Component (fetch data)
```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('assets').select('*')
  return <div>{/* render data */}</div>
}
```

### Client Component (interactive)
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function Component() {
  const supabase = createClient()
  // interactive logic
}
```

## Git Commands (If Using Git)

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial setup"

# Create repository on GitHub, then:
git remote add origin <your-repo-url>
git push -u origin main
```

## Vercel Deployment

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel

# Or: Push to GitHub and connect via Vercel dashboard
```

## Troubleshooting Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for updates
npm outdated

# Update a specific package
npm update <package-name>
```

## Environment Variables

### Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

### Production (Vercel)
Add same variables in Vercel Dashboard:
- Settings > Environment Variables
- Add each variable
- Deploy

## File Sizes to Watch

- Images: Keep under 5MB
- Database: Free tier = 500MB
- Storage: Free tier = 1GB

## Quick Checks

```bash
# Check Node version (need 18+)
node --version

# Check npm version
npm --version

# Check if port 3000 is available
lsof -i :3000

# Kill process on port 3000 (if needed)
kill -9 $(lsof -t -i:3000)
```

## Useful VSCode Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- GitLens

## Next.js Route Patterns

```
app/
├── page.tsx                    → /
├── assets/
│   ├── page.tsx               → /assets
│   ├── new/
│   │   └── page.tsx          → /assets/new
│   └── [id]/
│       ├── page.tsx          → /assets/123
│       └── edit/
│           └── page.tsx      → /assets/123/edit
└── api/
    └── assets/
        └── route.ts          → /api/assets
```

## Common Supabase Queries

```typescript
// Get all
const { data } = await supabase.from('assets').select('*')

// Get with filter
const { data } = await supabase
  .from('assets')
  .select('*')
  .eq('status', 'active')

// Get with relations
const { data } = await supabase
  .from('assets')
  .select('*, category:asset_categories(*), building:buildings(*)')

// Insert
const { data, error } = await supabase
  .from('assets')
  .insert({ name: 'New Asset', ... })

// Update
const { data, error } = await supabase
  .from('assets')
  .update({ status: 'maintenance' })
  .eq('id', assetId)

// Delete
const { error } = await supabase
  .from('assets')
  .delete()
  .eq('id', assetId)
```

## Upload Image to Supabase Storage

```typescript
const { data, error } = await supabase.storage
  .from('asset-images')
  .upload(`${assetId}/${file.name}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('asset-images')
  .getPublicUrl(data.path)
```

