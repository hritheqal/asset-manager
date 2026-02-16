'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Building, DA6Registration, BuildingFloor, Asset } from '@/lib/types';
import { 
  Building2, 
  MapPin, 
  Camera, 
  Save, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink,
  User,
  Shield,
  Package,
  ArrowLeft,
  Upload
} from 'lucide-react';

// Sample officers data (in production, fetch from Supabase)
const OFFICERS = [
  { 
    id: '550e8400-e29b-41d4-a716-446655440000', 
    name: 'Ahmad bin Ibrahim', 
    position: 'Building Maintenance Manager' 
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440001', 
    name: 'Siti Nurul Huda', 
    position: 'Asset Registration Supervisor' 
  },
];

interface OnBehalfUser {
  email: string;
  name: string;
  position: string;
  isRegistered: boolean;
}

export default function DA6RegistrationPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  // Building-specific data
  const [selectedBuildingFloors, setSelectedBuildingFloors] = useState<BuildingFloor[]>([]);
  const [loadingBuildingData, setLoadingBuildingData] = useState(false);
  
  // On-behalf state
  const [isOnBehalf, setIsOnBehalf] = useState(false);
  const [onBehalfEmail, setOnBehalfEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [onBehalfUser, setOnBehalfUser] = useState<OnBehalfUser | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<DA6Registration>>({
    status: 'Active',
    quantity: 1,
    status_record: 'draft',
    is_on_behalf: false,
  });
  
  // User info (current logged-in user)
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
  });

  // Load buildings, assets and user info on mount
  useEffect(() => {
    loadBuildings();
    loadAssets();
    loadCurrentUser();
  }, []);

  // Load building floors when building is selected
  useEffect(() => {
    if (formData.building_id) {
      loadBuildingFloors(formData.building_id);
    } else {
      setSelectedBuildingFloors([]);
    }
  }, [formData.building_id]);

  const loadBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error('Error loading buildings:', error);
      setStatus({ type: 'error', message: 'Failed to load buildings' });
    } finally {
      setLoading(false);
    }
  };

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      setStatus({ type: 'error', message: 'Failed to load assets' });
    }
  };

  const loadBuildingFloors = async (buildingId: string) => {
    setLoadingBuildingData(true);
    try {
      const { data: floors, error: floorsError } = await supabase
        .from('building_floors')
        .select('*')
        .eq('building_id', buildingId)
        .order('floor_number');
      
      if (floorsError) throw floorsError;
      setSelectedBuildingFloors(floors || []);
    } catch (error) {
      console.error('Error loading building floors:', error);
      setStatus({ type: 'error', message: 'Failed to load building floors' });
    } finally {
      setLoadingBuildingData(false);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.email?.split('@')[0] || '',
          position: 'Staff',
          email: user.email || '',
        });
        
        // Set default form data
        setFormData(prev => ({
          ...prev,
          filled_by_user_id: user.id,
          filled_by_name: user.email?.split('@')[0] || '',
          filled_by_position: 'Staff',
        }));
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleOnBehalfToggle = (checked: boolean) => {
    setIsOnBehalf(checked);
    setFormData(prev => ({ ...prev, is_on_behalf: checked }));
    
    if (!checked) {
      // Reset on-behalf data
      setOnBehalfEmail('');
      setOnBehalfUser(null);
      setFormData(prev => ({
        ...prev,
        on_behalf_email: undefined,
        on_behalf_name: undefined,
        on_behalf_position: undefined,
      }));
    }
  };

  const checkOnBehalfEmail = async () => {
    if (!onBehalfEmail) return;
    
    setCheckingEmail(true);
    try {
      // Mock check - in production, verify against your users database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOnBehalfUser({
        email: onBehalfEmail,
        name: onBehalfEmail.split('@')[0],
        position: 'Staff',
        isRegistered: true,
      });
      
      setFormData(prev => ({
        ...prev,
        on_behalf_email: onBehalfEmail,
        on_behalf_name: onBehalfEmail.split('@')[0],
        on_behalf_position: 'Staff',
      }));
      
      setStatus({ type: 'success', message: 'Email verified successfully' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to verify email' });
    } finally {
      setCheckingEmail(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos = files.map(file => URL.createObjectURL(file));
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Validate required fields
      if (!formData.building_id) {
        throw new Error('Please select a building');
      }
      if (!formData.asset_id) {
        throw new Error('Please select an asset');
      }
      if (!formData.officer_id) {
        throw new Error('Please select an authorizing officer');
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        photos: uploadedPhotos,
        status_record: 'submitted',
      };

      const { data, error } = await supabase
        .from('da6_registrations')
        .insert(submitData)
        .select()
        .single();

      if (error) throw error;

      setStatus({ type: 'success', message: 'DA6 registration submitted successfully!' });
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push('/sparta');
      }, 2000);
    } catch (error: any) {
      console.error('Error submitting DA6:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to submit registration' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setSaving(true);
    setStatus(null);

    try {
      const submitData = {
        ...formData,
        photos: uploadedPhotos,
        status_record: 'draft',
      };

      const { data, error } = await supabase
        .from('da6_registrations')
        .insert(submitData)
        .select()
        .single();

      if (error) throw error;

      setStatus({ type: 'success', message: 'Draft saved successfully!' });
    } catch (error: any) {
      console.error('Error saving draft:', error);
      setStatus({ type: 'error', message: error.message || 'Failed to save draft' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-emerald-600 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/sparta"
                className="inline-flex items-center text-white hover:text-emerald-100"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to SPARTA
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">DA6 Registration</h1>
                <p className="text-emerald-100 text-sm">Equipment Registration Form</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {status && (
          <div className={`mb-6 p-4 rounded-md ${
            status.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            status.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center">
              {status.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> :
               status.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> :
               <AlertCircle className="h-5 w-5 mr-2" />}
              <span>{status.message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Filler Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Filler Information</h2>
            </div>

            {/* On-behalf Toggle */}
            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={isOnBehalf}
                  onChange={(e) => handleOnBehalfToggle(e.target.checked)}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Fill on behalf of someone else</span>
              </label>
            </div>

            {/* On-behalf Email */}
            {isOnBehalf && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email of Person on Behalf
                </label>
                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={onBehalfEmail}
                    onChange={(e) => setOnBehalfEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={checkOnBehalfEmail}
                    disabled={checkingEmail || !onBehalfEmail}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {checkingEmail ? 'Checking...' : 'Verify'}
                  </button>
                </div>
                {onBehalfUser && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Verified: {onBehalfUser.name} ({onBehalfUser.position})
                  </div>
                )}
              </div>
            )}

            {/* Current User Info (Display Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Position
                </label>
                <input
                  type="text"
                  value={currentUser.position}
                  disabled
                  className="w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Authorizing Officer */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Authorizing Officer</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Officer <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.officer_id || ''}
                onChange={(e) => {
                  const officer = OFFICERS.find(o => o.id === e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    officer_id: e.target.value,
                    officer_name: officer?.name || '',
                    officer_position: officer?.position || '',
                  }));
                }}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              >
                <option value="">Select an officer...</option>
                {OFFICERS.map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {officer.name} - {officer.position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location & Asset Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Location & Asset Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Building */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.building_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, building_id: e.target.value }))}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="">Select building...</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor / Level
                </label>
                <select
                  value={formData.floor_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, floor_id: e.target.value }))}
                  disabled={!formData.building_id || loadingBuildingData}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:bg-gray-100"
                >
                  <option value="">Select floor...</option>
                  {selectedBuildingFloors.map((floor) => (
                    <option key={floor.id} value={floor.id}>
                      {floor.floor_name}
                    </option>
                  ))}
                </select>
                {loadingBuildingData && (
                  <p className="text-sm text-gray-500 mt-1">Loading floors...</p>
                )}
              </div>

              {/* Asset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asset <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.asset_id || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, asset_id: e.target.value }))}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="">Select asset...</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="Active">Active</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quantity & Measurement */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Package className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Quantity & Measurement</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Measurement Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurement Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.measurement_value || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, measurement_value: parseFloat(e.target.value) || undefined }))}
                  placeholder="e.g., 12.5"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Measurement Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={formData.measurement_unit || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, measurement_unit: e.target.value as any }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                >
                  <option value="">Select unit...</option>
                  <option value="m">meter (m)</option>
                  <option value="m2">meter persegi (m²)</option>
                </select>
              </div>
            </div>
          </div>

          {/* GPS Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <MapPin className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">GPS Location</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.latitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || undefined }))}
                  placeholder="e.g., 3.1390"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.00000001"
                  value={formData.longitude || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || undefined }))}
                  placeholder="e.g., 101.6869"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Optional: Enter GPS coordinates for precise location tracking
            </p>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Camera className="h-6 w-6 text-emerald-600" />
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
            </div>

            {/* Upload Button */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Upload className="h-5 w-5 mr-2 text-gray-400" />
                Upload Photos
              </button>
            </div>

            {/* Photo Preview */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Enter any additional notes or comments..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <RotateCcw className="h-5 w-5 mr-2 inline" />
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2 inline" />
              {saving ? 'Submitting...' : 'Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
