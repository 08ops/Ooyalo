import 'package:flutter/material.dart';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/repositories/stop_repository.dart';
import 'package:ooyalo_app/data/repositories/shuttle_repository.dart';
import 'package:ooyalo_app/data/repositories/route_repository.dart';

class StopViewModel extends ChangeNotifier {
  final StopRepository _stopRepo;
  final ShuttleRepository _shuttleRepo;
  final RouteRepository _routeRepo;

  StopViewModel(this._stopRepo, this._shuttleRepo, this._routeRepo);

  StopModel? selectedStop;
  List<ShuttleModel> arrivingShuttles = [];
  List<ShuttleRouteModel> servingRoutes = [];
  bool isLoading = true;

  Future<void> loadStop(String stopId) async {
    isLoading = true;
    notifyListeners();

    final allStops = await _stopRepo.getStops();
    selectedStop = allStops.where((s) => s.id == stopId).firstOrNull;

    if (selectedStop != null) {
      final allShuttles = await _shuttleRepo.getShuttles();
      arrivingShuttles = allShuttles.where((s) => s.nextStopId == stopId).toList();
      
      final allRoutes = await _routeRepo.getRoutes();
      servingRoutes = allRoutes.where((r) => r.stops.contains(stopId)).toList();
    }
    
    isLoading = false;
    notifyListeners();
  }

  List<ShuttleModel> get sortedArrivingShuttles {
    final sorted = List<ShuttleModel>.from(arrivingShuttles);
    sorted.sort((a, b) => a.etaSecondsToNextStop.compareTo(b.etaSecondsToNextStop));
    return sorted;
  }
}
