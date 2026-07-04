import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMap, useMapsLibrary, AdvancedMarker } from '@vis.gl/react-google-maps';
import { WardData, Submission } from '../types';
import { Layers, Users, GraduationCap, Flame, Droplet, MapPin, Eye } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface GoogleMapComponentProps {
  cityName: string;
  wards: WardData[];
  submissions: Submission[];
  selectedWardId: string | null;
  onSelectWard: (wardId: string | null) => void;
}

// Custom Polygon Component using standard google.maps.Polygon
const Polygon: React.FC<{
  paths: google.maps.LatLngLiteral[];
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  onClick?: () => void;
}> = ({ paths, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight, onClick }) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    const polygon = new google.maps.Polygon({
      paths,
      fillColor,
      fillOpacity,
      strokeColor,
      strokeOpacity,
      strokeWeight,
    });

    polygon.setMap(map);
    polygonRef.current = polygon;

    let clickListener: google.maps.MapsEventListener | null = null;
    if (onClick) {
      clickListener = google.maps.event.addListener(polygon, 'click', () => {
        onClick();
      });
    }

    return () => {
      polygon.setMap(null);
      if (clickListener) {
        google.maps.event.removeListener(clickListener);
      }
    };
  }, [map, paths, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  // Handle dynamic style updates without recreating the polygon
  useEffect(() => {
    if (polygonRef.current) {
      polygonRef.current.setOptions({
        fillColor,
        fillOpacity,
        strokeColor,
        strokeOpacity,
        strokeWeight,
      });
    }
  }, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWeight]);

  return null;
};

interface CityCenterMarkerProps {
  cityName: string;
  onCenterResolved: (location: google.maps.LatLngLiteral) => void;
}

const CityCenterMarker: React.FC<CityCenterMarkerProps> = ({ cityName, onCenterResolved }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib || !cityName || !map) return;
    
    placesLib.Place.searchByText({
      textQuery: cityName,
      fields: ['location'],
      maxResultCount: 1,
    }).then(({ places }) => {
      if (places?.[0]?.location) {
        const location = places[0].location;
        const lat = typeof location.lat === 'function' ? (location.lat as any)() : (location.lat as any);
        const lng = typeof location.lng === 'function' ? (location.lng as any)() : (location.lng as any);
        
        const resolved = { lat, lng };
        onCenterResolved(resolved);
        map.setCenter(resolved);
        map.setZoom(12);
      }
    });
  }, [placesLib, cityName, map]);

  return null;
};

export const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  cityName,
  wards,
  submissions,
  selectedWardId,
  onSelectWard,
}) => {
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [activeMetric, setActiveMetric] = useState<'submissions' | 'schools' | 'clinics' | 'water'>('submissions');

  // Trigger coordinate search when city name changes
  useEffect(() => {
    setMapCenter(null);
  }, [cityName]);

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-[550px] bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-400 font-sans text-sm text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500 animate-bounce" />
            Google Maps API Key Required
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Get an API key from Google Cloud Console to unlock interactive spatial heatmaps, ward polygon overlays, and real-time division analysis.
          </p>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs">
            <p><strong>To add your API key:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-slate-350">
              <li>Get an API key: <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline hover:text-cyan-300">Google Maps Start</a></li>
              <li>Open <strong>Settings</strong> (⚙️ gear icon, top-right corner)</li>
              <li>Go to <strong>Secrets</strong></li>
              <li>Add a secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code></li>
            </ol>
          </div>
          <p className="text-[10px] text-slate-550">The app will rebuild automatically after saving the secret.</p>
        </div>
      </div>
    );
  }

  // Calculate metric values
  const getMetricValue = (ward: WardData) => {
    if (activeMetric === 'submissions') {
      return submissions.filter(sub => sub.ward.toLowerCase() === ward.name.toLowerCase()).length;
    }
    if (activeMetric === 'schools') {
      return ward.infrastructureGaps.schools;
    }
    if (activeMetric === 'clinics') {
      return ward.infrastructureGaps.clinics;
    }
    // water
    return ward.infrastructureGaps.waterAccess;
  };

  const values = wards.map(getMetricValue);
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 10;

  // Get color scale
  const getMetricColor = (value: number) => {
    if (maxValue === minValue) return '#06b6d4'; // default cyan
    const ratio = (value - minValue) / (maxValue - minValue || 1);
    if (ratio > 0.75) return '#ef4444'; // Red (High deficit/urgency)
    if (ratio > 0.5) return '#f97316';  // Orange
    if (ratio > 0.25) return '#eab308'; // Yellow
    return '#10b981'; // Green (Low deficit/urgency)
  };

  // Helper to generate coordinates for a clean circle sector
  const generateSectorPolygon = (center: google.maps.LatLngLiteral, index: number, total: number) => {
    const points: google.maps.LatLngLiteral[] = [];
    const anglePerSector = 360 / total;
    const startAngle = index * anglePerSector;
    const endAngle = (index + 1) * anglePerSector;
    const radius = 0.04; // ~4.5km
    const lngFactor = 1 / Math.cos((center.lat * Math.PI) / 180);

    points.push(center);

    const steps = 8;
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (i * (endAngle - startAngle)) / steps;
      const rad = (angle * Math.PI) / 180;
      points.push({
        lat: center.lat + Math.cos(rad) * radius,
        lng: center.lng + Math.sin(rad) * radius * lngFactor,
      });
    }

    return points;
  };

  // Helper to get midpoint of sector for placing marker
  const getSectorLabelPosition = (center: google.maps.LatLngLiteral, index: number, total: number) => {
    const anglePerSector = 360 / total;
    const midAngle = index * anglePerSector + anglePerSector / 2;
    const radius = 0.024; // ~60% out for label
    const rad = (midAngle * Math.PI) / 180;
    const lngFactor = 1 / Math.cos((center.lat * Math.PI) / 180);

    return {
      lat: center.lat + Math.cos(rad) * radius,
      lng: center.lng + Math.sin(rad) * radius * lngFactor,
    };
  };

  const selectedWard = wards.find(w => w.id === selectedWardId);

  return (
    <div className="relative h-[550px] w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Floating control panel */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-xl max-w-xs w-60 space-y-3 font-sans">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-xs uppercase tracking-wider">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Heatmap Layer</span>
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs">
          <button
            onClick={() => setActiveMetric('submissions')}
            className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
              activeMetric === 'submissions'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-semibold'
                : 'bg-slate-950/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/70'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Submissions Density</span>
            </span>
          </button>
          <button
            onClick={() => setActiveMetric('schools')}
            className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
              activeMetric === 'schools'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-semibold'
                : 'bg-slate-950/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/70'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>School Gaps</span>
            </span>
          </button>
          <button
            onClick={() => setActiveMetric('clinics')}
            className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
              activeMetric === 'clinics'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-semibold'
                : 'bg-slate-950/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/70'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Clinic Deficits</span>
            </span>
          </button>
          <button
            onClick={() => setActiveMetric('water')}
            className={`flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
              activeMetric === 'water'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-semibold'
                : 'bg-slate-950/40 border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-950/70'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-400" />
              <span>Water Access Gaps</span>
            </span>
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/95 backdrop-blur border border-slate-800/80 px-3 py-2 rounded-xl shadow-lg flex items-center gap-3 text-[10px] font-sans text-slate-300">
        <span className="font-semibold text-slate-450 uppercase tracking-wide">Priority:</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#10b981]" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#eab308]" />
          <span>Med-Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#f97316]" />
          <span>Med-High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-[#ef4444]" />
          <span>Critical</span>
        </div>
      </div>

      {/* Ward Details Panel */}
      {selectedWard && (
        <div className="absolute top-4 right-4 z-10 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl max-w-xs w-64 space-y-3 font-sans text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h4 className="text-slate-100 font-bold text-sm tracking-tight">{selectedWard.name}</h4>
              <p className="text-[10px] text-slate-450 uppercase tracking-wider font-semibold">Active Ward Insights</p>
            </div>
            <button
              onClick={() => onSelectWard(null)}
              className="text-slate-400 hover:text-slate-200 text-[10px] py-1 px-2 bg-slate-950/50 hover:bg-slate-950 border border-slate-800 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-455">Population:</span>
              <span className="text-slate-100 font-medium">{selectedWard.population.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Avg Income Tier:</span>
              <span className="text-slate-100 font-medium">{selectedWard.avgIncome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Elderly Ratio:</span>
              <span className="text-slate-100 font-medium">{selectedWard.elderlyRatio}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-455">Student Ratio:</span>
              <span className="text-slate-100 font-medium">{selectedWard.studentRatio}%</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Infrastructure Gap Metrics</span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-450 block">School Deficit</span>
                <span className="text-cyan-400 font-bold text-xs">{selectedWard.infrastructureGaps.schools}/10</span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-450 block">Clinics Deficit</span>
                <span className="text-cyan-400 font-bold text-xs">{selectedWard.infrastructureGaps.clinics}/10</span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-455 block">Water Deficit</span>
                <span className="text-cyan-400 font-bold text-xs">{selectedWard.infrastructureGaps.waterAccess}%</span>
              </div>
              <div className="bg-slate-950/50 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-455 block">Road Quality</span>
                <span className="text-cyan-400 font-bold text-xs">{selectedWard.infrastructureGaps.roadQuality}/10</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Identified Local Needs</span>
            <div className="flex flex-wrap gap-1">
              {selectedWard.primaryNeeds.map((need, idx) => (
                <span key={idx} className="bg-cyan-950/40 border border-cyan-900/30 text-cyan-300 text-[9px] px-2 py-0.5 rounded-md">
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Primary Map instance */}
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          defaultZoom={5}
          mapId="DEMO_MAP_ID"
          disableDefaultUI={true}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <CityCenterMarker cityName={cityName} onCenterResolved={setMapCenter} />

          {/* Render polygon overlay layers if city center is resolved */}
          {mapCenter &&
            wards.map((ward, index) => {
              const sectorPaths = generateSectorPolygon(mapCenter, index, wards.length);
              const labelPosition = getSectorLabelPosition(mapCenter, index, wards.length);
              const metricValue = getMetricValue(ward);
              const baseColor = getMetricColor(metricValue);
              
              const isSelected = selectedWardId === ward.id;
              const fillOpacity = isSelected ? 0.65 : 0.35;
              const strokeWeight = isSelected ? 3 : 1.5;
              const strokeColor = isSelected ? '#ffffff' : baseColor;

              return (
                <React.Fragment key={ward.id}>
                  {/* Sector Polygon Layer */}
                  <Polygon
                    paths={sectorPaths}
                    fillColor={baseColor}
                    fillOpacity={fillOpacity}
                    strokeColor={strokeColor}
                    strokeOpacity={0.8}
                    strokeWeight={strokeWeight}
                    onClick={() => onSelectWard(selectedWardId === ward.id ? null : ward.id)}
                  />

                  {/* Ward Label Badge AdvancedMarker */}
                  <AdvancedMarker
                    position={labelPosition}
                    onClick={() => onSelectWard(selectedWardId === ward.id ? null : ward.id)}
                  >
                    <div className={`px-2 py-1 bg-slate-900/90 hover:bg-slate-900 border ${
                      isSelected ? 'border-cyan-400 shadow-cyan-500/20 shadow-md' : 'border-slate-800'
                    } rounded-md flex items-center gap-1 cursor-pointer transition-all select-none`}>
                      <span className="text-[9px] font-bold text-slate-100 whitespace-nowrap">{ward.name}</span>
                      <span
                        className="text-[8px] px-1 rounded-sm text-white font-mono font-bold"
                        style={{ backgroundColor: baseColor }}
                      >
                        {metricValue}
                      </span>
                    </div>
                  </AdvancedMarker>
                </React.Fragment>
              );
            })}
        </Map>
      </APIProvider>
    </div>
  );
};
