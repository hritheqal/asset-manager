'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import Link from 'next/link';
import { Building, MapPin, Layers, ZoomIn, ZoomOut, Maximize2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [3.1390, 101.6869];
const DEFAULT_ZOOM = 11;
const CLUSTER_ZOOM_THRESHOLD = 14;

let da5Icon: any = null;

const getDA5Icon = () => {
  if (typeof window === 'undefined') return null;
  if (!da5Icon) {
    const L = require('leaflet');
    da5Icon = new L.Icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
  return da5Icon;
};

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

interface DA5Cluster {
  name: string;
  count: number;
  records: DA5Data[];
  center: [number, number];
}

interface MapDashboardProps {
  da5Data: DA5Data[];
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
          title="Fit all points"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'submitted':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'draft':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    default:
      return <CheckCircle className="h-4 w-4 text-gray-600" />;
  }
}

export default function MapDashboard({ da5Data }: MapDashboardProps) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const mapRef = useRef<any>(null);

  const recordsWithLocation = useMemo(() => 
    da5Data.filter(d => d.latitude && d.longitude),
    [da5Data]
  );

  const clusters = useMemo(() => {
    const clusterMap = new Map<string, DA5Cluster>();
    
    recordsWithLocation.forEach(record => {
      // Cluster by building
      const key = record.building_id;
      const existing = clusterMap.get(key);
      
      if (existing) {
        existing.count += 1;
        existing.records.push(record);
      } else {
        clusterMap.set(key, {
          name: record.building_name || 'Unknown',
          count: 1,
          records: [record],
          center: [record.latitude, record.longitude],
        });
      }
    });
    
    return Array.from(clusterMap.values());
  }, [recordsWithLocation]);

  const isClusterView = zoom < CLUSTER_ZOOM_THRESHOLD;

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
    if (mapRef.current && recordsWithLocation.length > 0) {
      const L = require('leaflet');
      const bounds = L.latLngBounds(
        recordsWithLocation.map(r => [r.latitude, r.longitude] as [number, number])
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
                fillColor: '#6366f1',
                fillOpacity: 0.8,
                weight: 3,
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-2">{cluster.name}</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{cluster.count}</span> DA5 record{cluster.count > 1 ? 's' : ''}
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Records:</p>
                      <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                        {cluster.records.slice(0, 5).map((r) => (
                          <li key={r.id} className="flex items-center justify-between">
                            <span className="truncate">{r.floor || 'N/A'} - {r.room || 'N/A'}</span>
                            {getStatusIcon(r.status)}
                          </li>
                        ))}
                        {cluster.records.length > 5 && (
                          <li className="text-gray-500">
                            +{cluster.records.length - 5} more...
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
          recordsWithLocation.map((record) => (
            <Marker
              key={record.id}
              position={[record.latitude, record.longitude]}
              icon={getDA5Icon()}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">{record.building_name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3 text-gray-500" />
                      <span>Floor: {record.floor || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span>Room: {record.room || 'N/A'}</span>
                    </div>
                    {record.floor_finish && (
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-gray-500" />
                        <span>{record.floor_finish}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                      {getStatusIcon(record.status)}
                      <span className="font-medium">{record.status}</span>
                    </div>
                  </div>
                  <Link
                    href={`/sparta?building=${record.building_id}`}
                    className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    View Records
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
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span>DA5 Points</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Zoom level: {zoom} ({isClusterView ? 'Cluster view' : 'Individual view'})
        </p>
      </div>
    </div>
  );
}
