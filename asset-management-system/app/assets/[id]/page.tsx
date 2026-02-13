import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit, Package, Building2, Tag, Calendar, DollarSign, Wrench } from 'lucide-react'
import { format } from 'date-fns'

interface AssetPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch asset with all relations
  const { data: asset, error } = await supabase
    .from('assets')
    .select(`
      *,
      category:asset_categories(id, name),
      building:buildings(id, name, address),
      images:asset_images(id, image_url, is_primary, caption, created_at),
      maintenance_logs(id, maintenance_date, maintenance_type, description, cost, performed_by)
    `)
    .eq('id', id)
    .single()

  if (error || !asset) {
    notFound()
  }

  // Sort images - primary first
  const images = asset.images?.sort((a: any, b: any) => 
    b.is_primary - a.is_primary
  ) || []

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
    disposed: 'bg-red-100 text-red-800',
  }

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-red-100 text-red-800',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/assets"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="mt-1 text-sm text-gray-500 font-mono">{asset.asset_tag}</p>
            </div>
            <Link
              href={`/assets/${asset.id}/edit`}
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
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            {images.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((image: any) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.image_url}
                        alt={image.caption || asset.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      {image.is_primary && (
                        <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                      {image.caption && (
                        <p className="mt-2 text-sm text-gray-600">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {asset.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{asset.description}</p>
              </div>
            )}

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Technical Details
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {asset.serial_number && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                    <dd className="text-sm text-gray-900 font-mono">{asset.serial_number}</dd>
                  </>
                )}
                {asset.manufacturer && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                    <dd className="text-sm text-gray-900">{asset.manufacturer}</dd>
                  </>
                )}
                {asset.model && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="text-sm text-gray-900">{asset.model}</dd>
                  </>
                )}
                {asset.warranty_expiry && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">Warranty Expiry</dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(asset.warranty_expiry), 'MMM dd, yyyy')}
                    </dd>
                  </>
                )}
              </dl>
            </div>

            {/* Maintenance History */}
            {asset.maintenance_logs && asset.maintenance_logs.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Maintenance History
                </h2>
                <div className="space-y-4">
                  {asset.maintenance_logs.map((log: any) => (
                    <div key={log.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {log.maintenance_type.charAt(0).toUpperCase() + log.maintenance_type.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(log.maintenance_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      {log.description && (
                        <p className="text-sm text-gray-600 mb-1">{log.description}</p>
                      )}
                      {log.performed_by && (
                        <p className="text-xs text-gray-500">
                          Performed by: {log.performed_by}
                        </p>
                      )}
                      {log.cost && (
                        <p className="text-xs text-gray-500">
                          Cost: ${Number(log.cost).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {asset.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{asset.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Status & Condition */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Current Status</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        statusColors[asset.status as keyof typeof statusColors]
                      }`}
                    >
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Condition</span>
                  <div className="mt-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        conditionColors[asset.condition as keyof typeof conditionColors]
                      }`}
                    >
                      {asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category */}
            {asset.category && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Category
                </h3>
                <p className="text-gray-700">{asset.category.name}</p>
              </div>
            )}

            {/* Location */}
            {asset.building && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Location
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Building</span>
                    <p className="text-gray-900">{asset.building.name}</p>
                    {asset.building.address && (
                      <p className="text-sm text-gray-600">{asset.building.address}</p>
                    )}
                  </div>
                  {asset.room_location && (
                    <div>
                      <span className="text-sm text-gray-500">Room</span>
                      <p className="text-gray-900">{asset.room_location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Financial
              </h3>
              <dl className="space-y-3">
                {asset.purchase_date && (
                  <div>
                    <dt className="text-sm text-gray-500">Purchase Date</dt>
                    <dd className="text-gray-900">
                      {format(new Date(asset.purchase_date), 'MMM dd, yyyy')}
                    </dd>
                  </div>
                )}
                {asset.purchase_price && (
                  <div>
                    <dt className="text-sm text-gray-500">Purchase Price</dt>
                    <dd className="text-gray-900 font-semibold">
                      ${Number(asset.purchase_price).toLocaleString()}
                    </dd>
                  </div>
                )}
                {asset.current_value && (
                  <div>
                    <dt className="text-sm text-gray-500">Current Value</dt>
                    <dd className="text-gray-900 font-semibold">
                      ${Number(asset.current_value).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Created</dt>
                  <dd className="text-gray-900">
                    {format(new Date(asset.created_at), 'MMM dd, yyyy HH:mm')}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Last Updated</dt>
                  <dd className="text-gray-900">
                    {format(new Date(asset.updated_at), 'MMM dd, yyyy HH:mm')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
