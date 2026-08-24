import 'package:flutter_test/flutter_test.dart';
import 'package:ooyalo_app/data/models/shuttle_model.dart';
import 'package:ooyalo_app/data/mock_data.dart';

void main() {
  group('Mock Data & Models Verification', () {
    test('Mock stops contain valid campus locations', () {
      expect(MockData.stops.length, equals(8));
      final nightMarket = MockData.stops.firstWhere((s) => s.id == 'stop-night-market');
      expect(nightMarket.name, contains('Night Market'));
      expect(nightMarket.location.lat, closeTo(5.6565, 0.001));
      expect(nightMarket.location.lng, closeTo(-0.1830, 0.001));
      expect(nightMarket.amenities, isNotEmpty);
    });

    test('Mock routes are defined with valid paths and stops', () {
      expect(MockData.routes.length, equals(3));
      final mainLoop = MockData.routes.firstWhere((r) => r.id == 'route-blue-loop');
      expect(mainLoop.name, contains('Campus Loop'));
      expect(mainLoop.stops.length, equals(7));
      expect(mainLoop.path.length, greaterThan(0));
    });

    test('Mock shuttles have active operational status and metrics', () {
      expect(MockData.shuttles.length, equals(5));
      for (final shuttle in MockData.shuttles) {
        expect(shuttle.name, isNotEmpty);
        expect(shuttle.capacity, greaterThan(0));
        expect(shuttle.currentLocation.lat, isNotNull);
        expect(shuttle.currentLocation.lng, isNotNull);
      }
    });

    test('ShuttleModel serialization from JSON', () {
      final json = {
        'id': 'shuttle-test',
        'name': 'Shuttle Alpha',
        'plateNumber': 'GN-4521-22',
        'routeId': 'route-1',
        'currentLocation': {'lat': 5.6514, 'lng': -0.1872},
        'heading': 90.0,
        'speedKmh': 24.5,
        'status': 'in_service',
        'capacity': 30,
        'currentPassengers': 15,
        'occupancyStatus': 'medium',
        'nextStopId': 'stop-1',
        'etaSecondsToNextStop': 120,
        'distanceToNextStopMeters': 300,
        'lastUpdated': '2026-03-01T10:00:00Z',
        'driverName': 'Kwame Mensah',
        'driverPhone': '+233 24 123 4567',
      };

      final shuttle = ShuttleModel.fromJson(json);
      expect(shuttle.id, equals('shuttle-test'));
      expect(shuttle.occupancyPercent, equals(0.5));
      expect(shuttle.speedKmh, equals(24.5));
      expect(shuttle.driverName, equals('Kwame Mensah'));
      expect(shuttle.plateNumber, equals('GN-4521-22'));
    });
  });
}
