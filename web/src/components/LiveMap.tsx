import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  CampusStop, 
  ShuttleRoute, 
  ShuttleVehicle, 
  GeoPoint 
} from '../types/shuttle';
import { 
  Layers, 
  Compass, 
  Crosshair, 
  Maximize2, 
  Users, 
  Navigation, 
  Zap, 
  BatteryMedium,
  Radio,
  Clock
} from 'lucide-react';
import { CAMPUS_CENTER } from '../data/mockCampusData';

interface LiveMapProps {
  stops: CampusStop[];
  routes: ShuttleRoute[];
  shuttles: ShuttleVehicle[];
  selectedShuttleId: string | null;
  onSelectShuttle: (shuttle: ShuttleVehicle | null) => void;
  selectedStopId: string | null;
  onSelectStop: (stop: CampusStop | null) => void;
  selectedRouteFilter: string | 'all';
  onSetRouteFilter: (routeId: string | 'all') => void;
  studentLocation: GeoPoint;
  onSetArrivalAlert: (stopId: string, routeId: string, shuttleId?: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  stops,
  routes,
  shuttles,
  selectedShuttleId,
  onSelectShuttle,
  selectedStopId,
  onSelectStop,
  selectedRouteFilter,
  onSetRouteFilter,
  studentLocation,
  onSetArrivalAlert,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routePolylinesRef = useRef<{ [key: string]: L.Polyline }>({});
  const shuttleMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const stopMarkersRef = useRef<{ [key: string]: L.Marker }>({});
  const studentMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [CAMPUS_CENTER.lat, CAMPUS_CENTER.lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Dark high-contrast carto tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Subtle scale control
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Clear old polylines
    Object.keys(routePolylinesRef.current).forEach((key) => {
      const p = routePolylinesRef.current[key];
      if (p) p.remove();
    });
    routePolylinesRef.current = {};

    routes.forEach((route) => {
      const isVisible = selectedRouteFilter === 'all' || selectedRouteFilter === route.id;
      if (!isVisible) return;

      const latlngs: [number, number][] = route.path.map((p) => [p.lat, p.lng]);
      
      // Background glow line
      const glowLine = L.polyline(latlngs, {
        color: route.color,
        weight: 6,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Core crisp path line
      const mainLine = L.polyline(latlngs, {
        color: route.color,
        weight: 3.5,
        opacity: 0.9,
        dashArray: route.id === 'route-night-green' ? '6, 6' : undefined,
      }).addTo(map);

      mainLine.bindTooltip(`<b>${route.name}</b> (${route.code})`, {
        sticky: true,
        className: 'custom-map-tooltip',
      });

      routePolylinesRef.current[route.id] = mainLine;
      routePolylinesRef.current[`${route.id}-glow`] = glowLine;
    });
  }, [routes, selectedRouteFilter, mapReady]);

  // Render Stop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove old stops
    Object.keys(stopMarkersRef.current).forEach((key) => {
      const m = stopMarkersRef.current[key];
      if (m) m.remove();
    });
    stopMarkersRef.current = {};

    stops.forEach((stop) => {
      const isSelected = selectedStopId === stop.id;
      
      const customStopHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          ${isSelected ? '<div class="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></div>' : ''}
          <div class="w-7 h-7 rounded-full border-2 ${isSelected ? 'border-emerald-400 bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/50' : 'border-zinc-800 bg-zinc-900 text-zinc-100 shadow-md'} flex items-center justify-center transition-transform group-hover:scale-110">
            <span class="text-[9px] font-mono font-bold">${stop.code.slice(0, 2)}</span>
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-[10px] font-medium text-zinc-200 shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            ${stop.name}
          </div>
        </div>
      `;

      const stopIcon = L.divIcon({
        className: 'custom-stop-icon',
        html: customStopHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([stop.location.lat, stop.location.lng], { icon: stopIcon }).addTo(map);

      marker.on('click', () => {
        onSelectStop(stop);
      });

      stopMarkersRef.current[stop.id] = marker;
    });
  }, [stops, selectedStopId, mapReady, onSelectStop]);

  // Render Student Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (studentMarkerRef.current) {
      studentMarkerRef.current.remove();
    }

    const studentHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-3 rounded-full bg-sky-500/25 animate-ping"></div>
        <div class="w-6 h-6 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
        <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-sky-950 border border-sky-600 text-[9px] font-bold text-sky-200 shadow">
          You (Balme Walkway)
        </div>
      </div>
    `;

    const studentIcon = L.divIcon({
      className: 'student-loc-icon',
      html: studentHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    studentMarkerRef.current = L.marker([studentLocation.lat, studentLocation.lng], { icon: studentIcon }).addTo(map);
  }, [studentLocation, mapReady]);

  // Render & Animate Shuttle Markers with Heading and Real-time Telemetry
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    shuttles.forEach((shuttle) => {
      const isVisible = selectedRouteFilter === 'all' || selectedRouteFilter === shuttle.routeId;
      const existingMarker = shuttleMarkersRef.current[shuttle.id];

      if (!isVisible) {
        if (existingMarker) {
          existingMarker.remove();
          delete shuttleMarkersRef.current[shuttle.id];
        }
        return;
      }

      const isSelected = selectedShuttleId === shuttle.id;
      const route = routes.find((r) => r.id === shuttle.routeId);
      const routeColor = route?.color || '#10b981';

      // Occupancy pill color
      const isCrowded = shuttle.occupancyStatus === 'crowded' || shuttle.occupancyStatus === 'full';
      const occBg = isCrowded ? 'bg-amber-500' : 'bg-emerald-500';

      const shuttleHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group">
          <!-- Floating Status Badge -->
          <div class="mb-1 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-950/95 border border-zinc-700 shadow-lg text-[10px] font-bold text-white whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full ${occBg}"></span>
            <span class="font-mono">${shuttle.name.split('—')[0].trim()}</span>
            <span class="text-zinc-400 font-normal">| ${shuttle.speedKmh} km/h</span>
          </div>

          <!-- Bus Vehicle Pin with Heading Indicator -->
          <div class="relative w-9 h-9 rounded-xl flex items-center justify-center text-zinc-950 shadow-xl transition-transform ${isSelected ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-950' : 'group-hover:scale-110'}" style="background-color: ${routeColor};">
            <!-- Heading Direction Arrow -->
            <div class="absolute -top-2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-white transition-transform duration-300" style="transform: rotate(${shuttle.heading}deg); transform-origin: center 18px;"></div>
            
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>

          <!-- Solar Pulse Dot -->
          <div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border border-zinc-950 flex items-center justify-center shadow" title="Solar Telemetry Active">
            <div class="w-1.5 h-1.5 rounded-full bg-amber-200 animate-ping"></div>
          </div>
        </div>
      `;

      const shuttleIcon = L.divIcon({
        className: 'custom-shuttle-icon',
        html: shuttleHtml,
        iconSize: [40, 48],
        iconAnchor: [20, 24],
      });

      if (existingMarker) {
        existingMarker.setLatLng([shuttle.currentLocation.lat, shuttle.currentLocation.lng]);
        existingMarker.setIcon(shuttleIcon);
      } else {
        const marker = L.marker([shuttle.currentLocation.lat, shuttle.currentLocation.lng], { icon: shuttleIcon }).addTo(map);
        marker.on('click', () => {
          onSelectShuttle(shuttle);
        });
        shuttleMarkersRef.current[shuttle.id] = marker;
      }
    });

    // Cleanup markers that are no longer present
    const activeIds = new Set(shuttles.map((s) => s.id));
    Object.keys(shuttleMarkersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        shuttleMarkersRef.current[id].remove();
        delete shuttleMarkersRef.current[id];
      }
    });
  }, [shuttles, routes, selectedShuttleId, selectedRouteFilter, mapReady, onSelectShuttle]);

  // Center map controls
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([CAMPUS_CENTER.lat, CAMPUS_CENTER.lng], 15, { duration: 1 });
  };

  const handleZoomToStudent = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([studentLocation.lat, studentLocation.lng], 17, { duration: 1 });
  };

  const selectedShuttleObj = shuttles.find((s) => s.id === selectedShuttleId);
  const selectedStopObj = stops.find((s) => s.id === selectedStopId);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-zinc-950 flex flex-col overflow-hidden">
      {/* Route Filter Ribbon */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-[400] flex items-center gap-1.5 p-1.5 rounded-xl bg-zinc-950/90 border border-zinc-800/80 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full">
        <button
          onClick={() => onSetRouteFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedRouteFilter === 'all'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All Routes ({routes.length})
        </button>
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onSetRouteFilter(route.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedRouteFilter === route.id
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: route.color }} />
            <span>{route.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Map Action Quick Controls */}
      <div className="absolute top-4 right-4 z-[400] hidden sm:flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          title="Recenter Campus View"
          className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 shadow-xl backdrop-blur-md transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomToStudent}
          title="Zoom to My Location"
          className="p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 text-sky-400 hover:text-sky-300 hover:bg-zinc-900 shadow-xl backdrop-blur-md transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Main Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Selected Shuttle Live Telemetry Overlay Card */}
      {selectedShuttleObj && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-[400] bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">{selectedShuttleObj.name}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {selectedShuttleObj.plateNumber}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Driver: <span className="text-zinc-200">{selectedShuttleObj.driverName}</span> ({selectedShuttleObj.driverPhone})
              </p>
            </div>
            <button
              onClick={() => onSelectShuttle(null)}
              className="text-zinc-500 hover:text-zinc-300 text-sm p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 block">Next Stop</span>
              <span className="text-xs font-semibold text-white truncate block">
                {stops.find((s) => s.id === selectedShuttleObj.nextStopId)?.name.split(' ')[0] || 'En route'}
              </span>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 block">Arrival ETA</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {Math.ceil(selectedShuttleObj.etaSecondsToNextStop / 60)} min ({selectedShuttleObj.distanceToNextStopMeters}m)
              </span>
            </div>
            <div className="bg-zinc-900/80 p-2 rounded-xl border border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 block">Occupancy</span>
              <span className="text-xs font-semibold text-zinc-200">
                {selectedShuttleObj.currentPassengers}/{selectedShuttleObj.capacity} seats
              </span>
            </div>
          </div>

          {/* Hardware & IoT Micro-Stats */}
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/80">
            <div className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3 h-3" />
              <span>{selectedShuttleObj.hardware.solarPowerWatts}W Solar</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <BatteryMedium className="w-3 h-3" />
              <span>{selectedShuttleObj.hardware.batteryVoltage}V ({selectedShuttleObj.hardware.batteryPercentage}%)</span>
            </div>
            <div className="flex items-center gap-1 text-sky-400">
              <Radio className="w-3 h-3" />
              <span>{selectedShuttleObj.hardware.gsmRssi}dBm 2G</span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onSetArrivalAlert(selectedShuttleObj.nextStopId, selectedShuttleObj.routeId, selectedShuttleObj.id)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Notify My Arrival</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Stop Details Overlay */}
      {selectedStopObj && !selectedShuttleObj && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-[400] bg-zinc-950/95 border border-zinc-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedStopObj.code}
                </span>
                <h3 className="font-bold text-sm text-white">{selectedStopObj.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{selectedStopObj.description}</p>
            </div>
            <button onClick={() => onSelectStop(null)} className="text-zinc-500 hover:text-zinc-300 text-sm p-1">✕</button>
          </div>

          {/* Approaching Shuttles to this Stop */}
          <div className="my-3 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Approaching Shuttles</span>
            {shuttles
              .filter((s) => s.nextStopId === selectedStopObj.id)
              .map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/90 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">{s.name.split('—')[0]}</div>
                      <div className="text-[10px] text-zinc-400">{s.currentPassengers}/{s.capacity} aboard</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400 font-mono">
                      ~{Math.ceil(s.etaSecondsToNextStop / 60)} min
                    </div>
                    <div className="text-[10px] text-zinc-500">{s.distanceToNextStopMeters}m away</div>
                  </div>
                </div>
              ))}
            {shuttles.filter((s) => s.nextStopId === selectedStopObj.id).length === 0 && (
              <p className="text-xs text-zinc-500 italic py-1">No shuttles within 1 stop right now</p>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => onSetArrivalAlert(selectedStopObj.id, selectedStopObj.routes[0])}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Set Proximity Alarm for this Stop</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
