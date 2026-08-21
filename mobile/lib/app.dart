import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:ooyalo_app/config/theme.dart';
import 'package:ooyalo_app/config/constants.dart';
import 'package:ooyalo_app/router.dart';

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
        ChangeNotifierProvider(create: (_) => HomeViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => TrackingViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => RoutesViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => StopViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => AlertsViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => ProfileViewModel(), lazy: false),
        ChangeNotifierProvider(create: (_) => LostFoundViewModel(), lazy: false),
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
