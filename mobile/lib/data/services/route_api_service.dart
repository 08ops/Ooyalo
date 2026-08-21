import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ooyalo_app/data/models/route_model.dart';

class RouteApiService {
  final String baseUrl = 'https://api.ooyalo.com';

  Future<List<ShuttleRouteModel>> fetchRoutes() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/api/routes'));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ShuttleRouteModel.fromJson(json as Map<String, dynamic>)).toList();
      } else {
        throw Exception('Failed to load routes');
      }
    } catch (e) {
      throw Exception('Error fetching routes: $e');
    }
  }
}
