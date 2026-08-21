import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { db } from '../db/index';
import { users, vehicles, routes, stops, telemetry, routeStops } from '../db/schema';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin';

export const app = express();
app.use(cors());
app.use(express.json());

// Basic authentication middleware
const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Seed data route for testing
app.post('/api/seed', async (req, res) => {
  try {
    // Basic routes
    await db.insert(routes).values({
      name: 'Blue Loop',
      code: 'BLUE_LOOP',
      color: '#10b981',
      frequencyMinutes: 15,
      operatingHours: '06:00 - 22:00'
    }).onConflictDoNothing();

    res.json({ status: 'seeded' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Telemetry ingest (No auth for IoT devices, or use a secret token)
app.post('/api/telemetry', async (req, res) => {
  try {
    const { vehicleId, latitude, longitude, speedKmh, heading, batteryVoltage, solarWatts, gsmRssi, satellites } = req.body;
    
    // In a real app, verify the IoT secret token here

    const newTelemetry = await db.insert(telemetry).values({
      vehicleId,
      latitude,
      longitude,
      speedKmh,
      heading,
      batteryVoltage,
      solarWatts,
      gsmRssi,
      satellites,
    }).returning();

    res.json(newTelemetry[0]);
  } catch (error: any) {
    console.error('Failed to ingest telemetry:', error);
    res.status(500).json({ error: 'Failed to ingest telemetry', cause: error.message });
  }
});

// Get all shuttles live positions
app.get('/api/vehicles/live', async (req, res) => {
  try {
    const allVehicles = await db.select().from(vehicles);
    // In a full implementation we'd join with the latest telemetry row for each vehicle
    res.json(allVehicles);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get all routes
app.get('/api/routes', async (req, res) => {
  try {
    const allRoutes = await db.select().from(routes);
    res.json(allRoutes);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get all stops
app.get('/api/stops', async (req, res) => {
  try {
    const allStops = await db.select().from(stops);
    res.json(allStops);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

if (process.env.NODE_ENV !== 'development' || process.env.RUN_EXPRESS_DIRECTLY) {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
