import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ooyalo_app/data/models/stop_model.dart';

class StopApiService {
  final String baseUrl = 'https://api.ooyalo.com';

  Future<List<StopModel>> fetchStops() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/stops'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => StopModel.fromJson(json as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Failed to load stops');
      }
    } catch (e) {
      throw Exception('Error fetching stops: $e');
    }
  }
}
