'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import Link from 'next/link';
import { Building, MapPin, Layers, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [3.1390, 101.6869];
const DEFAULT_ZOOM = 11;
const CLUSTER_ZOOM_THRESHOLD = 14;

let buildingIcon: any = null;

const getBuildingIcon = () => {
  if (typeof window === 'undefined') return null;
  if (!buildingIcon) {
    const L = require('leaflet');
    buildingIcon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
  return buildingIcon;
};

function getZoneFromCoordinates(lat: number, lng: number): string {
  const zones: Record<string, { center: [number, number]; radius: number }> = {
    'Zone A - KL': { center: [3.1478, 101.6922], radius: 0.04 },
    'Zone B - Cheras': { center: [3.1072, 101.7577], radius: 0.05 },
    'Zone C - Kepong': { center: [3.2118, 101.6397], radius: 0.04 },
    'Zone D - Lembah Pantai': { center: [3.0894, 101.6856], radius: 0.04 },
    'Zone E - Segambut': { center: [3.1878, 101.6719], radius: 0.04 },
    'Zone F - TTDI': { center: [3.1990, 101.7100], radius: 0.03 },
    'Zone G - Setapak': { center: [3.2678, 101.6986], radius: 0.04 },
    'Zone H - Wangsa Maju': { center: [3.2144, 101.7386], radius: 0.03 },
    'Zone I - Bandar Tun Razak': { center: [3.0856, 101.7308], radius: 0.04 },
    'Zone J - Bukit Jalil': { center: [3.0572, 101.6856], radius: 0.05 },
    'Zone K - Seputeh': { center: [3.0992, 101.7019], radius: 0.03 },
    'Zone L - Taman Desa': { center: [3.0772, 101.6769], radius: 0.03 },
    'Zone M - Taman Connaught': { center: [3.1286, 101.7567], radius: 0.03 },
    'Zone N - Bandar Menjalara': { center: [3.1917, 101.6308], radius: 0.03 },
    'Zone O - Sri Hartamas': { center: [3.1639, 101.6539], radius: 0.03 },
  };

  let closestZone = 'Zone A - KL';
  let minDistance = Infinity;

  for (const [zoneName, zone] of Object.entries(zones)) {
    const distance = Math.sqrt(
      Math.pow(lat - zone.center[0], 2) + Math.pow(lng - zone.center[1], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestZone = zoneName;
    }
  }

  return closestZone;
}

interface BuildingData {
  id: string;
  name: string;
  address: string;
  city?: string;
  latitude: number;
  longitude: number;
  asset_count?: number;
}

interface ZoneCluster {
  name: string;
  count: number;
  buildings: BuildingData[];
  center: [number, number];
}

interface MapDashboardProps {
  buildings: BuildingData[];
}

function MapController({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  const map = useMap();
  
  useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });
  
  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);
  
  return null;
}

function ZoomControls({ onZoomIn, onZoomOut, onFitBounds }: { 
  onZoomIn: () => void; 
  onZoomOut: () => void;
  onFitBounds: () => void;
}) {
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <div className="leaflet-control leaflet-control-group bg-white rounded-md shadow-md">
        <button
          onClick={onZoomIn}
          className="w-8 h-8 flex items-center justify-center border-b border-gray-200 hover:bg-gray-100 rounded-t-md"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="w-8 h-8 flex items-center justify-center border-b border-gray-200 hover:bg-gray-100"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={onFitBounds}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-b-md"
          title="Fit all buildings"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function MapDashboard({ buildings }: MapDashboardProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const mapRef = useRef<any>(null);

  const buildingsWithLocation = useMemo(() => 
    buildings.filter(b => b.latitude && b.longitude),
    [buildings]
  );

  const clusters = useMemo(() => {
    const zoneMap = new Map<string, ZoneCluster>();
    
    buildingsWithLocation.forEach(building => {
      const zoneKey = getZoneFromCoordinates(building.latitude, building.longitude);
      const existing = zoneMap.get(zoneKey);
      
      if (existing) {
        existing.count += 1;
        existing.buildings.push(building);
      } else {
        zoneMap.set(zoneKey, {
          name: zoneKey,
          count: 1,
          buildings: [building],
          center: [building.latitude, building.longitude],
        });
      }
    });
    
    return Array.from(zoneMap.values());
  }, [buildingsWithLocation]);

  const isClusterView = zoom < CLUSTER_ZOOM_THRESHOLD;

  const getClusterColor = (count: number) => {
    if (count >= 10) return '#dc2626';
    if (count >= 5) return '#f59e0b';
    return '#22c55e';
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  };

  const handleFitBounds = () => {
    if (mapRef.current && buildingsWithLocation.length > 0) {
      const L = require('leaflet');
      const bounds = L.latLngBounds(
        buildingsWithLocation.map(b => [b.latitude, b.longitude] as [number, number])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController onZoomChange={setZoom} />
        
        <ZoomControls 
          onZoomIn={handleZoomIn} 
          onZoomOut={handleZoomOut}
          onFitBounds={handleFitBounds}
        />

        {isClusterView ? (
          clusters.map((cluster) => (
            <CircleMarker
              key={cluster.name}
              center={cluster.center}
              radius={Math.min(Math.max(cluster.count * 3, 15), 40)}
              pathOptions={{
                color: 'white',
                fillColor: getClusterColor(cluster.count),
                fillOpacity: 0.8,
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{cluster.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{cluster.count}</span> building{cluster.count > 1 ? 's' : ''}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Buildings:</p>
                      <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                        {cluster.buildings.slice(0, 5).map((b) => (
                          <li key={b.id} className="truncate">
                            <Link 
                              href={`/buildings/${b.id}`}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {b.name}
                            </Link>
                          </li>
                        ))}
                        {cluster.buildings.length > 5 && (
                          <li className="text-gray-500">
                            +{cluster.buildings.length - 5} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))
        ) : (
          buildingsWithLocation.map((building) => (
            <Marker
              key={building.id}
              position={[building.latitude, building.longitude]}
              icon={getBuildingIcon()}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">{building.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{building.address}</p>
                  {building.city && (
                    <p className="text-xs text-gray-500 mb-2">{building.city}</p>
                  )}
                  {building.asset_count !== undefined && (
                    <p className="text-sm text-indigo-600">
                      <Layers className="inline h-3 w-3 mr-1" />
                      {building.asset_count} asset{building.asset_count > 1 ? 's' : ''}
                    </p>
                  )}
                  <Link
                    href={`/buildings/${building.id}`}
                    className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>1-4</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>5-9</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>10+</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Zoom level: {zoom} ({isClusterView ? 'Cluster view' : 'Individual view'})
        </p>
      </div>
    </div>
  );
}
