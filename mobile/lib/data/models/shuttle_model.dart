class GeoPoint {
  final double lat;
  final double lng;

  const GeoPoint({required this.lat, required this.lng});

  factory GeoPoint.fromJson(Map<String, dynamic> json) {
    return GeoPoint(
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'lat': lat,
      'lng': lng,
    };
  }
}

class ShuttleModel {
  final String id;
  final String name;
  final String plateNumber;
  final String routeId;
  final GeoPoint currentLocation;
  final double heading;
  final double speedKmh;
  final String status;
  final int capacity;
  final int currentPassengers;
  final String occupancyStatus;
  final String nextStopId;
  final int etaSecondsToNextStop;
  final int distanceToNextStopMeters;
  final String lastUpdated;
  final String driverName;
  final String driverPhone;
  final bool isSimulated;
  final int routeProgressIndex;

  ShuttleModel({
    required this.id,
    required this.name,
    required this.plateNumber,
    required this.routeId,
    required this.currentLocation,
    required this.heading,
    required this.speedKmh,
    required this.status,
    required this.capacity,
    required this.currentPassengers,
    required this.occupancyStatus,
    required this.nextStopId,
    required this.etaSecondsToNextStop,
    required this.distanceToNextStopMeters,
    required this.lastUpdated,
    required this.driverName,
    required this.driverPhone,
    this.isSimulated = false,
    this.routeProgressIndex = 0,
  });

  factory ShuttleModel.fromJson(Map<String, dynamic> json) {
    return ShuttleModel(
      id: json['id'] as String,
      name: json['name'] as String,
      plateNumber: json['plateNumber'] as String,
      routeId: json['routeId'] as String,
      currentLocation: GeoPoint.fromJson(json['currentLocation'] as Map<String, dynamic>),
      heading: (json['heading'] as num).toDouble(),
      speedKmh: (json['speedKmh'] as num).toDouble(),
      status: json['status'] as String,
      capacity: json['capacity'] as int,
      currentPassengers: json['currentPassengers'] as int,
      occupancyStatus: json['occupancyStatus'] as String,
      nextStopId: json['nextStopId'] as String,
      etaSecondsToNextStop: json['etaSecondsToNextStop'] as int,
      distanceToNextStopMeters: json['distanceToNextStopMeters'] as int,
      lastUpdated: json['lastUpdated'] as String,
      driverName: json['driverName'] as String,
      driverPhone: json['driverPhone'] as String,
      isSimulated: json['isSimulated'] as bool? ?? false,
      routeProgressIndex: json['routeProgressIndex'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'plateNumber': plateNumber,
      'routeId': routeId,
      'currentLocation': currentLocation.toJson(),
      'heading': heading,
      'speedKmh': speedKmh,
      'status': status,
      'capacity': capacity,
      'currentPassengers': currentPassengers,
      'occupancyStatus': occupancyStatus,
      'nextStopId': nextStopId,
      'etaSecondsToNextStop': etaSecondsToNextStop,
      'distanceToNextStopMeters': distanceToNextStopMeters,
      'lastUpdated': lastUpdated,
      'driverName': driverName,
      'driverPhone': driverPhone,
      'isSimulated': isSimulated,
      'routeProgressIndex': routeProgressIndex,
    };
  }

  double get occupancyPercent => currentPassengers / capacity;

  String get occupancyLevel {
    final percent = occupancyPercent;
    if (percent < 0.5) return 'low';
    if (percent < 0.8) return 'medium';
    if (percent < 0.95) return 'high';
    return 'full';
  }
}
