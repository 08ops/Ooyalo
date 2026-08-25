import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  Activity, 
  TrendingUp, 
  Bus, 
  Star,
  CheckCircle2,
  AlertTriangle,
  Search
} from 'lucide-react';
import { ShuttleVehicle } from '../types/shuttle';

interface AdminDashboardProps {
  shuttles: ShuttleVehicle[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ shuttles }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'drivers' | 'lost-found'>('analytics');

  const mockDrivers = [
    { id: 'd1', name: 'Kwame Mensah', rating: 4.8, trips: 142, status: 'Active' },
    { id: 'd2', name: 'Abena Osei', rating: 4.9, trips: 210, status: 'Active' },
    { id: 'd3', name: 'Yaw Anim', rating: 3.5, trips: 89, status: 'Under Review' },
  ];

  const mockLostItems = [
    { id: 'L102', item: 'Dell Laptop', route: 'Blue Loop', date: '2 hrs ago', status: 'Recovered' },
    { id: 'L103', item: 'Water Bottle', route: 'Red Express', date: '1 day ago', status: 'Unclaimed' },
    { id: 'L104', item: 'Notebook', route: 'Night Owl', date: '2 days ago', status: 'Unclaimed' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">Fleet oversight, driver management, and passenger analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase">Daily Passengers</span>
          </div>
          <div className="text-3xl font-bold text-white">4,285</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% vs last week
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Bus className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-semibold uppercase">Active Fleet</span>
          </div>
          <div className="text-3xl font-bold text-white">{shuttles.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Operating on 3 active routes</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase">Avg Driver Rating</span>
          </div>
          <div className="text-3xl font-bold text-white">4.6</div>
          <div className="text-xs text-zinc-500 mt-1">Across {mockDrivers.length} active drivers</div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Package className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold uppercase">Unclaimed Items</span>
          </div>
          <div className="text-3xl font-bold text-white">2</div>
          <div className="text-xs text-zinc-500 mt-1">Awaiting passenger pickup</div>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/80 w-fit">
        {(['analytics', 'drivers', 'lost-found'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab 
                ? 'bg-zinc-800 text-white shadow-sm' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' & ')}
          </button>
        ))}
      </div>

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-4">Peak Hourly Demand</h3>
            <div className="h-48 flex items-end gap-2">
              {[30, 45, 80, 100, 85, 40, 25, 60, 90, 70, 30, 15].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-emerald-500/20 rounded-t-sm hover:bg-emerald-500/40 transition-colors"
                    style={{ height: `${val}%` }}
                  >
                    <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: '4px' }} />
                  </div>
                  <span className="text-[10px] text-zinc-500">{i + 7}h</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
             <h3 className="text-sm font-bold text-white mb-4">Route Distribution</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">Blue Loop (Main Campus)</span>
                    <span className="text-white font-mono">54%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[54%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">Red Express (Academic)</span>
                    <span className="text-white font-mono">32%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[32%]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">Night Owl (Hostels)</span>
                    <span className="text-white font-mono">14%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[14%]" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'drivers' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-semibold text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Driver Name</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Completed Trips</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {mockDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{driver.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-3.5 h-3.5 ${driver.rating >= 4 ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span className="font-mono">{driver.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">{driver.trips}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      driver.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-sky-400 hover:text-sky-300 font-semibold">View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lost-found' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-xs uppercase font-semibold text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Item Report</th>
                <th className="px-4 py-3">Route / Shuttle</th>
                <th className="px-4 py-3">Reported</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {mockLostItems.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{item.item}</div>
                    <div className="text-[10px] font-mono text-zinc-500">ID: {item.id}</div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{item.route}</td>
                  <td className="px-4 py-3 text-zinc-500">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className={`flex w-fit items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Recovered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {item.status === 'Recovered' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-sky-400 hover:text-sky-300 font-semibold">Match Report</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
