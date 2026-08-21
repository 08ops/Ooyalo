import 'dart:math';
import 'package:ooyalo_app/data/models/stop_model.dart';
import 'package:ooyalo_app/data/services/stop_api_service.dart';
import 'package:ooyalo_app/data/mock_data.dart';

class StopRepository {
  final StopApiService _apiService;
  List<StopModel>? _cachedStops;

  StopRepository({required StopApiService apiService}) : _apiService = apiService;

  Future<List<StopModel>> getStops() async {
    if (_cachedStops != null) {
      return _cachedStops!;
    }
    try {
      final stops = await _apiService.fetchStops();
      _cachedStops = stops;
      return stops;
    } catch (_) {
      _cachedStops = MockData.stops;
      return _cachedStops!;
    }
  }

  StopModel? getStopById(String id) {
    if (_cachedStops == null) return null;
    try {
      return _cachedStops!.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  List<StopModel> getNearbyStops(double lat, double lng) {
    if (_cachedStops == null) return [];
    
    final sortedStops = List<StopModel>.from(_cachedStops!);
    sortedStops.sort((a, b) {
      final distA = _calculateDistance(lat, lng, a.location.lat, a.location.lng);
      final distB = _calculateDistance(lat, lng, b.location.lat, b.location.lng);
      return distA.compareTo(distB);
    });
    
    return sortedStops;
  }

  double _calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    const p = 0.017453292519943295;
    final a = 0.5 -
        cos((lat2 - lat1) * p) / 2 +
        cos(lat1 * p) * cos(lat2 * p) * (1 - cos((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a));
  }
}
