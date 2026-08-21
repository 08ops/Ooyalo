import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:ooyalo_app/ui/core/shell/main_scaffold.dart';
import 'package:ooyalo_app/ui/features/home/screens/home_screen.dart';
import 'package:ooyalo_app/ui/features/tracking/screens/live_tracking_screen.dart';
import 'package:ooyalo_app/ui/features/stops/screens/stop_detail_screen.dart';
import 'package:ooyalo_app/ui/features/lost_found/screens/lost_item_form_screen.dart';
import 'package:ooyalo_app/ui/features/home/screens/accessibility_screen.dart';
import 'package:ooyalo_app/ui/features/routes/screens/routes_screen.dart';
import 'package:ooyalo_app/ui/features/routes/screens/route_detail_screen.dart';
import 'package:ooyalo_app/ui/features/alerts/screens/alerts_screen.dart';
import 'package:ooyalo_app/ui/features/profile/screens/profile_screen.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');
final GlobalKey<NavigatorState> _homeNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'home');
final GlobalKey<NavigatorState> _trackNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'track');
final GlobalKey<NavigatorState> _routesNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'routes');
final GlobalKey<NavigatorState> _alertsNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'alerts');
final GlobalKey<NavigatorState> _profileNavigatorKey = GlobalKey<NavigatorState>(debugLabel: 'profile');

final goRouter = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/home',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MainScaffold(navigationShell: navigationShell);
      },
      branches: [
        StatefulShellBranch(
          navigatorKey: _homeNavigatorKey,
          routes: [
            GoRoute(
              path: '/home',
              builder: (context, state) => const HomeScreen(),
              routes: [
                GoRoute(
                  path: 'tracking/:shuttleId',
                  builder: (context, state) => LiveTrackingScreen(
                    shuttleId: state.pathParameters['shuttleId'],
                  ),
                ),
                GoRoute(
                  path: 'stop/:stopId',
                  builder: (context, state) => StopDetailScreen(
                    stopId: state.pathParameters['stopId']!,
                  ),
                ),
                GoRoute(
                  path: 'lost-found',
                  builder: (context, state) => const LostItemFormScreen(),
                ),
                GoRoute(
                  path: 'accessibility',
                  builder: (context, state) => const AccessibilityScreen(),
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _trackNavigatorKey,
          routes: [
            GoRoute(
              path: '/track',
              builder: (context, state) => const LiveTrackingScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _routesNavigatorKey,
          routes: [
            GoRoute(
              path: '/routes',
              builder: (context, state) => const RoutesScreen(),
              routes: [
                GoRoute(
                  path: ':routeId',
                  builder: (context, state) => RouteDetailScreen(
                    routeId: state.pathParameters['routeId']!,
                  ),
                ),
              ],
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _alertsNavigatorKey,
          routes: [
            GoRoute(
              path: '/alerts',
              builder: (context, state) => const AlertsScreen(),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: _profileNavigatorKey,
          routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ],
        ),
      ],
    ),
  ],
);
