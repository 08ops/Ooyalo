import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';
import 'dart:math' as math;

class HomeViewModel extends ChangeNotifier {
  final ShuttleRepository _shuttleRepo;
  final RouteRepository _routeRepo;
  final StopRepository _stopRepo;

  List<ShuttleModel> shuttles = [];
  List<ShuttleRouteModel> routes = [];
  List<StopModel> stops = [];
  List<StopModel> nearbyStops = [];
  
  bool isLoading = true;
  String? error;
  String serviceStatus = 'operating';

  HomeViewModel(this._shuttleRepo, this._routeRepo, this._stopRepo);

  Future<void> loadData() async {
    isLoading = true;
    error = null;
    notifyListeners();

    try {
      final futures = await Future.wait([
        _shuttleRepo.getShuttles(),
        _routeRepo.getRoutes(),
        _stopRepo.getStops(),
      ]);

      shuttles = futures[0] as List<ShuttleModel>;
      routes = futures[1] as List<ShuttleRouteModel>;
      stops = futures[2] as List<StopModel>;

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
      final distA = _distance(campusLat, campusLng, a.latitude, a.longitude);
      final distB = _distance(campusLat, campusLng, b.latitude, b.longitude);
      return distA.compareTo(distB);
    });
  }

  double _distance(double lat1, double lon1, double lat2, double lon2) {
    var p = 0.017453292519943295;
    var c = math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 + 
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
    return shuttles.where((s) => s.status == 'in_service' || s.status == 'at_stop').toList();
  }
}
