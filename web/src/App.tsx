import React, { useState, useEffect, useRef } from 'react';
import { 
  CampusStop, 
  ShuttleRoute, 
  ShuttleVehicle, 
  ArrivalNotificationConfig, 
  NotificationItem, 
  DispatchBroadcast,
  GeoPoint
} from './types/shuttle';
import { 
  CAMPUS_CENTER, 
  INITIAL_CAMPUS_STOPS, 
  INITIAL_CAMPUS_ROUTES, 
  INITIAL_SHUTTLES, 
  INITIAL_BROADCASTS 
} from './data/mockCampusData';
import { tickSimulation } from './services/simulationEngine';
import { soundEffects } from './services/soundEffects';

import { Navbar, ActiveTab } from './components/Navbar';
import { LiveMap } from './components/LiveMap';
import { StudentArrivalPanel } from './components/StudentArrivalPanel';
import { HardwareTelemetryHub } from './components/HardwareTelemetryHub';
import { DispatchOps } from './components/DispatchOps';
import { AdminDashboard } from './components/AdminDashboard';
import { NotificationDrawer } from './components/NotificationDrawer';
import { StopDetailsModal } from './components/StopDetailsModal';
import { ShuttleDetailsDrawer } from './components/ShuttleDetailsDrawer';
import { Megaphone, X, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('live-map');
  const [stops] = useState<CampusStop[]>(INITIAL_CAMPUS_STOPS);
  const [routes, setRoutes] = useState<ShuttleRoute[]>(INITIAL_CAMPUS_ROUTES);
  const [shuttles, setShuttles] = useState<ShuttleVehicle[]>(INITIAL_SHUTTLES);
  const [broadcasts, setBroadcasts] = useState<DispatchBroadcast[]>(INITIAL_BROADCASTS);

  // Student Location (e.g. Near Balme Library quad)
  const [studentLocation] = useState<GeoPoint>({ lat: 5.6514, lng: -0.1872 });

  // Alerts & Notifications State
  const [activeAlerts, setActiveAlerts] = useState<ArrivalNotificationConfig[]>([
    {
      id: 'alert-default-01',
      stopId: 'stop-balme',
      routeId: 'route-blue-loop',
      thresholdMinutes: 3,
      enabled: true,
      notifySound: true,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-welcome',
      title: '🚌 Welcome to Ooyalo Shuttle Tracker',
      message: 'Tracking active across 5 campus shuttles with live GPS coordinates and solar IoT telemetry.',
      timestamp: 'Just now',
      type: 'proximity',
      read: false,
    },
  ]);

  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [selectedShuttle, setSelectedShuttle] = useState<ShuttleVehicle | null>(null);
  const [selectedStop, setSelectedStop] = useState<CampusStop | null>(null);
  const [routeFilter, setRouteFilter] = useState<string | 'all'>('all');

  // Simulation & Audio Controls
  const [isSimulating, setIsSimulating] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Ref for already triggered alert keys in memory
  const triggeredAlertIdsRef = useRef<Set<string>>(new Set());

  // Fetch Real Data from PostgreSQL via Express backend
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [routesRes, stopsRes, vehiclesRes] = await Promise.all([
          fetch('/api/routes'),
          fetch('/api/stops'),
          fetch('/api/vehicles/live')
        ]);
        
        if (routesRes.ok) {
          const fetchedRoutes = await routesRes.json();
          if (fetchedRoutes.length > 0) {
            setRoutes(fetchedRoutes.map((r: any) => ({
              id: r.code.toLowerCase().replace('_', '-'), // 'BLUE_LOOP' -> 'blue-loop'
              name: r.name,
              color: r.color,
              frequency: `${r.frequencyMinutes} mins`,
              active: true
            })));
          }
        }
        if (stopsRes.ok) {
          const fetchedStops = await stopsRes.json();
          if (fetchedStops.length > 0) {
             // In a real app we'd map this, for now using mock to guarantee UI stability
          }
        }
        if (vehiclesRes.ok) {
          const fetchedVehicles = await vehiclesRes.json();
          if (fetchedVehicles.length > 0) {
            setShuttles(current => {
              return current.map(mockShuttle => {
                 const realV = fetchedVehicles.find((v: any) => v.name === mockShuttle.name);
                 if (realV) {
                   return {
                     ...mockShuttle,
                     status: realV.status,
                     capacity: realV.capacity
                   };
                 }
                 return mockShuttle;
              });
            });
          }
        }
      } catch (e) {
        console.warn("Could not fetch real data from API, using mock data.", e);
      }
    }
    fetchInitialData();
  }, []);

  // Simulation Loop Effect (ticks every 1.5s)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setShuttles((currentShuttles) => {
        const { updatedShuttles, triggeredNotifications } = tickSimulation(
          currentShuttles,
          routes,
          stops,
          activeAlerts,
          triggeredAlertIdsRef.current
        );

        if (triggeredNotifications.length > 0) {
          setNotifications((prev) => [...triggeredNotifications, ...prev]);
        }

        return updatedShuttles;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating, routes, stops, activeAlerts]);

  // Handler: Add custom arrival alert
  const handleAddAlert = (alertData: Omit<ArrivalNotificationConfig, 'id' | 'createdAt'>) => {
    const newAlert: ArrivalNotificationConfig = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setActiveAlerts((prev) => [newAlert, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-set-${Date.now()}`,
        title: '🔔 Arrival Alarm Configured',
        message: `You will be alerted when an approaching shuttle is within ${newAlert.thresholdMinutes} mins of your stop.`,
        timestamp: 'Just now',
        type: 'proximity',
        read: false,
        stopId: newAlert.stopId,
      },
      ...prev,
    ]);
  };

  const handleRemoveAlert = (alertId: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleTriggerTestAlert = () => {
    soundEffects.playArrivalChime();

    const testNotif: NotificationItem = {
      id: `notif-test-${Date.now()}`,
      title: '🚌 Shuttle 01 Arrived at Balme Library!',
      message: 'Boarding now at Platform 2. 14 seats open. Solar battery at 88%.',
      timestamp: 'Just now',
      type: 'arrival',
      read: false,
    };
    setNotifications((prev) => [testNotif, ...prev]);
  };

  const handleManualInjectTelemetry = (data: {
    shuttleId: string;
    lat: number;
    lng: number;
    speed: number;
    batteryVoltage: number;
    solarWatts: number;
  }) => {
    setShuttles((prev) =>
      prev.map((s) => {
        if (s.id !== data.shuttleId) return s;
        return {
          ...s,
          currentLocation: { lat: data.lat, lng: data.lng },
          speedKmh: data.speed,
          lastUpdated: 'Just now (Injected)',
          hardware: {
            ...s.hardware,
            batteryVoltage: data.batteryVoltage,
            solarPowerWatts: data.solarWatts,
            lastHeartbeat: new Date().toISOString(),
          },
        };
      })
    );
  };

  // Dispatch Handlers
  const handleAddBroadcast = (bc: Omit<DispatchBroadcast, 'id' | 'timestamp'>) => {
    const newBc: DispatchBroadcast = {
      ...bc,
      id: `bc-${Date.now()}`,
      timestamp: 'Just now',
    };
    setBroadcasts((prev) => [newBc, ...prev]);

    // Push to passenger notifications
    setNotifications((prev) => [
      {
        id: `notif-bc-${Date.now()}`,
        title: `📢 Announcement: ${newBc.title}`,
        message: newBc.message,
        timestamp: 'Just now',
        type: 'broadcast',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleRemoveBroadcast = (id: string) => {
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateShuttleStatus = (shuttleId: string, status: ShuttleVehicle['status']) => {
    setShuttles((prev) =>
      prev.map((s) => (s.id === shuttleId ? { ...s, status } : s))
    );
  };

  const handleReassignRoute = (shuttleId: string, routeId: string) => {
    setShuttles((prev) =>
      prev.map((s) => (s.id === shuttleId ? { ...s, routeId } : s))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBroadcast = broadcasts.find((b) => b.active);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* 3-Zone Contract Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={unreadCount}
        onOpenAlerts={() => setIsAlertDrawerOpen(true)}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        activeShuttleCount={shuttles.filter(s => s.status === 'in_service' || s.status === 'at_stop').length}
      />

      {/* Emergency / Service Active Announcement Banner */}
      {activeBroadcast && (
        <div className={`px-4 py-2 text-xs font-semibold flex items-center justify-between transition-colors border-b ${
          activeBroadcast.severity === 'urgent'
            ? 'bg-rose-950 border-rose-800 text-rose-200'
            : activeBroadcast.severity === 'warning'
            ? 'bg-amber-950 border-amber-800 text-amber-200'
            : 'bg-sky-950 border-sky-800 text-sky-200'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center gap-2 px-2">
            <Megaphone className="w-4 h-4 shrink-0 animate-bounce" />
            <span><strong>{activeBroadcast.title}:</strong> {activeBroadcast.message}</span>
          </div>
          <button
            onClick={() => handleRemoveBroadcast(activeBroadcast.id)}
            className="text-zinc-400 hover:text-white text-xs px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeTab === 'live-map' && (
          <LiveMap
            stops={stops}
            routes={routes}
            shuttles={shuttles}
            selectedShuttleId={selectedShuttle?.id || null}
            onSelectShuttle={setSelectedShuttle}
            selectedStopId={selectedStop?.id || null}
            onSelectStop={setSelectedStop}
            selectedRouteFilter={routeFilter}
            onSetRouteFilter={setRouteFilter}
            studentLocation={studentLocation}
            onSetArrivalAlert={(stopId, routeId, shuttleId) => {
              handleAddAlert({
                stopId,
                routeId,
                shuttleId,
                thresholdMinutes: 3,
                enabled: true,
                notifySound: true,
              });
              soundEffects.playArrivalChime();
            }}
          />
        )}

        {activeTab === 'student-etas' && (
          <StudentArrivalPanel
            stops={stops}
            routes={routes}
            shuttles={shuttles}
            activeAlerts={activeAlerts}
            onAddAlert={handleAddAlert}
            onRemoveAlert={handleRemoveAlert}
            onSelectShuttle={(s) => {
              setSelectedShuttle(s);
            }}
            onSelectStop={(st) => {
              setSelectedStop(st);
            }}
            studentLocation={studentLocation}
          />
        )}

        {activeTab === 'hardware-hub' && (
          <HardwareTelemetryHub
            shuttles={shuttles}
            onManualInjectTelemetry={handleManualInjectTelemetry}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchOps
            shuttles={shuttles}
            routes={routes}
            stops={stops}
            broadcasts={broadcasts}
            onAddBroadcast={handleAddBroadcast}
            onRemoveBroadcast={handleRemoveBroadcast}
            onUpdateShuttleStatus={handleUpdateShuttleStatus}
            onReassignRoute={handleReassignRoute}
          />
        )}

        {activeTab === 'admin-dashboard' && (
          <AdminDashboard shuttles={shuttles} />
        )}
      </main>

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onClearAll={() => setNotifications([])}
        onTriggerTestAlert={handleTriggerTestAlert}
      />

      {/* Stop Timetable Modal */}
      <StopDetailsModal
        stop={selectedStop}
        onClose={() => setSelectedStop(null)}
        routes={routes}
        shuttles={shuttles}
        onSetAlert={(stopId, routeId) => {
          handleAddAlert({
            stopId,
            routeId,
            thresholdMinutes: 3,
            enabled: true,
            notifySound: true,
          });
        }}
      />

      {/* Shuttle Details Drawer */}
      <ShuttleDetailsDrawer
        shuttle={selectedShuttle}
        onClose={() => setSelectedShuttle(null)}
        routes={routes}
        stops={stops}
        onSetAlert={(stopId, routeId, shuttleId) => {
          handleAddAlert({
            stopId,
            routeId,
            shuttleId,
            thresholdMinutes: 3,
            enabled: true,
            notifySound: true,
          });
        }}
      />
    </div>
  );
}
