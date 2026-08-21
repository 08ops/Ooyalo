import { pgTable, text, timestamp, boolean, integer, doublePrecision, uuid, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  role: text('role').notNull().default('passenger'), // passenger, driver, admin, superadmin
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const drivers = pgTable('drivers', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  licenseNumber: text('license_number').notNull(),
  status: text('status').notNull().default('active'), // active, under_review, suspended
  totalTrips: integer('total_trips').default(0).notNull(),
  rating: doublePrecision('rating').default(5.0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const vehicles = pgTable('vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  plateNumber: text('plate_number').unique().notNull(),
  name: text('name').notNull(),
  capacity: integer('capacity').notNull(),
  status: text('status').notNull().default('offline'), // in_service, offline, maintenance
  routeId: uuid('route_id'), // optional, current assigned route
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const routes = pgTable('routes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  code: text('code').unique().notNull(), // e.g., BLUE_LOOP
  description: text('description'),
  color: text('color').notNull(),
  frequencyMinutes: integer('frequency_minutes').notNull(),
  operatingHours: text('operating_hours').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const stops = pgTable('stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  amenities: jsonb('amenities').default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const routeStops = pgTable('route_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  routeId: uuid('route_id').references(() => routes.id).notNull(),
  stopId: uuid('stop_id').references(() => stops.id).notNull(),
  stopOrder: integer('stop_order').notNull(),
});

export const telemetry = pgTable('telemetry', {
  id: uuid('id').defaultRandom().primaryKey(),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id).notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  speedKmh: doublePrecision('speed_kmh').notNull(),
  heading: doublePrecision('heading').notNull(),
  batteryVoltage: doublePrecision('battery_voltage'),
  solarWatts: doublePrecision('solar_watts'),
  gsmRssi: integer('gsm_rssi'),
  satellites: integer('satellites'),
  passengers: integer('passengers'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const lostItems = pgTable('lost_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id').references(() => users.id).notNull(),
  itemName: text('item_name').notNull(),
  description: text('description').notNull(),
  locationLost: text('location_lost'), // Stop name or route
  routeId: uuid('route_id').references(() => routes.id),
  dateLost: timestamp('date_lost').notNull(),
  status: text('status').notNull().default('reported'), // reported, found, recovered
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accessibilityProfiles = pgTable('accessibility_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  isVerified: boolean('is_verified').default(false).notNull(),
  needsWheelchair: boolean('needs_wheelchair').default(false).notNull(),
  needsVisualAssistance: boolean('needs_visual_assistance').default(false).notNull(),
  needsHearingAssistance: boolean('needs_hearing_assistance').default(false).notNull(),
  documentUrl: text('document_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const alerts = pgTable('alerts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  severity: text('severity').notNull().default('info'), // info, warning, urgent
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations definitions (Optional but helpful for Drizzle)
export const usersRelations = relations(users, ({ one, many }) => ({
  driverProfile: one(drivers, {
    fields: [users.id],
    references: [drivers.userId],
  }),
  accessibilityProfile: one(accessibilityProfiles, {
    fields: [users.id],
    references: [accessibilityProfiles.userId],
  }),
  lostItems: many(lostItems),
}));

export const routesRelations = relations(routes, ({ many }) => ({
  stops: many(routeStops),
}));

export const stopsRelations = relations(stops, ({ many }) => ({
  routes: many(routeStops),
}));
