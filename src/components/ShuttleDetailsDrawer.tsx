import React from 'react';
import { 
  ShuttleVehicle, 
  ShuttleRoute, 
  CampusStop 
} from '../types/shuttle';
import { 
  Bus, 
  Users, 
  Phone, 
  User, 
  MapPin, 
  Clock, 
  Zap, 
  BatteryMedium, 
  Radio, 
  Compass, 
  BellRing,
  AlertCircle
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface ShuttleDetailsDrawerProps {
  shuttle: ShuttleVehicle | null;
  onClose: () => void;
  routes: ShuttleRoute[];
  stops: CampusStop[];
  onSetAlert: (stopId: string, routeId: string, shuttleId: string) => void;
}

export const ShuttleDetailsDrawer: React.FC<ShuttleDetailsDrawerProps> = ({
  shuttle,
  onClose,
  routes,
  stops,
  onSetAlert,
}) => {
  if (!shuttle) return null;

  const route = routes.find((r) => r.id === shuttle.routeId);
  const nextStop = stops.find((s) => s.id === shuttle.nextStopId);
  const fillPct = Math.round((shuttle.currentPassengers / shuttle.capacity) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg"
                style={{ backgroundColor: route?.color || '#10b981' }}
              >
                <Bus className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">{shuttle.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                  <span className="font-mono text-zinc-300">{shuttle.plateNumber}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{route?.name}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-base p-1">✕</button>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Speed</span>
              <span className="text-sm font-mono font-extrabold text-white">{shuttle.speedKmh} km/h</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Heading</span>
              <span className="text-sm font-mono font-extrabold text-white">{shuttle.heading}°</span>
            </div>
            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 block uppercase font-semibold">ETA Next</span>
              <span className="text-sm font-mono font-extrabold text-emerald-400">
                {Math.ceil(shuttle.etaSecondsToNextStop / 60)} min
              </span>
            </div>
          </div>

          {/* Passenger Capacity & Comfort Gauge */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5 font-semibold">
                <Users className="w-4 h-4 text-zinc-500" />
                Live Passenger Count
              </span>
              <span className="text-white font-bold">
                {shuttle.currentPassengers} / {shuttle.capacity} seats ({fillPct}%)
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  fillPct > 85 ? 'bg-rose-500' : fillPct > 65 ? 'bg-amber-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
              <span>Comfort level: {fillPct > 85 ? 'Crowded (Standing)' : fillPct > 65 ? 'Moderate' : 'Good Seats Available'}</span>
              <span>Max: {shuttle.capacity} pax</span>
            </div>
          </div>

          {/* Driver & Assignment Information */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              Assigned Shuttle Driver
            </div>
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white text-sm">{shuttle.driverName}</div>
                <div className="text-zinc-400 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-zinc-500" />
                  <span>{shuttle.driverPhone}</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-[10px] font-semibold text-emerald-300">
                On Shift
              </span>
            </div>
          </div>

          {/* IoT Hardware Telemetry Metrics */}
          <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-3">
            <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Solar & IoT Telemetry Live Status
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">Solar Power</span>
                <span className="font-bold text-amber-400">{shuttle.hardware.solarPowerWatts} W ({shuttle.hardware.solarCurrentMa} mA)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">Battery Rail</span>
                <span className="font-bold text-emerald-400">{shuttle.hardware.batteryVoltage} V ({shuttle.hardware.batteryPercentage}%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">Cellular RSSI</span>
                <span className="font-bold text-sky-400">{shuttle.hardware.gsmRssi} dBm (MTN 2G)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <span className="text-[10px] text-zinc-500 block">GPS Satellites</span>
                <span className="font-bold text-zinc-200">{shuttle.hardware.satellites} Locked (HDOP {shuttle.hardware.hdop})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => {
              onSetAlert(shuttle.nextStopId, shuttle.routeId, shuttle.id);
              soundEffects.playArrivalChime();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <BellRing className="w-4 h-4" />
            <span>Notify Me When This Bus Arrives</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
