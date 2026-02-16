'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DA5Registration } from '@/lib/types';
import { 
  Building2, 
  MapPin, 
  Camera, 
  User,
  Shield,
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Ruler,
  PaintBucket,
  Home,
  Layers,
  Grid3X3,
  MapPinned
} from 'lucide-react';

export default function DA5RecordDetailPage() {
  const params = useParams();
  const supabase = createClient();
  const [record, setRecord] = useState<DA5Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      loadRecord(params.id as string);
    }
  }, [params.id]);

  const loadRecord = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('da5_registrations')
        .select(`
          *,
          building:buildings(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setRecord(data);
    } catch (err) {
      console.error('Error loading record:', err);
      setError('Failed to load record details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading record details...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error || 'Record not found'}</p>
          <Link 
            href="/sparta/da5" 
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to DA5 Form
          </Link>
        </div>
      </div>
    );
  }

  const building = record.building as any;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/sparta/da5" 
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to DA5 Form
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DA5 Record Detail</h1>
              <p className="mt-2 text-gray-600">Registration ID: {record.id}</p>
            </div>
            <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full ${
              record.status === 'submitted' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {record.status === 'submitted' ? (
                <><CheckCircle className="h-4 w-4 mr-1" /> Submitted</>
              ) : (
                <><Clock className="h-4 w-4 mr-1" /> Draft</>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: Filler Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Filler Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filled By</label>
                  <p className="text-lg text-gray-900">{record.filled_by_name}</p>
                  <p className="text-sm text-gray-500">{record.filled_by_position}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">On Behalf</label>
                  <p className="text-lg text-gray-900">
                    {record.is_on_behalf ? 'Yes' : 'No'}
                  </p>
                  {record.is_on_behalf && record.on_behalf_email && (
                    <p className="text-sm text-gray-500">{record.on_behalf_email}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Authorizing Officer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Authorizing Officer
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Officer Name</label>
                  <p className="text-lg text-gray-900">{record.officer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Officer Position</label>
                  <p className="text-lg text-gray-900">{record.officer_position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Building & Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Building & Location
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                  <p className="text-lg text-gray-900">{building?.name || 'N/A'}</p>
                  {building?.address && (
                    <p className="text-sm text-gray-500">{building.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    record.location_type === 'BLOCK' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {record.location_type}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Block / Zone</label>
                  <p className="text-lg text-gray-900">{record.block_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <p className="text-lg text-gray-900">{record.floor || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <p className="text-lg text-gray-900">{record.room || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Finishes & Measurements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <PaintBucket className="h-5 w-5 mr-2" />
                Finishes & Measurements
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Floor */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Layers className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-md font-semibold text-gray-900">Floor</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Finish Type</label>
                      <p className="text-gray-900">{record.floor_finish || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <p className="text-gray-900">
                        {record.floor_area ? `${record.floor_area} m²` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ceiling */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Home className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-md font-semibold text-gray-900">Ceiling</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Finish Type</label>
                      <p className="text-gray-900">{record.ceiling_finish || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <p className="text-gray-900">
                        {record.ceiling_area ? `${record.ceiling_area} m²` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wall */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Grid3X3 className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-md font-semibold text-gray-900">Wall</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Finish Type</label>
                      <p className="text-gray-900">{record.wall_finish || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                      <p className="text-gray-900">
                        {record.wall_area ? `${record.wall_area} m²` : 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: GPS Coordinates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MapPinned className="h-5 w-5 mr-2" />
                GPS Coordinates
              </h2>
            </div>
            <div className="p-6">
              {record.latitude && record.longitude ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <p className="text-lg text-gray-900 font-mono">{record.latitude.toFixed(6)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <p className="text-lg text-gray-900 font-mono">{record.longitude.toFixed(6)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <a
                      href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View on Google Maps
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No GPS coordinates recorded</p>
              )}
            </div>
          </div>

          {/* Section 6: Photos */}
          {record.photos && record.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photos ({record.photos.length})
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {record.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(photo, '_blank')}
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Photo {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 7: Notes */}
          {record.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Additional Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          )}

          {/* Section 8: Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Record Metadata
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <p className="text-gray-900">
                    {record.created_at ? new Date(record.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">
                    {record.updated_at ? new Date(record.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>SPARTA - Sistem Pendaftaran Aset Rol Tak Alih (DBKL)</p>
          <p className="mt-1">DA5 Record Detail</p>
        </div>
      </div>
    </div>
  );
}
