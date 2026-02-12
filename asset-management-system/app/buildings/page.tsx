import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Plus, MapPin } from 'lucide-react'

export default async function BuildingsPage() {
  const supabase = await createClient()

  // Fetch buildings with asset count
  const { data: buildings } = await supabase
    .from('buildings')
    .select('*, assets(count)')
    .order('name')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buildings</h1>
              <p className="mt-1 text-sm text-gray-500">
                {buildings?.length || 0} total buildings
              </p>
            </div>
            <Link
              href="/buildings/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Building
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!buildings || buildings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No buildings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new building.
            </p>
            <div className="mt-6">
              <Link
                href="/buildings/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Building
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building: any) => {
              const assetCount = building.assets?.[0]?.count || 0

              return (
                <Link
                  key={building.id}
                  href={`/buildings/${building.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-indigo-600" />
                      <h3 className="ml-3 text-lg font-semibold text-gray-900">
                        {building.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {building.address && (
                      <div className="flex items-start text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                        <div>
                          <p>{building.address}</p>
                          {(building.city || building.state) && (
                            <p>
                              {building.city}
                              {building.city && building.state && ', '}
                              {building.state} {building.postal_code}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {building.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {building.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm font-medium text-indigo-600">
                      {assetCount} {assetCount === 1 ? 'asset' : 'assets'}
                    </span>
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
