import 'package:ooyalo_app/data/models/shuttle_model.dart';

class StopModel {
  final String id;
  final String name;
  final String code;
  final String description;
  final GeoPoint location;
  final List<String> routes;
  final List<String> amenities;
  final int averageDwellSeconds;
  final bool isFavorite;

  StopModel({
    required this.id,
    required this.name,
    required this.code,
    required this.description,
    required this.location,
    required this.routes,
    required this.amenities,
    required this.averageDwellSeconds,
    required this.isFavorite,
  });

  factory StopModel.fromJson(Map<String, dynamic> json) {
    return StopModel(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      description: json['description'] as String,
      location: GeoPoint.fromJson(json['location'] as Map<String, dynamic>),
      routes: List<String>.from(json['routes'] as List),
      amenities: List<String>.from(json['amenities'] as List),
      averageDwellSeconds: json['averageDwellSeconds'] as int,
      isFavorite: json['isFavorite'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'description': description,
      'location': location.toJson(),
      'routes': routes,
      'amenities': amenities,
      'averageDwellSeconds': averageDwellSeconds,
      'isFavorite': isFavorite,
    };
  }
}
