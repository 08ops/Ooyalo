import React from 'react';
import { 
  Bus, 
  Radio, 
  Cpu, 
  ShieldCheck, 
  Wrench, 
  Bell, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Sparkles,
  LayoutDashboard,
  Smartphone
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

export type ActiveTab = 'live-map' | 'student-etas' | 'hardware-hub' | 'dispatch' | 'hardware-blueprint' | 'admin-dashboard' | 'ussd-simulator';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  activeShuttleCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  onOpenAlerts,
  isSimulating,
  setIsSimulating,
  soundEnabled,
  setSoundEnabled,
  activeShuttleCount,
}) => {
  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEffects.setSoundEnabled(nextState);
    if (nextState) {
      soundEffects.playSuccessTone();
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'live-map', label: 'Live Map', icon: Bus },
    { id: 'student-etas', label: 'Arrival ETAs', icon: Radio },
    { id: 'hardware-hub', label: 'IoT Telemetry', icon: Cpu },
    { id: 'dispatch', label: 'Fleet Ops', icon: ShieldCheck },
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'ussd-simulator', label: 'USSD Simulator', icon: Smartphone },
    { id: 'hardware-blueprint', label: 'Hardware Spec', icon: Wrench },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bus className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white font-mono">
                OOYALO
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE GPS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Zone (Single-row pills) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700/50'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls Zone */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Live Sim Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            title={isSimulating ? 'Pause GPS Telemetry Simulation' : 'Resume GPS Telemetry Simulation'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSimulating
                ? 'bg-emerald-950/40 border-emerald-700/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
            {isSimulating ? (
              <span className="hidden sm:inline font-mono text-[11px]">{activeShuttleCount} Active</span>
            ) : (
              <span className="hidden sm:inline text-[11px]">Paused</span>
            )}
            {isSimulating ? <Pause className="w-3 h-3 ml-0.5 opacity-70" /> : <Play className="w-3 h-3 ml-0.5 opacity-70" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Arrival Chimes' : 'Enable Arrival Chimes'}
            aria-label="Toggle Audio Alerts"
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Alert Notifications Drawer Trigger */}
          <button
            onClick={onOpenAlerts}
            aria-label="Open Alerts"
            className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-bold shadow-md animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Strip */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-zinc-900/90 border-t border-zinc-800/80 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-zinc-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
