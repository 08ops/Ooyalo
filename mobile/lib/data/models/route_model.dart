import 'package:ooyalo_app/data/models/shuttle_model.dart';

class ShuttleRouteModel {
  final String id;
  final String name;
  final String code;
  final String color;
  final String description;
  final String operatingHours;
  final int frequencyMinutes;
  final List<String> stops;
  final List<GeoPoint> path;
  final bool isActive;

  ShuttleRouteModel({
    required this.id,
    required this.name,
    required this.code,
    required this.color,
    required this.description,
    required this.operatingHours,
    required this.frequencyMinutes,
    required this.stops,
    required this.path,
    required this.isActive,
  });

  factory ShuttleRouteModel.fromJson(Map<String, dynamic> json) {
    return ShuttleRouteModel(
      id: json['id'] as String,
      name: json['name'] as String,
      code: json['code'] as String,
      color: json['color'] as String,
      description: json['description'] as String,
      operatingHours: json['operatingHours'] as String,
      frequencyMinutes: json['frequencyMinutes'] as int,
      stops: List<String>.from(json['stops'] as List),
      path: (json['path'] as List).map((e) => GeoPoint.fromJson(e as Map<String, dynamic>)).toList(),
      isActive: json['isActive'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'code': code,
      'color': color,
      'description': description,
      'operatingHours': operatingHours,
      'frequencyMinutes': frequencyMinutes,
      'stops': stops,
      'path': path.map((e) => e.toJson()).toList(),
      'isActive': isActive,
    };
  }
}
