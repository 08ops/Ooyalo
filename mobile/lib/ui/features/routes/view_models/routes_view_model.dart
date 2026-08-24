import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';
import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';

class RoutesViewModel extends ChangeNotifier {
  final RouteRepository _routeRepo;
  final ShuttleRepository _shuttleRepo;
  final StopRepository _stopRepo;

  RoutesViewModel(this._routeRepo, this._shuttleRepo, this._stopRepo);

  List<ShuttleRouteModel> routes = [];
  List<ShuttleModel> shuttles = [];
  List<StopModel> stops = [];
  
  ShuttleRouteModel? selectedRoute;
  bool isLoading = true;

  Future<void> loadRoutes() async {
    isLoading = true;
    notifyListeners();

    routes = await _routeRepo.getRoutes();
    shuttles = await _shuttleRepo.getShuttles();
    stops = await _stopRepo.getStops();
    
    isLoading = false;
    notifyListeners();
  }

  void selectRoute(ShuttleRouteModel route) {
    selectedRoute = route;
    notifyListeners();
  }

  int getActiveShuttleCount(String routeId) {
    return shuttles.where((s) => 
      s.routeId == routeId && 
      (s.status == 'in_service' || s.status == 'at_stop')
    ).length;
  }

  List<StopModel> getStopsForRoute(ShuttleRouteModel route) {
    final List<StopModel> routeStops = [];
    for (String stopId in route.stops) {
      final stop = stops.where((s) => s.id == stopId).firstOrNull;
      if (stop != null) {
        routeStops.add(stop);
      }
    }
    return routeStops;
  }

  List<ShuttleModel> getShuttlesForRoute(String routeId) {
    return shuttles.where((s) => s.routeId == routeId).toList();
  }
}
