# Government Building Asset Management System

A full-stack asset management system built with Next.js, Supabase, and Tailwind CSS for tracking and managing assets across government buildings.

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Features

- 📦 Asset tracking with detailed information
- 🏢 Building and location management
- 🖼️ Image upload and storage for assets
- 📊 Asset categorization
- 🔧 Maintenance logging
- 📱 Responsive design
- 🔒 Row Level Security (RLS)

## Getting Started

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned (takes ~2 minutes)
3. Go to Project Settings > API to get your credentials:
   - `Project URL`
   - `anon/public key`
   - `service_role key` (keep this secret!)

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL editor and click "Run"

This will create:
- Buildings table
- Assets table
- Asset categories table
- Asset images table
- Maintenance logs table
- Necessary indexes and triggers
- Row Level Security policies

### 5. Set Up Storage Bucket

1. Go to "Storage" in your Supabase dashboard
2. Click "Create a new bucket"
3. Name it `asset-images`
4. Make it **public** (so images can be displayed)
5. Click "Create bucket"

**Set up storage policies:**
1. Click on the `asset-images` bucket
2. Go to "Policies"
3. Add these policies:

**Policy 1: Allow public read access**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'asset-images' );
```

**Policy 2: Allow authenticated uploads**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'asset-images' );
```

**Policy 3: Allow authenticated deletes**
```sql
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'asset-images' );
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
asset-management/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── assets/             # Assets pages (to be created)
│   ├── buildings/          # Buildings pages (to be created)
│   └── api/                # API routes (to be created)
├── components/             # React components
├── lib/
│   └── supabase/          # Supabase client utilities
│       ├── client.ts      # Browser client
│       └── server.ts      # Server client
├── supabase/
│   └── schema.sql         # Database schema
├── public/                # Static files
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## Database Schema

### Tables

1. **buildings** - Government building locations
2. **asset_categories** - Asset categories (pre-populated)
3. **assets** - Individual assets with details
4. **asset_images** - Images associated with assets
5. **maintenance_logs** - Maintenance history for assets

### Key Relationships

- Assets belong to Buildings (optional)
- Assets belong to Categories
- Assets can have multiple Images
- Assets can have multiple Maintenance Logs

## Next Steps

1. **Create Asset Management Pages**
   - List all assets
   - Create new assets
   - Edit existing assets
   - Upload images

2. **Create Building Management Pages**
   - List all buildings
   - Create new buildings
   - Edit existing buildings

3. **Add Authentication** (optional)
   - Implement Supabase Auth
   - Protect routes
   - User management

4. **Add Advanced Features**
   - Search and filtering
   - Export reports (CSV/PDF)
   - Asset depreciation tracking
   - QR code generation for assets
   - Mobile scanning

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically detect Next.js and configure everything.

## Environment Variables for Production

Make sure to add these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Support

For issues or questions:
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Tailwind CSS: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## License

MIT
