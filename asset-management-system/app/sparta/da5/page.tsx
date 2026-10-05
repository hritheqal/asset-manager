'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Building, DA5Registration, FinishType, BuildingFloor } from '@/lib/types';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { 
  ssr: false,
  loading: () => <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
});
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
  Navigation
} from 'lucide-react';

// Mock finish types - in production, fetch from Supabase
const FINISH_TYPES: FinishType[] = [
  { id: '1', category: 'floor', name: 'Ceramic Tiles' },
  { id: '2', category: 'floor', name: 'Vinyl Flooring' },
  { id: '3', category: 'floor', name: 'Epoxy Coating' },
  { id: '4', category: 'floor', name: 'Cement Screed' },
  { id: '5', category: 'ceiling', name: 'Plaster Ceiling' },
  { id: '6', category: 'ceiling', name: 'Acoustic Ceiling' },
  { id: '7', category: 'ceiling', name: 'Metal Ceiling' },
  { id: '8', category: 'wall', name: 'Paint' },
  { id: '9', category: 'wall', name: 'Ceramic Tiles' },
  { id: '10', category: 'wall', name: 'Plaster' },
  { id: '11', category: 'wall', name: 'Glass Partition' },
];

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

export default function DA5RegistrationPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string } | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  // Building-specific data
  const [selectedBuildingFloors, setSelectedBuildingFloors] = useState<BuildingFloor[]>([]);
  const [loadingBuildingData, setLoadingBuildingData] = useState(false);
  
  // Filter buildings by type
  const [locationType, setLocationType] = useState<'BLOCK' | 'OUTDOOR'>('BLOCK');
  
  // On-behalf state
  const [isOnBehalf, setIsOnBehalf] = useState(false);
  const [onBehalfEmail, setOnBehalfEmail] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [onBehalfUser, setOnBehalfUser] = useState<OnBehalfUser | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Partial<DA5Registration>>({
    location_type: 'BLOCK',
    status: 'draft',
    is_on_behalf: false,
  });
  
  // Detected zone state (auto-filled from map click)
  const [detectedZone, setDetectedZone] = useState<{ zoneId: string; zoneName: string } | null>(null);
  
  // User info (current logged-in user)
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    position: '',
    email: '',
  });

  // Load buildings and user info on mount
  useEffect(() => {
    loadBuildings();
    loadCurrentUser();
  }, []);

  // Sync locationType with formData
  useEffect(() => {
    if (formData.location_type) {
      setLocationType(formData.location_type as 'BLOCK' | 'OUTDOOR');
    }
  }, [formData.location_type]);

  // Reload buildings when location type changes
  useEffect(() => {
    loadBuildings();
    // Reset selected building when type changes
    setFormData(prev => ({ ...prev, building_id: undefined }));
    setSelectedBuildingFloors([]);
  }, [locationType]);

  // Load building floors and blocks when building is selected
  useEffect(() => {
    if (formData.building_id) {
      loadBuildingData(formData.building_id);
    } else {
      setSelectedBuildingFloors([]);
    }
  }, [formData.building_id]);

  const loadBuildings = async () => {
    try {
      const buildingTypeFilter = locationType === 'BLOCK' ? 'block' : 'outdoor';
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('building_type', buildingTypeFilter)
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

  const loadBuildingData = async (buildingId: string) => {
    setLoadingBuildingData(true);
    try {
      // Load floors
      const { data: floors, error: floorsError } = await supabase
        .from('building_floors')
        .select('*')
        .eq('building_id', buildingId)
        .order('floor_number');
      
      if (floorsError) throw floorsError;
      setSelectedBuildingFloors(floors || []);
    } catch (error) {
      console.error('Error loading building data:', error);
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
        // Keep filled_by_* as current user (actual submitter) - no change needed
      }));
    }
  };

  const checkEmailExists = async () => {
    if (!onBehalfEmail || !onBehalfEmail.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setCheckingEmail(true);
    setStatus({ type: 'info', message: 'Checking email...' });

    try {
      // Normalize email to prevent wildcard injection attacks
      const normalizedEmail = onBehalfEmail.trim().toLowerCase();
      
      const { data: existingUsers } = await supabase
        .from('users')
        .select('email, name, position')
        .eq('email', normalizedEmail)
        .limit(1);

      if (existingUsers && existingUsers.length > 0) {
        const user = existingUsers[0];
        const onBehalfData: OnBehalfUser = {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          position: user.position || 'Staff',
          isRegistered: true,
        };
        
        setOnBehalfUser(onBehalfData);
        setFormData(prev => ({
          ...prev,
          on_behalf_email: user.email,
          on_behalf_name: onBehalfData.name,
          on_behalf_position: onBehalfData.position,
          // Keep filled_by_* as current user (actual submitter)
        }));
        setStatus({ type: 'success', message: `Email found: ${onBehalfData.name} - ${onBehalfData.position}` });
      } else {
        setOnBehalfUser({
          email: onBehalfEmail,
          name: '',
          position: '',
          isRegistered: false,
        });
        setStatus({ type: 'error', message: 'Email not registered. Please register first.' });
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setStatus({ type: 'error', message: 'Failed to check email. Please try again.' });
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleOfficerSelect = (officerId: string) => {
    const officer = OFFICERS.find(o => o.id === officerId);
    if (officer) {
      setFormData(prev => ({
        ...prev,
        officer_id: officer.id,
        officer_name: officer.name,
        officer_position: officer.position,
      }));
    }
  };

  const handleInputChange = (field: keyof DA5Registration, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setStatus({ type: 'info', message: 'Uploading photos...' });

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `da5-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('da5-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('da5-photos')
          .getPublicUrl(filePath);

        setUploadedPhotos(prev => [...prev, publicUrl]);
      }

      setStatus({ type: 'success', message: 'Photos uploaded successfully' });
    } catch (error) {
      console.error('Error uploading photos:', error);
      setStatus({ type: 'error', message: 'Failed to upload photos' });
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setStatus({ type: 'error', message: 'Geolocation is not supported by your browser' });
      return;
    }

    setStatus({ type: 'info', message: 'Getting location...' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setStatus({ type: 'success', message: 'Location captured successfully' });
      },
      (error) => {
        setStatus({ type: 'error', message: `Failed to get location: ${error.message}` });
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleMapLocationChange = (lat: number, lng: number) => {
    if (lat === 0 && lng === 0) {
      setFormData(prev => ({ ...prev, latitude: undefined, longitude: undefined }));
      setDetectedZone(null);
    } else {
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    }
  };

  const handleZoneDetect = async (zoneId: string, zoneName: string) => {
    setDetectedZone({ zoneId, zoneName });
    setStatus({ type: 'success', message: `Zone detected: ${zoneName}` });
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Officer required
    if (!formData.officer_id) {
      errors.push('Please select an authorizing officer');
    }

    // On-behalf validation
    if (isOnBehalf) {
      if (!onBehalfEmail) {
        errors.push('Please provide email for on-behalf registration');
      }
      if (!onBehalfUser?.isRegistered) {
        errors.push('Email not registered. Please register first or uncheck "on behalf" option.');
      }
    }

    // Building info
    if (!formData.building_id) errors.push('Please select a building');

    // Location-specific validation
    if (formData.location_type === 'OUTDOOR') {
      if (!formData.external_building_name) {
        errors.push('Please provide the outdoor structure name');
      }
    } else {
      // BLOCK type - only require floor if options are available
      if (selectedBuildingFloors.length > 0 && !formData.floor) {
        errors.push('Please select a floor');
      }
    }

    if (errors.length > 0) {
      setStatus({ type: 'error', message: errors.join('. ') });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setStatus({ type: 'info', message: 'Saving registration...' });

    try {
      const registrationData = {
        ...formData,
        photos: uploadedPhotos,
        status: 'submitted',
      };

      const { data, error } = await supabase
        .from('da5_registrations')
        .insert([registrationData])
        .select()
        .single();

      if (error) throw error;

      setStatus({ type: 'success', message: 'DA5 Registration saved successfully!' });
      
      setTimeout(() => {
        router.push('/sparta');
      }, 2000);
    } catch (error) {
      console.error('Error saving registration:', error);
      setStatus({ type: 'error', message: 'Failed to save registration. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      location_type: 'BLOCK',
      status: 'draft',
      is_on_behalf: false,
      filled_by_user_id: currentUser.id,
      filled_by_name: currentUser.name,
      filled_by_position: currentUser.position,
    });
    setLocationType('BLOCK');
    setIsOnBehalf(false);
    setOnBehalfEmail('');
    setOnBehalfUser(null);
    setSelectedBuildingFloors([]);
    setUploadedPhotos([]);
    setStatus(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DA5 Registration Form</h1>
          <p className="mt-2 text-gray-600">Building Space & Finishes Registration</p>
        </div>

        {/* Status Messages */}
        {status && status.type && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {status.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> :
             status.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" /> :
             <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2 flex-shrink-0"></div>}
            <span>{status.message}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Section 1: Filler Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                1. Filler Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* On-behalf checkbox */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOnBehalf}
                    onChange={(e) => handleOnBehalfToggle(e.target.checked)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Register on behalf of another person
                    <span className="block text-xs text-gray-500 font-normal mt-1">
                      Check this if you are filling this form for someone else
                    </span>
                  </span>
                </label>

                {/* On-behalf email section */}
                {isOnBehalf && (
                  <div className="mt-4 pl-7 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={onBehalfEmail}
                          onChange={(e) => setOnBehalfEmail(e.target.value)}
                          placeholder="Enter email address"
                          className="flex-1 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                        />
                        <button
                          type="button"
                          onClick={checkEmailExists}
                          disabled={checkingEmail || !onBehalfEmail}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                        >
                          {checkingEmail ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Checking...
                            </span>
                          ) : (
                            'Check Email'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Email check result */}
                    {onBehalfUser && (
                      <div className={`p-4 rounded-lg ${
                        onBehalfUser.isRegistered 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        {onBehalfUser.isRegistered ? (
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800">
                                Email registered successfully
                              </p>
                              <p className="text-sm text-green-700 mt-1">
                                <strong>Name:</strong> {onBehalfUser.name}<br />
                                <strong>Position:</strong> {onBehalfUser.position}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-800">
                                Email not registered in system
                              </p>
                              <p className="text-sm text-red-600 mt-1">
                                The email address is not found. Please register first.
                              </p>
                              <Link
                                href="/auth/signup"
                                target="_blank"
                                className="inline-flex items-center mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Register New User
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Filler info display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filled By (Name)
                  </label>
                  <input
                    type="text"
                    value={isOnBehalf ? (onBehalfUser?.name || '') : currentUser.name}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isOnBehalf 
                      ? (onBehalfUser?.isRegistered ? 'Auto-filled from email check' : 'Enter email and click Check Email')
                      : 'Auto-filled from your profile'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={isOnBehalf ? (onBehalfUser?.position || '') : currentUser.position}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Authorizing Officer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                2. Authorizing Officer <span className="text-sm font-normal ml-2">(Required)</span>
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.officer_id || ''}
                    onChange={(e) => handleOfficerSelect(e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  >
                    <option value="">-- Select Officer --</option>
                    {OFFICERS.map((officer) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the officer who instructed this registration
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Officer Position
                  </label>
                  <input
                    type="text"
                    value={formData.officer_position || ''}
                    disabled
                    className="w-full rounded-lg border-gray-300 bg-gray-100 text-gray-600 px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto-filled when officer is selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Building Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                3. Building Selection
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Location Type</label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="location_type"
                      value="BLOCK"
                      checked={locationType === 'BLOCK'}
                      onChange={(e) => {
                        setLocationType('BLOCK');
                        handleInputChange('location_type', 'BLOCK');
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Block</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="location_type"
                      value="OUTDOOR"
                      checked={locationType === 'OUTDOOR'}
                      onChange={(e) => {
                        setLocationType('OUTDOOR');
                        handleInputChange('location_type', 'OUTDOOR');
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Outdoor Structures</span>
                  </label>
                </div>
              </div>

              {/* Outdoor Structure Name - only shown when OUTDOOR is selected */}
              {formData.location_type === 'OUTDOOR' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outdoor Structure Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.external_building_name || ''}
                    onChange={(e) => handleInputChange('external_building_name', e.target.value)}
                    placeholder="Enter outdoor structure name"
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  />
                </div>
              )}

              {/* Building Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Building <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.building_id || ''}
                  onChange={(e) => handleInputChange('building_id', e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                >
                  <option value="">-- Select a Building --</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name} - {building.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loading indicator */}
              {loadingBuildingData && (
                <div className="flex items-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                  Loading building data...
                </div>
              )}

              {/* Floor Selection */}
              {formData.building_id && selectedBuildingFloors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.floor || ''}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  >
                    <option value="">-- Select Floor --</option>
                    {selectedBuildingFloors.map((floor) => (
                      <option key={floor.id} value={floor.floor_name}>
                        {floor.floor_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Floors defined for this building
                  </p>
                </div>
              )}


            </div>
          </div>

          {/* Section 4: Finishes & Measurements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">4. Finishes & Measurements</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Floor Finish */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Finish</label>
                  <select
                    value={formData.floor_finish || ''}
                    onChange={(e) => handleInputChange('floor_finish', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  >
                    <option value="">-- Select Floor Finish --</option>
                    {FINISH_TYPES.filter(f => f.category === 'floor').map((finish) => (
                      <option key={finish.id} value={finish.name}>{finish.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor Area (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.floor_area || ''}
                    onChange={(e) => handleInputChange('floor_area', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  />
                </div>
              </div>

              {/* Ceiling Finish */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ceiling Finish</label>
                  <select
                    value={formData.ceiling_finish || ''}
                    onChange={(e) => handleInputChange('ceiling_finish', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  >
                    <option value="">-- Select Ceiling Finish --</option>
                    {FINISH_TYPES.filter(f => f.category === 'ceiling').map((finish) => (
                      <option key={finish.id} value={finish.name}>{finish.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ceiling Area (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.ceiling_area || ''}
                    onChange={(e) => handleInputChange('ceiling_area', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  />
                </div>
              </div>

              {/* Wall Finish */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wall Finish</label>
                  <select
                    value={formData.wall_finish || ''}
                    onChange={(e) => handleInputChange('wall_finish', e.target.value)}
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  >
                    <option value="">-- Select Wall Finish --</option>
                    {FINISH_TYPES.filter(f => f.category === 'wall').map((finish) => (
                      <option key={finish.id} value={finish.name}>{finish.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wall Area (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.wall_area || ''}
                    onChange={(e) => handleInputChange('wall_area', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: GPS Location */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                5. GPS Location
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Select location on the map or use the current location button to capture GPS coordinates.
              </p>
              
              <MapPicker
                latitude={formData.latitude ?? null}
                longitude={formData.longitude ?? null}
                onLocationChange={handleMapLocationChange}
                onZoneDetect={handleZoneDetect}
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Current Location
              </button>
              {(formData.latitude && formData.longitude) && (
                <p className="text-sm text-green-600 flex items-center bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Location captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              )}
              
              {/* Detected Zone Display */}
              {detectedZone && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-indigo-800">
                    Detected Zone: {detectedZone.zoneName}
                  </p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Zone will be automatically saved with this registration
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Photos */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                6. Photos
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo / Upload
                </button>
                <span className="text-sm text-gray-500">
                  {uploadedPhotos.length} photo(s) uploaded
                </span>
              </div>

              {/* Photo Preview Grid */}
              {uploadedPhotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 7: Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">7. Additional Notes</h2>
            </div>
            <div className="p-6">
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                placeholder="Enter any additional notes or comments..."
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Registration
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>SPARTA - Sistem Pendaftaran Aset Rol Tak Alih (DBKL)</p>
          <p className="mt-1">DA5 Registration Form</p>
        </div>
      </div>
    </div>
  );
}
