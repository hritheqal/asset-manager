'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DA6Registration } from '@/lib/types';
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
  Package,
  Ruler,
  Home,
  Layers,
  Grid3X3
} from 'lucide-react';

export default function DA6RecordDetailPage() {
  const params = useParams();
  const supabase = createClient();
  const [record, setRecord] = useState<DA6Registration | null>(null);
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
        .from('da6_registrations')
        .select(`
          *,
          building:buildings(*),
          floor:building_floors(*),
          asset:assets(*)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
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
            href="/sparta"
            className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Records List
          </Link>
        </div>
      </div>
    );
  }

  const building = record.building as any;
  const floor = record.floor as any;
  const asset = record.asset as any;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sparta"
            className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Records List
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DA6 Registration Detail</h1>
              <p className="mt-2 text-gray-600">Equipment Registration Record</p>
            </div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              record.status_record === 'submitted'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {record.status_record === 'submitted' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submitted
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Draft
                </>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filler Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <div className="flex items-center">
                <User className="h-6 w-6 text-white mr-3" />
                <h2 className="text-lg font-semibold text-white">Filler Information</h2>
              </div>
            </div>
            <div className="p-6">
              {record.is_on_behalf && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Filled on behalf of:</strong> {record.on_behalf_name} ({record.on_behalf_email})
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-lg text-gray-900">{record.filled_by_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1 text-lg text-gray-900">{record.filled_by_position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Officer Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-white mr-3" />
                <h2 className="text-lg font-semibold text-white">Authorizing Officer</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-lg text-gray-900">{record.officer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1 text-lg text-gray-900">{record.officer_position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Equipment Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-white mr-3" />
                <h2 className="text-lg font-semibold text-white">Equipment Details</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Building</label>
                  <div className="mt-1 flex items-center">
                    <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-lg text-gray-900">{building?.name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Floor</label>
                  <div className="mt-1 flex items-center">
                    <Layers className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-lg text-gray-900">{floor?.floor_name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Asset</label>
                  <div className="mt-1 flex items-center">
                    <Grid3X3 className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-lg text-gray-900">{asset?.name || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      record.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Damaged'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantity & Measurement */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-emerald-600 px-6 py-4">
              <div className="flex items-center">
                <Ruler className="h-6 w-6 text-white mr-3" />
                <h2 className="text-lg font-semibold text-white">Quantity & Measurement</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Quantity</label>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{record.quantity}</p>
                </div>
                {record.measurement_value && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Measurement</label>
                      <p className="mt-1 text-2xl font-bold text-gray-900">{record.measurement_value}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Unit</label>
                      <p className="mt-1 text-2xl font-bold text-gray-900">{record.measurement_unit}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* GPS Location */}
          {(record.latitude || record.longitude) && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-white mr-3" />
                  <h2 className="text-lg font-semibold text-white">GPS Location</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Latitude</label>
                    <p className="mt-1 text-lg text-gray-900">{record.latitude}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Longitude</label>
                    <p className="mt-1 text-lg text-gray-900">{record.longitude}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          {record.photos && record.photos.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4">
                <div className="flex items-center">
                  <Camera className="h-6 w-6 text-white mr-3" />
                  <h2 className="text-lg font-semibold text-white">Photos</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {record.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {record.notes && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-emerald-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Notes</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{record.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Created: {new Date(record.created_at || '').toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last Updated: {new Date(record.updated_at || '').toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}