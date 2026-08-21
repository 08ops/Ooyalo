export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CampusStop {
  id: string;
  name: string;
  code: string;
  location: GeoPoint;
  description: string;
  routes: string[]; // route IDs passing through
  amenities: string[]; // e.g., 'Shelter', 'Lighting', 'Charging Port', 'Benches'
  averageDwellSeconds: number;
  isFavorite?: boolean;
}

export interface ShuttleRoute {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  operatingHours: string;
  frequencyMinutes: number;
  stops: string[]; // Stop IDs in order
  path: GeoPoint[]; // Polyline coordinates along actual campus roads
  isActive: boolean;
}

export interface HardwareTelemetry {
  deviceId: string;
  firmwareVersion: string;
  batteryVoltage: number; // e.g. 3.95V
  batteryPercentage: number; // 0-100%
  solarVoltage: number; // e.g. 5.6V
  solarCurrentMa: number; // e.g. 420mA
  solarPowerWatts: number; // e.g. 2.35W
  chargingState: 'Solar Charging' | 'Battery Only' | 'Full / Float' | 'Low Power Warn';
  gsmRssi: number; // e.g. -75 dBm
  gsmNetwork: string; // e.g. 'MTN Ghana 2G GPRS'
  satellites: number; // e.g. 8
  hdop: number; // Horizontal Dilution of Precision e.g. 1.1
  uploadLatencyMs: number;
  lastHeartbeat: string;
  esp32FreeHeap: number;
  temperatureC: number;
}

export interface ShuttleVehicle {
  id: string;
  name: string;
  plateNumber: string;
  routeId: string;
  currentLocation: GeoPoint;
  heading: number; // 0-360 degrees
  speedKmh: number;
  status: 'in_service' | 'at_stop' | 'in_depot' | 'delayed' | 'maintenance';
  capacity: number; // max capacity e.g. 30
  currentPassengers: number; // e.g. 18
  occupancyStatus: 'seats_available' | 'standing_only' | 'crowded' | 'full';
  nextStopId: string;
  etaSecondsToNextStop: number;
  distanceToNextStopMeters: number;
  lastUpdated: string;
  driverName: string;
  driverPhone: string;
  hardware: HardwareTelemetry;
  routeProgressIndex: number; // index along path coordinates
  isSimulated: boolean;
}

export interface ArrivalNotificationConfig {
  id: string;
  stopId: string;
  shuttleId?: string;
  routeId: string;
  thresholdMinutes: number; // Notify when ETA is <= this minutes
  enabled: boolean;
  notifySound: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'arrival' | 'proximity' | 'delay' | 'broadcast' | 'hardware_alert';
  read: boolean;
  shuttleId?: string;
  stopId?: string;
}

export interface DispatchBroadcast {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  timestamp: string;
  active: boolean;
  targetRoutes: string[]; // 'all' or specific route IDs
}

export interface HardwareBOMItem {
  id: string;
  name: string;
  description: string;
  qty: number;
  unitCostUsd: number;
  unitCostGhs: number;
  category: 'Core Microcontroller' | 'Cellular & Telemetry' | 'GPS Positioning' | 'Power & Solar' | 'Passive & Protection' | 'Enclosure & Mounting' | 'Recurring SIM';
  required: boolean;
  notes: string;
}
