import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:ooyalo_app/config/theme.dart';
import 'package:ooyalo_app/config/constants.dart';
import 'package:ooyalo_app/router.dart';

import 'package:ooyalo_app/data/services/shuttle_api_service.dart';
import 'package:ooyalo_app/data/services/route_api_service.dart';
import 'package:ooyalo_app/data/services/stop_api_service.dart';
import 'package:ooyalo_app/data/services/alert_api_service.dart';

import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';
import 'package:ooyalo_app/data/repositories/alert_repository.dart';
import 'package:ooyalo_app/data/repositories/favorites_repository.dart';

import 'package:ooyalo_app/ui/features/home/view_models/home_view_model.dart';
import 'package:ooyalo_app/ui/features/tracking/view_models/tracking_view_model.dart';
import 'package:ooyalo_app/ui/features/routes/view_models/routes_view_model.dart';
import 'package:ooyalo_app/ui/features/stops/view_models/stop_view_model.dart';
import 'package:ooyalo_app/ui/features/alerts/view_models/alerts_view_model.dart';
import 'package:ooyalo_app/ui/features/profile/view_models/profile_view_model.dart';
import 'package:ooyalo_app/ui/features/lost_found/view_models/lost_found_view_model.dart';

class OoyaloApp extends StatelessWidget {
  const OoyaloApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Services
        Provider<ShuttleApiService>(create: (_) => ShuttleApiService()),
        Provider<RouteApiService>(create: (_) => RouteApiService()),
        Provider<StopApiService>(create: (_) => StopApiService()),
        Provider<AlertApiService>(create: (_) => AlertApiService()),

        // Repositories
        ProxyProvider<ShuttleApiService, ShuttleRepository>(
          update: (_, service, previous) =>
              previous ?? ShuttleRepository(apiService: service),
        ),
        ProxyProvider<RouteApiService, RouteRepository>(
          update: (_, service, previous) =>
              previous ?? RouteRepository(apiService: service),
        ),
        ProxyProvider<StopApiService, StopRepository>(
          update: (_, service, previous) =>
              previous ?? StopRepository(apiService: service),
        ),
        ProxyProvider<AlertApiService, AlertRepository>(
          update: (_, service, previous) =>
              previous ?? AlertRepository(apiService: service),
        ),
        Provider<FavoritesRepository>(create: (_) => FavoritesRepository()),

        // ViewModels
        ChangeNotifierProxyProvider3<ShuttleRepository, RouteRepository, StopRepository, HomeViewModel>(
          create: (ctx) => HomeViewModel(
            ctx.read<ShuttleRepository>(),
            ctx.read<RouteRepository>(),
            ctx.read<StopRepository>(),
          ),
          update: (_, shuttle, route, stop, vm) =>
              vm ?? HomeViewModel(shuttle, route, stop),
        ),
        ChangeNotifierProxyProvider3<ShuttleRepository, RouteRepository, StopRepository, TrackingViewModel>(
          create: (ctx) => TrackingViewModel(
            ctx.read<ShuttleRepository>(),
            ctx.read<RouteRepository>(),
            ctx.read<StopRepository>(),
          ),
          update: (_, shuttle, route, stop, vm) =>
              vm ?? TrackingViewModel(shuttle, route, stop),
        ),
        ChangeNotifierProxyProvider3<RouteRepository, ShuttleRepository, StopRepository, RoutesViewModel>(
          create: (ctx) => RoutesViewModel(
            ctx.read<RouteRepository>(),
            ctx.read<ShuttleRepository>(),
            ctx.read<StopRepository>(),
          ),
          update: (_, route, shuttle, stop, vm) =>
              vm ?? RoutesViewModel(route, shuttle, stop),
        ),
        ChangeNotifierProxyProvider3<StopRepository, ShuttleRepository, RouteRepository, StopViewModel>(
          create: (ctx) => StopViewModel(
            ctx.read<StopRepository>(),
            ctx.read<ShuttleRepository>(),
            ctx.read<RouteRepository>(),
          ),
          update: (_, stop, shuttle, route, vm) =>
              vm ?? StopViewModel(stop, shuttle, route),
        ),
        ChangeNotifierProxyProvider<AlertRepository, AlertsViewModel>(
          create: (ctx) => AlertsViewModel(ctx.read<AlertRepository>()),
          update: (_, alert, vm) => vm ?? AlertsViewModel(alert),
        ),
        ChangeNotifierProvider<ProfileViewModel>(
          create: (_) => ProfileViewModel(),
        ),
        ChangeNotifierProvider<LostFoundViewModel>(
          create: (_) => LostFoundViewModel(),
        ),
      ],
      child: MaterialApp.router(
        title: AppConstants.appName,
        themeMode: ThemeMode.system,
        theme: OoyaloTheme.lightTheme,
        darkTheme: OoyaloTheme.darkTheme,
        routerConfig: goRouter,
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
