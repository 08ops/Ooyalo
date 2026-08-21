import React, { useState } from 'react';
import { 
  CampusStop, 
  ShuttleRoute, 
  ShuttleVehicle, 
  ArrivalNotificationConfig, 
  GeoPoint 
} from '../types/shuttle';
import { 
  Clock, 
  Radio, 
  Users, 
  Bell, 
  BellRing, 
  Search, 
  MapPin, 
  Compass, 
  Footprints, 
  Zap, 
  Check, 
  ChevronRight, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { calculateDistanceMeters } from '../services/simulationEngine';
import { soundEffects } from '../services/soundEffects';

interface StudentArrivalPanelProps {
  stops: CampusStop[];
  routes: ShuttleRoute[];
  shuttles: ShuttleVehicle[];
  activeAlerts: ArrivalNotificationConfig[];
  onAddAlert: (alert: Omit<ArrivalNotificationConfig, 'id' | 'createdAt'>) => void;
  onRemoveAlert: (alertId: string) => void;
  onSelectShuttle: (shuttle: ShuttleVehicle) => void;
  onSelectStop: (stop: CampusStop) => void;
  studentLocation: GeoPoint;
}

export const StudentArrivalPanel: React.FC<StudentArrivalPanelProps> = ({
  stops,
  routes,
  shuttles,
  activeAlerts,
  onAddAlert,
  onRemoveAlert,
  onSelectShuttle,
  onSelectStop,
  studentLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState<string | 'all'>('all');
  const [alertModalStopId, setAlertModalStopId] = useState<string | null>(null);
  const [alertThresholdMins, setAlertThresholdMins] = useState<number>(3);
  const [alertSound, setAlertSound] = useState<boolean>(true);

  // Find nearest stop to student
  const stopsWithDistance = stops.map((stop) => {
    const dist = calculateDistanceMeters(studentLocation, stop.location);
    const walkTimeMins = Math.max(1, Math.round(dist / 75)); // ~4.5 km/h walk speed
    return { ...stop, distanceMeters: dist, walkTimeMins };
  }).sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestStop = stopsWithDistance[0];

  // Filter shuttles
  const filteredShuttles = shuttles
    .filter((shuttle) => {
      if (selectedRouteId !== 'all' && shuttle.routeId !== selectedRouteId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nextStop = stops.find((s) => s.id === shuttle.nextStopId);
        const route = routes.find((r) => r.id === shuttle.routeId);
        return (
          shuttle.name.toLowerCase().includes(q) ||
          shuttle.plateNumber.toLowerCase().includes(q) ||
          (nextStop && nextStop.name.toLowerCase().includes(q)) ||
          (route && route.name.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => a.etaSecondsToNextStop - b.etaSecondsToNextStop);

  const handleCreateAlert = (stopId: string, routeId: string, shuttleId?: string) => {
    onAddAlert({
      stopId,
      routeId,
      shuttleId,
      thresholdMinutes: alertThresholdMins,
      enabled: true,
      notifySound: alertSound,
    });
    soundEffects.playArrivalChime();
    setAlertModalStopId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner / Student Nearest Stop Context */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Your Nearest Stop</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                {nearestStop.code}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{nearestStop.name}</h2>
            <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
              <span className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-zinc-500" />
                {nearestStop.distanceMeters}m ({nearestStop.walkTimeMins} min walk)
              </span>
              <span>•</span>
              <span className="text-zinc-300">
                Serving: {nearestStop.routes.map(rId => routes.find(r => r.id === rId)?.name.split(' ')[0]).join(', ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectStop(nearestStop)}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            View Stop Timetable
          </button>
          <button
            onClick={() => setAlertModalStopId(nearestStop.id)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <BellRing className="w-4 h-4" />
            <span>Set Arrival Alert</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shuttle, route, or stop..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Route Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRouteId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedRouteId === 'all'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200'
            }`}
          >
            All Lines
          </button>
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRouteId === route.id
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'bg-zinc-900/60 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }} />
              <span>{route.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Approaching Shuttles (Left/Main) & Active Proximity Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Approaching Shuttles Live Cards */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live Approaches ({filteredShuttles.length})
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Auto-refreshing 1s GPS</span>
          </div>

          {filteredShuttles.length === 0 ? (
            <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm text-zinc-400 font-medium">No shuttles match your filter</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedRouteId('all'); }}
                className="mt-2 text-xs text-emerald-400 underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredShuttles.map((shuttle) => {
              const route = routes.find((r) => r.id === shuttle.routeId);
              const nextStop = stops.find((s) => s.id === shuttle.nextStopId);
              const etaMinutes = Math.ceil(shuttle.etaSecondsToNextStop / 60);
              const isImminent = etaMinutes <= 2;
              const fillPct = Math.round((shuttle.currentPassengers / shuttle.capacity) * 100);

              const hasAlert = activeAlerts.some(
                (a) => a.enabled && a.stopId === shuttle.nextStopId && (!a.shuttleId || a.shuttleId === shuttle.id)
              );

              return (
                <div
                  key={shuttle.id}
                  className={`p-4 rounded-2xl bg-zinc-900/90 border transition-all ${
                    isImminent
                      ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/40 bg-gradient-to-r from-zinc-900 via-zinc-900 to-emerald-950/20'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Bus Info & Route */}
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md"
                        style={{ backgroundColor: route?.color || '#10b981' }}
                      >
                        <span className="font-mono text-xs">{shuttle.name.split('—')[0].replace('Shuttle ', '#')}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{shuttle.name}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {shuttle.plateNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                          <span className="text-zinc-300 font-medium">{route?.name}</span>
                          <span>•</span>
                          <span>Speed: <strong className="text-zinc-200 font-mono">{shuttle.speedKmh} km/h</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* ETA Countdown Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-lg font-mono font-extrabold ${isImminent ? 'text-emerald-400 animate-pulse' : 'text-zinc-100'}`}>
                          {etaMinutes} min
                        </div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{shuttle.distanceToNextStopMeters}m to {nextStop?.name.split(' ')[0]}</span>
                        </div>
                      </div>

                      {/* Alert Bell Button */}
                      <button
                        onClick={() => {
                          if (hasAlert) {
                            const alert = activeAlerts.find((a) => a.stopId === shuttle.nextStopId);
                            if (alert) onRemoveAlert(alert.id);
                          } else {
                            setAlertModalStopId(shuttle.nextStopId);
                          }
                        }}
                        title={hasAlert ? 'Alert active for this stop' : 'Set arrival alert'}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          hasAlert
                            ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Occupancy & Live Status Row */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Capacity Bar */}
                    <div className="flex-1 max-w-sm">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Users className="w-3 h-3 text-zinc-500" />
                          Occupancy: <strong className="text-zinc-200">{shuttle.currentPassengers} / {shuttle.capacity}</strong>
                        </span>
                        <span className={`font-semibold ${fillPct > 85 ? 'text-rose-400' : fillPct > 65 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {fillPct > 85 ? 'Standing Only' : fillPct > 65 ? 'Moderate' : 'Seats Open'} ({fillPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            fillPct > 85 ? 'bg-rose-500' : fillPct > 65 ? 'bg-amber-500' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    {/* IoT Telemetry Mini-Tag */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                        <Zap className="w-2.5 h-2.5" />
                        {shuttle.hardware.solarPowerWatts}W Solar
                      </span>
                      <button
                        onClick={() => onSelectShuttle(shuttle)}
                        className="text-emerald-400 hover:text-emerald-300 font-sans font-semibold flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Sidebar: Active Proximity Alarms & Stop Guide */}
        <div className="space-y-6">
          {/* Active Notifications Card */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-emerald-400" />
                Active Proximity Alarms ({activeAlerts.length})
              </h4>
            </div>

            {activeAlerts.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-500">
                <p>No active alerts set.</p>
                <p className="mt-1 text-[11px] text-zinc-400">
                  Tap the bell icon on any stop or shuttle to receive a notification before arrival!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeAlerts.map((alert) => {
                  const stop = stops.find((s) => s.id === alert.stopId);
                  const route = routes.find((r) => r.id === alert.routeId);
                  return (
                    <div
                      key={alert.id}
                      className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{stop?.name || 'Selected Stop'}</div>
                        <div className="text-[10px] text-zinc-400">
                          Notify when ≤ {alert.thresholdMinutes} mins away • {route?.name.split(' ')[0]}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveAlert(alert.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/30 border border-rose-800/40"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Campus Stops Directory */}
          <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 shadow-xl">
            <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Campus Stops ({stops.length})
            </h4>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {stopsWithDistance.map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop)}
                  className="p-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/60 border border-zinc-800/80 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono px-1 rounded bg-zinc-800 text-zinc-300">
                        {stop.code}
                      </span>
                      <span className="text-xs font-bold text-zinc-200">{stop.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">
                      {stop.distanceMeters}m walk • {stop.routes.length} line(s)
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Proximity Alert Configuration Modal */}
      {alertModalStopId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-emerald-400" />
                  Set Arrival Proximity Alarm
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Target Stop: <strong className="text-zinc-200">{stops.find((s) => s.id === alertModalStopId)?.name}</strong>
                </p>
              </div>
              <button onClick={() => setAlertModalStopId(null)} className="text-zinc-500 hover:text-zinc-300 text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300 block">
                Notify me when shuttle ETA is within:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 5].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setAlertThresholdMins(mins)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      alertThresholdMins === mins
                        ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {mins} Minutes
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-zinc-300 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Play transit audio chime
                </span>
                <input
                  type="checkbox"
                  checked={alertSound}
                  onChange={(e) => setAlertSound(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setAlertModalStopId(null)}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetStop = stops.find((s) => s.id === alertModalStopId);
                  if (targetStop) {
                    handleCreateAlert(targetStop.id, targetStop.routes[0]);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
              >
                Activate Alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
