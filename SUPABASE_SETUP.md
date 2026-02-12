# Supabase Setup Guide

Complete guide to setting up Supabase for your Asset Management System.

## Part 1: Create Supabase Project

### Step 1: Sign Up / Log In
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email

### Step 2: Create New Project
1. Click "New Project"
2. Fill in the details:
   - **Name:** `asset-management` (or your preferred name)
   - **Database Password:** Create a strong password (save it somewhere safe!)
   - **Region:** Choose the closest region to your users
   - **Pricing Plan:** Free (sufficient for development)
3. Click "Create new project"
4. ⏱️ Wait 2-3 minutes while your project provisions

### Step 3: Get Your API Credentials
1. Once the project is ready, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see these important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
   
   **API Keys:**
   - `anon` / `public` key (safe to use in browser)
   - `service_role` key (⚠️ KEEP SECRET - never expose in frontend)

4. Copy these values to your `.env.local` file:

```bash
# In your project root, edit .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

---

## Part 2: Set Up Database Tables

### Step 1: Open SQL Editor
1. In your Supabase dashboard, click **SQL Editor** (in the sidebar)
2. Click **New Query**

### Step 2: Run Database Schema
1. Open the `database-schema.sql` file (provided separately)
2. Copy **ALL** the SQL code
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl/Cmd + Enter)
5. ✅ You should see "Success. No rows returned"

This creates:
- 5 database tables (buildings, assets, categories, images, maintenance_logs)
- Relationships between tables
- Indexes for performance
- Automatic timestamp updates
- 7 pre-populated asset categories
- Row Level Security policies

### Step 3: Verify Tables Were Created
1. Click **Table Editor** in the sidebar
2. You should see these tables:
   - `buildings`
   - `assets`
   - `asset_categories` (with 7 sample categories)
   - `asset_images`
   - `maintenance_logs`

---

## Part 3: Set Up Image Storage

### Step 1: Create Storage Bucket
1. Click **Storage** in the sidebar
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name:** `asset-images`
   - **Public bucket:** ✅ **YES** (toggle ON)
   - **File size limit:** `5 MB`
   - **Allowed MIME types:** `image/*`
4. Click **Create bucket**

### Step 2: Configure Storage Policies
Storage policies control who can upload, view, and delete images.

1. Click on the `asset-images` bucket
2. Go to the **Policies** tab
3. Click **New Policy**

#### Policy 1: Public Read Access
Allows anyone to view images (needed for displaying them on your site).

1. Click **"Create policy from scratch"**
2. Configure:
   - **Policy name:** Public Access
   - **Policy definition:** SELECT
   - **Target roles:** public
3. Switch to **SQL Editor** tab and paste:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'asset-images' );
```

4. Click **Review** then **Save policy**

#### Policy 2: Authenticated Upload
Allows authenticated users to upload images.

1. Click **New Policy** again
2. Click **"Create policy from scratch"**
3. Switch to **SQL Editor** tab and paste:

```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'asset-images' );
```

4. Click **Review** then **Save policy**

#### Policy 3: Authenticated Delete
Allows authenticated users to delete images.

1. Click **New Policy** again
2. Switch to **SQL Editor** tab and paste:

```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'asset-images' );
```

4. Click **Review** then **Save policy**

### Step 3: Verify Storage Setup
1. Go to **Storage** > `asset-images`
2. Try uploading a test image (click **Upload file**)
3. If successful, you're all set! ✅
4. Delete the test image

---

## Part 4: Test Database Connection

### Step 1: Test in Your App
1. Make sure your `.env.local` has the correct values
2. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

### Step 2: Test Database Query (Optional)
Create a simple test page to verify connection:

```typescript
// app/test/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('asset_categories')
    .select('*')
  
  if (error) {
    return <div>Error: {error.message}</div>
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <p className="mb-4 text-green-600">✅ Connected successfully!</p>
      <h2 className="text-xl font-semibold mb-2">Asset Categories:</h2>
      <ul className="list-disc list-inside">
        {categories?.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

Visit `http://localhost:3000/test` - you should see the 7 categories!

---

## Part 5: Understanding Your Database

### Tables Overview

**1. buildings**
Stores government building information
- Fields: name, address, city, state, postal_code, description

**2. asset_categories** (pre-populated)
Asset types like Furniture, Electronics, Equipment, etc.
- Fields: name, description

**3. assets** (main table)
All your assets with full details
- Fields: asset_tag, name, category, building, location, dates, prices, status, condition, etc.
- Status: active, maintenance, retired, disposed
- Condition: excellent, good, fair, poor

**4. asset_images**
Multiple images per asset
- Fields: asset_id (FK), image_url, storage_path, is_primary, caption

**5. maintenance_logs**
Service history for each asset
- Fields: asset_id (FK), date, type, performed_by, description, cost

### Relationships
- Assets → Buildings (many-to-one)
- Assets → Categories (many-to-one)
- Assets → Images (one-to-many)
- Assets → Maintenance Logs (one-to-many)

---

## Troubleshooting

### "Invalid API key" Error
- ✅ Check `.env.local` has correct values from Supabase Settings > API
- ✅ Restart dev server after changing `.env.local`
- ✅ Make sure variable names match exactly

### "relation does not exist" Error
- ✅ Run the `database-schema.sql` again in SQL Editor
- ✅ Make sure you copied ALL the SQL code
- ✅ Check Table Editor to verify tables exist

### Images Not Uploading
- ✅ Verify `asset-images` bucket exists
- ✅ Check bucket is set to **public**
- ✅ Verify all 3 storage policies are created
- ✅ Check browser console for specific errors

### Database Permission Errors
- ✅ Check Row Level Security policies are created
- ✅ Verify you're using the correct API key (anon for client, service_role for admin)

---

## Next Steps

✅ Supabase project created
✅ Database tables set up
✅ Image storage configured
✅ Connection tested

Now you're ready to build your application features:
1. Asset listing page
2. Create asset form
3. Image upload component
4. Building management
5. Reports and analytics

---

## Useful Supabase Features

### Table Editor
Visual interface to view and edit data
- Click any table to see rows
- Add/edit/delete records
- Export data as CSV

### SQL Editor
Run custom queries
- Analyze data
- Create reports
- Test queries before adding to code

### Database > Functions
Create custom PostgreSQL functions
- Complex calculations
- Data validation
- Triggers

### Authentication (Future)
Add user login
- Email/password
- OAuth (Google, GitHub, etc.)
- Magic links

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

