import 'package:shared_preferences/shared_preferences.dart';

class FavoritesRepository {
  static const String _favoriteStopsKey = 'favorite_stops';
  static const String _favoriteRoutesKey = 'favorite_routes';

  Future<List<String>> getFavoriteStopIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_favoriteStopsKey) ?? [];
  }

  Future<void> toggleFavoriteStop(String stopId) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_favoriteStopsKey) ?? [];
    
    if (favorites.contains(stopId)) {
      favorites.remove(stopId);
    } else {
      favorites.add(stopId);
    }
    
    await prefs.setStringList(_favoriteStopsKey, favorites);
  }

  Future<List<String>> getFavoriteRouteIds() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList(_favoriteRoutesKey) ?? [];
  }

  Future<void> toggleFavoriteRoute(String routeId) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_favoriteRoutesKey) ?? [];
    
    if (favorites.contains(routeId)) {
      favorites.remove(routeId);
    } else {
      favorites.add(routeId);
    }
    
    await prefs.setStringList(_favoriteRoutesKey, favorites);
  }

  Future<bool> isFavoriteStop(String stopId) async {
    final favorites = await getFavoriteStopIds();
    return favorites.contains(stopId);
  }

  Future<bool> isFavoriteRoute(String routeId) async {
    final favorites = await getFavoriteRouteIds();
    return favorites.contains(routeId);
  }
}
