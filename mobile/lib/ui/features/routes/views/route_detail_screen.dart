import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:ooyalo_app/ui/features/routes/view_models/routes_view_model.dart';
import 'package:ooyalo_app/config/colors.dart';
import 'package:ooyalo_app/ui/core/widgets/shuttle_card.dart';

class RouteDetailScreen extends StatefulWidget {
  final String routeId;
  const RouteDetailScreen({super.key, required this.routeId});

  @override
  State<RouteDetailScreen> createState() => _RouteDetailScreenState();
}

class _RouteDetailScreenState extends State<RouteDetailScreen> {
  GoogleMapController? _mapController;

  @override
  void dispose() {
    _mapController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<RoutesViewModel>(
      builder: (context, viewModel, child) {
        final route = viewModel.routes.where((r) => r.id == widget.routeId).firstOrNull;
        
        if (route == null) {
          return Scaffold(
            appBar: AppBar(title: const Text('Route Not Found')),
            body: const Center(child: Text('Invalid route')),
          );
        }

        final routeStops = viewModel.getStopsForRoute(route);
        final routeShuttles = viewModel.getShuttlesForRoute(route.id);
        
        Color routeColor = AppColors.primary;
        try {
          routeColor = Color(int.parse(route.color.replaceAll('#', '0xFF')));
        } catch (_) {}

        final mapTarget = route.path.isNotEmpty
            ? LatLng(route.path.first.lat, route.path.first.lng)
            : const LatLng(5.6514, -0.1872);

        return Scaffold(
          backgroundColor: AppColors.backgroundLight,
          body: CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                backgroundColor: routeColor,
                flexibleSpace: FlexibleSpaceBar(
                  title: Text(
                    route.name,
                    style: GoogleFonts.plusJakartaSans(
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      GoogleMap(
                        initialCameraPosition: CameraPosition(
                          target: mapTarget,
                          zoom: 14,
                        ),
                        myLocationEnabled: true,
                        zoomControlsEnabled: false,
                        onMapCreated: (controller) => _mapController = controller,
                        polylines: {
                          Polyline(
                            polylineId: PolylineId(route.id),
                            color: routeColor,
                            width: 4,
                            points: route.path
                                .map((e) => LatLng(e.lat, e.lng))
                                .toList(),
                          ),
                        },
                      ),
                      Container(color: Colors.black26),
                    ],
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildInfoCard(route, routeStops.length),
                      const SizedBox(height: 24),
                      Text(
                        'Route Stops',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 16),
                      _buildStopsTimeline(routeStops, routeShuttles, routeColor),
                      const SizedBox(height: 24),
                      if (routeShuttles.isNotEmpty) ...[
                        Text(
                          'Active Shuttles',
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ...routeShuttles.map((shuttle) => Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: ShuttleCard(shuttle: shuttle),
                        )),
                      ]
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }
    );
  }

  Widget _buildInfoCard(route, int totalStops) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildInfoItem(Icons.schedule, 'Frequency', '${route.frequencyMinutes} min'),
          _buildInfoItem(Icons.timelapse, 'Est. Time', '45 min'),
          _buildInfoItem(Icons.place, 'Total Stops', totalStops.toString()),
        ],
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String label, String value) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primary, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: GoogleFonts.plusJakartaSans(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildStopsTimeline(List stops, List shuttles, Color routeColor) {
    return Column(
      children: List.generate(stops.length, (index) {
        final stop = stops[index];
        final isLast = index == stops.length - 1;
        
        final shuttlesAtStop = shuttles.where((s) => s.nextStopId == stop.id).toList();

        return IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Column(
                children: [
                  Container(
                    width: 16,
                    height: 16,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      border: Border.all(color: routeColor, width: 4),
                      shape: BoxShape.circle,
                    ),
                  ),
                  if (!isLast)
                    Expanded(
                      child: Container(
                        width: 2,
                        color: routeColor.withValues(alpha: 0.3),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        stop.name,
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                        ),
                      ),
                      if (shuttlesAtStop.isNotEmpty)
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.accent),
                          ),
                          child: Text(
                            '🚌 Shuttle arriving in 2 min',
                            style: GoogleFonts.plusJakartaSans(
                              color: Colors.orange[800],
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}
