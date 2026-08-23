# 🚐 Ooyalo — Campus Shuttle Tracker (Mobile)

> Real-time shuttle tracking for University of Ghana, Legon

A premium Flutter mobile app that lets students, staff, and visitors see exactly where campus shuttles are, when they'll arrive, and how full they are — in real time.

---

## 📱 What This App Does

| Feature | Description |
|---------|-------------|
| **Live Tracking** | See shuttles moving on Google Maps in real time |
| **ETA & Occupancy** | Know when a shuttle arrives and if there's space |
| **5-Tab Navigation** | Home · Track · Routes · Alerts · Profile |
| **8 Campus Stops** | Balme Library, Night Market, Pentagon, TF Hostels, Diaspora, UGBS, Commonwealth, Mensah Sarbah |
| **3 Routes** | Blue Campus Loop · Gold Express · Night Owl Green |
| **Lost & Found** | Report lost items on shuttles |
| **Accessibility** | Wheelchair, visual, and hearing assistance options |
| **Dark Mode** | System-adaptive theming |

---

## 🎨 Design System

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0057B8` | Headers, CTAs, navigation |
| Secondary | `#00A86B` | Success states, low occupancy |
| Accent | `#FFC107` | Warnings, highlights, favorites |
| Error | `#E53935` | Full capacity, disruptions |

**Typography:** Plus Jakarta Sans (via Google Fonts)
**Cards:** 16px rounded corners, soft shadows
**Theme:** Material 3 with `ColorScheme.fromSeed`
**Inspiration:** Uber · Bolt · Google Maps · Citymapper

---

## 🏗️ Architecture

```
MVVM + Repository Pattern
═══════════════════════════

┌─────────────────────────────────────┐
│            UI Layer                 │
│  Views (Screens)  ←→  ViewModels   │
│  (StatefulWidget)   (ChangeNotifier)│
└──────────────┬──────────────────────┘
               │ reads/writes
┌──────────────▼──────────────────────┐
│          Data Layer                 │
│  Repositories (cache + fallback)    │
│       ↓              ↓              │
│  API Services    Mock Data          │
│  (http package)  (hardcoded)        │
└─────────────────────────────────────┘
```

**State Management:** `provider` (ChangeNotifier + Consumer)
**Routing:** `go_router` with `StatefulShellRoute` for bottom nav
**Maps:** `google_maps_flutter`
**HTTP:** `http` with manual `dart:convert` serialization

---

## 📂 Project Structure

```
mobile/
├── pubspec.yaml
├── analysis_options.yaml
├── lib/
│   ├── main.dart                         # Entry point
│   ├── app.dart                          # MultiProvider + MaterialApp.router
│   ├── router.dart                       # GoRouter with 5-tab shell
│   │
│   ├── config/
│   │   ├── colors.dart                   # OoyaloColors brand palette
│   │   ├── theme.dart                    # Light + Dark ThemeData
│   │   └── constants.dart                # API URL, campus coords, defaults
│   │
│   ├── data/
│   │   ├── models/                       # Data classes with fromJson/toJson
│   │   │   ├── shuttle_model.dart        # ShuttleModel + GeoPoint
│   │   │   ├── route_model.dart          # ShuttleRouteModel
│   │   │   ├── stop_model.dart           # StopModel
│   │   │   ├── alert_model.dart          # AlertModel
│   │   │   └── lost_item_model.dart      # LostItemModel
│   │   ├── mock_data.dart                # All campus data (8 stops, 3 routes, 5 shuttles)
│   │   ├── services/                     # HTTP API clients
│   │   │   ├── shuttle_api_service.dart
│   │   │   ├── route_api_service.dart
│   │   │   ├── stop_api_service.dart
│   │   │   └── alert_api_service.dart
│   │   └── repositories/                 # Cache + API fallback to mock
│   │       ├── shuttle_repository.dart
│   │       ├── route_repository.dart
│   │       ├── stop_repository.dart
│   │       ├── alert_repository.dart
│   │       └── favorites_repository.dart
│   │
│   ├── ui/
│   │   ├── core/
│   │   │   ├── shell/
│   │   │   │   └── main_scaffold.dart    # Bottom nav bar with 5 tabs
│   │   │   └── widgets/                  # Reusable components
│   │   │       ├── ooyalo_card.dart       # Premium card base
│   │   │       ├── occupancy_badge.dart   # 🟢🟡🔴 occupancy indicator
│   │   │       ├── eta_chip.dart          # "4 min" countdown chip
│   │   │       ├── shuttle_card.dart      # Shuttle info card
│   │   │       ├── stop_card.dart         # Stop info card
│   │   │       ├── route_card.dart        # Route info card
│   │   │       ├── service_status_banner.dart
│   │   │       └── search_bar_widget.dart
│   │   │
│   │   └── features/
│   │       ├── home/                     # Home tab
│   │       ├── tracking/                 # Live map tracking
│   │       ├── routes/                   # Route list + detail
│   │       ├── stops/                    # Stop detail
│   │       ├── alerts/                   # Notifications
│   │       ├── profile/                  # User settings
│   │       ├── lost_found/               # Lost item form
│   │       └── accessibility/            # Accessibility options
│   │
│   └── utils/
│       ├── distance_utils.dart           # Haversine formula
│       └── time_format_utils.dart        # Greeting, ETA formatting
│
└── 50 files total
```

---

## 🚀 Getting Started

### Prerequisites

You need the **Flutter SDK** installed on your machine.

#### Install Flutter (Windows)

1. **Download** the Flutter SDK from [flutter.dev/get-started/install/windows](https://docs.flutter.dev/get-started/install/windows/mobile)
2. **Extract** it to a folder like `C:\src\flutter` (avoid `Program Files`)
3. **Add to PATH:**
   - Press `Win + S`, search **"Environment Variables"**
   - Under **User variables**, edit **Path** → click **New**
   - Add: `C:\src\flutter\bin`
   - Click OK on all dialogs
4. **Restart your terminal** (close and reopen VS Code or PowerShell)
5. **Verify:**
   ```bash
   flutter doctor
   ```

#### Install Android Studio (for Android emulator)

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. During setup, check **Android SDK** and **Android Virtual Device**
3. Open Android Studio → **More Actions → SDK Manager** → install latest Android SDK
4. **More Actions → Virtual Device Manager** → create a Pixel device
5. Run `flutter doctor` again — it will tell you if anything is still missing

### Setup & Run

```bash
# Navigate to the mobile app
cd C:\Users\DELLg7\Desktop\DEV\Ooyalo\mobile

# Generate platform folders (android/, ios/, etc.)
flutter create .

# Fetch all dependencies
flutter pub get

# Run on connected device or emulator
flutter run
```

### Google Maps API Key (Required for map tiles)

The Live Tracking screen uses Google Maps. Without an API key, you'll see a grey grid instead of map tiles. The rest of the app works fine without it.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps SDK for Android** (and/or iOS)
3. Create an API key
4. Add it to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_API_KEY_HERE"/>
   ```

---

## ⚠️ Known Issues to Fix Before First Build

These are bugs from the code generation phase that need to be fixed for the app to compile:

### 🔴 Critical — Import Path Mismatches in `router.dart`

The router imports screens from `/screens/` paths, but the actual files are in `/views/` directories.

**File:** `lib/router.dart` (lines 4-12)

| Wrong Import | Correct Import |
|---|---|
| `features/home/screens/home_screen.dart` | `features/home/views/home_screen.dart` |
| `features/tracking/screens/live_tracking_screen.dart` | `features/tracking/views/live_tracking_screen.dart` |
| `features/stops/screens/stop_detail_screen.dart` | `features/stops/views/stop_detail_screen.dart` |
| `features/lost_found/screens/lost_item_form_screen.dart` | `features/lost_found/views/lost_item_form_screen.dart` |
| `features/home/screens/accessibility_screen.dart` | `features/accessibility/views/accessibility_screen.dart` |
| `features/routes/screens/routes_screen.dart` | `features/routes/views/routes_screen.dart` |
| `features/routes/screens/route_detail_screen.dart` | `features/routes/views/route_detail_screen.dart` |
| `features/alerts/screens/alerts_screen.dart` | `features/alerts/views/alerts_screen.dart` |
| `features/profile/screens/profile_screen.dart` | `features/profile/views/profile_screen.dart` |

### 🔴 Critical — ViewModel Constructor Mismatch in `app.dart`

`app.dart` creates ViewModels with `HomeViewModel()` (no args), but most ViewModels require repository dependencies injected:

- `HomeViewModel` needs `(ShuttleRepository, RouteRepository, StopRepository)`
- `TrackingViewModel` needs `(ShuttleRepository, RouteRepository, StopRepository)`
- `RoutesViewModel` needs `(RouteRepository, ShuttleRepository, StopRepository)`
- `StopViewModel` needs `(StopRepository, ShuttleRepository, RouteRepository)`
- `AlertsViewModel` needs `(AlertRepository)`
- `ProfileViewModel` — ✅ OK (no deps)
- `LostFoundViewModel` — ✅ OK (no deps)

### 🟡 Minor — StopModel has `location.lat`/`location.lng` but HomeViewModel accesses `a.latitude`/`a.longitude`

In `home_view_model.dart` line 57: `a.latitude` should be `a.location.lat`.

### 🟡 Minor — Lost & Found location names don't match mock data stops

`lost_found_view_model.dart` uses generic names ("Main Gate Stop", "Library Stop") instead of the actual campus stops ("Balme Library Central", "Night Market / Food Court", etc.)

---

## 🗺️ Roadmap — Next Steps

### Phase 1: Make It Compile ✅ → 🔨
> *Fix the critical issues above so the app builds and launches*

- [ ] Install Flutter SDK on your machine
- [ ] Fix `router.dart` import paths
- [ ] Fix `app.dart` to inject repository dependencies into ViewModels
- [ ] Fix `StopModel` field access in `home_view_model.dart`
- [ ] Run `flutter create .` then `flutter pub get`
- [ ] Run `flutter analyze` and fix any remaining issues
- [ ] Run `flutter run` — see the app on device/emulator

### Phase 2: Polish the UI 🎨
> *Refine the visual quality to match Uber/Bolt standards*

- [ ] Add splash screen with Ooyalo branding
- [ ] Add onboarding flow (3 swipeable intro cards)
- [ ] Animate shuttle markers on the map (smooth position interpolation)
- [ ] Add pull-to-refresh on Home and Routes screens
- [ ] Add shimmer loading skeletons instead of CircularProgressIndicator
- [ ] Add haptic feedback on button taps
- [ ] Test dark mode on all screens

### Phase 3: Connect to Live Backend 🔌
> *Hook up to the existing Express API at `localhost:3001`*

- [ ] Start the web backend: `cd ../` → `npm install` → `npm run dev`
- [ ] Update `constants.dart` API URL to point to your dev machine's local IP
- [ ] Test live data flow: Routes → Stops → Vehicles
- [ ] Add WebSocket or SSE connection for real-time shuttle positions (replacing 2s polling)
- [ ] Add Firebase Auth for login (the backend already has `requireAuth` middleware)

### Phase 4: Add Real Features 🚀
> *Features that make the app actually useful on campus*

- [ ] **GPS-based nearby stops** — use `geolocator` package to get real user location
- [ ] **Push notifications** — "Your shuttle is 2 minutes away"
- [ ] **Favorites persistence** — wire up `shared_preferences` for saved stops/routes
- [ ] **Search** — implement stop/route search with autocomplete
- [ ] **Travel history** — log which shuttles the user boards
- [ ] **Offline mode** — cache last-known data with SQLite

### Phase 5: Production 🏁
> *Prepare for real deployment at University of Ghana*

- [ ] Add Firebase Crashlytics for error reporting
- [ ] Add analytics (Firebase Analytics or Mixpanel)
- [ ] Performance profiling (60fps target on budget Android phones)
- [ ] Accessibility audit (screen readers, font scaling)
- [ ] Build signed APK: `flutter build apk --release`
- [ ] Set up CI/CD (GitHub Actions → build → test → deploy)
- [ ] Publish to Google Play Store

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Flutter 3.x |
| Language | Dart 3.5 |
| State | Provider (ChangeNotifier) |
| Routing | go_router 14 |
| Maps | google_maps_flutter |
| HTTP | http package |
| Storage | shared_preferences |
| Fonts | Google Fonts (Plus Jakarta Sans) |
| Backend | Express 5 + PostgreSQL (existing web app) |

---

## 📡 Backend API

The mobile app connects to the same backend as the admin dashboard:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/routes` | GET | All shuttle routes |
| `/api/stops` | GET | All campus stops |
| `/api/vehicles/live` | GET | Live shuttle positions |
| `/api/telemetry` | POST | IoT device data ingest |
| `/api/health` | GET | Server health check |

**Base URL:** `http://localhost:3001` (update in `lib/config/constants.dart`)

---

## 📄 License

Internal project — University of Ghana Campus Shuttle Tracker

