import 'package:ooyalo_app/data/models/route_model.dart';
import 'package:ooyalo_app/data/services/route_api_service.dart';
import 'package:ooyalo_app/data/mock_data.dart';

class RouteRepository {
  final RouteApiService _apiService;
  List<ShuttleRouteModel>? _cachedRoutes;

  RouteRepository({required RouteApiService apiService}) : _apiService = apiService;

  Future<List<ShuttleRouteModel>> getRoutes() async {
    if (_cachedRoutes != null) {
      return _cachedRoutes!;
    }
    try {
      final routes = await _apiService.fetchRoutes();
      _cachedRoutes = routes;
      return routes;
    } catch (_) {
      _cachedRoutes = MockData.routes;
      return _cachedRoutes!;
    }
  }

  ShuttleRouteModel? getRouteById(String id) {
    if (_cachedRoutes == null) return null;
    try {
      return _cachedRoutes!.firstWhere((r) => r.id == id);
    } catch (_) {
      return null;
    }
  }
}
