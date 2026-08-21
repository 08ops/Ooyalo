import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ooyalo_app/data/models/shuttle_model.dart';

class ShuttleApiService {
  final String baseUrl = 'https://api.ooyalo.com';

  Future<List<ShuttleModel>> fetchLiveShuttles() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/vehicles/live'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ShuttleModel.fromJson(json as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Failed to load shuttles');
      }
    } catch (e) {
      throw Exception('Error fetching shuttles: $e');
    }
  }
}
