import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit, Building2, Package } from 'lucide-react'
import { format } from 'date-fns'

interface BuildingPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BuildingPage({ params }: BuildingPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch building details
  const { data: building, error } = await supabase
    .from('buildings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !building) {
    notFound()
  }

  // Fetch assets in this building
  const { data: assets } = await supabase
    .from('assets')
    .select(`
      *,
      category:asset_categories(id, name),
      images:asset_images(id, image_url, is_primary)
    `)
    .eq('building_id', id)
    .order('name')

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
    disposed: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/buildings"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buildings
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Building2 className="h-10 w-10 text-indigo-600 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
                {building.description && (
                  <p className="mt-1 text-sm text-gray-500">{building.description}</p>
                )}
              </div>
            </div>
            <Link
              href={`/buildings/${building.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Description */}
            {building.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-700 text-sm">{building.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-500">Total Assets</dt>
                  <dd className="text-2xl font-bold text-gray-900">{assets?.length || 0}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Active Assets</dt>
                  <dd className="text-xl font-semibold text-green-600">
                    {assets?.filter((a: any) => a.status === 'active').length || 0}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {format(new Date(building.created_at), 'MMM dd, yyyy')}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {format(new Date(building.updated_at), 'MMM dd, yyyy')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Assets List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Assets in this Building
                </h2>
              </div>

              {!assets || assets.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No assets found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No assets have been assigned to this building yet.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/assets/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add Asset
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assets.map((asset: any) => {
                    const primaryImage = asset.images?.find((img: any) => img.is_primary)

                    return (
                      <Link
                        key={asset.id}
                        href={`/assets/${asset.id}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            {/* Image */}
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                              {primaryImage?.image_url ? (
                                <img
                                  src={primaryImage.image_url}
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {asset.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 font-mono">
                                    {asset.asset_tag}
                                  </p>
                                  {asset.category && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {asset.category.name}
                                    </p>
                                  )}
                                  {asset.room_location && (
                                    <p className="text-xs text-gray-500">
                                      Room: {asset.room_location}
                                    </p>
                                  )}
                                </div>
                                <span
                                  className={`ml-4 px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
                                    statusColors[asset.status as keyof typeof statusColors]
                                  }`}
                                >
                                  {asset.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
