# Quick Setup Guide

## Step 1: Install Dependencies
```bash
cd asset-management
npm install
```

## Step 2: Create Supabase Project
1. Visit https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: asset-management
   - Database password: (create a strong password)
   - Region: (choose closest to you)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

## Step 3: Get Supabase Credentials
1. In your Supabase project, go to Settings > API
2. Copy these values:
   - Project URL (under "Project URL")
   - anon/public key (under "Project API keys")
   - service_role key (under "Project API keys" - keep secret!)

## Step 4: Configure Environment
1. In the asset-management folder, create `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and paste your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Set Up Database
1. In Supabase, click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open `supabase/schema.sql` in a text editor
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

## Step 6: Create Storage Bucket
1. In Supabase, click "Storage" (left sidebar)
2. Click "Create a new bucket"
3. Settings:
   - Name: `asset-images`
   - Public bucket: **YES** (toggle on)
   - File size limit: 5MB
   - Allowed MIME types: image/*
4. Click "Create bucket"

## Step 7: Add Storage Policies
1. Click on the `asset-images` bucket
2. Click "Policies" tab
3. Click "New Policy"
4. Click "Create a policy from scratch"
5. Add 3 policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'asset-images' );
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'asset-images' );
```

**Policy 3: Authenticated Delete**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'asset-images' );
```

## Step 8: Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Verify Everything Works

1. Check the homepage loads
2. Verify no console errors
3. You're ready to start building!

## Next: Build Features

Now you can start creating the asset management pages:
- `/app/assets/page.tsx` - List all assets
- `/app/assets/new/page.tsx` - Create new asset
- `/app/assets/[id]/page.tsx` - View/edit asset
- `/app/buildings/page.tsx` - List all buildings

## Troubleshooting

**"Invalid API key" error:**
- Check `.env.local` has correct values
- Restart dev server after changing .env.local

**"relation does not exist" error:**
- Run the schema.sql again in Supabase SQL Editor
- Make sure you ran ALL the SQL code

**Images not uploading:**
- Check storage bucket is public
- Verify storage policies are created
- Check browser console for errors

## Need Help?
- Check README.md for detailed documentation
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
