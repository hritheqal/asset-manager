import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Plus, Search, Building2, Tag } from 'lucide-react'
import { Asset, AssetCategory, Building } from '@/lib/types'

interface AssetsPageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    category?: string
    building?: string
  }>
}

export default async function AssetsPage({ searchParams }: AssetsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
    .from('assets')
    .select(`
      *,
      category:asset_categories(id, name),
      building:buildings(id, name),
      images:asset_images(id, image_url, is_primary)
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,asset_tag.ilike.%${params.search}%`)
  }
  if (params.status) {
    query = query.eq('status', params.status)
  }
  if (params.category) {
    query = query.eq('category_id', params.category)
  }
  if (params.building) {
    query = query.eq('building_id', params.building)
  }

  const { data: assets } = await query

  // Get categories and buildings for filters
  const { data: categories } = await supabase
    .from('asset_categories')
    .select('*')
    .order('name')

  const { data: buildings } = await supabase
    .from('buildings')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
              <p className="mt-1 text-sm text-gray-500">
                {assets?.length || 0} total assets
              </p>
            </div>
            <Link
              href="/assets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Asset
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={params.search}
                  placeholder="Search by name or asset tag..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={params.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="retired">Retired</option>
                  <option value="disposed">Disposed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={params.category}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Building Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building
                </label>
                <select
                  name="building"
                  defaultValue={params.building}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Buildings</option>
                  {buildings?.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Assets Grid */}
        {!assets || assets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new asset.
            </p>
            <div className="mt-6">
              <Link
                href="/assets/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Asset
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset: any) => {
              const primaryImage = asset.images?.find((img: any) => img.is_primary)
              const statusColors = {
                active: 'bg-green-100 text-green-800',
                maintenance: 'bg-yellow-100 text-yellow-800',
                retired: 'bg-gray-100 text-gray-800',
                disposed: 'bg-red-100 text-red-800',
              }

              return (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {primaryImage?.image_url ? (
                      <img
                        src={primaryImage.image_url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-400" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                        {asset.name}
                      </h3>
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          statusColors[asset.status as keyof typeof statusColors]
                        }`}
                      >
                        {asset.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-mono">{asset.asset_tag}</span>
                      </div>

                      {asset.category && (
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{asset.category.name}</span>
                        </div>
                      )}

                      {asset.building && (
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{asset.building.name}</span>
                          {asset.room_location && (
                            <span className="text-gray-400 ml-1">
                              - {asset.room_location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {asset.current_value && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-900">
                          ${Number(asset.current_value).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
