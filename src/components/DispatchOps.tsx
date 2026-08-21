import React, { useState } from 'react';
import { 
  ShuttleVehicle, 
  ShuttleRoute, 
  CampusStop, 
  DispatchBroadcast 
} from '../types/shuttle';
import { 
  ShieldCheck, 
  Megaphone, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Users, 
  Navigation, 
  Wrench, 
  Radio, 
  Bus,
  Clock
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface DispatchOpsProps {
  shuttles: ShuttleVehicle[];
  routes: ShuttleRoute[];
  stops: CampusStop[];
  broadcasts: DispatchBroadcast[];
  onAddBroadcast: (broadcast: Omit<DispatchBroadcast, 'id' | 'timestamp'>) => void;
  onRemoveBroadcast: (id: string) => void;
  onUpdateShuttleStatus: (shuttleId: string, status: ShuttleVehicle['status']) => void;
  onReassignRoute: (shuttleId: string, routeId: string) => void;
}

export const DispatchOps: React.FC<DispatchOpsProps> = ({
  shuttles,
  routes,
  stops,
  broadcasts,
  onAddBroadcast,
  onRemoveBroadcast,
  onUpdateShuttleStatus,
  onReassignRoute,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'info' | 'warning' | 'urgent'>('warning');
  const [broadcastRoute, setBroadcastRoute] = useState<string>('all');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;

    onAddBroadcast({
      title: broadcastTitle,
      message: broadcastMsg,
      severity: broadcastSeverity,
      active: true,
      targetRoutes: broadcastRoute === 'all' ? ['all'] : [broadcastRoute],
    });

    soundEffects.playArrivalChime();
    setBroadcastTitle('');
    setBroadcastMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Dispatch Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white font-mono">Campus Fleet Dispatch & Operations</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DISPATCH TERMINAL
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time fleet control, route assignments, driver monitoring, and emergency passenger alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-zinc-300">
            Active Fleet: <strong className="text-emerald-400">{shuttles.filter(s => s.status === 'in_service' || s.status === 'at_stop').length}</strong> / {shuttles.length}
          </div>
        </div>
      </div>

      {/* Broadcast Announcer & Active Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Announcement Form */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Broadcast Passenger Notice</h3>
          </div>
          <p className="text-xs text-zinc-400">
            Publish instant announcements displayed on all student mobile apps and digital stop displays.
          </p>

          <form onSubmit={handleBroadcastSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Headline</label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Heavy Rain Delay on Ring Road"
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Notice Details</label>
              <textarea
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Detailed delay note or alternative route guidance..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Severity</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value as 'info' | 'warning' | 'urgent')}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="info">Info / Routine</option>
                  <option value="warning">Warning / Delay</option>
                  <option value="urgent">Urgent / Emergency</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">Target Route</label>
                <select
                  value={broadcastRoute}
                  onChange={(e) => setBroadcastRoute(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">All Lines (Campus-wide)</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name.split(' ')[0]} Line
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
            >
              <Megaphone className="w-4 h-4" />
              <span>Publish Live Broadcast</span>
            </button>

            {broadcastSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Notice broadcasted live across all student devices!</span>
              </div>
            )}
          </form>
        </div>

        {/* Active Broadcasts List */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Live Passenger Broadcasts ({broadcasts.length})
            </h3>
          </div>

          {broadcasts.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No active broadcasts published.
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map((bc) => (
                <div
                  key={bc.id}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                    bc.severity === 'urgent'
                      ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                      : bc.severity === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : 'bg-sky-950/30 border-sky-800/60 text-sky-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{bc.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-300">
                        {bc.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1">{bc.message}</p>
                  </div>
                  <button
                    onClick={() => onRemoveBroadcast(bc.id)}
                    className="text-zinc-400 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fleet Live Table & Quick Controls */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bus className="w-4 h-4 text-emerald-400" />
            Live Shuttle Fleet Management
          </h3>
          <span className="text-xs font-mono text-zinc-500">Instant Status & Route Control</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-semibold">
                <th className="py-3 px-3">Vehicle & Plate</th>
                <th className="py-3 px-3">Assigned Route</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Occupancy</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3">Next Stop / ETA</th>
                <th className="py-3 px-3 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
              {shuttles.map((shuttle) => {
                const route = routes.find((r) => r.id === shuttle.routeId);
                const nextStop = stops.find((s) => s.id === shuttle.nextStopId);

                return (
                  <tr key={shuttle.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-sans font-semibold text-zinc-100">
                      <div>{shuttle.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{shuttle.plateNumber}</div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={shuttle.routeId}
                        onChange={(e) => onReassignRoute(shuttle.id, e.target.value)}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                      >
                        {routes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name.split(' ')[0]} Line
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-3 font-sans text-zinc-300">
                      <div>{shuttle.driverName}</div>
                      <div className="text-[10px] text-zinc-500">{shuttle.driverPhone}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-zinc-200">
                        {shuttle.currentPassengers} / {shuttle.capacity} pax
                      </div>
                      <div className="w-16 h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${(shuttle.currentPassengers / shuttle.capacity) * 100}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <select
                        value={shuttle.status}
                        onChange={(e) => onUpdateShuttleStatus(shuttle.id, e.target.value as ShuttleVehicle['status'])}
                        className="px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="in_service">🟢 In Service</option>
                        <option value="at_stop">🟡 At Stop</option>
                        <option value="delayed">🔴 Delayed</option>
                        <option value="in_depot">⚪ In Depot</option>
                        <option value="maintenance">🔧 Maintenance</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <div className="text-zinc-200">{nextStop?.name.split(' ')[0] || 'En route'}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        ~{Math.ceil(shuttle.etaSecondsToNextStop / 60)} min ({shuttle.distanceToNextStopMeters}m)
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          const nextStatus: ShuttleVehicle['status'] = shuttle.status === 'in_service' ? 'delayed' : 'in_service';
                          onUpdateShuttleStatus(shuttle.id, nextStatus);
                        }}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-sans font-semibold border border-zinc-700 transition-colors"
                      >
                        {shuttle.status === 'delayed' ? 'Clear Delay' : 'Flag Delay'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
