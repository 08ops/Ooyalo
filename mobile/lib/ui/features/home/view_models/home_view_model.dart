import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/models/alert_model.dart';
import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';
import 'package:ooyalo_app/data/repositories/alert_repository.dart';
import 'package:ooyalo_app/data/services/alert_api_service.dart';

class HomeViewModel extends ChangeNotifier {
  final ShuttleRepository _shuttleRepo;
  final RouteRepository _routeRepo;
  final StopRepository _stopRepo;
  final AlertRepository _alertRepo;

  HomeViewModel(
    this._shuttleRepo,
    this._routeRepo,
    this._stopRepo, [
    AlertRepository? alertRepo,
  ]) : _alertRepo = alertRepo ?? AlertRepository(apiService: AlertApiService());

  bool isLoading = true;
  String? error;

  List<ShuttleModel> shuttles = [];
  List<ShuttleRouteModel> routes = [];
  List<StopModel> stops = [];
  List<AlertModel> alerts = [];

  List<StopModel> nearbyStops = [];
  String get serviceStatus => 'Normal Service';

  Future<void> loadData() => loadDashboardData();

  Future<void> loadDashboardData() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final futures = await Future.wait([
        _shuttleRepo.getShuttles(),
        _routeRepo.getRoutes(),
        _stopRepo.getStops(),
        _alertRepo.getAlerts(),
      ]);

      shuttles = futures[0] as List<ShuttleModel>;
      routes = futures[1] as List<ShuttleRouteModel>;
      stops = futures[2] as List<StopModel>;
      alerts = futures[3] as List<AlertModel>;

      _calculateNearbyStops();
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void _calculateNearbyStops() {
    const double campusLat = 5.6514;
    const double campusLng = -0.1872;

    nearbyStops = List.from(stops);
    nearbyStops.sort((a, b) {
      final distA = _distance(campusLat, campusLng, a.location.lat, a.location.lng);
      final distB = _distance(campusLat, campusLng, b.location.lat, b.location.lng);
      return distA.compareTo(distB);
    });
  }

  double _distance(double lat1, double lon1, double lat2, double lon2) {
    const p = 0.017453292519943295;
    final c = math.cos;
    final a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;
    return 12742 * math.asin(math.sqrt(a));
  }

  ShuttleRouteModel? getRouteForShuttle(ShuttleModel shuttle) {
    try {
      return routes.firstWhere((route) => route.id == shuttle.routeId);
    } catch (_) {
      return null;
    }
  }

  List<ShuttleModel> get activeShuttles {
    return shuttles.where((s) => s.status == 'in_service').toList();
  }
}
