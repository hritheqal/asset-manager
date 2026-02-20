'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, X, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [3.1390, 101.6869];
const DEFAULT_ZOOM = 12;

let customIcon: any = null;

const getIcon = () => {
  if (typeof window === 'undefined') return null;
  if (!customIcon) {
    const L = require('leaflet');
    customIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
  return customIcon;
};

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

function LocationMarker({ lat, lng, onLocationChange }: { 
  lat: number | null; 
  lng: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const newLat = e.latlng.lat;
      const newLng = e.latlng.lng;
      onLocationChange(newLat, newLng);
    },
  });

  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  const icon = getIcon();
  if (lat && lng && icon) {
    return <Marker position={[lat, lng]} icon={icon} />;
  }
  return null;
}

export default function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const [lat, setLat] = useState<number | null>(latitude ?? null);
  const [lng, setLng] = useState<number | null>(longitude ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLat(latitude ?? null);
    setLng(longitude ?? null);
  }, [latitude, longitude]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: curLat, longitude: curLng } = position.coords;
        setLat(curLat);
        setLng(curLng);
        onLocationChange(curLat, curLng);
        setLoading(false);
      },
      (err) => {
        setError('Unable to retrieve your location. Please check your browser permissions.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearLocation = () => {
    setLat(null);
    setLng(null);
    onLocationChange(0, 0);
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setLat(null);
      return;
    }
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      setLat(numVal);
      onLocationChange(numVal, lng ?? 0);
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setLng(null);
      return;
    }
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      setLng(numVal);
      onLocationChange(lat ?? 0, numVal);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Location on Map
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Navigation className="h-4 w-4 mr-1" />
            {loading ? 'Getting...' : 'Current Location'}
          </button>
          {(lat !== null || lng !== null) && (
            <button
              type="button"
              onClick={clearLocation}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={lat !== null && lng !== null ? [lat, lng] : DEFAULT_CENTER}
          zoom={lat !== null && lng !== null ? 15 : DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            lat={lat} 
            lng={lng}
            onLocationChange={onLocationChange}
          />
        </MapContainer>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={lat ?? ''}
            onChange={handleLatChange}
            placeholder="Click on map or use current location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={lng ?? ''}
            onChange={handleLngChange}
            placeholder="Click on map or use current location"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500 flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Click on the map or use &quot;Current Location&quot; to set the building location
      </p>
    </div>
  );
}
