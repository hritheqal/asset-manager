# Asset Management System - Setup Instructions

Follow these steps on your local machine to create the project.

## Step 1: Create Next.js App

Open your terminal and run:

```bash
npx create-next-app@latest asset-management-system --typescript --tailwind --app --no-src-dir --import-alias "@/*" --eslint
```

When prompted, answer:
- ✅ Would you like to use TypeScript? **Yes**
- ✅ Would you like to use ESLint? **Yes**
- ✅ Would you like to use Tailwind CSS? **Yes**
- ✅ Would you like to use `src/` directory? **No**
- ✅ Would you like to use App Router? **Yes**
- ✅ Would you like to customize the default import alias? **No** (use @/*)
- ❌ Would you like to use Turbopack? **No**

Then navigate to your project:

```bash
cd asset-management-system
```

## Step 2: Install Additional Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr lucide-react date-fns
```

## Step 3: Update next.config.js

Replace the content of `next.config.js` with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
```

## Step 4: Create Environment Files

Create `.env.example`:

```bash
cat > .env.example << 'EOF'
# Supabase Configuration
# Get these values from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
EOF
```

Create `.env.local`:

```bash
cp .env.example .env.local
```

**Important:** You'll update `.env.local` with real values after creating your Supabase project.

## Step 5: Create Directory Structure

```bash
mkdir -p lib/supabase
mkdir -p supabase
mkdir -p components
```

## Step 6: Create Supabase Client Files

Create `lib/supabase/client.ts`:

```bash
cat > lib/supabase/client.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
EOF
```

Create `lib/supabase/server.ts`:

```bash
cat > lib/supabase/server.ts << 'EOF'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The set method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The delete method was called from a Server Component.
          }
        },
      },
    }
  )
}
EOF
```

## Step 7: Create Type Definitions

Create `lib/types.ts`:

```bash
cat > lib/types.ts << 'EOF'
// Database types
export interface Building {
  id: string
  name: string
  address: string
  city: string | null
  state: string | null
  postal_code: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface AssetCategory {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Asset {
  id: string
  asset_tag: string
  name: string
  description: string | null
  category_id: string | null
  building_id: string | null
  room_location: string | null
  purchase_date: string | null
  purchase_price: number | null
  current_value: number | null
  status: 'active' | 'maintenance' | 'retired' | 'disposed'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  serial_number: string | null
  manufacturer: string | null
  model: string | null
  warranty_expiry: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AssetImage {
  id: string
  asset_id: string
  image_url: string
  storage_path: string
  is_primary: boolean
  caption: string | null
  created_at: string
}

export interface MaintenanceLog {
  id: string
  asset_id: string
  maintenance_date: string
  maintenance_type: 'routine' | 'repair' | 'inspection' | 'other'
  performed_by: string | null
  description: string | null
  cost: number | null
  created_at: string
}

export interface AssetWithDetails extends Asset {
  category?: AssetCategory
  building?: Building
  images?: AssetImage[]
  maintenance_logs?: MaintenanceLog[]
}
EOF
```

## Step 8: Update Homepage

Replace `app/page.tsx` with:

```bash
cat > app/page.tsx << 'EOF'
import Link from 'next/link'
import { Building2, Package, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Asset Management System
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/assets"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Assets
              </Link>
              <Link
                href="/buildings"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Buildings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Asset Management System
          </h1>
          <p className="text-xl text-gray-600">
            Manage and track assets across government buildings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <Link href="/assets" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Package className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Assets
              </h2>
              <p className="text-gray-600">
                View and manage all assets in the system
              </p>
            </div>
          </Link>

          <Link href="/buildings" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Building2 className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Buildings
              </h2>
              <p className="text-gray-600">
                Manage building locations and details
              </p>
            </div>
          </Link>

          <Link href="/reports" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <FileText className="h-12 w-12 text-indigo-600 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Reports
              </h2>
              <p className="text-gray-600">
                Generate reports and analytics
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Getting Started
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Set up your Supabase project and add credentials to .env.local</li>
            <li>Run the database migration to create tables</li>
            <li>Start adding buildings and assets to the system</li>
            <li>Track and manage your government assets efficiently</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
EOF
```

## Step 9: Test the Setup

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the homepage!

---

## Next: Set Up Supabase

Now you need to create and configure your Supabase database. Continue to the next file for Supabase setup instructions.

