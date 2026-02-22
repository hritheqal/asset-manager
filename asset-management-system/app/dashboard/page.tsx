'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Building, Layers, MapPin, Filter, X } from 'lucide-react';

const MapDashboard = dynamic(() => import('@/components/MapDashboard'), { 
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
});

interface DA5Data {
  id: string;
  building_id: string;
  building_name?: string;
  floor: string;
  room: string;
  location_type: string;
  floor_finish: string;
  status: string;
  latitude: number;
  longitude: number;
}

interface BuildingOption {
  id: string;
  name: string;
}

interface ZoneOption {
  zone_id: string;
  zone_name: string;
}

export default function DashboardPage() {
  const supabase = createClient();
  
  const [da5Data, setDa5Data] = useState<DA5Data[]>([]);
  const [buildings, setBuildings] = useState<BuildingOption[]>([]);
  const [zones, setZones] = useState<ZoneOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // First, try to fetch all DA5 records to see if there are any
      const { data: allRecords, error: allError } = await supabase
        .from('da5_registrations')
        .select('id, latitude, longitude')
        .limit(5);

      console.log('All DA5 Records:', { data: allRecords, error: allError });

      // Fetch DA5 registrations with building info (only those with GPS)
      const { data: da5Records, error } = await supabase
        .from('da5_registrations')
        .select(`
          id,
          building_id,
          floor,
          room,
          location_type,
          floor_finish,
          status,
          latitude,
          longitude,
          buildings:building_id(name)
        `)
        .not('latitude', 'is', 'null')
        .not('longitude', 'is', 'null');

      console.log('DA5 Records with GPS:', { data: da5Records, error });

      if (da5Records) {
        const mapped = da5Records.map((r: any) => ({
          id: r.id,
          building_id: r.building_id,
          building_name: r.buildings?.name || 'Unknown Building',
          floor: r.floor || '',
          room: r.room || '',
          location_type: r.location_type || '',
          floor_finish: r.floor_finish || '',
          status: r.status || 'draft',
          latitude: r.latitude,
          longitude: r.longitude,
        }));
        setDa5Data(mapped);
      }

      // Fetch buildings for filter
      const { data: buildingList } = await supabase
        .from('buildings')
        .select('id, name')
        .order('name');
      
      if (buildingList) {
        setBuildings(buildingList);
      }

      // Fetch zones for filter
      const { data: zoneList } = await supabase
        .from('dbkl_zones')
        .select('zone_id, zone_name')
        .order('zone_name');
      
      if (zoneList) {
        setZones(zoneList);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  // Filter logic
  const filteredData = useMemo(() => {
    return da5Data.filter(item => {
      if (selectedBuilding && item.building_id !== selectedBuilding) return false;
      if (selectedStatus && item.status !== selectedStatus) return false;
      // Zone filtering would require joining with zone detection - simplified for now
      return true;
    });
  }, [da5Data, selectedZone, selectedStatus, selectedBuilding]);

  const clearFilters = () => {
    setSelectedZone('');
    setSelectedStatus('');
    setSelectedBuilding('');
  };

  const hasActiveFilters = selectedZone || selectedStatus || selectedBuilding;

  // Stats
  const totalRecords = da5Data.length;
  const filteredCount = filteredData.length;
  const uniqueBuildings = new Set(da5Data.map(d => d.building_id)).size;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Asset Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            DA5 Registration Map Visualization
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filter Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                {[selectedZone, selectedStatus, selectedBuilding].filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Building Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building
                </label>
                <select
                  value={selectedBuilding}
                  onChange={(e) => setSelectedBuilding(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Buildings</option>
                  {buildings.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                </select>
              </div>

              {/* Zone Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zone
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Zones</option>
                  {zones.map(z => (
                    <option key={z.zone_id} value={z.zone_id}>{z.zone_name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Layers className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total DA5 Records</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : totalRecords}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Showing on Map</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : filteredCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Building className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Buildings</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : uniqueBuildings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">View Mode</p>
                <p className="text-lg font-semibold text-gray-900">DA5 Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[600px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            ) : (
              <MapDashboard da5Data={filteredData} />
            )}
          </div>
        </div>

        {!loading && filteredCount === 0 && hasActiveFilters && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No records match your filters. Try adjusting the filter criteria.
            </p>
          </div>
        )}

        {!loading && totalRecords === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No DA5 registrations with location data found. Register new DA5 entries with GPS coordinates to see them on the map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
