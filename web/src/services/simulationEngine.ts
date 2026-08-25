import { ShuttleVehicle, ShuttleRoute, CampusStop, GeoPoint, HardwareTelemetry, ArrivalNotificationConfig, NotificationItem } from '../types/shuttle';
import { soundEffects } from './soundEffects';

// Haversine formula to compute distance in meters between two coordinates
export function calculateDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (p1.lat * Math.PI) / 180;
  const φ2 = (p2.lat * Math.PI) / 180;
  const Δφ = ((p2.lat - p1.lat) * Math.PI) / 180;
  const Δλ = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Compute compass bearing from p1 to p2 in degrees (0 - 360)
export function calculateBearing(p1: GeoPoint, p2: GeoPoint): number {
  const y = Math.sin((p2.lng - p1.lng) * (Math.PI / 180)) * Math.cos((p2.lat * Math.PI) / 180);
  const x =
    Math.cos((p1.lat * Math.PI) / 180) * Math.sin((p2.lat * Math.PI) / 180) -
    Math.sin((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.cos((p2.lng - p1.lng) * (Math.PI / 180));
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(bearing);
}

// Linear interpolate between two points
export function interpolateGeo(p1: GeoPoint, p2: GeoPoint, fraction: number): GeoPoint {
  return {
    lat: p1.lat + (p2.lat - p1.lat) * fraction,
    lng: p1.lng + (p2.lng - p1.lng) * fraction,
  };
}

// Generate realistic NMEA sentence for terminal simulation
export function generateNmeaSentence(lat: number, lng: number, speedKnots: number, courseDeg: number): string {
  const now = new Date();
  const timeStr = now.toISOString().replace(/[-:T]/g, '').slice(8, 14) + '.00';
  const latDeg = Math.floor(Math.abs(lat));
  const latMin = ((Math.abs(lat) - latDeg) * 60).toFixed(4);
  const latStr = `${String(latDeg).padStart(2, '0')}${latMin},${lat >= 0 ? 'N' : 'S'}`;
  
  const lngDeg = Math.floor(Math.abs(lng));
  const lngMin = ((Math.abs(lng) - lngDeg) * 60).toFixed(4);
  const lngStr = `${String(lngDeg).padStart(3, '0')}${lngMin},${lng >= 0 ? 'E' : 'W'}`;

  return `$GPRMC,${timeStr},A,${latStr},${lngStr},${speedKnots.toFixed(1)},${courseDeg.toFixed(1)},210826,,,A*7F`;
}

export interface SimulationTickResult {
  updatedShuttles: ShuttleVehicle[];
  triggeredNotifications: NotificationItem[];
  telemetryLogs: {
    timestamp: string;
    deviceId: string;
    payload: Record<string, unknown>;
    rawNmea: string;
    atCommand: string;
  }[];
}

export function tickSimulation(
  shuttles: ShuttleVehicle[],
  routes: ShuttleRoute[],
  stops: CampusStop[],
  activeAlerts: ArrivalNotificationConfig[],
  alreadyTriggeredAlertIds: Set<string>
): SimulationTickResult {
  const updatedShuttles: ShuttleVehicle[] = [];
  const triggeredNotifications: NotificationItem[] = [];
  const telemetryLogs: SimulationTickResult['telemetryLogs'] = [];

  const routeMap = new Map(routes.map((r) => [r.id, r]));
  const stopMap = new Map(stops.map((s) => [s.id, s]));

  for (const shuttle of shuttles) {
    if (!shuttle.isSimulated || shuttle.status === 'in_depot' || shuttle.status === 'maintenance') {
      updatedShuttles.push(shuttle);
      continue;
    }

    const route = routeMap.get(shuttle.routeId);
    if (!route || route.path.length < 2) {
      updatedShuttles.push(shuttle);
      continue;
    }

    let progressIndex = shuttle.routeProgressIndex;
    const currentWaypoint = route.path[progressIndex % route.path.length];
    const nextWaypoint = route.path[(progressIndex + 1) % route.path.length];

    // Determine target next stop on route
    const currentStop = stops.find((s) => s.id === shuttle.nextStopId) || stops[0];
    const distanceToStop = calculateDistanceMeters(shuttle.currentLocation, currentStop.location);

    let newStatus = shuttle.status;
    let newSpeed = shuttle.speedKmh;
    let newPassengers = shuttle.currentPassengers;
    let newLocation = { ...shuttle.currentLocation };
    let newHeading = shuttle.heading;

    // Dwell logic at stop
    if (distanceToStop < 45 && shuttle.status !== 'at_stop' && Math.random() > 0.4) {
      newStatus = 'at_stop';
      newSpeed = 0;
      // Boarding/alighting variance
      const deltaPax = Math.floor(Math.random() * 7) - 3;
      newPassengers = Math.max(2, Math.min(shuttle.capacity, shuttle.currentPassengers + deltaPax));
    } else if (shuttle.status === 'at_stop') {
      // Chance of departing stop
      if (Math.random() > 0.65) {
        newStatus = 'in_service';
        newSpeed = Math.floor(18 + Math.random() * 14); // 18-32 km/h
        // Advance next stop ID
        const routeStops = route.stops;
        const currentStopIdx = routeStops.indexOf(shuttle.nextStopId);
        const nextIdx = (currentStopIdx + 1) % routeStops.length;
        shuttle.nextStopId = routeStops[nextIdx];
      }
    } else {
      // Normal moving simulation
      const stepFraction = 0.08 + Math.random() * 0.04;
      newLocation = interpolateGeo(shuttle.currentLocation, nextWaypoint, stepFraction);
      newHeading = calculateBearing(shuttle.currentLocation, nextWaypoint);
      newSpeed = Math.floor(20 + Math.random() * 12);

      const distToNextWaypoint = calculateDistanceMeters(newLocation, nextWaypoint);
      if (distToNextWaypoint < 20) {
        progressIndex = (progressIndex + 1) % route.path.length;
      }
    }

    // Recalculate ETA in seconds based on distance and average transit speed (~22 km/h = 6.1 m/s)
    const updatedDistanceToStop = calculateDistanceMeters(newLocation, currentStop.location);
    const calculatedEtaSeconds = Math.max(15, Math.round(updatedDistanceToStop / 5.8));

    // Occupancy status string
    let occupancy: ShuttleVehicle['occupancyStatus'] = 'seats_available';
    const fillRatio = newPassengers / shuttle.capacity;
    if (fillRatio >= 0.95) occupancy = 'full';
    else if (fillRatio >= 0.8) occupancy = 'crowded';
    else if (fillRatio >= 0.65) occupancy = 'standing_only';

    // Telemetry updates (IoT battery & solar simulation)
    const solarWatts = +(2.0 + Math.random() * 1.5).toFixed(2);
    const batVolt = +(3.85 + Math.random() * 0.25).toFixed(2);
    const batPct = Math.min(100, Math.max(20, Math.round(shuttle.hardware.batteryPercentage + (Math.random() * 0.4 - 0.1))));
    const gsmRssi = -65 - Math.floor(Math.random() * 18);

    const updatedHardware: HardwareTelemetry = {
      ...shuttle.hardware,
      batteryVoltage: batVolt,
      batteryPercentage: batPct,
      solarPowerWatts: solarWatts,
      solarVoltage: +(5.4 + Math.random() * 0.5).toFixed(2),
      solarCurrentMa: Math.round((solarWatts / 5.5) * 1000),
      gsmRssi,
      satellites: Math.floor(8 + Math.random() * 4),
      uploadLatencyMs: Math.floor(280 + Math.random() * 180),
      lastHeartbeat: new Date().toISOString(),
      esp32FreeHeap: Math.round(180000 + Math.random() * 8000),
    };

    const updatedVehicle: ShuttleVehicle = {
      ...shuttle,
      currentLocation: newLocation,
      heading: newHeading,
      speedKmh: newSpeed,
      status: newStatus,
      currentPassengers: newPassengers,
      occupancyStatus: occupancy,
      etaSecondsToNextStop: calculatedEtaSeconds,
      distanceToNextStopMeters: updatedDistanceToStop,
      lastUpdated: 'Just now (1s)',
      routeProgressIndex: progressIndex,
      hardware: updatedHardware,
    };

    updatedShuttles.push(updatedVehicle);

    // Check alert triggers
    for (const alert of activeAlerts) {
      if (!alert.enabled) continue;
      if (alert.routeId && alert.routeId !== shuttle.routeId) continue;
      if (alert.shuttleId && alert.shuttleId !== shuttle.id) continue;
      if (alert.stopId === shuttle.nextStopId) {
        const etaMinutes = calculatedEtaSeconds / 60;
        const alertKey = `${alert.id}-${shuttle.id}-${shuttle.nextStopId}-${Math.floor(Date.now() / (120 * 1000))}`;

        if (etaMinutes <= alert.thresholdMinutes && !alreadyTriggeredAlertIds.has(alertKey)) {
          alreadyTriggeredAlertIds.add(alertKey);

          const stopObj = stopMap.get(alert.stopId);
          const stopTitle = stopObj ? stopObj.name : 'your stop';

          if (alert.notifySound) {
            soundEffects.playArrivalChime();
          }

          triggeredNotifications.push({
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title: `🚌 ${shuttle.name} Arriving Soon!`,
            message: `Estimated arrival at ${stopTitle} in ~${Math.ceil(etaMinutes)} min (${updatedDistanceToStop}m away). ${shuttle.capacity - newPassengers} seats open.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'arrival',
            read: false,
            shuttleId: shuttle.id,
            stopId: alert.stopId,
          });
        }
      }
    }

    // Telemetry log for debug / hardware console
    const knots = newSpeed * 0.539957;
    const rawNmea = generateNmeaSentence(newLocation.lat, newLocation.lng, knots, newHeading);
    const atCmd = `AT+HTTPDATA=184,5000\nPOST /api/telemetry\n{"id":"${shuttle.hardware.deviceId}","lat":${newLocation.lat.toFixed(6)},"lng":${newLocation.lng.toFixed(6)},"spd":${newSpeed},"bat":${batVolt},"sol":${solarWatts},"rssi":${gsmRssi}}`;

    telemetryLogs.push({
      timestamp: new Date().toISOString().slice(11, 19),
      deviceId: shuttle.hardware.deviceId,
      payload: {
        device: shuttle.hardware.deviceId,
        shuttle: shuttle.name,
        lat: newLocation.lat,
        lng: newLocation.lng,
        speed: newSpeed,
        heading: newHeading,
        battery: batVolt,
        solar_watts: solarWatts,
        gsm_rssi: gsmRssi,
        satellites: updatedHardware.satellites,
      },
      rawNmea,
      atCommand: atCmd,
    });
  }

  return {
    updatedShuttles,
    triggeredNotifications,
    telemetryLogs,
  };
}
