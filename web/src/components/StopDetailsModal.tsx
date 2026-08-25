import React from 'react';
import { 
  CampusStop, 
  ShuttleRoute, 
  ShuttleVehicle 
} from '../types/shuttle';
import { 
  MapPin, 
  Clock, 
  Users, 
  BellRing, 
  Check, 
  Zap, 
  Shield, 
  Sun,
  Bus
} from 'lucide-react';

interface StopDetailsModalProps {
  stop: CampusStop | null;
  onClose: () => void;
  routes: ShuttleRoute[];
  shuttles: ShuttleVehicle[];
  onSetAlert: (stopId: string, routeId: string) => void;
}

export const StopDetailsModal: React.FC<StopDetailsModalProps> = ({
  stop,
  onClose,
  routes,
  shuttles,
  onSetAlert,
}) => {
  if (!stop) return null;

  const stopRoutes = routes.filter((r) => stop.routes.includes(r.id));
  const approachingShuttles = shuttles
    .filter((s) => s.nextStopId === stop.id)
    .sort((a, b) => a.etaSecondsToNextStop - b.etaSecondsToNextStop);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {stop.code}
                </span>
                <h3 className="font-bold text-base text-white">{stop.name}</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{stop.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-sm p-1">✕</button>
        </div>

        {/* Amenities Pills */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">Stop Amenities</span>
          <div className="flex flex-wrap gap-1.5">
            {stop.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5"
              >
                <Check className="w-3 h-3 text-emerald-400" />
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Live Approaching Shuttles */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Next Approaching Shuttles
          </span>

          {approachingShuttles.length === 0 ? (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-500">
              No shuttles currently inbound. Next scheduled in ~{stopRoutes[0]?.frequencyMinutes || 8} mins.
            </div>
          ) : (
            approachingShuttles.map((s) => {
              const route = routes.find((r) => r.id === s.routeId);
              const etaMins = Math.ceil(s.etaSecondsToNextStop / 60);

              return (
                <div
                  key={s.id}
                  className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: route?.color || '#10b981' }}
                    >
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{s.name}</div>
                      <div className="text-[10px] text-zinc-400">
                        {s.currentPassengers}/{s.capacity} seats taken ({s.speedKmh} km/h)
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-mono font-extrabold text-emerald-400">
                      {etaMins} min
                    </div>
                    <div className="text-[10px] text-zinc-500">{s.distanceToNextStopMeters}m away</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Lines Serving this Stop */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
            Routes Serving This Stop
          </span>
          <div className="space-y-2">
            {stopRoutes.map((r) => (
              <div key={r.id} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                  <div>
                    <div className="text-xs font-bold text-zinc-200">{r.name}</div>
                    <div className="text-[10px] text-zinc-500">Every {r.frequencyMinutes} mins • {r.operatingHours}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSetAlert(stop.id, r.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
