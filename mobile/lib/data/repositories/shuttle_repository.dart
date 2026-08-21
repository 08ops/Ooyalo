import 'dart:async';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/services/shuttle_api_service.dart';
import 'package:ooyalo_app/data/mock_data.dart';

class ShuttleRepository {
  final ShuttleApiService _apiService;
  List<ShuttleModel> _cachedShuttles = [];
  Timer? _pollingTimer;
  final _shuttleStreamController = StreamController<List<ShuttleModel>>.broadcast();

  ShuttleRepository({required ShuttleApiService apiService}) : _apiService = apiService {
    _startPolling();
  }

  Future<List<ShuttleModel>> getShuttles() async {
    try {
      final shuttles = await _apiService.fetchLiveShuttles();
      _cachedShuttles = shuttles;
      return shuttles;
    } catch (_) {
      _cachedShuttles = MockData.shuttles;
      return _cachedShuttles;
    }
  }

  ShuttleModel? getShuttleById(String id) {
    try {
      return _cachedShuttles.firstWhere((s) => s.id == id);
    } catch (_) {
      return null;
    }
  }

  Stream<List<ShuttleModel>> get shuttleStream => _shuttleStreamController.stream;

  void _startPolling() {
    _pollingTimer?.cancel();
    getShuttles().then((shuttles) {
      if (!_shuttleStreamController.isClosed) {
        _shuttleStreamController.add(shuttles);
      }
    });

    _pollingTimer = Timer.periodic(const Duration(seconds: 2), (timer) async {
      final shuttles = await getShuttles();
      if (!_shuttleStreamController.isClosed) {
        _shuttleStreamController.add(shuttles);
      }
    });
  }

  void dispose() {
    _pollingTimer?.cancel();
    _shuttleStreamController.close();
  }
}
