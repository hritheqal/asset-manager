'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase/client';
import { Building, Layers, MapPin } from 'lucide-react';

const MapDashboard = dynamic(() => import('@/components/MapDashboard'), { 
  ssr: false,
  loading: () => <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
});

interface BuildingData {
  id: string;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  asset_count?: number;
}

export default function DashboardPage() {
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuildings() {
      const supabase = createClient();
      
      const { data } = await supabase
        .from('buildings')
        .select(`
          id,
          name,
          address,
          city,
          latitude,
          longitude
        `)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (data) {
        setBuildings(data.map(b => ({
          ...b,
          city: b.city || undefined,
        })));
      }
      setLoading(false);
    }

    fetchBuildings();
  }, []);

  const buildingsWithLocation = buildings.filter(b => b.latitude && b.longitude);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Asset Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Interactive map of buildings and assets
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Building className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Buildings</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : buildings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">With Location</p>
                <p className="text-2xl font-semibold text-gray-900">{loading ? '...' : buildingsWithLocation.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Layers className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">DBKL Zones</p>
                <p className="text-2xl font-semibold text-gray-900">15</p>
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
                <p className="text-lg font-semibold text-gray-900">Interactive</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-[600px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
              </div>
            ) : (
              <MapDashboard buildings={buildings} />
            )}
          </div>
        </div>

        {!loading && buildingsWithLocation.length === 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No buildings with location data found. Add buildings with GPS coordinates to see them on the map.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
