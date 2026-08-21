import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ooyalo_app/data/models/alert_model.dart';
import 'package:ooyalo_app/data/models/lost_item_model.dart';
import 'package:ooyalo_app/data/mock_data.dart';

class AlertApiService {
  final String baseUrl = 'https://api.ooyalo.com';

  Future<List<AlertModel>> fetchAlerts() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return MockData.alerts;
  }

  Future<void> submitLostItem(LostItemModel item) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }
}
