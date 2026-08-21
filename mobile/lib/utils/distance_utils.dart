import 'dart:math' as math;

class DistanceUtils {
  static const double _earthRadiusMeters = 6371000;

  static double calculateDistanceMeters(double lat1, double lng1, double lat2, double lng2) {
    final dLat = _toRadians(lat2 - lat1);
    final dLng = _toRadians(lng2 - lng1);

    final a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(lat1)) *
            math.cos(_toRadians(lat2)) *
            math.sin(dLng / 2) *
            math.sin(dLng / 2);

    final c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));

    return _earthRadiusMeters * c;
  }

  static double calculateBearing(double lat1, double lng1, double lat2, double lng2) {
    final rLat1 = _toRadians(lat1);
    final rLat2 = _toRadians(lat2);
    final dLng = _toRadians(lng2 - lng1);

    final y = math.sin(dLng) * math.cos(rLat2);
    final x = math.cos(rLat1) * math.sin(rLat2) -
        math.sin(rLat1) * math.cos(rLat2) * math.cos(dLng);

    final bearing = math.atan2(y, x);
    return (_toDegrees(bearing) + 360) % 360;
  }

  static String formatDistance(double meters) {
    if (meters < 1000) {
      return '${meters.round()}m';
    } else {
      return '${(meters / 1000).toStringAsFixed(1)} km';
    }
  }

  static int estimateWalkTimeMinutes(double meters) {
    // Average walking speed is ~4.5 km/h, which is 1.25 meters/second.
    // Time in minutes = (Distance in meters / 1.25) / 60
    final double walkSpeedMetersPerSecond = 1.25;
    final int minutes = (meters / walkSpeedMetersPerSecond / 60).ceil();
    return minutes > 0 ? minutes : 1;
  }

  static double _toRadians(double degrees) {
    return degrees * (math.pi / 180.0);
  }

  static double _toDegrees(double radians) {
    return radians * (180.0 / math.pi);
  }
}
