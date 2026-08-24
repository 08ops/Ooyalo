import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';

class TrackingViewModel extends ChangeNotifier {
  final ShuttleRepository _shuttleRepo;
  final RouteRepository _routeRepo;
  final StopRepository _stopRepo;

  ShuttleModel? selectedShuttle;
  ShuttleRouteModel? selectedRoute;
  List<ShuttleModel> allShuttles = [];
  List<StopModel> routeStops = [];
  
  bool isFollowing = false;
  bool isLoading = true;

  TrackingViewModel(this._shuttleRepo, this._routeRepo, this._stopRepo);

  Future<void> loadData({String? shuttleId}) async {
    isLoading = true;
    notifyListeners();

    try {
      final shuttles = await _shuttleRepo.getShuttles();
      allShuttles = shuttles;

      if (shuttleId != null) {
        try {
          final shuttle = allShuttles.firstWhere((s) => s.id == shuttleId);
          await _selectShuttle(shuttle);
        } catch (_) {}
      }
    } catch (e) {
      // Handle error
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _selectShuttle(ShuttleModel shuttle) async {
    selectedShuttle = shuttle;
    try {
      final routes = await _routeRepo.getRoutes();
      selectedRoute = routes.firstWhere((r) => r.id == shuttle.routeId);
      
      final stops = await _stopRepo.getStops();
      routeStops = stops.where((stop) => selectedRoute?.stops.contains(stop.id) ?? false).toList();
    } catch (_) {}
  }

  void selectShuttle(ShuttleModel shuttle) async {
    isLoading = true;
    notifyListeners();
    await _selectShuttle(shuttle);
    isLoading = false;
    notifyListeners();
  }

  void clearSelection() {
    selectedShuttle = null;
    selectedRoute = null;
    routeStops = [];
    isFollowing = false;
    notifyListeners();
  }

  void toggleFollow() {
    isFollowing = !isFollowing;
    notifyListeners();
  }

  List<StopModel> getStopsForRoute(String routeId) {
    return routeStops; // Simplification, would normally filter global stops list
  }
}
