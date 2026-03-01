'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewBuildingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Building type state
  const [buildingType, setBuildingType] = useState<'block' | 'outdoor'>('block')
  
  // Floor count state (0-70)
  const [floorCount, setFloorCount] = useState(0)

  const handleFloorChange = (increment: number) => {
    const newValue = floorCount + increment
    if (newValue >= 0 && newValue <= 70) {
      setFloorCount(newValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      // 1. Create building
      const buildingData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string || null,
        floor_count: floorCount,
        building_type: buildingType,
      }

      const { data: building, error: buildingError } = await supabase
        .from('buildings')
        .insert(buildingData)
        .select()
        .single()

      if (buildingError) throw buildingError

      // 2. Create floors (0 to floorCount, inclusive of Ground Floor)
      const floorsData = []
      for (let i = 0; i <= floorCount; i++) {
        floorsData.push({
          building_id: building.id,
          floor_number: i,
          floor_name: i === 0 ? 'Ground Floor' : String(i),
        })
      }

      if (floorsData.length > 0) {
        const { error: floorsError } = await supabase
          .from('building_floors')
          .insert(floorsData)
        
        if (floorsError) throw floorsError
      }

      setLoading(false)
      router.push(`/buildings/${building.id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Error creating building:', err)
      console.error('Error details:', JSON.stringify(err, null, 2))
      setError(err?.message || err?.error_description || 'Failed to create building. Please check console for details.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/buildings"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Buildings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Building</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., City Hall"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief description of the building..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Building Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Type <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="building_type"
                      value="block"
                      checked={buildingType === 'block'}
                      onChange={() => setBuildingType('block')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Block</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="building_type"
                      value="outdoor"
                      checked={buildingType === 'outdoor'}
                      onChange={() => setBuildingType('outdoor')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Outdoor Structures</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {buildingType === 'block' 
                    ? 'For buildings, cafes, kiosks, and similar structures'
                    : 'For outdoor structures like landscape, fencing, walkways, bus stops'}
                </p>
              </div>
            </div>
          </div>

          {/* Building Structure */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Building Structure</h2>
            <div className="space-y-6">
              {/* Floor Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Floors <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => handleFloorChange(-1)}
                    disabled={floorCount <= 0}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="floor_count"
                    value={floorCount}
                    readOnly
                    className="w-20 text-center px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => handleFloorChange(1)}
                    disabled={floorCount >= 70}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    (0 = Ground Floor only, max 70)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Will create: {floorCount === 0 ? 'Ground Floor' : `Ground Floor, ${Array.from({length: Math.min(floorCount - 1, 5)}, (_, i) => i + 1).join(', ')}${floorCount > 6 ? ', ...' : ''}`}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/buildings"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
