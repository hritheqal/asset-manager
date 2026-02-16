'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, X, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

// DBKL Zones list
const DBKL_ZONES = [
  { id: 'zone-a', name: 'Zone A - KL' },
  { id: 'zone-b', name: 'Zone B - Cheras' },
  { id: 'zone-c', name: 'Zone C - Kepong' },
  { id: 'zone-d', name: 'Zone D - Lembah Pantai' },
  { id: 'zone-e', name: 'Zone E - Segambut' },
  { id: 'zone-f', name: 'Zone F - TTDI' },
  { id: 'zone-g', name: 'Zone G - Setapak' },
  { id: 'zone-h', name: 'Zone H - Wangsa Maju' },
  { id: 'zone-i', name: 'Zone I - Bandar Tun Razak' },
  { id: 'zone-j', name: 'Zone J - Bukit Jalil' },
  { id: 'zone-k', name: 'Zone K - Seputeh' },
  { id: 'zone-l', name: 'Zone L - Taman Desa' },
  { id: 'zone-m', name: 'Zone M - Taman Connaught' },
  { id: 'zone-n', name: 'Zone N - Bandar Menjalara' },
  { id: 'zone-o', name: 'Zone O - Sri Hartamas' },
]

export default function NewBuildingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Floor count state (0-70)
  const [floorCount, setFloorCount] = useState(0)
  
  // Zone state (single select)
  const [selectedZone, setSelectedZone] = useState<string>('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFloorChange = (increment: number) => {
    const newValue = floorCount + increment
    if (newValue >= 0 && newValue <= 70) {
      setFloorCount(newValue)
    }
  }

  const selectZone = (zoneId: string) => {
    setSelectedZone(zoneId)
    setIsDropdownOpen(false)
    setSearchQuery('')
  }

  const clearZone = () => {
    setSelectedZone('')
  }

  const filteredZones = DBKL_ZONES.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getZoneName = (zoneId: string) => {
    return DBKL_ZONES.find(z => z.id === zoneId)?.name || zoneId
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Validate zone
    if (!selectedZone) {
      setError('Please select a zone')
      setLoading(false)
      return
    }

    try {
      // 1. Create building
      const buildingData = {
        name: formData.get('name') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string || null,
        state: formData.get('state') as string || null,
        postal_code: formData.get('postal_code') as string || null,
        description: formData.get('description') as string || null,
        floor_count: floorCount,
      }

      const { data: building, error: buildingError } = await supabase
        .from('buildings')
        .insert(buildingData)
        .select()
        .single()

      if (buildingError) throw buildingError

      // 2. Create floors (0 to floorCount, inclusive of Ground Floor)
      // floorCount=0 creates Ground Floor only, floorCount=1 creates Ground+1, etc.
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

      // 3. Create block/zone
      const blocksData = [{
        building_id: building.id,
        block_name: getZoneName(selectedZone),
      }]

      const { error: blocksError } = await supabase
        .from('building_blocks')
        .insert(blocksData)
      
      if (blocksError) throw blocksError

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
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State / Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    placeholder="12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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

              {/* Zone Dropdown */}
              <div ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zone <span className="text-red-500">*</span>
                </label>
                
                {/* Selected Zone Chip */}
                {selectedZone && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {getZoneName(selectedZone)}
                      <button
                        type="button"
                        onClick={() => clearZone()}
                        className="ml-2 text-indigo-600 hover:text-indigo-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  </div>
                )}

                {/* Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-left flex items-center justify-between"
                  >
                    <span className={!selectedZone ? 'text-gray-400' : 'text-gray-900'}>
                      {!selectedZone 
                        ? 'Select zone...' 
                        : getZoneName(selectedZone)
                      }
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {/* Search Input */}
                      <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search zones..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Zone Options */}
                      <div className="p-2">
                        {filteredZones.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No zones found
                          </p>
                        ) : (
                          filteredZones.map(zone => (
                            <button
                              key={zone.id}
                              type="button"
                              onClick={() => selectZone(zone.id)}
                              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                                selectedZone === zone.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                              }`}
                            >
                              <span className="text-sm">
                                {zone.name}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select one DBKL zone for this building
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
