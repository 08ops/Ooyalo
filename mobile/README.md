# ooyalo_app
# 🚍 Ooyalo Mobile App

A new Flutter project.
<div align="center">
  <h3>Real-Time Campus Shuttle Tracker for the University of Ghana</h3>
  <p>An intuitive, modern, cross-platform Flutter application providing real-time GPS tracking, estimated arrival times (ETAs), stop discovery, occupancy levels, and accessibility assistance.</p>
</div>

## Getting Started
---

This project is a starting point for a Flutter application.
## 📱 Features

A few resources to get you started if this is your first Flutter project:
- **🗺️ Live GPS Tracking**: Real-time visualization of shuttles, routes, and stops on an interactive Google Map with custom markers and polyline paths.
- **⏱️ Accurate ETAs & Metrics**: Live calculation of arrival times (ETAs), distances to upcoming stops, speed (km/h), and heading.
- **🚏 Route & Stop Explorer**: Detailed timeline views of route stops, frequency intervals, operating hours, and stop amenities (shelters, benches, lighting).
- **👥 Occupancy Level Monitoring**: Visual occupancy badges (`low`, `medium`, `high`, `full`) and progress indicators to help passengers plan boarding.
- **🔔 Live Alerts & Updates**: Real-time campus transit announcements, emergency notifications, and delay broadcasts with filter chips and swipe-to-dismiss.
- **♿ Accessibility Assistance**: Priority boarding requests and specialized assistance signals for passengers with mobility, visual, or hearing needs.
- **🌓 Adaptive Theme**: Clean UI styled in Material 3 with full Light and Dark mode support.

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)
---

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
## 🏗️ Architecture & Technology Stack

The mobile app is built with **Flutter 3.x** and **Dart 3.x**, following Clean Architecture principles and MVVM separation of concerns:

```
lib/
├── app.dart                       # MultiProvider DI & App Root Configuration
├── main.dart                      # Flutter Entrypoint
├── router.dart                    # GoRouter StatefulShellRoute Configuration
├── config/
│   ├── colors.dart                # AppColors & Brand Design Tokens
│   └── theme.dart                 # Material 3 ThemeData (Light & Dark)
├── data/
│   ├── mock_data.dart             # Seed & Mock Data for Development
│   ├── models/                    # Data Transfer Objects & JSON serialization
│   │   ├── alert_model.dart       # Transit alerts & notifications
│   │   ├── route_model.dart       # Shuttle routes & GPS paths
│   │   ├── shuttle_model.dart     # Real-time shuttle state & telemetry
│   │   └── stop_model.dart        # Campus stops & amenities
│   ├── repositories/              # Repository layer abstracting API services
│   │   ├── alert_repository.dart
│   │   ├── favorites_repository.dart
│   │   ├── route_repository.dart
│   │   ├── shuttle_repository.dart
│   │   └── stop_repository.dart
│   └── services/                  # HTTP client & remote API integration
│       ├── alert_api_service.dart
│       ├── route_api_service.dart
│       ├── shuttle_api_service.dart
│       └── stop_api_service.dart
└── ui/
    ├── core/
    │   ├── shell/                 # Navigation shell with Bottom Navigation Bar
    │   └── widgets/               # Reusable UI widgets (cards, chips, banners)
    └── features/                  # Feature-driven UI & ViewModels (MVVM)
        ├── accessibility/         # Accessibility requests
        ├── alerts/                # Notifications & alerts feed
        ├── home/                  # Dashboard, greeting, search, nearby stops
        ├── lost_found/            # Lost & found reporting
        ├── profile/               # User settings & preferences
        ├── routes/                # Route list & detailed stop timelines
        ├── stops/                 # Stop detail & upcoming arrivals
        └── tracking/              # Google Maps live tracking & shuttle sheet
```

### Key Libraries & Packages

| Package | Version | Purpose |
| :--- | :--- | :--- |
| [`provider`](https://pub.dev/packages/provider) | `^6.1.0` | State Management & Dependency Injection |
| [`go_router`](https://pub.dev/packages/go_router) | `^14.0.0` | Declarative Routing & Stateful Shell Navigation |
| [`google_maps_flutter`](https://pub.dev/packages/google_maps_flutter) | `^2.10.0` | Native Google Maps rendering, markers & polylines |
| [`google_fonts`](https://pub.dev/packages/google_fonts) | `^6.0.0` | Typography (Plus Jakarta Sans) |
| [`geolocator`](https://pub.dev/packages/geolocator) | `^13.0.0` | Device location & distance calculations |
| [`http`](https://pub.dev/packages/http) | `^1.2.0` | REST API communication |
| [`shared_preferences`](https://pub.dev/packages/shared_preferences) | `^2.3.0` | Local persistent storage |

---

## 🚀 Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (version `>=3.5.0`)
- [Dart SDK](https://dart.dev/get-dart) (included with Flutter)
- Android Studio / Xcode / VS Code with Flutter extension
- An active Android Emulator, iOS Simulator, or connected physical device

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd mobile
   ```

2. Fetch all dependencies:
   ```bash
   flutter pub get
   ```

3. Configure Google Maps API Key:
   - **Android**: Add your API key to `android/app/src/main/AndroidManifest.xml`:
     ```xml
     <meta-data
         android:name="com.google.android.geo.API_KEY"
         android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
     ```
   - **iOS**: Add your API key in `ios/Runner/AppDelegate.swift`:
     ```swift
     GMSServices.provideAPIKey("YOUR_GOOGLE_MAPS_API_KEY")
     ```

4. Launch the application:
   ```bash
   flutter run
   ```

---

## 🧪 Testing & Code Quality

The codebase enforces strict static analysis rules and automated unit testing:

- **Run Static Analysis**:
  ```bash
  flutter analyze
  ```
  *(Expected: `No issues found!`)*

- **Run Automated Unit Tests**:
  ```bash
  flutter test --no-pub
  ```
  *(Verifies mock stops, routes, shuttle models, and JSON deserialization logic)*

---

## 📄 License
Part of the **Ooyalo Transit System**. All rights reserved.
