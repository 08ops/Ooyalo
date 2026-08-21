import 'package:ooyalo_app/data/models/alert_model.dart';
import 'package:ooyalo_app/data/services/alert_api_service.dart';
import 'package:ooyalo_app/data/mock_data.dart';

class AlertRepository {
  final AlertApiService _apiService;

  AlertRepository({required AlertApiService apiService}) : _apiService = apiService;

  Future<List<AlertModel>> getAlerts() async {
    try {
      return await _apiService.fetchAlerts();
    } catch (_) {
      return MockData.alerts;
    }
  }
}
